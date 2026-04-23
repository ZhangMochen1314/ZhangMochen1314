# 智能体技能集成指南 (deerflow2.0 集成说明)

这份文档将指导您如何将提取的顶级科研绘图模板库，以及对应的 Python 入口脚本，集成到您的 `deerflow2.0` 智能体中，使其正式具备“科研绘图”这一高级技能。

## 一、 文件与结构部署
在下载并解压当前提供的 ZIP 包后，您需要将以下核心内容部署到 `deerflow2.0` 智能体运行所在的服务器/项目目录中：

1. **`best_templates/` 文件夹**：存放所有图表最高分 `.py` 代码和 `.json` 评分记录的核心库。
2. **`style_manager.py`**：全局样式配置模块（A4尺寸、黄金比例、去标题、宋体等）。
3. **`scientific_plotter.py`**：技能执行统一入口。

> *注意：请确保这三个内容位于同一个执行目录下（或者智能体代码能够 import 到的系统环境变量路径中）。*

## 二、 依赖库安装
确保您的智能体运行环境（如虚拟环境、Docker容器等）已经安装了绘图必备的数据分析和可视化依赖库。您可以通过以下命令快速安装：
```bash
pip install matplotlib seaborn pandas numpy scipy networkx statsmodels
```

## 三、 在智能体中注册 Tool (工具)
为了让智能体的大脑（LLM）知道自己可以画图，您需要为大模型定义并注册一个 Function/Tool。这里以 OpenAI 格式为例：

```json
{
  "name": "draw_scientific_plot",
  "description": "调用此工具来生成高质量的科研分析或商业统计图表。支持18种以上的复杂图表（如散点、中介效应、脑影像激活等）。",
  "parameters": {
    "type": "object",
    "properties": {
      "plot_type": {
        "type": "string",
        "description": "要绘制的图表类型名称，例如 'plot_distribution', 'create_did_plot', 'plot_social_network', 'plot_interaction' 等。"
      },
      "style": {
        "type": "string",
        "enum": ["academic", "commercial"],
        "description": "选择学术黑白简约风（academic，适用于期刊论文）或彩色商业华丽风（commercial，适用于汇报PPT）。"
      },
      "output_path": {
        "type": "string",
        "description": "图表的绝对保存路径，例如 '/tmp/agent_output.png'。"
      }
    },
    "required": ["plot_type", "style", "output_path"]
  }
}
```

## 四、 在后端绑定执行逻辑
当智能体分析用户的意图，决定输出一张科研图片并返回了对应的 `plot_type`、`style` 和 `output_path` 参数时，您的系统后端需要执行如下代码，去调用刚部署的绘图脚本：

```python
# 在 deerflow2.0 后端处理 Tool Calls 的逻辑中：
import traceback
from scientific_plotter import generate_plot

def execute_draw_scientific_plot(plot_type: str, style: str, output_path: str):
    """
    智能体调用的实体函数
    """
    try:
        # 直接调用打包提供的统一绘图入口
        generate_plot(plot_type=plot_type, style=style, output_path=output_path)
        return f"绘图成功！高质量的 {style} 风格图片已保存至：{output_path}。您可以将此路径返回给用户。"
    except Exception as e:
        error_msg = traceback.format_exc()
        return f"绘图失败，原因: {e}。\n详细日志: {error_msg}。请尝试更换 plot_type 或检查参数。"
```

## 五、 修改智能体的 System Prompt
最后，为了最大化利用该技能，建议在 `deerflow2.0` 的系统提示词（System Prompt）中添加以下约束和人设说明：

> **[角色设定]**
> 你是一个精通实证分析与数据可视化的顶级科研助手。
> 
> **[技能调用约束]**
> 1. 当用户需要展示统计结果或响应画图需求（如正大杯竞赛数据分析、人文社科论文配图）时，你必须调用 `draw_scientific_plot` 工具。
> 2. 风格选择原则：
>    - 若用户场景为“期刊论文”、“学术发表”、“黑白印刷”等，必须传递 `style="academic"`。
>    - 若用户场景为“PPT演讲”、“商业报告”、“海报展示”等，必须传递 `style="commercial"`。
> 3. 工具执行完毕后，不要再用 Markdown 输出假代码块，而是直接将 `output_path` 中生成的真实图片通过消息附件或 Markdown 图片语法 `![分析图](文件路径)` 返回给用户。

完成上述集成后，您的 `deerflow2.0` 即完成了该技能的全面升级！