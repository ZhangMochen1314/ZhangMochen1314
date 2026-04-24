"""
DeepTrace Data Collector - 日志记录模块
提供统一的日志记录功能，支持不同日志级别和文件输出
"""

import logging
import os
from datetime import datetime
from pathlib import Path


class DataCollectorLogger:
    """数据搜集器日志记录器"""

    def __init__(self, log_dir='logs', log_level=logging.INFO):
        """
        初始化日志记录器

        Args:
            log_dir: 日志目录
            log_level: 日志级别
        """
        self.log_dir = Path(log_dir)
        self.log_dir.mkdir(parents=True, exist_ok=True)

        # 设置日志格式
        self.log_format = '[%(asctime)s] [%(levelname)s] [%(name)s:%(lineno)d] %(message)s'
        self.date_format = '%Y-%m-%d %H:%M:%S'

        # 创建不同模块的日志记录器
        self.loggers = {
            'data_fetcher': self._create_logger('data_fetcher', log_level),
            'data_converter': self._create_logger('data_converter', log_level),
            'data_validator': self._create_logger('data_validator', log_level)
        }

    def _create_logger(self, name, level):
        """创建日志记录器"""
        logger = logging.getLogger(name)
        logger.setLevel(level)

        # 清除已有的处理器
        logger.handlers.clear()

        # 文件处理器
        file_handler = logging.FileHandler(
            self.log_dir / f'{name}.log',
            encoding='utf-8'
        )
        file_handler.setLevel(level)

        # 控制台处理器
        console_handler = logging.StreamHandler()
        console_handler.setLevel(level)

        # 设置格式
        formatter = logging.Formatter(self.log_format, self.date_format)
        file_handler.setFormatter(formatter)
        console_handler.setFormatter(formatter)

        # 添加处理器
        logger.addHandler(file_handler)
        logger.addHandler(console_handler)

        return logger

    def get_logger(self, name='data_fetcher'):
        """获取指定模块的日志记录器"""
        return self.loggers.get(name, self._create_logger(name, logging.INFO))

    def log_operation(self, module, level, message, **kwargs):
        """
        记录操作日志

        Args:
            module: 模块名称
            level: 日志级别 ('DEBUG', 'INFO', 'WARNING', 'ERROR')
            message: 日志消息
            **kwargs: 额外信息
        """
        logger = self.get_logger(module)

        # 添加额外信息到消息
        if kwargs:
            extra_info = ' '.join([f'{k}={v}' for k, v in kwargs.items()])
            message = f'{message} | {extra_info}'

        # 记录日志
        if level == 'DEBUG':
            logger.debug(message)
        elif level == 'INFO':
            logger.info(message)
        elif level == 'WARNING':
            logger.warning(message)
        elif level == 'ERROR':
            logger.error(message)


# 全局日志实例
_logger_instance = None


def get_logger(module='data_fetcher'):
    """获取日志记录器实例"""
    global _logger_instance
    if _logger_instance is None:
        _logger_instance = DataCollectorLogger()
    return _logger_instance.get_logger(module)


def log_info(module, message, **kwargs):
    """记录INFO级别日志"""
    logger = get_logger(module)
    if kwargs:
        extra_info = ' '.join([f'{k}={v}' for k, v in kwargs.items()])
        message = f'{message} | {extra_info}'
    logger.info(message)


def log_warning(module, message, **kwargs):
    """记录WARNING级别日志"""
    logger = get_logger(module)
    if kwargs:
        extra_info = ' '.join([f'{k}={v}' for k, v in kwargs.items()])
        message = f'{message} | {extra_info}'
    logger.warning(message)


def log_error(module, message, **kwargs):
    """记录ERROR级别日志"""
    logger = get_logger(module)
    if kwargs:
        extra_info = ' '.join([f'{k}={v}' for k, v in kwargs.items()])
        message = f'{message} | {extra_info}'
    logger.error(message)


def log_debug(module, message, **kwargs):
    """记录DEBUG级别日志"""
    logger = get_logger(module)
    if kwargs:
        extra_info = ' '.join([f'{k}={v}' for k, v in kwargs.items()])
        message = f'{message} | {extra_info}'
    logger.debug(message)
