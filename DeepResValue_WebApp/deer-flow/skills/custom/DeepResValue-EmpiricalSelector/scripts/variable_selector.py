import os
import pandas as pd
import numpy as np
import statsmodels.api as sm
import matplotlib.pyplot as plt
import seaborn as sns
from typing import List, Tuple

def select_significant_variables(
    df: pd.DataFrame, 
    y_var: str, 
    candidate_vars: List[str], 
    p_value_threshold: float = 0.1,
    output_dir: str = "/workspace/DeepResValue_WebApp/deer-flow/skills/custom/DeepResValue-EmpiricalSelector/assets"
) -> Tuple[pd.DataFrame, str]:
    """
    基于统计显著性筛选解释变量
    
    参数:
    df: pandas.DataFrame, 原始数据集
    y_var: str, 被解释变量(因变量)名称
    candidate_vars: List[str], 由大模型基于语义预先筛选的候选解释变量列表
    p_value_threshold: float, p值阈值，默认为0.1
    output_dir: str, 图表输出目录
    
    返回:
    Tuple[pd.DataFrame, str]: 显著变量的统计结果表，以及生成的可视化图片路径
    """
    
    # 1. 数据预处理
    if y_var not in df.columns:
        raise ValueError(f"被解释变量 '{y_var}' 不在数据集中。")
        
    valid_candidates = [var for var in candidate_vars if var in df.columns]
    if not valid_candidates:
        raise ValueError("提供的所有候选变量均不在数据集中。")
        
    # 提取需要的列并剔除缺失值
    analysis_df = df[[y_var] + valid_candidates].dropna()
    if len(analysis_df) < 10:
        raise ValueError("剔除缺失值后，样本量过少，无法进行有意义的回归分析。")
        
    Y = analysis_df[y_var]
    X = analysis_df[valid_candidates]
    
    # 将可能存在的非数值列转换为虚拟变量或抛出错误
    X = pd.get_dummies(X, drop_first=True, dtype=float)
    
    # 2. 单变量显著性初筛 (Univariate screening)
    significant_vars = []
    results_list = []
    
    for col in X.columns:
        x_single = sm.add_constant(X[[col]])
        try:
            # 根据因变量类型选择模型 (简单判断：如果只有0和1，则使用Logit)
            if set(Y.unique()).issubset({0, 1}):
                model = sm.Logit(Y, x_single).fit(disp=0)
            else:
                model = sm.OLS(Y, x_single).fit()
                
            p_val = model.pvalues[col]
            if p_val < p_value_threshold:
                significant_vars.append(col)
                results_list.append({
                    "Variable": col,
                    "Coefficient": model.params[col],
                    "Std_Error": model.bse[col],
                    "t_value": model.tvalues[col] if hasattr(model, 'tvalues') else np.nan,
                    "p_value": p_val
                })
        except Exception as e:
            print(f"Warning: 变量 {col} 无法进行回归分析，错误信息: {e}")
            continue

    if not significant_vars:
        return pd.DataFrame(), ""
        
    results_df = pd.DataFrame(results_list)
    
    # 3. 生成可视化 (相关性热力图)
    if not os.path.exists(output_dir):
        os.makedirs(output_dir, exist_ok=True)
        
    plot_vars = [y_var] + significant_vars
    corr_matrix = analysis_df[plot_vars].corr()
    
    plt.figure(figsize=(max(8, len(plot_vars) * 0.8), max(6, len(plot_vars) * 0.8)))
    
    # 设置简单的全局绘图风格
    sns.set_theme(style="whitegrid", context="paper")
    plt.rcParams['font.sans-serif'] = ['SimHei', 'Arial Unicode MS', 'sans-serif']
    plt.rcParams['axes.unicode_minus'] = False
    
    # 绘制热力图
    mask = np.triu(np.ones_like(corr_matrix, dtype=bool))
    cmap = sns.diverging_palette(230, 20, as_cmap=True)
    sns.heatmap(corr_matrix, mask=mask, cmap=cmap, vmax=1, vmin=-1, center=0,
                square=True, linewidths=.5, cbar_kws={"shrink": .5}, annot=True, fmt=".2f")
                
    plt.title(f"核心解释变量与 {y_var} 的相关性热力图", fontsize=16, pad=20)
    plt.tight_layout()
    
    plot_path = os.path.join(output_dir, f"correlation_heatmap_{y_var}.png")
    plt.savefig(plot_path, dpi=300, bbox_inches='tight')
    plt.close()
    
    return results_df, plot_path

def generate_markdown_report(results_df: pd.DataFrame, y_var: str, plot_path: str) -> str:
    """生成结构化的 Markdown 分析报告"""
    if results_df.empty:
        return f"**分析结果**: 没有找到与 {y_var} 统计显著（p < 0.1）的解释变量。\n"
        
    report = f"## 核心解释变量筛选报告\n\n"
    report += f"**被解释变量 (因变量 Y)**: `{y_var}`\n\n"
    
    report += "### 1. 统计显著变量清单\n\n"
    
    # 格式化表格
    display_df = results_df.copy()
    display_df['Coefficient'] = display_df['Coefficient'].apply(lambda x: f"{x:.4f}")
    display_df['Std_Error'] = display_df['Std_Error'].apply(lambda x: f"{x:.4f}")
    display_df['t_value'] = display_df['t_value'].apply(lambda x: f"{x:.4f}")
    display_df['p_value'] = display_df['p_value'].apply(lambda x: f"{x:.4f}" if x >= 0.0001 else "<0.0001")
    
    # 添加星号标记
    def add_stars(p_val_str):
        if p_val_str == "<0.0001": return "***"
        p = float(p_val_str)
        if p < 0.01: return "***"
        elif p < 0.05: return "**"
        elif p < 0.1: return "*"
        return ""
        
    display_df['Significance'] = display_df['p_value'].apply(add_stars)
    
    report += display_df.to_markdown(index=False)
    report += "\n\n*(注: *** p<0.01, ** p<0.05, * p<0.1)*\n\n"
    
    report += "### 2. 可视化分析\n\n"
    report += f"相关性热力图已生成，请查看：\n![Correlation Heatmap]({plot_path})\n\n"
    
    report += "### 3. 下一步建议\n\n"
    report += "建议基于上述具有统计显著性的核心变量，进一步构建多元回归模型或面板数据模型（如固定效应模型），并加入适当的控制变量以缓解内生性问题。"
    
    return report

