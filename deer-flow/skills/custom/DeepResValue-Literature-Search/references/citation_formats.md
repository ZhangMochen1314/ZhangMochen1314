# 引用格式规范

## 目录
- [概览](#概览)
- [支持的引用格式](#支持的引用格式)
  - [APA格式（第7版）](#apa格式第7版)
  - [MLA格式（第9版）](#mla格式第9版)
  - [Chicago格式（第17版）](#chicago格式第17版)
  - [GB/T 7714-2015（中国国家标准）](#gbt-7714-2015中国国家标准)
- [格式转换规则](#格式转换规则)
- [特殊情况处理](#特殊情况处理)
- [参考文献列表排序](#参考文献列表排序)
- [完整示例](#完整示例)
- [使用说明](#使用说明)

## 概览
本文档提供常见引用格式的标准和示例，用于生成参考文献列表和正文引用。

## 支持的引用格式

### APA格式（第7版）

#### 正文引用
- 单作者：(作者姓, 年份)
- 双作者：(作者1姓 & 作者2姓, 年份)
- 三作者及以上：(第一作者姓 et al., 年份)
- 中文作者：(张三, 2023)
- 多篇文献：(Wang, 2023; Li, 2022; Chen, 2021)

#### 参考文献列表
**期刊文章：**
```
作者姓, 名首字母. (年份). 文章标题. 期刊名称（斜体）, 卷号（斜体）(期号), 页码. https://doi.org/xxxxx
```

**示例：**
```
Wang, L., Chen, M., & Zhang, W. (2023). Deep learning applications in medical imaging diagnosis. Nature Medicine, 29(5), 1234-1245. https://doi.org/10.1038/s41591-023-01234-5
```

**中文期刊：**
```
张三, 李四, & 王五. (2023). 深度学习在医学影像诊断中的应用研究. 中华医学杂志, 103(12), 789-795.
```

**书籍：**
```
作者姓, 名首字母. (年份). 书名（斜体）. 出版社.
```

**示例：**
```
李明. (2022). 医学人工智能导论. 人民卫生出版社.
```

**会议论文：**
```
作者姓, 名首字母. (年份, 月日). 论文标题. 会议名称, 地点.
```

**示例：**
```
Chen, W., & Liu, Y. (2023, June 15-18). A novel approach to medical image segmentation. Proceedings of the IEEE International Conference on Computer Vision, Vancouver, Canada.
```

---

### MLA格式（第9版）

#### 正文引用
- 格式：(作者姓 页码)
- 示例：(Wang 1234)
- 中文：(张三 45)

#### 参考文献列表
**期刊文章：**
```
作者姓, 名. "文章标题." 期刊名称, 卷号, 期号, 年份, 页码.
```

**示例：**
```
Wang, Li, and Ming Chen. "Deep Learning Applications in Medical Imaging Diagnosis." Nature Medicine, vol. 29, no. 5, 2023, pp. 1234-1245.
```

**书籍：**
```
作者姓, 名. 书名. 出版社, 年份.
```

**示例：**
```
李明. 医学人工智能导论. 人民卫生出版社, 2022.
```

---

### Chicago格式（第17版）

#### 正文引用（作者-日期制）
- 格式：(作者姓 年份, 页码)
- 示例：(Wang 2023, 1234)
- 中文：(张三 2023, 45)

#### 参考文献列表
**期刊文章：**
```
作者姓, 名. 年份. "文章标题." 期刊名称 卷号 (期号): 页码.
```

**示例：**
```
Wang, Li, and Ming Chen. 2023. "Deep Learning Applications in Medical Imaging Diagnosis." Nature Medicine 29 (5): 1234-1245.
```

**书籍：**
```
作者姓, 名. 年份. 书名. 出版地: 出版社.
```

**示例：**
```
李明. 2022. 医学人工智能导论. 北京: 人民卫生出版社.
```

---

### GB/T 7714-2015（中国国家标准）

#### 正文引用
- 格式：[序号]
- 示例：研究表明...[1-3]

#### 参考文献列表
**期刊文章：**
```
[序号] 作者. 文章标题[J]. 期刊名称, 年份, 卷(期): 页码.
```

**示例：**
```
[1] Wang L, Chen M, Zhang W. Deep learning applications in medical imaging diagnosis[J]. Nature Medicine, 2023, 29(5): 1234-1245.
```

**中文期刊：**
```
[1] 张三, 李四, 王五. 深度学习在医学影像诊断中的应用研究[J]. 中华医学杂志, 2023, 103(12): 789-795.
```

**书籍：**
```
[序号] 作者. 书名[M]. 出版地: 出版社, 年份: 页码.
```

**示例：**
```
[1] 李明. 医学人工智能导论[M]. 北京: 人民卫生出版社, 2022.
```

---

## 格式转换规则

### 作者姓名处理

| 格式 | 英文作者 | 中文作者 |
|------|----------|----------|
| APA | Wang, L., & Chen, M. | 张三, 李四 |
| MLA | Wang, Li, and Chen, Ming | 张三, 李四 |
| Chicago | Wang, Li, and Ming Chen | 张三, 李四 |
| GB/T | Wang L, Chen M | 张三, 李四 |

### 作者数量处理

| 格式 | 1-2名作者 | 3名及以上作者 |
|------|-----------|---------------|
| APA | 全部列出 | 第一作者 + et al. |
| MLA | 全部列出 | 第一作者 + et al. |
| Chicago | 全部列出 | 第一作者 + et al. |
| GB/T | 全部列出 | 前三名 + 等 |

### 标题大小写

| 格式 | 文章标题 | 期刊名称 |
|------|----------|----------|
| APA | 句首大写 | 斜体，标题大写 |
| MLA | 标题大写 | 斜体，标题大写 |
| Chicago | 标题大写 | 斜体，标题大写 |
| GB/T | 原样 | 正体，标题大写 |

## 特殊情况处理

### 无作者
- APA：使用标题作为作者，标题前移
- 示例：("Deep Learning in Medicine," 2023)

### 无年份
- APA：使用"n.d."（no date）
- 示例：(Wang, n.d.)

### 无页码
- APA：使用文章编号或DOI
- 示例：https://doi.org/10.1038/s41591-023-01234-5

### 在线优先发表
- APA：标注"Advance online publication"
- 示例：Wang, L. (2023). Title. Journal Name. Advance online publication. https://doi.org/xxx

### 译文
- 标注原文语言
- 示例：Wang, L. (2023). Title (M. Chen, Trans.). Journal. (Original work published 2022)

## 参考文献列表排序

### 按字母顺序（APA/MLA/Chicago）
- 英文文献在前，按作者姓氏字母顺序
- 中文文献在后，按拼音字母顺序
- 同一作者多篇文献，按年份排序
- 同一作者同年份文献，用a, b, c区分

### 按引用顺序（GB/T）
- 按正文引用先后顺序编号
- 同一文献多次引用，使用相同序号

## 完整示例

### APA格式参考文献列表

```
参考文献

Chen, W., & Liu, Y. (2023). A novel approach to medical image segmentation. Nature Medicine, 29(5), 1234-1245. https://doi.org/10.1038/s41591-023-01234-5

李明. (2022). 医学人工智能导论. 人民卫生出版社.

Wang, L., Chen, M., & Zhang, W. (2023). Deep learning applications in medical imaging diagnosis: A systematic review. Journal of Medical AI, 12(3), 45-67.

Zhang, H. (2021). Challenges in clinical implementation of AI systems. In Proceedings of the International Conference on Healthcare Informatics (pp. 112-125). IEEE Press.

张三, 李四, & 王五. (2023). 深度学习在医学影像诊断中的应用研究. 中华医学杂志, 103(12), 789-795.
```

### GB/T格式参考文献列表

```
参考文献

[1] Chen W, Liu Y. A novel approach to medical image segmentation[J]. Nature Medicine, 2023, 29(5): 1234-1245.

[2] 李明. 医学人工智能导论[M]. 北京: 人民卫生出版社, 2022.

[3] Wang L, Chen M, Zhang W. Deep learning applications in medical imaging diagnosis: A systematic review[J]. Journal of Medical AI, 2023, 12(3): 45-67.

[4] Zhang H. Challenges in clinical implementation of AI systems[C]//Proceedings of the International Conference on Healthcare Informatics. IEEE Press, 2021: 112-125.

[5] 张三, 李四, 王五. 深度学习在医学影像诊断中的应用研究[J]. 中华医学杂志, 2023, 103(12): 789-795.
```

## 使用说明

1. **格式选择**：根据用户需求或目标期刊要求选择格式
2. **信息完整性**：确保每条参考文献包含必要的出版信息
3. **格式统一**：同一综述内必须使用统一的引用格式
4. **中英文混合**：按格式规则处理中英文文献的排序和呈现
