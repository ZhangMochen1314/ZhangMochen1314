"""
StatsPAI tools.
"""

import json
from pathlib import Path
from typing import Any
from urllib.parse import unquote, urlparse

from langchain.tools import ToolRuntime, tool
from langgraph.typing import ContextT

from deerflow.agents.thread_state import ThreadState
from deerflow.config.paths import VIRTUAL_PATH_PREFIX, get_paths
from deerflow.uploads.manager import normalize_filename, upload_virtual_path


def _get_thread_id(runtime: ToolRuntime[ContextT, ThreadState]) -> str | None:
    thread_id = runtime.context.get("thread_id") if runtime.context else None
    if thread_id:
        return thread_id

    runtime_config = getattr(runtime, "config", None) or {}
    thread_id = runtime_config.get("configurable", {}).get("thread_id")
    if thread_id:
        return thread_id

    try:
        from langgraph.config import get_config

        return get_config().get("configurable", {}).get("thread_id")
    except RuntimeError:
        return None


def _artifact_url_to_virtual_path(artifact_url: str) -> str:
    parsed = urlparse(artifact_url)
    path = parsed.path or ""

    marker = "/artifacts"
    idx = path.find(marker)
    if idx < 0:
        raise ValueError("Not an artifacts URL")

    candidate = unquote(path[idx + len(marker) :])
    if not candidate.startswith(VIRTUAL_PATH_PREFIX):
        raise ValueError("Artifacts URL does not reference a /mnt/user-data virtual path")
    return candidate


def _normalize_input_ref_to_virtual_path(input_ref: str) -> str:
    if not input_ref:
        raise ValueError("data_path is required")

    parsed = urlparse(input_ref)
    is_http_url = parsed.scheme.lower() in {"http", "https"}
    if is_http_url:
        input_ref = parsed.path or ""

    if input_ref.startswith(VIRTUAL_PATH_PREFIX):
        return input_ref

    if "/artifacts" in input_ref and "/api/threads/" in input_ref:
        return _artifact_url_to_virtual_path(input_ref)

    if "://" in input_ref:
        raise ValueError("External URLs are not supported. Use virtual_path or artifact_url from uploads instead.")

    if input_ref.startswith("uploads/"):
        filename = input_ref[len("uploads/") :]
        return upload_virtual_path(normalize_filename(filename))

    if "/" in input_ref or "\\" in input_ref:
        raise ValueError("Only virtual_path, artifact_url, or plain filename is supported for data_path")

    return upload_virtual_path(normalize_filename(input_ref))


def _resolve_virtual_path_to_host_path(runtime: ToolRuntime[ContextT, ThreadState], virtual_path: str) -> Path:
    thread_id = _get_thread_id(runtime)
    if not thread_id:
        raise ValueError("Thread ID is not available in runtime context")
    return get_paths().resolve_virtual_path(thread_id, virtual_path)


@tool("statspai_list_functions", parse_docstring=True)
def statspai_list_functions_tool(
    query: str | None = None,
    max_results: int = 50,
) -> str:
    """List available StatsPAI functions for tool-like execution and discovery.

    Args:
        query: Optional keyword filter (best-effort; may be ignored depending on StatsPAI version).
        max_results: Max number of entries to return.
    """
    try:
        import statspai as sp
    except Exception as exc:
        return json.dumps({"error": f"Failed to import statspai: {exc}"}, ensure_ascii=False)

    funcs: Any = None
    if hasattr(sp, "list_functions"):
        try:
            funcs = sp.list_functions(query=query) if query else sp.list_functions()
        except TypeError:
            funcs = sp.list_functions()
        except Exception:
            funcs = sp.list_functions()

    if funcs is None and hasattr(sp, "agent") and hasattr(sp.agent, "tools") and hasattr(sp.agent.tools, "list_functions"):
        try:
            funcs = sp.agent.tools.list_functions(query=query) if query else sp.agent.tools.list_functions()
        except TypeError:
            funcs = sp.agent.tools.list_functions()
        except Exception:
            funcs = sp.agent.tools.list_functions()

    if funcs is None:
        return json.dumps({"error": "StatsPAI list_functions() not available in this version"}, ensure_ascii=False)

    if isinstance(funcs, list):
        if query:
            q = query.lower()
            funcs = [f for f in funcs if q in str(f).lower()]
        funcs = funcs[: max_results if max_results > 0 else 50]

    return json.dumps({"query": query, "results": funcs}, ensure_ascii=False)


@tool("statspai_describe_function", parse_docstring=True)
def statspai_describe_function_tool(name: str) -> str:
    """Describe a StatsPAI function for correct invocation.

    Args:
        name: Function name in StatsPAI (e.g. ivreg, rdrobust, synth).
    """
    try:
        import statspai as sp
    except Exception as exc:
        return json.dumps({"error": f"Failed to import statspai: {exc}"}, ensure_ascii=False)

    out: dict[str, Any] = {"name": name}

    if hasattr(sp, "describe_function"):
        try:
            out["describe"] = sp.describe_function(name)
        except Exception as exc:
            out["describe_error"] = str(exc)

    if hasattr(sp, "function_schema"):
        try:
            out["schema"] = sp.function_schema(name)
        except Exception as exc:
            out["schema_error"] = str(exc)

    if len(out.keys()) == 1:
        fn = getattr(sp, name, None)
        if fn is None:
            out["error"] = "Function not found in statspai namespace"
        else:
            out["callable"] = True
            out["doc"] = getattr(fn, "__doc__", None)

    return json.dumps(out, ensure_ascii=False)


@tool("statspai_execute", parse_docstring=True)
def statspai_execute_tool(
    runtime: ToolRuntime[ContextT, ThreadState],
    name: str,
    arguments: dict[str, Any],
    data_path: str,
) -> str:
    """Execute a StatsPAI function using a dataset referenced by thread uploads.

    data_path contract:
    - Accepts virtual_path: /mnt/user-data/uploads/xxx.csv
    - Accepts artifact_url generated by this app: /api/threads/{thread_id}/artifacts/mnt/user-data/uploads/xxx.csv
    - Accepts plain filename: xxx.csv (treated as uploads/xxx.csv)
    - Rejects external URLs (e.g. OSS https://...)

    Args:
        name: StatsPAI function name.
        arguments: Keyword arguments for the function. If `data` is absent, this tool injects a pandas DataFrame loaded from data_path.
        data_path: virtual_path / artifact_url / filename for the dataset.
    """
    try:
        import pandas as pd
        import statspai as sp
    except Exception as exc:
        return json.dumps({"error": f"Import error: {exc}"}, ensure_ascii=False)

    try:
        virtual_path = _normalize_input_ref_to_virtual_path(data_path)
        host_path = _resolve_virtual_path_to_host_path(runtime, virtual_path)
    except Exception as exc:
        return json.dumps({"error": str(exc), "data_path": data_path}, ensure_ascii=False)

    if not host_path.is_file():
        return json.dumps(
            {
                "error": "File not found in thread uploads",
                "data_path": data_path,
                "virtual_path": virtual_path,
                "hint": "If you used presigned OSS upload, call /api/threads/{thread_id}/uploads/confirm first, then use uploaded_files.path (virtual_path).",
            },
            ensure_ascii=False,
        )

    suffix = host_path.suffix.lower()
    try:
        if suffix in {".csv"}:
            df = pd.read_csv(host_path)
        elif suffix in {".parquet"}:
            df = pd.read_parquet(host_path)
        elif suffix in {".xlsx", ".xls"}:
            df = pd.read_excel(host_path)
        elif suffix in {".dta"}:
            df = pd.read_stata(host_path)
        else:
            return json.dumps(
                {
                    "error": f"Unsupported file type: {suffix}",
                    "virtual_path": virtual_path,
                },
                ensure_ascii=False,
            )
    except Exception as exc:
        return json.dumps({"error": f"Failed to load dataset: {exc}", "virtual_path": virtual_path}, ensure_ascii=False)

    fn = getattr(sp, name, None)
    if fn is None or not callable(fn):
        return json.dumps(
            {
                "error": f"StatsPAI function not found: {name}",
                "virtual_path": virtual_path,
                "hint": "Use statspai_list_functions / statspai_describe_function to find the correct function name and schema.",
            },
            ensure_ascii=False,
        )

    call_args = dict(arguments or {})
    if "data" not in call_args:
        call_args["data"] = df

    try:
        result = fn(**call_args)
    except Exception as exc:
        return json.dumps(
            {
                "error": f"Execution failed: {exc}",
                "name": name,
                "virtual_path": virtual_path,
            },
            ensure_ascii=False,
        )

    out: dict[str, Any] = {
        "name": name,
        "virtual_path": virtual_path,
    }

    summary_obj = getattr(result, "summary", None)
    if callable(summary_obj):
        try:
            out["summary"] = summary_obj()
        except Exception:
            pass

    tidy_obj = getattr(result, "tidy", None)
    if callable(tidy_obj):
        try:
            tidy = tidy_obj()
            if hasattr(tidy, "to_dict"):
                out["tidy"] = tidy.to_dict(orient="records")  # type: ignore[call-arg]
            else:
                out["tidy"] = tidy
        except Exception:
            pass

    if "summary" not in out:
        out["result"] = str(result)

    return json.dumps(out, ensure_ascii=False)

