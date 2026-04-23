import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
from style_manager import apply_academic_style, apply_commercial_style

def generate_corr_data():
    """生成用于相关系数热力图的数据"""
    np.random.seed(42)
    # 生成 6 个变量的多变量正态分布数据
    # 构造协方差矩阵
    cov_mat = np.array([
        [1.0, 0.8, -0.5, 0.2, 0.1, 0.6],
        [0.8, 1.0, -0.4, 0.1, 0.3, 0.5],
        [-0.5, -0.4, 1.0, -0.7, 0.0, -0.2],
        [0.2, 0.1, -0.7, 1.0, 0.4, 0.3],
        [0.1, 0.3, 0.0, 0.4, 1.0, 0.1],
        [0.6, 0.5, -0.2, 0.3, 0.1, 1.0]
    ])
    mean_vec = np.zeros(6)
    data = np.random.multivariate_normal(mean_vec, cov_mat, size=200)
    
    cols = ['Growth', 'Profit', 'Debt', 'Liquidity', 'Scale', 'R&D']
    df = pd.DataFrame(data, columns=cols)
    return df.corr()

def plot_heatmap(style='academic', output_path='heatmap_academic.pdf'):
    """
    绘制相关系数热力图
    """
    if style == 'academic':
        apply_academic_style()
        cmap = 'Greys'
        annot_kws = {'size': 10, 'color': 'black'}
    else:
        apply_commercial_style()
        cmap = 'coolwarm' # 适合商业展示的红蓝对比色
        annot_kws = {'size': 11}

    corr = generate_corr_data()

    # 热力图通常适合方形
    figsize = plt.rcParams.get('figure.figsize')
    # 强制将高度和宽度调整得接近方形，以便热力图美观
    fig, ax = plt.subplots(figsize=(figsize[1]*1.2, figsize[1]*1.2))

    # 生成一个 mask，掩盖上半部分（常见于学术论文，商业展示可掩也可不掩，这里统一掩盖上半部）
    mask = np.triu(np.ones_like(corr, dtype=bool))

    sns.heatmap(
        corr, 
        mask=mask, 
        cmap=cmap, 
        vmax=1.0, 
        vmin=-1.0, 
        center=0,
        annot=True, 
        fmt=".2f",
        square=True, 
        linewidths=.5, 
        cbar_kws={"shrink": .7},
        ax=ax,
        annot_kws=annot_kws
    )
    
    ax.set_title('Correlation Heatmap', fontweight='bold' if style == 'commercial' else 'normal', pad=20)
    
    # 学术风格下如果遇到字体颜色太深的问题，可能需要调整 annot_kws，但在 'Greys' 下黑字一般清晰
    
    plt.tight_layout()
    plt.savefig(output_path, bbox_inches='tight')
    plt.close()
    print(f"Saved {style} style plot to {output_path}")

if __name__ == "__main__":
    plot_heatmap('academic', 'heatmap_academic.pdf')
    plot_heatmap('commercial', 'heatmap_commercial.png')
