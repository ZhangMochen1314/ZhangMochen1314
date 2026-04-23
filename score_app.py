import gradio as gr
import os
import csv
from PIL import Image

BASE_DIR = "/workspace/output_templates"
CSV_FILE = "/workspace/scores.csv"

def get_folders():
    folders = []
    if os.path.exists(BASE_DIR):
        for item in sorted(os.listdir(BASE_DIR)):
            item_path = os.path.join(BASE_DIR, item)
            if os.path.isdir(item_path):
                academic_img = os.path.join(item_path, "academic.png")
                commercial_img = os.path.join(item_path, "commercial.png")
                if os.path.exists(academic_img) and os.path.exists(commercial_img):
                    folders.append(item)
    return folders

# Initialize CSV file with headers if it doesn't exist
def init_csv():
    if not os.path.exists(CSV_FILE):
        with open(CSV_FILE, mode='w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(["Folder", "Academic_Score", "Commercial_Score"])

def get_content(idx, folders):
    if not folders:
        return "没有找到任何图片", None, None
    if idx >= len(folders):
        return "所有图片已打分完毕！", None, None
    
    folder = folders[idx]
    progress_text = f"**进度**: {idx + 1} / {len(folders)} - **当前目录**: {folder}"
    academic_img_path = os.path.join(BASE_DIR, folder, "academic.png")
    commercial_img_path = os.path.join(BASE_DIR, folder, "commercial.png")
    
    try:
        academic_img = Image.open(academic_img_path)
        commercial_img = Image.open(commercial_img_path)
    except Exception as e:
        academic_img = None
        commercial_img = None
        progress_text += f"\n加载图片失败: {e}"
        
    return progress_text, academic_img, commercial_img

def save_and_next(idx, academic_score, commercial_score):
    folders = get_folders()
    init_csv()
    
    if idx < len(folders):
        folder = folders[folders[idx]] if isinstance(idx, int) else folders[int(idx)]
        with open(CSV_FILE, mode='a', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow([folder, academic_score, commercial_score])
        idx = int(idx) + 1
    
    progress_text, academic_img, commercial_img = get_content(idx, folders)
    # Reset sliders to 50 for the next pair
    return idx, progress_text, academic_img, commercial_img, 50, 50

def load_initial_state():
    folders = get_folders()
    init_csv()
    return get_content(0, folders)[0], get_content(0, folders)[1], get_content(0, folders)[2]

def get_initial_idx():
    return 0

with gr.Blocks(title="图片打分工具") as demo:
    gr.Markdown("# 图片打分工具")
    
    state_idx = gr.State(value=0)
    
    progress_md = gr.Markdown()
    
    with gr.Row():
        with gr.Column():
            gr.Markdown("### Academic")
            academic_image = gr.Image(label="Academic.png", interactive=False, type="pil")
            academic_slider = gr.Slider(minimum=0, maximum=100, value=50, step=1, label="Academic Score")
            
        with gr.Column():
            gr.Markdown("### Commercial")
            commercial_image = gr.Image(label="Commercial.png", interactive=False, type="pil")
            commercial_slider = gr.Slider(minimum=0, maximum=100, value=50, step=1, label="Commercial Score")
            
    save_btn = gr.Button("保存并进入下一组 (Save & Next)", variant="primary")
    
    demo.load(
        fn=get_initial_idx,
        inputs=[],
        outputs=[state_idx]
    ).then(
        fn=load_initial_state,
        inputs=[],
        outputs=[progress_md, academic_image, commercial_image]
    )
    
    save_btn.click(
        fn=save_and_next,
        inputs=[state_idx, academic_slider, commercial_slider],
        outputs=[state_idx, progress_md, academic_image, commercial_image, academic_slider, commercial_slider]
    )

if __name__ == "__main__":
    demo.launch(server_name="0.0.0.0", server_port=7861)
