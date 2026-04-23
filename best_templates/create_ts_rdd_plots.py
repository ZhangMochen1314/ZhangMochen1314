import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import statsmodels.api as sm
from style_manager import apply_academic_style, apply_commercial_style

def generate_ts_rdd_data():
    np.random.seed(42)
    
    # 1. Time Series Data
    dates = pd.date_range(start='2010-01-01', periods=120, freq='ME')
    ts_data = np.cumsum(np.random.normal(0.05, 1, 120)) + 100
    
    # 2. Panel Data (3 entities)
    panel_dates = pd.date_range(start='2015-01-01', periods=60, freq='ME')
    panel_df = pd.DataFrame({'Date': panel_dates})
    panel_df['Entity_A'] = np.cumsum(np.random.normal(0.1, 0.5, 60)) + 50
    panel_df['Entity_B'] = np.cumsum(np.random.normal(0.05, 0.6, 60)) + 45
    panel_df['Entity_C'] = np.cumsum(np.random.normal(0.15, 0.4, 60)) + 55
    
    # 3. RDD Data
    # Running variable X from -50 to 50, cutoff at 0
    X_rdd = np.random.uniform(-50, 50, 300)
    treatment = (X_rdd >= 0).astype(int)
    # True model: Y = 10 + 0.5*X + 5*Treatment + noise
    Y_rdd = 10 + 0.5 * X_rdd + 8 * treatment + np.random.normal(0, 4, 300)
    
    return dates, ts_data, panel_df, X_rdd, Y_rdd

def create_ts_rdd_plots(style='academic'):
    if style == 'academic':
        apply_academic_style()
        suffix = 'academic.pdf'
    else:
        apply_commercial_style()
        suffix = 'commercial.png'
        
    dates, ts_data, panel_df, X_rdd, Y_rdd = generate_ts_rdd_data()
    
    fig = plt.figure(figsize=(15, 4.5))
    colors = plt.rcParams['axes.prop_cycle'].by_key()['color']
    
    # 1. Time Series Plot
    ax1 = fig.add_subplot(131)
    ax1.plot(dates, ts_data, color=colors[0], linewidth=2)
    ax1.set_title('Macroeconomic Time Series')
    ax1.set_xlabel('Year')
    ax1.set_ylabel('Index Value')
    # rotate x-axis labels
    for tick in ax1.get_xticklabels():
        tick.set_rotation(45)
    
    # 2. Panel Trend Plot
    ax2 = fig.add_subplot(132)
    ax2.plot(panel_df['Date'], panel_df['Entity_A'], label='Entity A', color=colors[0], linewidth=2)
    ax2.plot(panel_df['Date'], panel_df['Entity_B'], label='Entity B', color=colors[1] if len(colors)>1 else colors[0], linewidth=2, linestyle='--')
    ax2.plot(panel_df['Date'], panel_df['Entity_C'], label='Entity C', color=colors[2] if len(colors)>2 else colors[0], linewidth=2, linestyle='-.')
    ax2.set_title('Panel Data Trends')
    ax2.set_xlabel('Year')
    ax2.set_ylabel('Performance')
    ax2.legend()
    for tick in ax2.get_xticklabels():
        tick.set_rotation(45)
        
    # 3. RDD Plot
    ax3 = fig.add_subplot(133)
    # Scatter plot
    ax3.scatter(X_rdd, Y_rdd, alpha=0.5, color='gray' if style=='academic' else '#adb5bd', s=20, 
                edgecolors='white' if style=='commercial' else 'none')
    
    # Fit line for X < 0
    mask_left = X_rdd < 0
    X_left = sm.add_constant(X_rdd[mask_left])
    model_left = sm.OLS(Y_rdd[mask_left], X_left).fit()
    x_val_left = np.linspace(-50, 0, 100)
    y_val_left = model_left.predict(sm.add_constant(x_val_left))
    ax3.plot(x_val_left, y_val_left, color=colors[0], linewidth=2.5, label='Control Fit')
    
    # Fit line for X >= 0
    mask_right = X_rdd >= 0
    X_right = sm.add_constant(X_rdd[mask_right])
    model_right = sm.OLS(Y_rdd[mask_right], X_right).fit()
    x_val_right = np.linspace(0, 50, 100)
    y_val_right = model_right.predict(sm.add_constant(x_val_right))
    ax3.plot(x_val_right, y_val_right, color=colors[1] if len(colors)>1 else 'black', linewidth=2.5, label='Treated Fit')
    
    # Cutoff line
    ax3.axvline(0, color='red' if style=='commercial' else 'black', linestyle='--', linewidth=1.5)
    
    ax3.set_title('Regression Discontinuity Design')
    ax3.set_xlabel('Running Variable')
    ax3.set_ylabel('Outcome')
    ax3.legend()
    
    plt.tight_layout()
    plt.savefig(f'time_series_rdd_{suffix}')
    plt.close()

if __name__ == "__main__":
    create_ts_rdd_plots('academic')
    create_ts_rdd_plots('commercial')
    print("Time series and RDD plots generated successfully.")
