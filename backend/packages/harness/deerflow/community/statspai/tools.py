import json
import uuid
from pathlib import Path
from typing import Annotated, Any

from langchain.tools import InjectedToolCallId, ToolRuntime, tool
from langchain_core.messages import ToolMessage
from langgraph.types import Command
from langgraph.typing import ContextT

from deerflow.agents.thread_state import ThreadState
from deerflow.config.paths import VIRTUAL_PATH_PREFIX
from deerflow.sandbox.tools import ensure_sandbox_initialized, ensure_thread_directories_exist, is_local_sandbox

_V_WORKSPACE = f"{VIRTUAL_PATH_PREFIX}/workspace"
_V_OUTPUTS = f"{VIRTUAL_PATH_PREFIX}/outputs"


_RUNNER_PY = r"""import json
import sys
import time
from pathlib import Path
from typing import Any


def _read_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def _write_json(path: Path, obj: Any) -> None:
    path.write_text(json.dumps(obj, ensure_ascii=False, indent=2), encoding="utf-8")


def _load_dataframe(data_path: str):
    import pandas as pd

    p = Path(data_path)
    suffix = p.suffix.lower()
    if suffix == ".csv":
        return pd.read_csv(p)
    if suffix in (".tsv", ".txt"):
        return pd.read_csv(p, sep="\\t")
    if suffix == ".dta":
        return pd.read_stata(p)
    if suffix in (".xlsx", ".xls"):
        return pd.read_excel(p)
    if suffix == ".parquet":
        return pd.read_parquet(p)
    if suffix == ".jsonl":
        return pd.read_json(p, lines=True)
    if suffix == ".json":
        return pd.read_json(p)
    raise ValueError(f"Unsupported data file suffix: {suffix}")


def _safe_str(v: Any) -> str:
    try:
        return str(v)
    except Exception:
        return repr(v)


def main() -> int:
    if len(sys.argv) < 2:
        print("Missing job spec path", file=sys.stderr)
        return 2

    spec_path = Path(sys.argv[1]).resolve()
    spec = _read_json(spec_path)

    output_dir = Path(spec["output_dir"]).resolve()
    output_dir.mkdir(parents=True, exist_ok=True)

    run_log_path = output_dir / "run.log"

    def log(line: str) -> None:
        line = line.rstrip("\\n\\r")
        print(line)
        run_log_path.open("a", encoding="utf-8").write(line + "\\n")

    log(f"[statspai_job] start={time.time()}")
    log(f"[statspai_job] spec={spec_path}")

    name = str(spec["name"])
    arguments = spec.get("arguments") or {}
    data_path = spec.get("data_path")
    make_plot = bool(spec.get("make_plot", True))
    export_xlsx = bool(spec.get("export_xlsx", True))
    language = str(spec.get("language", "zh"))

    try:
        import statspai as sp
    except Exception as e:
        _write_json(output_dir / "manifest.json", {"success": False, "error": f"ImportError: {e}"})
        return 1

    df = None
    if data_path:
        df = _load_dataframe(str(data_path))

    fn = getattr(sp, name, None)
    if fn is None:
        _write_json(output_dir / "manifest.json", {"success": False, "error": f\"Unknown statspai function: {name}\"})
        return 1

    kwargs = dict(arguments)
    if df is not None and "data" not in kwargs:
        kwargs["data"] = df

    log(f"[statspai_job] function={name}")
    log(f"[statspai_job] arguments={json.dumps({k: v for k, v in kwargs.items() if k != 'data'}, ensure_ascii=False)}")
    log(f"[statspai_job] data_path={data_path}")
    log(f"[statspai_job] statspai_version={getattr(sp, '__version__', 'unknown')}")

    try:
        result = fn(**kwargs)
    except Exception as e:
        _write_json(output_dir / "manifest.json", {"success": False, "error": f"{type(e).__name__}: {e}"})
        return 1

    result_json: dict[str, Any] | None = None
    to_dict = getattr(result, "to_dict", None)
    if callable(to_dict):
        try:
            out = to_dict()
            if isinstance(out, dict):
                result_json = out
        except Exception:
            result_json = None

    if result_json is None:
        try:
            from statspai.agent.tools import _default_serializer

            result_json = _default_serializer(result)
        except Exception:
            result_json = {"repr": _safe_str(result)}

    _write_json(output_dir / "result.json", result_json)

    summary_text = ""
    summary = getattr(result, "summary", None)
    if callable(summary):
        try:
            summary_text = summary()
            if not isinstance(summary_text, str):
                summary_text = _safe_str(summary_text)
        except Exception:
            summary_text = ""

    tidy_path = None
    tidy = getattr(result, "tidy", None)
    if callable(tidy):
        try:
            tidy_df = tidy()
            if hasattr(tidy_df, "to_csv"):
                tidy_path = output_dir / "tidy.csv"
                tidy_df.to_csv(tidy_path, index=False)
        except Exception:
            tidy_path = None

    figure_path = None
    if make_plot and callable(getattr(result, "plot", None)):
        try:
            if language.lower().startswith("zh"):
                from statspai.plots import set_theme, use_chinese

                set_theme("academic")
                use_chinese()
            else:
                from statspai.plots import set_theme

                set_theme("academic")

            fig, _ = result.plot(type="auto")
            figure_path = output_dir / "figure.png"
            fig.savefig(figure_path, dpi=220, bbox_inches="tight")
            try:
                import matplotlib.pyplot as plt

                plt.close(fig)
            except Exception:
                pass
        except Exception:
            figure_path = None

    xlsx_path = None
    if export_xlsx:
        try:
            xlsx_path = output_dir / "regtable.xlsx"
            sp.outreg2(result, filename=str(xlsx_path))
        except Exception:
            xlsx_path = None

    report_path = output_dir / "report.md"
    md = []
    md.append("# StatsPAI 分析报告")
    md.append("")
    md.append(f"- function: `{name}`")
    md.append(f"- data_path: `{data_path}`")
    md.append(f"- statspai_version: `{getattr(sp, '__version__', 'unknown')}`")
    md.append("")
    if summary_text:
        md.append("## 结果摘要")
        md.append("")
        md.append("```")
        md.append(summary_text.rstrip())
        md.append("```")
        md.append("")
    if figure_path is not None and figure_path.exists():
        md.append("## 图")
        md.append("")
        md.append(f"![figure](./{figure_path.name})")
        md.append("")
    report_path.write_text("\\n".join(md).rstrip() + "\\n", encoding="utf-8")

    manifest = {
        "success": True,
        "name": name,
        "data_path": data_path,
        "statspai_version": getattr(sp, "__version__", "unknown"),
        "files": {
            "report_md": report_path.name,
            "result_json": "result.json",
            "run_log": run_log_path.name,
            "figure_png": figure_path.name if figure_path is not None and figure_path.exists() else None,
            "tidy_csv": tidy_path.name if tidy_path is not None and tidy_path.exists() else None,
            "regtable_xlsx": xlsx_path.name if xlsx_path is not None and xlsx_path.exists() else None,
        },
    }
    _write_json(output_dir / "manifest.json", manifest)
    log(f"[statspai_job] done={time.time()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
"""


def _thread_paths(runtime: ToolRuntime[ContextT, ThreadState]) -> tuple[Path, Path]:
    if runtime.state is None:
        raise ValueError("Thread runtime state is not available")
    thread_data = runtime.state.get("thread_data") or {}
    workspace_path = thread_data.get("workspace_path")
    outputs_path = thread_data.get("outputs_path")
    if not workspace_path or not outputs_path:
        raise ValueError("Thread workspace/outputs paths are not available in runtime state")
    return Path(workspace_path).resolve(), Path(outputs_path).resolve()


def _safe_signature(fn: Any) -> str:
    try:
        import inspect

        return str(inspect.signature(fn))
    except Exception:
        return "(unknown)"


@tool("statspai_list_functions", parse_docstring=True)
def statspai_list_functions_tool(query: str | None = None, category: str | None = None, limit: int = 80) -> str:
    """列出或检索 StatsPAI 的可用函数（用于让模型“先选对方法再执行”）。

    Args:
        query: 可选。关键词检索（会匹配 name/description/tags）。
        category: 可选。按类别过滤（例如 causal/econometrics 等，具体以 StatsPAI registry 为准）。
        limit: 返回条数上限（默认 80）。
    """
    import statspai as sp

    if query:
        search_fn = getattr(sp, "search_functions", None)
        if callable(search_fn):
            items = search_fn(query)
            return json.dumps({"query": query, "total": len(items), "results": items[:limit]}, ensure_ascii=False, indent=2)
        try:
            from statspai.registry import search_functions as registry_search

            items = registry_search(query)
            return json.dumps({"query": query, "total": len(items), "results": items[:limit]}, ensure_ascii=False, indent=2)
        except Exception as e:
            return json.dumps({"query": query, "error": f"{type(e).__name__}: {e}"}, ensure_ascii=False, indent=2)

    list_fn = getattr(sp, "list_functions", None)
    if callable(list_fn):
        names = list_fn(category=category)
        return json.dumps({"category": category, "total": len(names), "results": names[:limit]}, ensure_ascii=False, indent=2)
    try:
        from statspai.registry import list_functions as registry_list

        names = registry_list(category=category)
        return json.dumps({"category": category, "total": len(names), "results": names[:limit]}, ensure_ascii=False, indent=2)
    except Exception:
        names = sorted([n for n in dir(sp) if not n.startswith("_") and callable(getattr(sp, n, None))])
        return json.dumps({"category": category, "total": len(names), "results": names[:limit]}, ensure_ascii=False, indent=2)


@tool("statspai_describe_function", parse_docstring=True)
def statspai_describe_function_tool(name: str) -> str:
    """返回某个 StatsPAI 函数的详细说明与参数 schema。

    Args:
        name: StatsPAI 函数名（来自 statspai_list_functions）。
    """
    import statspai as sp

    payload: dict[str, Any] = {"name": name}
    describe_fn = getattr(sp, "describe_function", None)
    schema_fn = getattr(sp, "function_schema", None)
    card_fn = getattr(sp, "agent_card", None)

    if callable(describe_fn):
        try:
            payload["spec"] = describe_fn(name)
        except Exception as e:
            payload["error"] = f"{type(e).__name__}: {e}"
            return json.dumps(payload, ensure_ascii=False, indent=2)
    else:
        try:
            from statspai.registry import describe_function as registry_describe

            payload["spec"] = registry_describe(name)
        except Exception:
            fn = getattr(sp, name, None)
            if fn is None:
                payload["error"] = f"Unknown function: {name}"
                return json.dumps(payload, ensure_ascii=False, indent=2)
            payload["spec"] = {"name": name, "signature": _safe_signature(fn)}

    if callable(schema_fn):
        try:
            payload["schema"] = schema_fn(name)
        except Exception:
            payload["schema"] = None
    else:
        try:
            from statspai.registry import function_schema as registry_schema

            payload["schema"] = registry_schema(name)
        except Exception:
            payload["schema"] = None

    if callable(card_fn):
        try:
            payload["agent_card"] = card_fn(name)
        except Exception:
            payload["agent_card"] = None
    else:
        try:
            from statspai.registry import agent_card as registry_card

            payload["agent_card"] = registry_card(name)
        except Exception:
            payload["agent_card"] = None

    return json.dumps(payload, ensure_ascii=False, indent=2)


@tool("statspai_execute", parse_docstring=True)
def statspai_execute_tool(
    runtime: ToolRuntime[ContextT, ThreadState],
    name: str,
    arguments: dict[str, Any],
    data_path: str | None,
    make_plot: bool = True,
    export_xlsx: bool = True,
    language: str = "zh",
    tool_call_id: Annotated[str, InjectedToolCallId] = "",
) -> Command:
    """在当前线程的沙盒环境中执行 StatsPAI 分析，并将产物写入 outputs 后自动展示。

    Args:
        name: StatsPAI 函数名（例如 regress/ivreg/rdrobust/synth/callaway_santanna 等）。
        arguments: 函数参数（JSON object）。不要在这里传 data；data 由 data_path 加载后注入。
        data_path: 数据文件路径（推荐使用 /mnt/user-data/uploads 下的文件）。
        make_plot: 是否生成图（默认 true）。
        export_xlsx: 是否尝试导出 Excel 回归表（默认 true）。
        language: zh/en。zh 会启用 use_chinese() 并使用 academic 主题。
    """
    try:
        ensure_thread_directories_exist(runtime)
        sandbox = ensure_sandbox_initialized(runtime)

        run_id = uuid.uuid4().hex
        subdir = f"statspai/{run_id}"
        v_workspace_dir = f"{_V_WORKSPACE}/{subdir}"
        v_output_dir = f"{_V_OUTPUTS}/{subdir}"
        v_spec_path = f"{v_workspace_dir}/job_spec.json"
        v_runner_path = f"{v_workspace_dir}/run_statspai_job.py"
        v_manifest_path = f"{v_output_dir}/manifest.json"

        job_spec = {
            "name": name,
            "arguments": arguments,
            "data_path": data_path,
            "output_dir": v_output_dir,
            "make_plot": make_plot,
            "export_xlsx": export_xlsx,
            "language": language,
        }

        if is_local_sandbox(runtime):
            workspace_dir, outputs_dir = _thread_paths(runtime)
            host_workspace_dir = (workspace_dir / subdir).resolve()
            host_output_dir = (outputs_dir / subdir).resolve()
            host_workspace_dir.mkdir(parents=True, exist_ok=True)
            host_output_dir.mkdir(parents=True, exist_ok=True)

            (host_workspace_dir / "job_spec.json").write_text(
                json.dumps({**job_spec, "output_dir": str(host_output_dir)}, ensure_ascii=False, indent=2),
                encoding="utf-8",
            )
            (host_workspace_dir / "run_statspai_job.py").write_text(_RUNNER_PY, encoding="utf-8")

            cmd = (
                f"Set-Location -LiteralPath '{str(host_workspace_dir)}'; "
                f"python -u '{str((host_workspace_dir / 'run_statspai_job.py').resolve())}' "
                f"'{str((host_workspace_dir / 'job_spec.json').resolve())}'"
            )
            sandbox.execute_command(cmd)
            manifest_text = (host_output_dir / "manifest.json").read_text(encoding="utf-8")
        else:
            sandbox.write_file(v_spec_path, json.dumps(job_spec, ensure_ascii=False, indent=2))
            sandbox.write_file(v_runner_path, _RUNNER_PY)
            sandbox.execute_command(f"python -u '{v_runner_path}' '{v_spec_path}'")
            manifest_text = sandbox.read_file(v_manifest_path)

        manifest = json.loads(manifest_text) if manifest_text else {"success": False, "error": "Missing manifest"}
        files = (manifest.get("files") or {}) if isinstance(manifest, dict) else {}

        artifacts: list[str] = []
        for key in ("report_md", "figure_png", "regtable_xlsx", "tidy_csv", "result_json", "run_log"):
            val = files.get(key)
            if isinstance(val, str) and val:
                artifacts.append(f"{v_output_dir}/{val}")
        artifacts.append(v_manifest_path)

        msg = {"success": bool(manifest.get("success")), "name": name, "output_dir": v_output_dir, "artifacts": artifacts}
        if isinstance(manifest, dict) and "error" in manifest:
            msg["error"] = manifest.get("error")

        return Command(update={"artifacts": artifacts, "messages": [ToolMessage(json.dumps(msg, ensure_ascii=False, indent=2), tool_call_id=tool_call_id)]})
    except Exception as e:
        return Command(update={"messages": [ToolMessage(f"Error: {type(e).__name__}: {e}", tool_call_id=tool_call_id)]})

