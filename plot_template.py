import matplotlib.pyplot as plt
import matplotlib as mpl
import numpy as np

def setup_academic_style():
    """
    设置全局学术绘图样式
    包含：A4宽度适配尺寸、学术标准字体（中英混排）、全局标题策略等。
    """
    # 基础配置
    config = {
        # 字体设置：优先使用 Times New Roman，遇到中文回退到 SimSun (宋体)，再回退到系统默认无衬线字体
        "font.family": "serif",
        "font.serif": ["Times New Roman", "SimSun", "sans-serif"],
        "font.size": 9,                 # 全局默认字号 = 小五号
        "axes.unicode_minus": False,    # 解决负号显示问题
        "mathtext.fontset": "stix",     # 数学公式字体接近 Times New Roman
        
        # 坐标轴和刻度
        "axes.labelsize": 9,            # 坐标轴标签字号
        "xtick.labelsize": 9,           # X轴刻度字号
        "ytick.labelsize": 9,           # Y轴刻度字号
        "xtick.direction": "in",        # 刻度线朝内
        "ytick.direction": "in",        # 刻度线朝内
        "axes.linewidth": 0.5,          # 坐标轴线宽
        
        # 图例
        "legend.fontsize": 9,           # 图例字号
        "legend.frameon": False,        # 图例默认去边框
        
        # 线条
        "lines.linewidth": 1.0,         # 默认线宽
        
        # 尺寸与分辨率 (适配A4宽度，任务要求 6.3 x 4.7) 黄金比例约等于 1:0.618, 故高为 6.3 * 0.618 ≈ 3.89
        "figure.figsize": (6.3, 3.89),
        "figure.dpi": 150,              # 显示分辨率
        "savefig.dpi": 600,             # 保存分辨率
        "savefig.bbox": "tight",        # 紧凑保存
        
        # 全局标题策略：默认不显示图表内部标题 (将标题字号设为0，或者颜色设为透明)
        "axes.titlesize": 0,            
        "axes.titlecolor": "none",
        
        # 导出设置
        "pdf.fonttype": 42,             # 嵌入TrueType字体
        "ps.fonttype": 42,
    }
    
    mpl.rcParams.update(config)


def plot_line_chart(x, y_list, labels=None, xlabel="X轴", ylabel="Y轴", save_path=None):
    """
    折线图（Line Plot）模板
    强调趋势，区分线型和标记。
    """
    fig, ax = plt.subplots()
    
    # 常用线型和标记样式
    linestyles = ['-', '--', '-.', ':']
    markers = ['o', 's', '^', 'D', 'v', '<', '>']
    colors = ['#2c3e50', '#e74c3c', '#3498db', '#27ae60', '#f39c12']
    
    for i, y in enumerate(y_list):
        label = labels[i] if labels else f"Data {i+1}"
        ax.plot(x, y, 
                label=label, 
                linestyle=linestyles[i % len(linestyles)], 
                marker=markers[i % len(markers)],
                color=colors[i % len(colors)],
                markersize=4,
                linewidth=1.2)
        
    ax.set_xlabel(xlabel)
    ax.set_ylabel(ylabel)
    
    if labels:
        ax.legend()
        
    # 去除顶部和右侧边框
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    
    plt.tight_layout()
    if save_path:
        plt.savefig(save_path)
    return fig, ax


def plot_bar_chart(categories, values_list, labels=None, xlabel="类别", ylabel="数值", save_path=None):
    """
    柱状图（Bar Chart）模板
    适合人文社科的对比分析，柔和配色。
    """
    fig, ax = plt.subplots()
    
    n_categories = len(categories)
    n_groups = len(values_list)
    
    # 柔和配色方案
    colors = ['#5b9bd5', '#ed7d31', '#a5a5a5', '#ffc000', '#4472c4']
    
    bar_width = 0.8 / n_groups
    index = np.arange(n_categories)
    
    for i, values in enumerate(values_list):
        label = labels[i] if labels else f"Group {i+1}"
        # 计算偏移量，使得多组柱子居中
        offset = (i - n_groups / 2 + 0.5) * bar_width
        ax.bar(index + offset, values, bar_width, 
               label=label, color=colors[i % len(colors)], alpha=0.9)
               
    ax.set_xlabel(xlabel)
    ax.set_ylabel(ylabel)
    ax.set_xticks(index)
    ax.set_xticklabels(categories)
    
    if labels:
        ax.legend()
        
    # 去除顶部和右侧边框
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    
    plt.tight_layout()
    if save_path:
        plt.savefig(save_path)
    return fig, ax


def plot_scatter_chart(x_list, y_list, labels=None, xlabel="X轴", ylabel="Y轴", save_path=None):
    """
    散点图（Scatter Plot）模板
    用于展示变量相关性。
    """
    fig, ax = plt.subplots()
    
    markers = ['o', 's', '^', 'D']
    colors = ['#2c3e50', '#e74c3c', '#3498db', '#27ae60']
    
    for i in range(len(x_list)):
        label = labels[i] if labels else f"Group {i+1}"
        ax.scatter(x_list[i], y_list[i], 
                   label=label, 
                   marker=markers[i % len(markers)],
                   color=colors[i % len(colors)],
                   alpha=0.7,
                   s=30)
                   
    ax.set_xlabel(xlabel)
    ax.set_ylabel(ylabel)
    
    if labels:
        ax.legend()
        
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    
    plt.tight_layout()
    if save_path:
        plt.savefig(save_path)
    return fig, ax


def plot_box_chart(data_list, labels=None, xlabel="组别", ylabel="分布值", save_path=None):
    """
    箱线图（Box Plot）模板
    用于展示数据分布和异常值。
    """
    fig, ax = plt.subplots()
    
    # 绘制箱线图
    box = ax.boxplot(data_list, patch_artist=True, labels=labels if labels else [f"G{i+1}" for i in range(len(data_list))])
    
    # 柔和配色
    colors = ['#5b9bd5', '#ed7d31', '#a5a5a5', '#ffc000']
    
    for i, patch in enumerate(box['boxes']):
        patch.set_facecolor(colors[i % len(colors)])
        patch.set_alpha(0.7)
        patch.set_linewidth(1.0)
        
    for median in box['medians']:
        median.set(color='#2c3e50', linewidth=1.5)
        
    for flier in box['fliers']:
        flier.set(marker='o', color='#e74c3c', alpha=0.5, markersize=4)
        
    ax.set_xlabel(xlabel)
    ax.set_ylabel(ylabel)
    
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    
    plt.tight_layout()
    if save_path:
        plt.savefig(save_path)
    return fig, ax
