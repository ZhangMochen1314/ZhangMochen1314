# 提取压缩包进行探索
import tarfile
import os

with tarfile.open("/workspace/archive/data/文献.gz", "r:gz") as tar:
    tar.extractall(path="/workspace/archive/data/extract_wenxian")
print("文献 extracted")

with tarfile.open("/workspace/archive/data/数据搜集.gz", "r:gz") as tar:
    tar.extractall(path="/workspace/archive/data/extract_shuju")
print("数据搜集 extracted")

with tarfile.open("/workspace/archive/data/2026统计建模.gz", "r:gz") as tar:
    tar.extractall(path="/workspace/archive/data/extract_tongji")
print("2026统计建模 extracted")
