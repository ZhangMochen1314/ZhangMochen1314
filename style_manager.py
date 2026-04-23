import matplotlib.pyplot as plt

def apply_academic_style():
    """
    应用黑白/灰度学术风格，适合发表学术论文。
    特点：
    - 黑白或灰度色调
    - A4尺寸（宽8.27英寸），符合黄金比例（1.618）
    - 衬线字体（Serif）
    - 刻度线朝内
    - 无多余装饰
    """
    # A4纸宽度约为 8.27 英寸
    # 黄金比例约为 1.618，因此高度约为 8.27 / 1.618 ≈ 5.11 英寸
    fig_width = 8.27
    fig_height = fig_width / 1.618
    
    plt.rcParams.update({
        # 图像大小与分辨率
        'figure.figsize': (fig_width, fig_height),
        'figure.dpi': 300,
        'figure.facecolor': 'white',
        
        # 字体设置
        'text.color': 'black',
        'font.family': 'serif',
        'font.serif': ['Times New Roman', 'DejaVu Serif', 'serif'],
        'font.size': 11,
        
        # 坐标轴设置
        'axes.facecolor': 'white',
        'axes.edgecolor': 'black',
        'axes.labelcolor': 'black',
        'axes.linewidth': 1.0,
        'axes.grid': True,
        'axes.spines.top': True,
        'axes.spines.right': True,
        
        # 颜色循环：灰度/黑白线条
        'axes.prop_cycle': plt.cycler('color', ['0.0', '0.3', '0.5', '0.7']),
        
        # 网格设置
        'grid.color': '0.8',
        'grid.linestyle': '--',
        'grid.linewidth': 0.5,
        'grid.alpha': 1.0,
        
        # 刻度设置 (刻度朝内，符合学术规范)
        'xtick.color': 'black',
        'xtick.direction': 'in',
        'xtick.major.size': 4,
        'xtick.major.width': 1,
        'xtick.top': True,
        
        'ytick.color': 'black',
        'ytick.direction': 'in',
        'ytick.major.size': 4,
        'ytick.major.width': 1,
        'ytick.right': True,
        
        # 线条与标记点
        'lines.linewidth': 1.5,
        'lines.markersize': 6,
        
        # 图例设置
        'legend.frameon': False,
        'legend.fontsize': 10,
        
        # 保存设置
        'savefig.bbox': 'tight',
        'savefig.dpi': 300,
        'savefig.format': 'pdf',
    })

def apply_commercial_style():
    """
    应用彩色华丽商业风格，适合PPT展示、商业报告和数据看板。
    特点：
    - 高对比度的鲜艳色彩
    - 无衬线字体（Sans-serif），现代感强
    - 去除顶部和右侧边框，更加开阔
    - 浅色背景或明亮质感
    - 粗线条与清晰的图例
    """
    plt.rcParams.update({
        # 图像大小与分辨率 (适合宽屏展示)
        'figure.figsize': (10, 5.625), # 16:9 比例
        'figure.dpi': 150,
        'figure.facecolor': '#f8f9fa', # 极浅的灰白色背景
        
        # 字体设置
        'text.color': '#212529', # 深灰/黑
        'font.family': 'sans-serif',
        'font.sans-serif': ['Helvetica', 'Arial', 'DejaVu Sans', 'sans-serif'],
        'font.size': 12,
        
        # 坐标轴设置
        'axes.facecolor': '#ffffff',
        'axes.edgecolor': '#dee2e6',
        'axes.labelcolor': '#495057',
        'axes.linewidth': 1.5,
        'axes.grid': True,
        'axes.spines.top': False,   # 去除顶部边框
        'axes.spines.right': False, # 去除右侧边框
        
        # 颜色循环：高对比度华丽色彩 (蓝, 粉红, 青, 橙, 紫)
        'axes.prop_cycle': plt.cycler('color', ['#4361ee', '#f72585', '#4cc9f0', '#f8961e', '#7209b7']),
        
        # 网格设置
        'grid.color': '#e9ecef',
        'grid.linestyle': '-',
        'grid.linewidth': 1.0,
        'grid.alpha': 0.7,
        
        # 刻度设置 (刻度朝外)
        'xtick.color': '#6c757d',
        'xtick.direction': 'out',
        'xtick.major.size': 5,
        'xtick.major.width': 1.5,
        'xtick.bottom': True,
        'xtick.top': False,
        
        'ytick.color': '#6c757d',
        'ytick.direction': 'out',
        'ytick.major.size': 5,
        'ytick.major.width': 1.5,
        'ytick.left': True,
        'ytick.right': False,
        
        # 线条与标记点
        'lines.linewidth': 2.5,
        'lines.markersize': 8,
        
        # 图例设置
        'legend.frameon': True,
        'legend.framealpha': 0.9,
        'legend.edgecolor': '#dee2e6',
        'legend.fontsize': 11,
        'legend.shadow': True,
        
        # 保存设置
        'savefig.bbox': 'tight',
        'savefig.dpi': 300,
        'savefig.facecolor': '#f8f9fa',
        'savefig.format': 'png',
    })
