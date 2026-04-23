import numpy as np
from plot_template import (
    setup_academic_style,
    plot_line_chart,
    plot_bar_chart,
    plot_scatter_chart,
    plot_box_chart
)

def main():
    print("正在加载学术绘图配置...")
    # 1. 加载基础学术样式配置
    setup_academic_style()
    
    print("正在生成折线图...")
    # 2. 生成折线图
    x = np.linspace(0, 10, 10)
    y1 = np.sin(x)
    y2 = np.cos(x)
    plot_line_chart(
        x=x, 
        y_list=[y1, y2], 
        labels=['正弦曲线 (Sine)', '余弦曲线 (Cosine)'], 
        xlabel='时间 (Time)', 
        ylabel='振幅 (Amplitude)', 
        save_path='line_chart_example.pdf'
    )
    
    print("正在生成柱状图...")
    # 3. 生成柱状图
    categories = ['2019', '2020', '2021', '2022', '2023']
    group1 = [20, 34, 30, 35, 27]
    group2 = [25, 32, 34, 20, 25]
    plot_bar_chart(
        categories=categories,
        values_list=[group1, group2],
        labels=['实验组 (Experimental)', '对照组 (Control)'],
        xlabel='年份 (Year)',
        ylabel='观测值 (Observation)',
        save_path='bar_chart_example.pdf'
    )
    
    print("正在生成散点图...")
    # 4. 生成散点图
    x1 = np.random.normal(0, 1, 50)
    y1 = x1 * 1.5 + np.random.normal(0, 0.5, 50)
    x2 = np.random.normal(2, 1, 50)
    y2 = x2 * 0.5 + np.random.normal(0, 0.5, 50)
    plot_scatter_chart(
        x_list=[x1, x2],
        y_list=[y1, y2],
        labels=['样本 A (Sample A)', '样本 B (Sample B)'],
        xlabel='变量 X (Variable X)',
        ylabel='变量 Y (Variable Y)',
        save_path='scatter_chart_example.pdf'
    )
    
    print("正在生成箱线图...")
    # 5. 生成箱线图
    data1 = np.random.normal(100, 10, 200)
    data2 = np.random.normal(90, 20, 200)
    data3 = np.random.normal(110, 15, 200)
    plot_box_chart(
        data_list=[data1, data2, data3],
        labels=['组 1 (Group 1)', '组 2 (Group 2)', '组 3 (Group 3)'],
        xlabel='不同分组 (Different Groups)',
        ylabel='分数分布 (Score Distribution)',
        save_path='box_chart_example.pdf'
    )
    
    print("所有图表生成完毕！文件已保存为 PDF 格式。")

if __name__ == "__main__":
    main()
