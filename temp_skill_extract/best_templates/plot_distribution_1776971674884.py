import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
from style_manager import apply_academic_style, apply_commercial_style

def generate_simulated_data():
    """生成模拟数据用于分布图绘制"""
    pass # np.random.seed(42)
    # 生成三个不同分布的组数据
    n_samples = 500
    group_a = np.random.normal(loc=0, scale=1, size=n_samples)
    group_b = np.random.normal(loc=1.5, scale=1.5, size=n_samples)
    group_c = np.random.normal(loc=-1, scale=0.8, size=n_samples)
    
    # 构造 DataFrame
    data = []
    for val in group_a:
        data.append({'Group': 'Group A', 'Value': val})
    for val in group_b:
        data.append({'Group': 'Group B', 'Value': val})
    for val in group_c:
        data.append({'Group': 'Group C', 'Value': val})
        
    return pd.DataFrame(data)

def plot_distribution(style='academic', output_path='distribution_academic.pdf'):
    """
    绘制小提琴图和核密度估计图
    """
    # 1. 应用样式
    if style == 'academic':
        apply_academic_style()
        palette = ['#404040', '#808080', '#BFBFBF']  # 灰度调色板
        kde_alpha = 0.3
    else:
        apply_commercial_style()
        # 商业风格使用默认的华丽色彩（由 style_manager 中的 axes.prop_cycle 控制，这里使用 seaborn 时显式传入或让它继承）
        # 获取当前色板的颜色
        prop_cycle = plt.rcParams['axes.prop_cycle']
        colors = prop_cycle.by_key()['color']
        palette = colors[:3]
        kde_alpha = 0.5

    # 2. 生成数据
    df = generate_simulated_data()

    # 3. 创建画布，1行2列
    # 获取设置好的画布尺寸，若商业风格希望更宽，可在此调整，但优先使用 style_manager 的默认大小
    figsize = plt.rcParams.get('figure.figsize')
    # 稍微加宽一点以容纳两个子图
    fig, axes = plt.subplots(1, 2, figsize=(figsize[0] * 1.5, figsize[1]))

    # --- 子图 1: 小提琴图 ---
    sns.violinplot(
        data=df, 
        x='Group', 
        y='Value', 
        hue='Group',
        ax=axes[0], 
        palette=palette, 
        inner='quartile', # 显示四分位数
        linewidth=plt.rcParams['axes.linewidth'],
        legend=False
    )
    axes[0].set_title('Violin Plot of Groups', fontweight='bold' if style == 'commercial' else 'normal')
    axes[0].set_xlabel('Group')
    axes[0].set_ylabel('Value')

    # --- 子图 2: 核密度估计图 (KDE) ---
    sns.kdeplot(
        data=df, 
        x='Value', 
        hue='Group', 
        ax=axes[1], 
        palette=palette, 
        fill=True, 
        alpha=kde_alpha,
        linewidth=plt.rcParams['lines.linewidth']
    )
    axes[1].set_title('Kernel Density Estimation', fontweight='bold' if style == 'commercial' else 'normal')
    axes[1].set_xlabel('Value')
    axes[1].set_ylabel('Density')

    # 4. 调整布局并保存
    plt.tight_layout()
    plt.savefig(output_path)
    plt.close()
    print(f"Saved {style} style plot to {output_path}")

if __name__ == "__main__":
    # 生成学术风格图片
    plot_distribution(style='academic', output_path='distribution_academic.pdf')
    # 生成商业风格图片
    plot_distribution(style='commercial', output_path='distribution_commercial.png')
