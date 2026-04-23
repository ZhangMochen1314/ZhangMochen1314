#!/usr/bin/env python3
"""
DeepResValue-DataClean 缺失值清洗脚本
强制优先使用 StatsPAI，失败时自动回退到 pandas
"""
import pandas as pd
import numpy as np
import sys

# ========== 1. 读取数据 ==========
df = pd.read_csv('../uploads/test_data_missing.csv')
print("=" * 60)
print("【清洗前】原始数据 (前10行):")
print("=" * 60)
print(df.to_string())
print("\n缺失值统计:")
print(df.isnull().sum().to_string())
print()

# ========== 2. 尝试使用 statspai ==========
use_statspai = False
try:
    from statspai.data_clean import DataClean
    print("[INFO] StatsPAI 导入成功，正在使用 StatsPAI 处理...")
    
    cleaner = DataClean()
    # StatsPAI 的缺失值处理
    df_cleaned = cleaner.handle_missing(df)
    use_statspai = True
    print("[INFO] StatsPAI 处理完成！")
except ImportError:
    print("[INFO] StatsPAI 未安装 (ImportError)，自动回退到 pandas...")
except AttributeError as e:
    print(f"[INFO] StatsPAI 不支持 handle_missing (AttributeError: {e})，自动回退到 pandas...")
except Exception as e:
    print(f"[INFO] StatsPAI 处理报错 ({type(e).__name__}: {e})，自动回退到 pandas...")

# ========== 3. 如果 statspai 不可用，用 pandas 回退 ==========
if not use_statspai:
    print("[INFO] 使用 pandas 进行缺失值填补...")
    df_cleaned = df.copy()
    
    # 数值型列：用中位数填补
    numeric_cols = ['age', 'income', 'satisfaction_score']
    for col in numeric_cols:
        median_val = df_cleaned[col].median()
        df_cleaned[col].fillna(median_val, inplace=True)
        print(f"  → {col}: 用中位数 {median_val:.2f} 填补")
    
    # 分类型列：用众数填补
    categorical_cols = ['education', 'region']
    for col in categorical_cols:
        mode_val = df_cleaned[col].mode().iloc[0]
        df_cleaned[col].fillna(mode_val, inplace=True)
        print(f"  → {col}: 用众数 '{mode_val}' 填补")

# ========== 4. 输出清洗结果 ==========
print("\n" + "=" * 60)
print("【清洗后】数据 (前5行):")
print("=" * 60)
print(df_cleaned.head(5).to_string())

print("\n" + "=" * 60)
print("清洗后缺失值统计:")
print("=" * 60)
print(df_cleaned.isnull().sum().to_string())

# 保存清洗后数据
output_path = '../outputs/test_data_missing_cleaned.csv'
df_cleaned.to_csv(output_path, index=False)
print(f"\n[OK] 清洗后数据已保存至: {output_path}")
