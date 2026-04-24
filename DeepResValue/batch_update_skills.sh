#!/bin/bash

# 定义要修改的目录
SKILLS_DIR="/workspace/DeepResValue/skills/custom"

# 需要排除的目录（已经手工精修过，或者不需要改的）
EXCLUDE_DIRS=("DeepResValue-DID" "DeepResValue-DataClean" "DeepResValue-IV" "DeepResValue-RD" "DeepResValue-DataRouter" "DeepResValue-SciPlot" "DeepResValue-DataCollector" "DeepResValue-Literature-Review" "DeepResValue-Literature-Search" "DeepResValue-StatModel")

# 遍历所有的 SKILL.md
for skill_file in $(find "$SKILLS_DIR" -name "SKILL.md"); do
    dir_name=$(basename $(dirname "$skill_file"))
    
    # 检查是否在排除列表中
    skip=false
    for exclude in "${EXCLUDE_DIRS[@]}"; do
        if [[ "$dir_name" == "$exclude" ]]; then
            skip=true
            break
        fi
    done
    
    if [ "$skip" = true ]; then
        continue
    fi

    echo "Processing $dir_name..."
    
    # 使用 awk 进行批量替换
    # 寻找 "## 2. 执行策略" 或类似标题，并将其替换为新的规范标题和内容
    # 如果找到了 "StatsPAI 首选原则"，则在其后插入预装声明和3次重试降级声明
    
    awk '
    /## 2. 执行策略/ {
        print "## 2. 执行策略与 StatsPAI 准确调用规范（严格遵守）"
        next
    }
    /\*\*StatsPAI 首选原则\*\*/ {
        print "1. **StatsPAI 首选原则**：在生成 Python 分析代码时，**必须优先尝试导入并使用预装在 Sandbox 里的 `statspai` 库**。"
        next
    }
    /Fallback 稳健机制/ || /自动回退/ {
        print "2. **容错与降级机制 (Fallback to Native Python)**："
        print "   如果你连续尝试修复并执行 `statspai` 代码 **3次均失败**，或者遇到库暂未支持的功能，你必须触发**平滑降级**："
        print "   - **立即放弃使用 `statspai`**。"
        print "   - 转而使用原生的 `statsmodels`, `linearmodels`, 或 `scikit-learn` 编写稳健的备用代码。"
        print "   - 在向用户解释时，请礼貌地说明：“由于数据复杂性导致高级估计量无法收敛，我已自动为您切换到经典的备用模型进行评估。”"
        next
    }
    { print $0 }
    ' "$skill_file" > "${skill_file}.tmp" && mv "${skill_file}.tmp" "$skill_file"

done

echo "Batch update completed."
