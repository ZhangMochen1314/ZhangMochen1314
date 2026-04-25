---
name: literature-search
description: Use this skill when the user asks to search, find, or collect academic literature/papers on a specific topic. This skill searches academic databases (like arXiv) and retrieves structured metadata (title, authors, year, journal, abstract, link). It outputs a structured Markdown list of the found literature.
---

# Literature Search Skill

## Overview

This skill is designed to search for and collect academic literature on a given topic. It retrieves key metadata for each paper and outputs a clean, structured Markdown list. It is purely focused on **data collection** and does not write literature reviews (for writing reviews, use the `literature-review` skill).

## When to Use This Skill

- User asks to "find papers on X" or "search for literature about Y".
- User needs a list of recent academic articles on a specific topic.
- User is preparing for a literature review and needs the raw materials (the papers and their abstracts).

## Workflow

### 1. Understand Requirements
- Identify the **research topic / keywords**.
- Identify the **number of papers** required (default to 30 if not specified).
- Identify any **time range** constraints (e.g., "last 5 years").

### 2. Execute Search
You must use the provided `scripts/search_arxiv.py` script to fetch papers. (This script is compatible with the `systematic-literature-review` approach but adapted for general search).

```bash
python /workspace/deer-flow/skills/public/literature-search/scripts/search_arxiv.py \
  "<keywords>" \
  --max-results <N> \
  [--start-date YYYY-MM-DD] \
  [--sort-by relevance]
```

**Query Guidelines**:
- Extract 2-3 core keywords. Do not pass long sentences.
- Use `--sort-by relevance` to ensure the most applicable papers are found.

### 3. Format Output
The script outputs JSON data. You must format this data into a structured **Markdown** report.
**DO NOT output HTML.**

**Markdown Format Template:**
```markdown
# Literature Search Results: [Topic]

Found [N] papers based on your query.

## 1. [Paper Title]
- **Authors**: [Author 1, Author 2, ...]
- **Published**: [Year/Date]
- **Journal/Source**: [e.g., arXiv]
- **Link**: [URL or DOI]
- **Abstract**: [Abstract text...]

## 2. [Paper Title]
...
```

### 4. Deliver Results
Save the formatted Markdown to a file (e.g., `/workspace/literature_search_results.md`) and provide a brief summary of the search results to the user in the chat, including the path to the saved file.

