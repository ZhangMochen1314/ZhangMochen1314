import importlib
import inspect
import glob
import os
import sys
import traceback

sys.path.append(os.path.abspath(os.path.dirname(__file__)))
from style_manager import apply_academic_style, apply_commercial_style

def main():
    plot_files = glob.glob("plot_*.py")
    plot_files = [f for f in plot_files if os.path.basename(f) != "plot_template.py"]
    plot_files.sort()

    for file in plot_files:
        module_name = os.path.basename(file)[:-3]
        try:
            module = importlib.import_module(module_name)
            print(f"--- Processing {module_name} ---")
            
            functions = []
            for name, obj in inspect.getmembers(module, inspect.isfunction):
                if obj.__module__ == module_name:
                    if name.startswith('plot_') or name.startswith('create_'):
                        functions.append((name, obj))
            
            for name, func in functions:
                sig = inspect.signature(func)
                can_call = True
                for param_name, param in sig.parameters.items():
                    if param_name not in ['style', 'style_name', 'output_path']:
                        if param.default == inspect.Parameter.empty:
                            can_call = False
                            break
                
                if not can_call:
                    continue
                
                # academic
                try:
                    print(f"  Executing {name} (academic)...")
                    apply_academic_style()
                    kwargs = {}
                    if 'style' in sig.parameters:
                        kwargs['style'] = 'academic'
                    elif 'style_name' in sig.parameters:
                        kwargs['style_name'] = 'academic'
                        
                    if 'output_path' in sig.parameters:
                        default_out = sig.parameters['output_path'].default
                        if default_out and isinstance(default_out, str):
                            kwargs['output_path'] = default_out.replace('commercial.png', 'academic.pdf')
                    
                    func(**kwargs)
                except Exception as e:
                    print(f"  [ERROR] {name}(academic): {e}")
                    traceback.print_exc()

                # commercial
                try:
                    print(f"  Executing {name} (commercial)...")
                    apply_commercial_style()
                    kwargs = {}
                    if 'style' in sig.parameters:
                        kwargs['style'] = 'commercial'
                    elif 'style_name' in sig.parameters:
                        kwargs['style_name'] = 'commercial'
                        
                    if 'output_path' in sig.parameters:
                        default_out = sig.parameters['output_path'].default
                        if default_out and isinstance(default_out, str):
                            kwargs['output_path'] = default_out.replace('academic.pdf', 'commercial.png')
                    
                    func(**kwargs)
                except Exception as e:
                    print(f"  [ERROR] {name}(commercial): {e}")
                    traceback.print_exc()
                    
        except Exception as e:
            print(f"[ERROR] Failed to process module {module_name}: {e}")
            traceback.print_exc()

if __name__ == "__main__":
    main()
