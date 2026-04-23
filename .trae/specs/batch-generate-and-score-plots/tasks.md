# Tasks

- [x] Task 1: 改造生成脚本以支持批量与随机扰动
  - [x] SubTask 1.1: 修改 `generate_all.py`，加入 `for i in range(10):` 的循环逻辑，确保每种图表运行 10 次。
  - [x] SubTask 1.2: 检查底层绘图脚本（如 `plot_distribution.py`, `plot_did_event.py` 等），确保其内部模拟数据或随机种子在每次调用时能产生微小变化。
- [x] Task 2: 执行批量生成
  - [x] SubTask 2.1: 清理旧的 `output_templates/` 和 `best_templates/`。
  - [x] SubTask 2.2: 运行修改后的 `generate_all.py`，确认已成功生成大量包含图片、代码和说明的图表目录。
- [x] Task 3: 执行自动评分与最优模板归档
  - [x] SubTask 3.1: 运行 `auto_score_pipeline.py`。
  - [x] SubTask 3.2: 验证脚本能正确评估多达 10 个版本，并将每种图表的“得分王”（最高分代码和 JSON）成功复制至 `best_templates/`。
