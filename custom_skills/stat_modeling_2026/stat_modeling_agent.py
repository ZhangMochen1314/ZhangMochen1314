import os
from pathlib import Path
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.tools import tool

# 假设在 deerflow 2.0 后端中
# 技能的基础路径
SKILL_DIR = Path(__file__).parent

def load_system_prompt() -> str:
    """加载 2026 统计建模大赛的系统提示词（由 Coze 的 SKILL.md 改造而来）"""
    prompt_file = SKILL_DIR / "system_prompt.md"
    if prompt_file.exists():
        with open(prompt_file, "r", encoding="utf-8") as f:
            return f.read()
    return "你是一个 2026 年统计建模大赛指导专家。"

def load_knowledge_base() -> str:
    """加载知识库文档内容（由于内容不多，可以直接拼接到 prompt，或者使用 RAG 向量检索）"""
    kb_dir = SKILL_DIR / "knowledge_base"
    kb_text = ""
    if kb_dir.exists():
        for file in kb_dir.glob("*.md"):
            with open(file, "r", encoding="utf-8") as f:
                kb_text += f"\n\n--- [知识库文件: {file.name}] ---\n"
                kb_text += f.read()
    return kb_text

def get_modeling_competition_prompt() -> ChatPromptTemplate:
    """生成包含知识库和专家设定的完整提示词模板"""
    system_instruction = load_system_prompt()
    knowledge_base_text = load_knowledge_base()
    
    # 融合为超级 Agent 的 System Prompt
    full_system_prompt = f"""{system_instruction}

# 附加知识库参考（重要）
请在回答用户关于论文写作、文献搜集、方法选择、答辩、评分标准等问题时，严格参考以下知识库内容：
{knowledge_base_text}

注意：如果用户请求生成代码或进行数据分析，请使用自带的数据分析工具和 Python REPL 来执行计算。
"""

    prompt = ChatPromptTemplate.from_messages([
        ("system", full_system_prompt),
        MessagesPlaceholder(variable_name="messages"),
    ])
    return prompt

def route_user_input(state):
    """
    LangGraph 路由函数示例：
    检测用户输入是否带有 "@2026建模大赛指导" 技能引用标签，
    如果有，则将请求路由到 modeling_skill_node 节点。
    """
    messages = state["messages"]
    last_msg = messages[-1].content
    
    if "@2026建模大赛指导" in last_msg:
        # 移除标签前缀后传递给专业节点
        # state["messages"][-1].content = last_msg.replace("@2026建模大赛指导", "").strip()
        return "modeling_skill_node"
        
    return "general_agent_node"

# --- 作为一个可被主 Agent 调用的子图 (SubGraph/Skill) ---
def build_modeling_skill_node(llm, tools=None):
    """
    构建鹿流(DeerFlow)的自定义技能节点。
    当请求被路由到 "@2026建模大赛指导" 时，将触发该节点。
    """
    if tools is None:
        tools = [] # 可以加入 stats_pai 等数据分析工具
        
    prompt = get_modeling_competition_prompt()
    # 绑定工具
    llm_with_tools = llm.bind_tools(tools)
    
    # 构建处理链
    def modeling_agent_node(state):
        # State 通常是一个包含 messages 的字典 (LangGraph)
        messages = state["messages"]
        chain = prompt | llm_with_tools
        response = chain.invoke({"messages": messages})
        return {"messages": [response]}
        
    return modeling_agent_node

# --- 或者作为一个可被大模型直接调用的 Tool ---
@tool
def modeling_competition_advisor(query: str) -> str:
    """
    指导 2026 年第十二届全国大学生统计建模大赛。
    当用户询问关于大赛的流程、选题方向、文献收集、分析方法、论文写作、答辩技巧或评审标准时，调用此工具。
    """
    # 简易实现：直接返回大模型的调用结果
    # 实际在 DeerFlow 中，推荐使用上面的 Agent Node 路由模式，以便直接流式输出
    pass
