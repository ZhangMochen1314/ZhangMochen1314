import asyncio
import os
from deerflow.agents import make_lead_agent
from langchain_core.messages import HumanMessage

# os.environ["DEEPSEEK_API_KEY"] = "your-api-key-here"

async def main():
    config = {
        "configurable": {
            "thread_id": "test-deepseek-v4pro-001",
            "thinking_enabled": True,
            "is_plan_mode": False,
            "model_name": "deepseek-v4-pro",
        }
    }

    agent = make_lead_agent(config)

    user_input = "Hello! Please identify yourself and what version of the model you are."
    print(f"User: {user_input}")
    
    state = {"messages": [HumanMessage(content=user_input)]}
    result = await agent.ainvoke(state, config=config, context={"thread_id": "test-deepseek-v4pro-001"})

    if result.get("messages"):
        last_message = result["messages"][-1]
        print(f"\nAgent: {last_message.content}")
        if hasattr(last_message, 'additional_kwargs') and 'reasoning_content' in last_message.additional_kwargs:
            print(f"\nThinking:\n{last_message.additional_kwargs['reasoning_content']}")

if __name__ == "__main__":
    asyncio.run(main())
