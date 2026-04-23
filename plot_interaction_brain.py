import numpy as np
import matplotlib.pyplot as plt
import style_manager

def plot_interaction(style_name):
    # Setup data
    X = np.linspace(-2, 2, 100)
    
    # Slopes and intercepts
    # High Moderator
    Y_high = 0.9 * X + 0.2
    # Low Moderator
    Y_low = 0.1 * X - 0.2
    
    plt.figure()
    
    # In academic style, the color cycle is grayscale, in commercial it's colorful.
    # We will just plot lines and use default colors which will be picked up from the style.
    plt.plot(X, Y_high, label='High Moderator (+1 SD)', linestyle='-')
    plt.plot(X, Y_low, label='Low Moderator (-1 SD)', linestyle='--')
    
    plt.title('Interaction Effect (Simple Slopes)')
    plt.xlabel('Predictor (X)')
    plt.ylabel('Outcome (Y)')
    plt.legend()
    
    # Fix layout and save
    plt.tight_layout()
    # Save the figure based on style
    ext = 'pdf' if style_name == 'academic' else 'png'
    filename = f'interaction_plot_{style_name}.{ext}'
    plt.savefig(filename)
    plt.close()

def generate_brain_data():
    # Create a 2D grid
    x = np.linspace(-5, 5, 200)
    y = np.linspace(-5, 5, 200)
    X, Y = np.meshgrid(x, y)
    
    # Simulate a structural brain slice (an ellipse)
    brain_mask = (X**2 / 4**2 + Y**2 / 5**2) <= 1
    # Add some structural "texture"
    np.random.seed(42)
    structural = np.random.normal(0.5, 0.1, X.shape)
    # Smooth it to look a bit like brain tissue
    from scipy.ndimage import gaussian_filter
    structural = gaussian_filter(structural, sigma=3)
    structural = np.where(brain_mask, structural, 0)
    
    # Simulate fMRI activation areas (two Gaussian blobs)
    blob1 = np.exp(-((X - 2)**2 + (Y - 1)**2) / 0.5)
    blob2 = np.exp(-((X + 1.5)**2 + (Y + 2)**2) / 0.8)
    activation = blob1 + blob2 * 0.8
    # Only keep activation inside the brain and above a threshold
    activation = np.where(brain_mask & (activation > 0.3), activation, np.nan)
    
    return structural, activation

def plot_brain_activation(style_name):
    structural, activation = generate_brain_data()
    
    plt.figure()
    
    # Plot structural as grayscale
    plt.imshow(structural, cmap='gray', origin='lower', extent=[-5, 5, -5, 5])
    
    # Plot activation overlaid with a colormap
    # Use 'hot' or 'inferno' for activation
    plt.imshow(activation, cmap='hot', alpha=0.7, origin='lower', extent=[-5, 5, -5, 5])
    
    plt.title('Simulated fMRI Activation Overlay')
    plt.axis('off') # Hide axes for brain plot
    
    # Add a colorbar for the activation
    cbar = plt.colorbar(fraction=0.046, pad=0.04)
    cbar.set_label('Activation Level (Z-score)')
    
    plt.tight_layout()
    ext = 'pdf' if style_name == 'academic' else 'png'
    filename = f'brain_activation_{style_name}.{ext}'
    plt.savefig(filename)
    plt.close()

def main():
    # 1. Academic Style
    style_manager.apply_academic_style()
    plot_interaction('academic')
    plot_brain_activation('academic')
    
    # 2. Commercial Style
    style_manager.apply_commercial_style()
    plot_interaction('commercial')
    plot_brain_activation('commercial')

if __name__ == '__main__':
    main()
