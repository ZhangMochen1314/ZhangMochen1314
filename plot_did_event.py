import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from style_manager import apply_academic_style, apply_commercial_style

def generate_did_data():
    # Simulate event study coefficients and confidence intervals
    periods = np.arange(-5, 6) # From t-5 to t+5
    # True effects: 0 before treatment (parallel trends), and increasing after treatment
    true_effects = np.where(periods < 0, 0, periods * 0.5 + 0.5)
    
    # Add some noise to estimates
    np.random.seed(42)
    estimates = true_effects + np.random.normal(0, 0.2, len(periods))
    # Normalize period -1 to be exactly 0 (base period)
    estimates[periods == -1] = 0
    
    # Standard errors
    se = np.random.uniform(0.15, 0.3, len(periods))
    se[periods == -1] = 0 # No error for base period
    
    # 95% Confidence Intervals
    ci_lower = estimates - 1.96 * se
    ci_upper = estimates + 1.96 * se
    
    df = pd.DataFrame({
        'Period': periods,
        'Estimate': estimates,
        'CI_Lower': ci_lower,
        'CI_Upper': ci_upper
    })
    
    return df

def create_did_plot(style='academic'):
    if style == 'academic':
        apply_academic_style()
        suffix = 'academic.pdf'
    else:
        apply_commercial_style()
        suffix = 'commercial.png'
        
    df = generate_did_data()
    
    # Use standard figure size from the style but override if necessary
    fig, ax = plt.subplots()
    
    colors = plt.rcParams['axes.prop_cycle'].by_key()['color']
    primary_color = colors[0]
    
    # Calculate error margins for errorbar plot
    yerr_lower = df['Estimate'] - df['CI_Lower']
    yerr_upper = df['CI_Upper'] - df['Estimate']
    
    # Plot event study
    ax.errorbar(df['Period'], df['Estimate'], yerr=[yerr_lower, yerr_upper], 
                fmt='o', color=primary_color, capsize=4, capthick=1.5, elinewidth=1.5, markersize=8)
    
    # Add line connecting the estimates
    ax.plot(df['Period'], df['Estimate'], color=primary_color, linestyle='-', alpha=0.5)
    
    # Add vertical line for the event time
    ax.axvline(x=-0.5, color='red' if style=='commercial' else 'black', linestyle='--', linewidth=1.5, label='Treatment Time')
    
    # Add horizontal line at 0
    ax.axhline(y=0, color='gray' if style=='commercial' else 'black', linestyle='-', linewidth=1)
    
    ax.set_title('Event Study: Dynamic Treatment Effects')
    ax.set_xlabel('Periods Relative to Treatment')
    ax.set_ylabel('Estimated Effect')
    
    ax.set_xticks(df['Period'])
    # Optional: Format xticks like t-5, t-4, ..., t, ..., t+5
    xticklabels = [f't{p}' if p < 0 else f't+{p}' if p > 0 else 't' for p in df['Period']]
    ax.set_xticklabels(xticklabels)
    
    if style == 'commercial':
        ax.legend()
        
    plt.tight_layout()
    plt.savefig(f'did_event_study_{suffix}')
    plt.close()

if __name__ == "__main__":
    create_did_plot('academic')
    create_did_plot('commercial')
    print("DID event study plots generated successfully.")
