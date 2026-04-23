import os
import re
import json
import importlib.util
import inspect
import logging
import traceback
from contextlib import contextmanager
import matplotlib.pyplot as plt

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("scientific_plotter")

TEMPLATE_DIR = "/workspace/best_templates/"

class PlotterRegistry:
    def __init__(self):
        self.templates = {}
        self._load_best_templates()

    def _load_best_templates(self):
        """Scan the template directory, find the best scored module for each plot_type, and register them."""
        if not os.path.exists(TEMPLATE_DIR):
            logger.warning(f"Template directory {TEMPLATE_DIR} does not exist.")
            return

        # Map plot_type -> list of (score, py_filename)
        scores_map = {}
        
        for filename in os.listdir(TEMPLATE_DIR):
            if filename.endswith("_score.json"):
                # Extract base name (plot_type) from something like create_did_plot_1776971666326_score.json
                # We assume the pattern is {plot_type}_{timestamp}_score.json
                match = re.match(r'(.+)_\d+_score\.json$', filename)
                if match:
                    plot_type = match.group(1)
                    filepath = os.path.join(TEMPLATE_DIR, filename)
                    try:
                        with open(filepath, 'r', encoding='utf-8') as f:
                            data = json.load(f)
                            score = data.get('total_score', 0)
                            py_filename = filename.replace('_score.json', '.py')
                            
                            if plot_type not in scores_map:
                                scores_map[plot_type] = []
                            scores_map[plot_type].append((score, py_filename))
                    except Exception as e:
                        logger.error(f"Error reading score file {filename}: {e}")

        # Register the module with the highest score for each plot_type
        for plot_type, candidates in scores_map.items():
            candidates.sort(key=lambda x: x[0], reverse=True)
            best_score, best_py_filename = candidates[0]
            
            best_py_path = os.path.join(TEMPLATE_DIR, best_py_filename)
            if os.path.exists(best_py_path):
                self.templates[plot_type] = best_py_path
                logger.debug(f"Registered '{plot_type}' -> {best_py_filename} (score: {best_score})")
            else:
                logger.warning(f"Python file {best_py_filename} for {plot_type} not found.")
                
        logger.info(f"Loaded {len(self.templates)} best templates.")

    def get_function(self, plot_type):
        """Dynamically load the module and return the plotting function."""
        if plot_type not in self.templates:
            raise ValueError(f"Unknown plot_type: '{plot_type}'. Available types: {list(self.templates.keys())}")
            
        filepath = self.templates[plot_type]
        module_name = f"dynamic_template_{plot_type}"
        
        spec = importlib.util.spec_from_file_location(module_name, filepath)
        module = importlib.util.module_from_spec(spec)
        try:
            spec.loader.exec_module(module)
        except Exception as e:
            raise ImportError(f"Failed to load module for {plot_type} from {filepath}: {e}")
            
        # Try to find the function with the exact same name as plot_type
        if hasattr(module, plot_type):
            return getattr(module, plot_type)
            
        # Fallback: look for any function that has 'plot' in its name, excluding generate_data etc.
        for name, obj in inspect.getmembers(module, inspect.isfunction):
            if name.startswith('plot_') or name.startswith('create_') and name.endswith('_plot'):
                return obj
                
        raise ValueError(f"Could not find a suitable plotting function in {filepath}")

# Initialize registry globally
registry = PlotterRegistry()

@contextmanager
def redirect_savefig(new_path):
    """Context manager to intercept plt.savefig and change its output path."""
    if not new_path:
        yield
        return
        
    original_savefig = plt.savefig
    
    def patched_savefig(*args, **kwargs):
        # Change the first positional argument or 'fname' kwarg to new_path
        if 'fname' in kwargs:
            kwargs['fname'] = new_path
        elif args:
            args = (new_path,) + args[1:]
        else:
            args = (new_path,)
        return original_savefig(*args, **kwargs)
        
    plt.savefig = patched_savefig
    try:
        yield
    finally:
        plt.savefig = original_savefig

def generate_plot(plot_type, style='academic', output_path=None, **kwargs):
    """
    Unified entry function to generate a scientific plot.
    
    :param plot_type: Type of plot (e.g., 'create_did_plot', 'plot_distribution').
    :param style: 'academic' or 'commercial'.
    :param output_path: Custom output file path. If None, uses the template's default.
    :param kwargs: Additional arguments to pass to the plotting function.
    """
    try:
        logger.info(f"Generating plot '{plot_type}' with style '{style}'...")
        
        # Get the target function from the best template
        plot_func = registry.get_function(plot_type)
        
        # Inspect function signature to pass appropriate arguments
        sig = inspect.signature(plot_func)
        call_args = {}
        
        if 'style' in sig.parameters:
            call_args['style'] = style
            
        if 'output_path' in sig.parameters and output_path is not None:
            call_args['output_path'] = output_path
            
        # Pass any extra kwargs that the function accepts
        for key, value in kwargs.items():
            if key in sig.parameters:
                call_args[key] = value
                
        # Handle kwargs with ** in the signature
        has_kwargs = any(p.kind == inspect.Parameter.VAR_KEYWORD for p in sig.parameters.values())
        if has_kwargs:
            for key, value in kwargs.items():
                if key not in call_args:
                    call_args[key] = value

        # Execute the function, redirecting savefig if output_path wasn't passed as a parameter but was requested
        with redirect_savefig(output_path if 'output_path' not in call_args else None):
            result = plot_func(**call_args)
            
        logger.info(f"Successfully generated plot '{plot_type}'.")
        if output_path:
            logger.info(f"Plot saved to: {output_path}")
            
        return result
        
    except Exception as e:
        logger.error(f"Error generating plot '{plot_type}': {e}")
        logger.error(traceback.format_exc())
        raise
