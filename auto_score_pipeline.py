import os
import glob
import json
import random
import shutil
import logging
import re
from pathlib import Path

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

def simulate_llm_vision_scoring(image_path: str, prompt: str) -> dict:
    """
    模拟一个 LLM 视觉评分函数。
    接收图片路径和提示词，返回包含总分与维度的 JSON 格式字典。
    """
    logging.debug(f"正在为图片模拟 LLM 评分: {image_path}...")
    
    # 随机生成维度得分（满分 10 分）
    aesthetics = random.randint(5, 10)
    clarity = random.randint(5, 10)
    accuracy = random.randint(5, 10)
    
    total_score = aesthetics + clarity + accuracy
    
    # 模拟生成的 JSON 格式数据
    result = {
        "total_score": total_score,
        "dimensions": {
            "aesthetics": aesthetics,
            "clarity": clarity,
            "accuracy": accuracy
        },
        "reasoning": "图片配色合理，数据展示清晰，符合专业可视化标准。"
    }
    
    return result

def main():
    input_dir = "/workspace/output_templates"
    output_dir = "/workspace/best_templates"
    
    # 确保输出目录存在
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        logging.info(f"创建输出目录: {output_dir}")
        
    if not os.path.exists(input_dir):
        logging.error(f"输入目录不存在: {input_dir}")
        return

    # 提示词，包含评分规则与 JSON 格式要求
    prompt = """
    请作为一名专业的数据可视化专家，根据以下规则对提供的图表图片进行评分：
    1. 美观度 (aesthetics, 0-10分): 颜色搭配、排版和字体是否具有视觉吸引力？
    2. 清晰度 (clarity, 0-10分): 数据是否容易阅读和理解？标签是否清晰？
    3. 准确度 (accuracy, 0-10分): 图表是否正确代表了标准的可视化实践？
    
    请严格按照以下 JSON 格式输出评估结果：
    {
      "total_score": <整数，各项维度得分总和>,
      "dimensions": {
        "aesthetics": <整数>,
        "clarity": <整数>,
        "accuracy": <整数>
      },
      "reasoning": "<字符串，对得分的解释>"
    }
    """
    
    # 查找输入目录下的所有子目录
    subdirs = [os.path.join(input_dir, d) for d in os.listdir(input_dir) if os.path.isdir(os.path.join(input_dir, d))]
    
    # 按图表类型进行分组 (例如: create_did_plot_1776945738213 -> create_did_plot)
    groups = {}
    for subdir in subdirs:
        basename = os.path.basename(subdir)
        # 提取图表类型（去掉末尾的时间戳后缀）
        match = re.match(r'(.+)_\d+$', basename)
        if match:
            chart_type = match.group(1)
        else:
            chart_type = basename
            
        if chart_type not in groups:
            groups[chart_type] = []
        groups[chart_type].append(subdir)
        
    logging.info(f"共发现 {len(groups)} 种图表类型，开始评分...")
    
    # 遍历每种图表类型，选出最高分的版本
    for chart_type, dirs in groups.items():
        logging.info(f"--- 正在处理图表类型: {chart_type} ---")
        best_score = -1
        best_dir = None
        best_details = {}
        
        for d in dirs:
            academic_img = os.path.join(d, "academic.png")
            commercial_img = os.path.join(d, "commercial.png")
            
            score_academic = 0
            score_commercial = 0
            details = {}
            
            # 评估学术风格图片
            if os.path.exists(academic_img):
                try:
                    res_acad = simulate_llm_vision_scoring(academic_img, prompt)
                    score_academic = res_acad.get("total_score", 0)
                    details['academic'] = res_acad
                    logging.info(f"  [{os.path.basename(d)}] 学术图片得分: {score_academic} (维度: {res_acad.get('dimensions')})")
                except Exception as e:
                    logging.error(f"  [{os.path.basename(d)}] 评估学术图片时出错: {e}")
            else:
                logging.warning(f"  [{os.path.basename(d)}] 缺少 academic.png")
                
            # 评估商业风格图片
            if os.path.exists(commercial_img):
                try:
                    res_comm = simulate_llm_vision_scoring(commercial_img, prompt)
                    score_commercial = res_comm.get("total_score", 0)
                    details['commercial'] = res_comm
                    logging.info(f"  [{os.path.basename(d)}] 商业图片得分: {score_commercial} (维度: {res_comm.get('dimensions')})")
                except Exception as e:
                    logging.error(f"  [{os.path.basename(d)}] 评估商业图片时出错: {e}")
            else:
                logging.warning(f"  [{os.path.basename(d)}] 缺少 commercial.png")
                
            # 计算该版本的总得分
            total = score_academic + score_commercial
            logging.info(f"  -> [{os.path.basename(d)}] 总得分: {total}")
            
            if total > best_score:
                best_score = total
                best_dir = d
                best_details = details
                
        # 将最高分代码拷贝至 best_templates
        if best_dir:
            source_code = os.path.join(best_dir, "source_code.py")
            if os.path.exists(source_code):
                dest_path = os.path.join(output_dir, f"{chart_type}.py")
                try:
                    shutil.copy2(source_code, dest_path)
                    logging.info(f"成功: {chart_type} 的最高分版本是 {os.path.basename(best_dir)} (得分 {best_score})，已拷贝至 {dest_path}")
                    
                    # 可选：将评分结果也写入到目标目录，方便查阅
                    result_path = os.path.join(output_dir, f"{chart_type}_score.json")
                    with open(result_path, 'w', encoding='utf-8') as f:
                        json.dump({
                            "best_version": os.path.basename(best_dir),
                            "total_score": best_score,
                            "scores": best_details
                        }, f, ensure_ascii=False, indent=2)
                        
                except Exception as e:
                    logging.error(f"拷贝 {chart_type} 代码时出错: {e}")
            else:
                logging.error(f"最高分版本目录中缺少 source_code.py: {best_dir}")
        else:
            logging.warning(f"未能为 {chart_type} 找到有效得分版本。")

if __name__ == "__main__":
    main()
