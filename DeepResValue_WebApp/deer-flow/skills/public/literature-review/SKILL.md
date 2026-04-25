---
name: literature-review
description: Use this skill when the user provides a list of academic papers (or an uploaded document/data file containing paper metadata) and asks you to write a comprehensive, academic literature review synthesizing their findings. Outputs exclusively in Markdown format.
---

# Literature Review Skill

## Overview

This skill takes a set of academic papers (metadata, abstracts, or full texts) and synthesizes them into a structured, academic literature review. It does **not** search the web for new papers. It only processes the papers provided by the user (either uploaded files or text input).

**Do not use HTML format.** All output must be strictly in **Markdown**.

## When to Use This Skill

- The user has uploaded a file (.bib, .ris, .csv, .pdf) containing literature and asks for a review.
- The user provides a list of papers and asks you to summarize and synthesize them.
- The user needs an academic literature review report based on a provided corpus.

## Workflow

### 1. File Parsing
Identify the format of the user's provided data:
- **BibTeX / RIS / EndNote XML**: Extract structured fields (title, author, year, abstract).
- **Excel / CSV**: Read the tabular data.
- **PDF / Word**: Extract text content and identify the paper's title, authors, abstract, and key findings.

**Strict Rule**: ONLY use the literature provided by the user. Do NOT hallucinate or fabricate any papers, citations, or findings.

### 2. Thematic Analysis
- **Themes**: Identify 3-6 recurring research directions or problem framings across the provided papers.
- **Convergences**: Identify findings that multiple papers agree on.
- **Disagreements**: Note where papers reach different conclusions or use incompatible methodologies.
- **Gaps**: Note what the collective literature does not yet address.

### 3. Report Generation
Generate the literature review strictly following this academic Markdown structure:

```markdown
# Literature Review: [Research Topic]

## Abstract
[Brief summary of the research background, main findings across the papers, and significance, 200-300 words]

## 1. Introduction
### 1.1 Research Background
### 1.2 Purpose and Significance

## 2. Literature Review
### 2.1 [Theme 1]
[Synthesize research under this theme. Use numeric citations like [1][2].]

### 2.2 [Theme 2]
[Synthesize research under this theme. Use numeric citations like [3][4].]

### 2.3 [Theme 3]
[Synthesize research under this theme. Use numeric citations like [5][6].]

## 3. Methodology Overview
### 3.1 Main Research Methods
### 3.2 Methodological Trends

## 4. Limitations and Future Directions
### 4.1 Limitations in Existing Literature
### 4.2 Future Research Directions

## 5. Conclusion

## References
[List all references in APA format, numbered according to their appearance in the text]
```

### 4. Citation Rules
- **In-text Citations**: Use numeric brackets, e.g., [1], [2][3], in order of appearance.
- **Reference List**: Must perfectly match the in-text citations. Only include papers that actually appear in the user's provided data.

### 5. Final Output
Save the generated Markdown to a file (e.g., `/workspace/literature_review_report.md`) and notify the user that the synthesis is complete. Provide a short executive summary in the chat, but do not dump the entire report into the chat window.
