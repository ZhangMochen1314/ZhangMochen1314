import os
import logging
from typing import Optional, AsyncIterator
from openai import AsyncOpenAI

logger = logging.getLogger(__name__)

class LLMService:
    def __init__(self):
        # 主模型：阿里云百炼 DeepSeek V4-Pro（支持联网搜索）
        self.primary_client = AsyncOpenAI(
            api_key=os.getenv("DASHSCOPE_API_KEY"),
            base_url="https://dashscope.aliyuncs.com/compatible-mode/v1",
        )
        
        # 备用模型：DeepSeek官方API
        self.backup_client = AsyncOpenAI(
            api_key=os.getenv("DEEPSEEK_API_KEY"),
            base_url="https://api.deepseek.com/v1",
        )
        
        # 轻量模型：用于简单任务
        self.flash_model = "deepseek-v4-flash"
        self.pro_model = "deepseek-v4-pro"
    
    async def chat(
        self,
        messages: list,
        model: str = "pro",
        use_backup: bool = False,
        enable_search: bool = False,
        enable_thinking: bool = False,
        stream: bool = True
    ):
        """
        智能选择主模型或备用模型
        
        Args:
            messages: 对话消息列表
            model: "pro" 或 "flash"
            use_backup: 是否使用备用模型（DeepSeek官方）
            enable_search: 是否开启联网搜索（仅百炼支持）
            enable_thinking: 是否开启思考模式
            stream: 是否流式输出
        """
        client = self.backup_client if use_backup else self.primary_client
        model_name = self.pro_model if model == "pro" else self.flash_model
        
        # 构建额外参数
        extra_body = {}
        if enable_search and not use_backup:  # 联网搜索仅百炼支持
            extra_body["enable_search"] = True
        if enable_thinking:
            extra_body["enable_thinking"] = True
        
        try:
            return await client.chat.completions.create(
                model=model_name,
                messages=messages,
                stream=stream,
                extra_body=extra_body if extra_body else None,
            )
        except Exception as e:
            if not use_backup:
                # 主模型失败，自动切换到备用
                logger.warning(f"主模型调用失败: {e}，切换到备用模型")
                return await self.chat(
                    messages, model, use_backup=True, 
                    enable_search=False,  # 备用模型不支持联网搜索
                    enable_thinking=enable_thinking,
                    stream=stream
                )
            raise e
    
    async def chat_with_search(self, messages: list, stream: bool = True):
        """带联网搜索的对话（用于实时信息查询）"""
        return await self.chat(
            messages, 
            model="pro", 
            enable_search=True,
            stream=stream
        )
