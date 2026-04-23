import numpy as np
import matplotlib.pyplot as plt
from style_manager import apply_academic_style, apply_commercial_style

def plot_example_data(title):
    x = np.linspace(0, 10, 100)
    y1 = np.sin(x)
    y2 = np.cos(x)
    y3 = np.sin(x) * np.exp(-0.1 * x)
    y4 = np.cos(x) * np.exp(-0.1 * x)
    
    plt.figure()
    plt.plot(x, y1, label='Sin(x)')
    plt.plot(x, y2, label='Cos(x)', linestyle='--')
    plt.plot(x, y3, label='Damped Sin(x)', marker='o', markevery=10)
    plt.plot(x, y4, label='Damped Cos(x)', marker='s', markevery=10)
    
    plt.title(title)
    plt.xlabel('Time (s)')
    plt.ylabel('Amplitude')
    plt.legend()

def main():
    # 1. 验证学术风格
    apply_academic_style()
    plot_example_data('Academic Style Example')
    plt.savefig('academic_style.png')
    print("Saved academic_style.png")
    
    # 清理当前图形状态，以便重置并应用下一个样式
    plt.close('all')
    
    # 2. 验证商业风格
    apply_commercial_style()
    plot_example_data('Commercial Style Example')
    plt.savefig('commercial_style.png')
    print("Saved commercial_style.png")
    
    plt.close('all')

if __name__ == '__main__':
    main()
