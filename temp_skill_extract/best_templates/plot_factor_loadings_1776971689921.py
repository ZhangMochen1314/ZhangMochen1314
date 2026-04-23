import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
from style_manager import apply_academic_style, apply_commercial_style

def plot_factor_loadings(style='academic', output_path='factor_loadings_academic.pdf'):
    if style == 'academic':
        apply_academic_style()
        color = 'black'
        text_color = 'black'
    else:
        apply_commercial_style()
        color = '#4361ee'
        text_color = '#212529'

    # Simulated factor loadings
    variables = ['V1', 'V2', 'V3', 'V4', 'V5', 'V6']
    f1 = [0.8, 0.75, 0.7, 0.1, 0.2, 0.15]
    f2 = [0.1, 0.2, 0.15, 0.85, 0.8, 0.75]
    
    fig, ax = plt.subplots()
    
    # Draw axes
    ax.axhline(0, color='gray', linestyle='--', linewidth=1)
    ax.axvline(0, color='gray', linestyle='--', linewidth=1)
    
    # Draw vectors
    for i in range(len(variables)):
        ax.arrow(0, 0, f1[i], f2[i], head_width=0.03, head_length=0.03, fc=color, ec=color, 
                 length_includes_head=True, alpha=0.8)
        # Add labels
        ax.text(f1[i] + 0.05, f2[i] + 0.05, variables[i], color=text_color, 
                fontweight='bold' if style=='commercial' else 'normal')
        
    ax.set_xlim(-1, 1)
    ax.set_ylim(-1, 1)
    ax.set_xlabel('Factor 1')
    ax.set_ylabel('Factor 2')
    ax.set_title('Factor Loadings Plot', pad=15, fontweight='bold' if style == 'commercial' else 'normal')
    
    # Add circle
    circle = plt.Circle((0,0), 1, color='gray', fill=False, linestyle='--')
    ax.add_artist(circle)
    ax.set_aspect('equal')
    
    plt.tight_layout()
    plt.savefig(output_path, bbox_inches='tight')
    plt.close()
    print(f"Saved {style} style factor loadings plot to {output_path}")

def plot_error_bars(style='academic', output_path='error_bars_academic.pdf'):
    if style == 'academic':
        apply_academic_style()
        color = '0.4'
        err_color = 'black'
    else:
        apply_commercial_style()
        color = '#4cc9f0'
        err_color = '#f72585'

    groups = ['Control', 'Treatment A', 'Treatment B', 'Treatment C']
    means = [10.2, 14.5, 13.8, 18.2]
    std_devs = [1.5, 1.8, 1.2, 2.1]
    
    fig, ax = plt.subplots()
    
    x_pos = np.arange(len(groups))
    
    # Plot bars with error bars
    ax.bar(x_pos, means, yerr=std_devs, align='center', alpha=0.8, color=color, 
           capsize=5, ecolor=err_color, edgecolor='black' if style=='academic' else 'none')
           
    ax.set_xticks(x_pos)
    ax.set_xticklabels(groups)
    ax.set_ylabel('Scores')
    ax.set_title('Effect with Error Bars', pad=15, fontweight='bold' if style == 'commercial' else 'normal')
    
    plt.tight_layout()
    plt.savefig(output_path, bbox_inches='tight')
    plt.close()
    print(f"Saved {style} style error bar plot to {output_path}")

def plot_forest(style='academic', output_path='forest_academic.pdf'):
    if style == 'academic':
        apply_academic_style()
        color = 'black'
        diamond_color = '0.3'
    else:
        apply_commercial_style()
        color = '#4361ee'
        diamond_color = '#f72585'

    studies = ['Study 1', 'Study 2', 'Study 3', 'Study 4', 'Study 5']
    effects = [1.2, 1.5, 0.9, 1.8, 1.3]
    lower = [0.8, 1.1, 0.5, 1.2, 0.9]
    upper = [1.6, 1.9, 1.3, 2.4, 1.7]
    weights = [20, 30, 15, 10, 25]  # for square size
    
    overall_effect = 1.35
    overall_lower = 1.15
    overall_upper = 1.55
    
    fig, ax = plt.subplots(figsize=(8, 6) if style == 'academic' else (10, 6))
    
    y_pos = np.arange(len(studies), 0, -1)
    
    # Plot individual studies
    for i in range(len(studies)):
        # Error bar
        ax.plot([lower[i], upper[i]], [y_pos[i], y_pos[i]], color=color, linewidth=1.5)
        # Square size proportional to weight
        sq_size = weights[i] * 5
        ax.scatter(effects[i], y_pos[i], s=sq_size, color=color, marker='s', zorder=3)
        
    # Plot overall effect (Diamond)
    y_overall = 0
    diamond_x = [overall_lower, overall_effect, overall_upper, overall_effect]
    diamond_y = [y_overall, y_overall + 0.2, y_overall, y_overall - 0.2]
    ax.fill(diamond_x, diamond_y, color=diamond_color, zorder=3)
    
    # Vertical line of no effect (assuming OR=1 or diff=0, let's use 1)
    ax.axvline(1, color='gray', linestyle='--', linewidth=1, zorder=1)
    
    # Ticks and labels
    ax.set_yticks(np.append(y_pos, y_overall))
    ax.set_yticklabels(studies + ['Overall'])
    ax.set_xlabel('Effect Size (e.g., Odds Ratio)')
    ax.set_title('Forest Plot of Meta-Analysis', pad=15, fontweight='bold' if style == 'commercial' else 'normal')
    
    # Remove top and right spines
    if style == 'academic':
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)
    
    plt.tight_layout()
    plt.savefig(output_path, bbox_inches='tight')
    plt.close()
    print(f"Saved {style} style forest plot to {output_path}")

if __name__ == "__main__":
    # Factor Loadings
    plot_factor_loadings('academic', 'factor_loadings_academic.pdf')
    plot_factor_loadings('commercial', 'factor_loadings_commercial.png')
    
    # Error Bars
    plot_error_bars('academic', 'error_bars_academic.pdf')
    plot_error_bars('commercial', 'error_bars_commercial.png')
    
    # Forest Plot
    plot_forest('academic', 'forest_academic.pdf')
    plot_forest('commercial', 'forest_commercial.png')
