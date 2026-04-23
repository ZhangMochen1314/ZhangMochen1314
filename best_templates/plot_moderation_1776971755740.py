import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from style_manager import apply_academic_style, apply_commercial_style

def draw_box(ax, center, text, width=0.25, height=0.15, style='academic'):
    if style == 'academic':
        edgecolor = 'black'
        facecolor = 'white'
        textcolor = 'black'
    else:
        edgecolor = '#4361ee'
        facecolor = '#e0fbfc'
        textcolor = '#212529'
        
    box = mpatches.FancyBboxPatch((center[0] - width/2, center[1] - height/2), width, height, 
                                  boxstyle="round,pad=0.02", edgecolor=edgecolor, facecolor=facecolor, linewidth=1.5)
    ax.add_patch(box)
    ax.text(center[0], center[1], text, ha='center', va='center', color=textcolor, 
            fontweight='bold' if style == 'commercial' else 'normal')
    return box

def draw_arrow(ax, start, end, text=None, style='academic'):
    if style == 'academic':
        color = 'black'
    else:
        color = '#4361ee'
        
    ax.annotate('', xy=end, xytext=start,
                arrowprops=dict(arrowstyle="->", color=color, lw=1.5, shrinkA=5, shrinkB=5))
    if text:
        mid_x = (start[0] + end[0]) / 2
        mid_y = (start[1] + end[1]) / 2
        ax.text(mid_x, mid_y + 0.05, text, ha='center', va='center', color=color)

def plot_path_analysis(style='academic', output_path='path_analysis_academic.pdf'):
    if style == 'academic':
        apply_academic_style()
    else:
        apply_commercial_style()

    fig, ax = plt.subplots(figsize=(8, 5))
    
    # Define node centers
    nodes = {
        'X1': (0.2, 0.7),
        'X2': (0.2, 0.3),
        'Y1': (0.5, 0.5),
        'Y2': (0.8, 0.5)
    }
    
    # Draw boxes
    for name, pos in nodes.items():
        draw_box(ax, pos, name, width=0.15, height=0.1, style=style)
        
    # Draw arrows
    draw_arrow(ax, (0.2+0.075, 0.7), (0.5-0.075, 0.5), r'$\beta_1$', style)
    draw_arrow(ax, (0.2+0.075, 0.3), (0.5-0.075, 0.5), r'$\beta_2$', style)
    draw_arrow(ax, (0.5+0.075, 0.5), (0.8-0.075, 0.5), r'$\beta_3$', style)
    
    # Draw correlation between X1 and X2
    if style == 'academic':
        color = 'black'
    else:
        color = '#4361ee'
    ax.annotate('', xy=(0.2, 0.65), xytext=(0.2, 0.35),
                arrowprops=dict(arrowstyle="<->", connectionstyle="arc3,rad=0.5", color=color, lw=1.5))
                
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis('off')
    ax.set_title('Path Analysis Diagram', pad=15, fontweight='bold' if style == 'commercial' else 'normal')
    
    plt.tight_layout()
    plt.savefig(output_path, bbox_inches='tight')
    plt.close()
    print(f"Saved {style} style path analysis plot to {output_path}")

def plot_mediation(style='academic', output_path='mediation_academic.pdf'):
    if style == 'academic':
        apply_academic_style()
    else:
        apply_commercial_style()

    fig, ax = plt.subplots(figsize=(6, 4))
    
    # Define node centers
    x_pos = (0.2, 0.3)
    m_pos = (0.5, 0.7)
    y_pos = (0.8, 0.3)
    
    # Draw boxes
    draw_box(ax, x_pos, 'X (IV)', width=0.2, height=0.15, style=style)
    draw_box(ax, m_pos, 'M (Mediator)', width=0.2, height=0.15, style=style)
    draw_box(ax, y_pos, 'Y (DV)', width=0.2, height=0.15, style=style)
    
    # Draw arrows
    draw_arrow(ax, (0.2+0.1, 0.3+0.075), (0.5-0.1, 0.7-0.075), 'a', style)
    draw_arrow(ax, (0.5+0.1, 0.7-0.075), (0.8-0.1, 0.3+0.075), 'b', style)
    draw_arrow(ax, (0.2+0.1, 0.3), (0.8-0.1, 0.3), "c'", style)
    
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis('off')
    ax.set_title('Mediation Effect Model', pad=15, fontweight='bold' if style == 'commercial' else 'normal')
    
    plt.tight_layout()
    plt.savefig(output_path, bbox_inches='tight')
    plt.close()
    print(f"Saved {style} style mediation plot to {output_path}")

def plot_moderation(style='academic', output_path='moderation_academic.pdf'):
    if style == 'academic':
        apply_academic_style()
    else:
        apply_commercial_style()

    fig, ax = plt.subplots(figsize=(6, 4))
    
    # Define node centers
    x_pos = (0.2, 0.3)
    w_pos = (0.5, 0.7)
    y_pos = (0.8, 0.3)
    
    # Draw boxes
    draw_box(ax, x_pos, 'X (IV)', width=0.2, height=0.15, style=style)
    draw_box(ax, w_pos, 'W (Moderator)', width=0.25, height=0.15, style=style)
    draw_box(ax, y_pos, 'Y (DV)', width=0.2, height=0.15, style=style)
    
    # Draw arrows
    draw_arrow(ax, (0.2+0.1, 0.3), (0.8-0.1, 0.3), 'Main Effect', style)
    
    # Moderation arrow pointing to the middle of X->Y arrow
    mid_x_y = (0.5, 0.3)
    draw_arrow(ax, (0.5, 0.7-0.075), mid_x_y, 'Interaction', style)
    
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis('off')
    ax.set_title('Moderation Effect Model', pad=15, fontweight='bold' if style == 'commercial' else 'normal')
    
    plt.tight_layout()
    plt.savefig(output_path, bbox_inches='tight')
    plt.close()
    print(f"Saved {style} style moderation plot to {output_path}")

def plot_latent_class(style='academic', output_path='latent_class_academic.pdf'):
    if style == 'academic':
        apply_academic_style()
        colors = ['0.2', '0.5', '0.8']
        markers = ['o', 's', '^']
    else:
        apply_commercial_style()
        colors = ['#4361ee', '#f72585', '#4cc9f0']
        markers = ['o', 's', '^']

    indicators = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5']
    
    # Simulated means for 3 latent classes
    class1 = [4.2, 4.0, 4.5, 4.1, 4.3]
    class2 = [2.5, 3.0, 2.8, 2.2, 2.6]
    class3 = [1.2, 1.5, 1.1, 1.8, 1.4]
    
    classes = [class1, class2, class3]
    labels = ['Class 1 (High)', 'Class 2 (Medium)', 'Class 3 (Low)']
    
    fig, ax = plt.subplots()
    
    x = np.arange(len(indicators))
    
    for i, (c_data, label) in enumerate(zip(classes, labels)):
        ax.plot(x, c_data, marker=markers[i], color=colors[i], label=label, 
                linewidth=2, markersize=8)
                
    ax.set_xticks(x)
    ax.set_xticklabels(indicators)
    ax.set_ylabel('Item Means / Probabilities')
    ax.set_ylim(0, 5)
    ax.set_title('Latent Class Profile', pad=15, fontweight='bold' if style == 'commercial' else 'normal')
    ax.legend(title='Latent Classes')
    
    plt.tight_layout()
    plt.savefig(output_path, bbox_inches='tight')
    plt.close()
    print(f"Saved {style} style latent class plot to {output_path}")

if __name__ == "__main__":
    # Path Analysis
    plot_path_analysis('academic', 'path_analysis_academic.pdf')
    plot_path_analysis('commercial', 'path_analysis_commercial.png')
    
    # Mediation
    plot_mediation('academic', 'mediation_academic.pdf')
    plot_mediation('commercial', 'mediation_commercial.png')
    
    # Moderation
    plot_moderation('academic', 'moderation_academic.pdf')
    plot_moderation('commercial', 'moderation_commercial.png')
    
    # Latent Class
    plot_latent_class('academic', 'latent_class_academic.pdf')
    plot_latent_class('commercial', 'latent_class_commercial.png')
