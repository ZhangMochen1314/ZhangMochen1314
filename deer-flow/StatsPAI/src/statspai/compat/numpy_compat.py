import numpy as np

try:
    # Try numpy 2.0+ attribute
    trapezoid = np.trapezoid
except AttributeError:
    # Fallback to numpy 1.x
    trapezoid = np.trapz
