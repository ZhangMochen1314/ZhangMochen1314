import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
from style_manager import apply_academic_style, apply_commercial_style

def generate_scatter_data():
    """生成带相关性的散点/气泡数据"""
    np.random.seed(42)
    n = 100
    x = np.random.uniform(10, 50, n)
    # y = 2*x + 噪音
    y = 2 * x + np.random.normal(0, 15, n)
    # 气泡大小（代表另一个维度，例如人口或营收）
    size = np.random.uniform(20, 500, n)
    # 气泡颜色分类（代表不同地区或类别）
    categories = np.random.choice(['Category A', 'Category B', 'Category C'], n)
    
    return pd.DataFrame({'X': x, 'Y': y, 'Size': size, 'Category': categories})

def plot_scatter_bubble(style='academic', output_path='scatter_bubble_academic.pdf'):
    """
    绘制带拟合线及95%置信区间的散点图，以及气泡图
    """
    if style == 'academic':
        apply_academic_style()
        scatter_color = '0.3'
        line_color = 'black'
        bubble_palette = ['#404040', '#808080', '#BFBFBF']
        alpha = 0.6
    else:
        apply_commercial_style()
        prop_cycle = plt.rcParams['axes.prop_cycle']
        colors = prop_cycle.by_key()['color']
        scatter_color = colors[0]
        line_color = colors[1]
        bubble_palette = colors[:3]
        alpha = 0.7

    df = generate_scatter_data()

    figsize = plt.rcParams.get('figure.figsize')
    fig, axes = plt.subplots(1, 2, figsize=(figsize[0] * 1.5, figsize[1]))

    # --- 子图 1: 散点图与拟合线 (含95%置信区间) ---
    sns.regplot(
        data=df, 
        x='X', 
        y='Y', 
        ax=axes[0], 
        color=scatter_color,
        scatter_kws={'alpha': alpha, 's': 30},
        line_kws={'color': line_color, 'linewidth': 2}
    )
    axes[0].set_title('Scatter Plot with 95% CI', fontweight='bold' if style == 'commercial' else 'normal')
    axes[0].set_xlabel('Variable X')
    axes[0].set_ylabel('Variable Y')

    # --- 子图 2: 气泡图 ---
    # 利用 seaborn 的 scatterplot 绘制气泡图
    sns.scatterplot(
        data=df, 
        x='X', 
        y='Y', 
        size='Size', 
        hue='Category', 
        ax=axes[1],
        palette=bubble_palette,
        sizes=(20, 500), 
        alpha=alpha,
        edgecolor='w' if style == 'commercial' else 'k'
    )
    axes[1].set_title('Bubble Chart', fontweight='bold' if style == 'commercial' else 'normal')
    axes[1].set_xlabel('Variable X')
    axes[1].set_ylabel('Variable Y')
    
    # 调整图例位置，避免遮挡
    axes[1].legend(bbox_to_anchor=(1.05, 1), loc='upper left', borderaxespad=0.)

    plt.tight_layout()
    plt.savefig(output_path, bbox_inches='tight')
    plt.close()
    print(f"Saved {style} style plot to {output_path}")

if __name__ == "__main__":
    plot_scatter_bubble('academic', 'scatter_bubble_academic.pdf')
    plot_scatter_bubble('commercial', 'scatter_bubble_commercial.png')
