import numpy as np
import matplotlib.pyplot as plt
import networkx as nx
from scipy.cluster.hierarchy import dendrogram, linkage
import pandas as pd
from style_manager import apply_academic_style, apply_commercial_style

def plot_social_network(style='academic', output_path='network_academic.pdf'):
    if style == 'academic':
        apply_academic_style()
        node_color = '0.7'
        edge_color = '0.3'
        font_color = 'black'
    else:
        apply_commercial_style()
        node_color = '#4361ee'
        edge_color = '#adb5bd'
        font_color = 'white'

    # Create a random graph
    np.random.seed(42)
    G = nx.barabasi_albert_graph(20, 2, seed=42)
    
    # Calculate degree for node sizes
    degrees = dict(G.degree())
    node_sizes = [v * 100 + 100 for v in degrees.values()]
    
    fig, ax = plt.subplots()
    pos = nx.spring_layout(G, seed=42)
    
    nx.draw_networkx_nodes(G, pos, ax=ax, node_size=node_sizes, node_color=node_color, alpha=0.9)
    nx.draw_networkx_edges(G, pos, ax=ax, edge_color=edge_color, alpha=0.5, width=1.5)
    
    # Draw labels for top nodes
    labels = {i: str(i) for i in G.nodes() if degrees[i] > 3}
    nx.draw_networkx_labels(G, pos, labels=labels, ax=ax, font_size=10, font_color=font_color, font_weight='bold')
    
    ax.set_title('Social Network Graph', pad=15, fontweight='bold' if style == 'commercial' else 'normal')
    ax.axis('off')
    
    plt.tight_layout()
    plt.savefig(output_path, bbox_inches='tight')
    plt.close()
    print(f"Saved {style} style network plot to {output_path}")

def plot_dendrogram(style='academic', output_path='dendrogram_academic.pdf'):
    if style == 'academic':
        apply_academic_style()
        color_threshold = 0
        link_color_func = lambda k: 'black'
    else:
        apply_commercial_style()
        color_threshold = 15
        # default colors in scipy are not matching our prop_cycle directly, but we can rely on default
        link_color_func = None

    np.random.seed(42)
    # Generate data
    X = np.random.randn(30, 2)
    X[:10] += 5
    X[10:20] -= 5
    
    Z = linkage(X, 'ward')
    
    fig, ax = plt.subplots()
    if style == 'academic':
        dendrogram(Z, ax=ax, color_threshold=color_threshold, link_color_func=link_color_func, above_threshold_color='black')
    else:
        dendrogram(Z, ax=ax, color_threshold=color_threshold)
        
    ax.set_title('Hierarchical Clustering Dendrogram', pad=15, fontweight='bold' if style == 'commercial' else 'normal')
    ax.set_xlabel('Sample index' if style == 'commercial' else 'Sample Index')
    ax.set_ylabel('Distance')
    
    plt.tight_layout()
    plt.savefig(output_path, bbox_inches='tight')
    plt.close()
    print(f"Saved {style} style dendrogram plot to {output_path}")

def plot_social_mobility_stacked(style='academic', output_path='mobility_stacked_academic.pdf'):
    """
    Use a stacked bar chart to represent social mobility (transition matrix)
    """
    if style == 'academic':
        apply_academic_style()
        colors = ['0.3', '0.5', '0.7', '0.9']
    else:
        apply_commercial_style()
        colors = ['#4361ee', '#f72585', '#4cc9f0', '#f8961e']

    # Transition matrix (e.g., from generation 1 to generation 2)
    # Rows: Gen 1 status (Low, Lower-Mid, Upper-Mid, High)
    # Cols: Gen 2 status
    data = np.array([
        [40, 30, 20, 10],
        [20, 40, 30, 10],
        [10, 20, 40, 30],
        [5, 10, 25, 60]
    ])
    
    categories = ['Low', 'Lower-Mid', 'Upper-Mid', 'High']
    gen1_labels = categories
    
    fig, ax = plt.subplots()
    
    bottom = np.zeros(len(categories))
    
    for i in range(len(categories)):
        ax.bar(gen1_labels, data[:, i], bottom=bottom, label=f'Gen 2: {categories[i]}', color=colors[i], edgecolor='black' if style=='academic' else 'none')
        bottom += data[:, i]
        
    ax.set_title('Social Mobility Transition', pad=15, fontweight='bold' if style == 'commercial' else 'normal')
    ax.set_xlabel('Generation 1 Status')
    ax.set_ylabel('Percentage (%)')
    ax.legend(title='Generation 2 Status', bbox_to_anchor=(1.05, 1), loc='upper left')
    
    # Set y-axis to 100%
    ax.set_ylim(0, 100)
    
    plt.tight_layout()
    plt.savefig(output_path, bbox_inches='tight')
    plt.close()
    print(f"Saved {style} style mobility plot to {output_path}")

if __name__ == "__main__":
    # Network
    plot_social_network('academic', 'network_academic.pdf')
    plot_social_network('commercial', 'network_commercial.png')
    
    # Dendrogram
    plot_dendrogram('academic', 'dendrogram_academic.pdf')
    plot_dendrogram('commercial', 'dendrogram_commercial.png')
    
    # Social Mobility (Stacked Bar)
    plot_social_mobility_stacked('academic', 'mobility_academic.pdf')
    plot_social_mobility_stacked('commercial', 'mobility_commercial.png')
