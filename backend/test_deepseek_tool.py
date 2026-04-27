import asyncio
import os
from deerflow.agents import make_lead_agent
from langchain_core.messages import HumanMessage

# os.environ["DEEPSEEK_API_KEY"] = "your-api-key-here"

async def main():
    config = {
        "configurable": {
            "thread_id": "test-deepseek-tool-001",
            "thinking_enabled": True,
            "is_plan_mode": False,
            "model_name": "deepseek-reasoner",
        }
    }

    agent = make_lead_agent(config)

    user_input = "请使用工具查看一下 /workspace/deer-flow 目录下面有哪些文件，并告诉我。"
    print(f"User: {user_input}")
    
    state = {"messages": [HumanMessage(content=user_input)]}
    result = await agent.ainvoke(state, config=config, context={"thread_id": "test-deepseek-tool-001"})

    if result.get("messages"):
        for msg in result["messages"]:
            if msg.type == "ai":
                print(f"\nAgent: {msg.content}")
                if hasattr(msg, 'additional_kwargs') and 'reasoning_content' in msg.additional_kwargs:
                    print(f"\nThinking:\n{msg.additional_kwargs['reasoning_content']}")
            elif msg.type == "tool":
                print(f"\nTool Result: {msg.content}")

if __name__ == "__main__":
    asyncio.run(main())
