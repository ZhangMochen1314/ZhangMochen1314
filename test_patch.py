import matplotlib.pyplot as plt
import os

original_savefig = plt.savefig
def test():
    fig, ax = plt.subplots()
    ax.plot([1, 2], [3, 4])
    
    # patch
    out_dir = "/workspace/test_out"
    os.makedirs(out_dir, exist_ok=True)
    plt.savefig = lambda fname, *args, **kwargs: original_savefig(os.path.join(out_dir, 'academic.png'), *args, **kwargs)
    
    plt.savefig("ignored.pdf")
    plt.savefig = original_savefig

test()
