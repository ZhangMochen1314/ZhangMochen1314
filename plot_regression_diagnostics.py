import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import statsmodels.api as sm
from style_manager import apply_academic_style, apply_commercial_style

def generate_regression_data():
    np.random.seed(42)
    n = 100
    X1 = np.random.normal(0, 1, n)
    X2 = X1 * 0.5 + np.random.normal(0, 0.8, n)
    X3 = np.random.uniform(-2, 2, n)
    
    # Generate dependent variable
    y = 2.0 + 1.5 * X1 - 0.8 * X2 + 0.5 * X3 + np.random.normal(0, 1, n)
    
    # Introduce an outlier/high leverage point
    X1[0], X2[0], X3[0] = 4.0, -3.0, 3.0
    y[0] = 10.0
    
    df = pd.DataFrame({'Y': y, 'X1': X1, 'X2': X2, 'X3': X3})
    return df

def create_regression_plots(style='academic'):
    if style == 'academic':
        apply_academic_style()
        suffix = 'academic.pdf'
    else:
        apply_commercial_style()
        suffix = 'commercial.png'
        
    df = generate_regression_data()
    X = sm.add_constant(df[['X1', 'X2', 'X3']])
    y = df['Y']
    model = sm.OLS(y, X).fit()
    
    # Create figure with 1x3 subplots
    # Overriding figsize slightly for 1x3 layout while keeping style's height
    fig = plt.figure(figsize=(12, 4.5))
    
    # 1. Regression Coefficients Plot (with error bars)
    ax1 = fig.add_subplot(131)
    params = model.params.drop('const')
    conf_int = model.conf_int().drop('const')
    errors = params - conf_int[0]
    
    # Bar plot for coefficients
    x_pos = np.arange(len(params))
    colors = plt.rcParams['axes.prop_cycle'].by_key()['color']
    ax1.errorbar(x_pos, params, yerr=errors, fmt='o', color=colors[0], 
                 capsize=5, capthick=1.5, elinewidth=1.5, markersize=8)
    ax1.axhline(0, color='black' if style=='academic' else '#6c757d', linestyle='--', linewidth=1)
    ax1.set_xticks(x_pos)
    ax1.set_xticklabels(params.index)
    ax1.set_title('Regression Coefficients\n(95% CI)')
    ax1.set_ylabel('Coefficient Value')
    
    # 2. Leverage-Residual Plot
    ax2 = fig.add_subplot(132)
    influence = model.get_influence()
    leverage = influence.hat_matrix_diag
    studentized_resid = influence.resid_studentized_internal
    cooks_d = influence.cooks_distance[0]
    
    # Bubble plot where size is Cook's Distance
    scatter = ax2.scatter(leverage, studentized_resid, 
                          s=cooks_d * 1000, alpha=0.6, 
                          edgecolors='white' if style=='commercial' else 'black',
                          color=colors[1] if len(colors)>1 else colors[0])
    
    ax2.axhline(0, color='black' if style=='academic' else '#6c757d', linestyle='--', linewidth=1)
    ax2.axvline(np.mean(leverage), color='black' if style=='academic' else '#6c757d', linestyle=':', linewidth=1)
    ax2.set_title('Leverage vs. Studentized Residuals\n(Size = Cook\'s D)')
    ax2.set_xlabel('Leverage')
    ax2.set_ylabel('Studentized Residuals')
    
    # 3. Partial Regression Plot for X1
    ax3 = fig.add_subplot(133)
    # Regress Y on other variables
    y_other = sm.OLS(y, sm.add_constant(df[['X2', 'X3']])).fit().resid
    # Regress X1 on other variables
    x1_other = sm.OLS(df['X1'], sm.add_constant(df[['X2', 'X3']])).fit().resid
    
    ax3.scatter(x1_other, y_other, alpha=0.7, color=colors[2] if len(colors)>2 else colors[0],
                edgecolors='white' if style=='commercial' else 'black')
    
    # Fit line for partial regression
    partial_model = sm.OLS(y_other, sm.add_constant(x1_other)).fit()
    x_vals = np.linspace(x1_other.min(), x1_other.max(), 100)
    y_vals = partial_model.params.iloc[0] + partial_model.params.iloc[1] * x_vals
    ax3.plot(x_vals, y_vals, color='red' if style=='commercial' else 'black', linewidth=2)
    
    ax3.set_title('Partial Regression Plot (X1)')
    ax3.set_xlabel('e(X1 | X2, X3)')
    ax3.set_ylabel('e(Y | X2, X3)')
    
    plt.tight_layout()
    plt.savefig(f'regression_diagnostics_{suffix}')
    plt.close()

if __name__ == "__main__":
    create_regression_plots('academic')
    create_regression_plots('commercial')
    print("Regression diagnostic plots generated successfully.")
