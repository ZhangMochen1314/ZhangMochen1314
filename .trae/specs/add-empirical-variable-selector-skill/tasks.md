# Tasks

- [x] Task 1: Create DeepResValue-EmpiricalSelector Skill Directory and Configuration
  - [x] SubTask 1.1: Create the directory `skills/custom/DeepResValue-EmpiricalSelector/`.
  - [x] SubTask 1.2: Create `SKILL.md` inside the directory, outlining the intention clarification (getting the dependent variable and theme), semantic evaluation rules, statistical significance rules (e.g., $p<0.05$ or $p<0.1$), and output formats. It must adhere to the `SKILL_TEMPLATE.md` standards.

- [x] Task 2: Develop the Python Script for Variable Selection
  - [x] SubTask 2.1: Create the directory `skills/custom/DeepResValue-EmpiricalSelector/scripts/`.
  - [x] SubTask 2.2: Develop `variable_selector.py`. The script should accept a DataFrame, a dependent variable ($Y$), and a list of semantically pre-selected candidate variables ($X$).
  - [x] SubTask 2.3: Implement the statistical filtering logic in the script using `statsmodels.api.OLS` (or Logit if $Y$ is binary) to perform univariate or multivariate regressions and filter variables by $p$-value.
  - [x] SubTask 2.4: Implement a visualization function within the script (e.g., using `seaborn` or `matplotlib` with `statspai.plots.set_theme`) to generate a correlation heatmap or significance bar chart of the selected variables.

- [x] Task 3: Integration and Documentation
  - [x] SubTask 3.1: Ensure the script outputs a structured markdown report summarizing the selected variables, their coefficients, standard errors, $t$-values, and $p$-values.
  - [x] SubTask 3.2: Verify that the output paths for generated plots are correctly managed so they can be presented to the user.
