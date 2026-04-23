此次合并主要引入了大量因果推断与统计建模的新模块，包括合成控制法、目标试验模拟、时间序列分析、目标最大似然估计（TMLE）以及相关的测试用例。这些变更显著扩展了框架的分析能力，并增强了工具类的支持和工作流集的完整性。
| 文件 | 变更 |
|------|---------|
| src/statspai/synth/experimental_design.py | - 新增合成控制法 (Synthetic Control) 相关模块及功能 |
| src/statspai/synth/fdid.py | - 新增合成控制法 (Synthetic Control) 相关模块及功能 |
| src/statspai/synth/gsynth.py | - 新增合成控制法 (Synthetic Control) 相关模块及功能 |
| src/statspai/synth/kernel.py | - 新增合成控制法 (Synthetic Control) 相关模块及功能 |
| src/statspai/synth/mc.py | - 新增合成控制法 (Synthetic Control) 相关模块及功能 |
| src/statspai/synth/multi_outcome.py | - 新增合成控制法 (Synthetic Control) 相关模块及功能 |
| src/statspai/synth/penscm.py | - 新增合成控制法 (Synthetic Control) 相关模块及功能 |
| src/statspai/synth/plots.py | - 新增合成控制法 (Synthetic Control) 相关模块及功能 |
| src/statspai/synth/power.py | - 新增合成控制法 (Synthetic Control) 相关模块及功能 |
| src/statspai/synth/report.py | - 新增合成控制法 (Synthetic Control) 相关模块及功能 |
| src/statspai/synth/robust.py | - 新增合成控制法 (Synthetic Control) 相关模块及功能 |
| src/statspai/synth/scm.py | - 新增合成控制法 (Synthetic Control) 相关模块及功能 |
| src/statspai/synth/scpi.py | - 新增合成控制法 (Synthetic Control) 相关模块及功能 |
| src/statspai/synth/sdid.py | - 新增合成控制法 (Synthetic Control) 相关模块及功能 |
| src/statspai/synth/sensitivity.py | - 新增合成控制法 (Synthetic Control) 相关模块及功能 |
| src/statspai/synth/sequential_sdid.py | - 新增合成控制法 (Synthetic Control) 相关模块及功能 |
| src/statspai/synth/sparse.py | - 新增合成控制法 (Synthetic Control) 相关模块及功能 |
| src/statspai/synth/staggered.py | - 新增合成控制法 (Synthetic Control) 相关模块及功能 |
| src/statspai/synth/survival.py | - 新增合成控制法 (Synthetic Control) 相关模块及功能 |
| src/statspai/target_trial/__init__.py | - 新增目标试验模拟 (Target Trial Emulation) 相关模块及功能 |
| src/statspai/target_trial/ccw.py | - 新增目标试验模拟 (Target Trial Emulation) 相关模块及功能 |
| src/statspai/target_trial/ccw_internal.py | - 新增目标试验模拟 (Target Trial Emulation) 相关模块及功能 |
| src/statspai/target_trial/diagnostics.py | - 新增目标试验模拟 (Target Trial Emulation) 相关模块及功能 |
| src/statspai/target_trial/emulate.py | - 新增目标试验模拟 (Target Trial Emulation) 相关模块及功能 |
| src/statspai/target_trial/protocol.py | - 新增目标试验模拟 (Target Trial Emulation) 相关模块及功能 |
| src/statspai/target_trial/report.py | - 新增目标试验模拟 (Target Trial Emulation) 相关模块及功能 |
| src/statspai/timeseries/__init__.py | - 新增时间序列分析 (Time Series) 相关模块及功能 |
| src/statspai/timeseries/arima.py | - 新增时间序列分析 (Time Series) 相关模块及功能 |
| src/statspai/timeseries/bvar.py | - 新增时间序列分析 (Time Series) 相关模块及功能 |
| src/statspai/timeseries/cointegration.py | - 新增时间序列分析 (Time Series) 相关模块及功能 |
| src/statspai/timeseries/garch.py | - 新增时间序列分析 (Time Series) 相关模块及功能 |
| src/statspai/timeseries/its.py | - 新增时间序列分析 (Time Series) 相关模块及功能 |
| src/statspai/timeseries/local_projections.py | - 新增时间序列分析 (Time Series) 相关模块及功能 |
| src/statspai/timeseries/structural_break.py | - 新增时间序列分析 (Time Series) 相关模块及功能 |
| src/statspai/timeseries/var.py | - 新增时间序列分析 (Time Series) 相关模块及功能 |
| src/statspai/tmle/__init__.py | - 新增目标最大似然估计 (TMLE) 相关模块及功能 |
| src/statspai/tmle/hal_tmle.py | - 新增目标最大似然估计 (TMLE) 相关模块及功能 |
| src/statspai/tmle/ltmle.py | - 新增目标最大似然估计 (TMLE) 相关模块及功能 |
| src/statspai/tmle/ltmle_survival.py | - 新增目标最大似然估计 (TMLE) 相关模块及功能 |
| src/statspai/tmle/super_learner.py | - 新增目标最大似然估计 (TMLE) 相关模块及功能 |
| src/statspai/tmle/tmle.py | - 新增目标最大似然估计 (TMLE) 相关模块及功能 |
| src/statspai/transport/__init__.py | - 新增可移植性与泛化性 (Transportability & Generalizability) 相关模块及功能 |
| src/statspai/transport/evidence_synthesis.py | - 新增可移植性与泛化性 (Transportability & Generalizability) 相关模块及功能 |
| src/statspai/transport/generalize.py | - 新增可移植性与泛化性 (Transportability & Generalizability) 相关模块及功能 |
| src/statspai/transport/identify.py | - 新增可移植性与泛化性 (Transportability & Generalizability) 相关模块及功能 |
| src/statspai/transport/weighting.py | - 新增可移植性与泛化性 (Transportability & Generalizability) 相关模块及功能 |
| src/statspai/utils/__init__.py | - 新增工具类及数据生成过程 (DGP) 等辅助功能 |
| src/statspai/utils/data_tools.py | - 新增工具类及数据生成过程 (DGP) 等辅助功能 |
| src/statspai/utils/dgp.py | - 新增工具类及数据生成过程 (DGP) 等辅助功能 |
| src/statspai/utils/egen.py | - 新增工具类及数据生成过程 (DGP) 等辅助功能 |
| src/statspai/utils/io.py | - 新增工具类及数据生成过程 (DGP) 等辅助功能 |
| src/statspai/utils/iv_helpers.py | - 新增工具类及数据生成过程 (DGP) 等辅助功能 |
| src/statspai/utils/labels.py | - 新增工具类及数据生成过程 (DGP) 等辅助功能 |
| src/statspai/workflow/__init__.py | - 新增因果推断工作流 (Causal Workflow) 及报告生成功能 |
| src/statspai/workflow/causal_workflow.py | - 新增因果推断工作流 (Causal Workflow) 及报告生成功能 |
| src/statspai/workflow/paper.py | - 新增因果推断工作流 (Causal Workflow) 及报告生成功能 |
| tests/__init__.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/coverage_monte_carlo/FINDINGS.md | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/coverage_monte_carlo/__init__.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/coverage_monte_carlo/test_coverage.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/external_parity/PUBLISHED_REFERENCE_VALUES.md | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/external_parity/__init__.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/external_parity/test_causalml_book.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/external_parity/test_honest_did_paper_parity.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/external_parity/test_published_replications.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/integration/__init__.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/integration/test_causal_mas_with_fake_llm.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/iv/__init__.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/iv/test_bayesian_iv.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/iv/test_ivmte_bounds.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/iv/test_jive_variants.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/iv/test_mte.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/iv/test_npiv.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/iv/test_plausibly_exogenous.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/iv/test_plots.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/iv/test_post_lasso.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/iv/test_unified_fit.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/iv/test_weak_identification.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/iv/test_weak_iv_ci.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/reference_parity/REFERENCES.md | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/reference_parity/__init__.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/reference_parity/conftest.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/reference_parity/test_assimilation_parity.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/reference_parity/test_cross_estimator_parity.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/reference_parity/test_did_parity.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/reference_parity/test_iv_parity.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/reference_parity/test_matching_parity.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/reference_parity/test_mr_parity.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/reference_parity/test_paper_parity.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/reference_parity/test_rd_parity.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/reference_parity/test_synth_parity.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/spatial/__init__.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/spatial/fixtures/baseline_outputs.json | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/spatial/fixtures/columbus_reference.json | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/spatial/fixtures/georgia_gwr_reference.json | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/spatial/test_backward_compat.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/spatial/test_columbus_crossval.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/spatial/test_diagnostics_impacts.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/spatial/test_esda_geary.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/spatial/test_esda_getis_ord.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/spatial/test_esda_join_counts.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/spatial/test_esda_moran.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/spatial/test_esda_plots.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/spatial/test_gwr.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/spatial/test_models_base.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/spatial/test_models_gmm.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/spatial/test_models_logdet.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/spatial/test_models_ml.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/spatial/test_models_slx_sac.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/spatial/test_panel.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/spatial/test_weights_block.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/spatial/test_weights_contiguity.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/spatial/test_weights_core.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/spatial/test_weights_distance.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_aft.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_agent.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_agent_blocks_drift.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_agent_docs.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_agent_result_methods.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_agent_schema.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_aggte.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_arima.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_article_aliases.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_article_aliases_round2.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_auto_cate.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_auto_cate_tuned.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_auto_estimators.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_bartik.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_bayes_advi.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_bayes_did.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_bayes_did_cohort.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_bayes_dml.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_bayes_fuzzy_rd.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_bayes_hdi_compat.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_bayes_hte_iv.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_bayes_iv.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_bayes_iv_per_instrument.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_bayes_mte.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_bayes_mte_bivariate_normal.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_bayes_mte_hv_latent.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_bayes_mte_multi_iv.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_bayes_mte_policy.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_bayes_mte_selection.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_bayes_mte_tidy.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_bayes_mte_uncertainty.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_bayes_rd.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_bcf_longitudinal.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_bcf_ordinal.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_binscatter.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_bjs_joint.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_bridge.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_bridge_full.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_bunching_unified.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_bvar.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_causal_discovery.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_causal_discovery_ts.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_causal_forest_grf.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_causal_impact.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_causal_kalman.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_causal_llm.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_causal_mas.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_causal_rl.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_causal_rl_core.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_causal_text.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_causal_workflow.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_check_identification.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_cluster_rct.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_compat_sklearn.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_conformal_bcf_bunching_mc.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_conformal_extended.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_conformal_frontiers.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_continuous_iv_late.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_correctness_v150.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_cs_rcs.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_cs_report.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_cs_report_smoke.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_dag_recommend_and_tte_report.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_dag_scm.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_decomposition_tier_c.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_deepiv.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_diag_themes.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_diagnose_batteries_sprint_b.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_diagnose_result_closed_loop.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_diagnostics.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_did.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_did_advanced.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_did_frontiers.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_did_multiplegt_joint.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_did_numerical_fixtures.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_did_summary.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_dispatchers_v150.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_dist_iv_frontiers.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_dml.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_dml_iivm.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_dml_model_averaging.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_dml_panel.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_dml_split.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_ebalance.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_econ_trinity.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_epi.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_epi_diagnostic.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_escape_hatches.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_evidence_synthesis.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_exception_migrations.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_exceptions.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_export.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_fairness.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_fast_bench.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_fixest.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_forest_inference.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_frailty.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_front_door.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_front_door_integrate_by.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_frontier.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_g_computation.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_garch.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_gardner_2s.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_ges.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_gformula_ice.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_gmm.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_hal_tmle.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_harvest_did.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_hausman.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_hdfe_native.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_heckman.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_help.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_honest_did_aggte.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_honest_did_sdid.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_icp.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_inference.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_interference_extensions.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_iv.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_iv_frontiers.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_kernel_iv.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_lingam.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_llm_dag_loop.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_llm_evaluator.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_local_projections.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_longitudinal.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_matching.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_matching_optimal.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_mediate_interventional.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_mediation.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_mediation_sensitivity.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_metalearner_frontiers.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_metalearners.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_mixtape_ch09_guide.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_modelsummary.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_mr_diagnostics.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_mr_extensions.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_mr_extras.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_mr_frontier.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_msm.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_multilevel.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_multiway_and_subcluster.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_neural_causal.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_new_features.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_new_v06_modules.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_numba_kernels.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_ols.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_ope_cevae.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_ope_extensions.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_overlap_and_cbps.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_overlap_did.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_panel.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_paper_pipeline.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_paper_tables.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_phase9to14.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_policy_learning.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_postestimation.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_predict_oos.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_preregister.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_principal_strat.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_proximal.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_proximal_frontiers.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_quantile.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_question_dsl.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_rd.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_rd_aliases.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_rd_frontiers.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_rd_new_modules.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_rd_validation.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_rddensity_io.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_rdpower.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_recommend_agent_cards.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_registry.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_registry_new_modules.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_review_fixes.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_review_fixes_round2.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_ri.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_rif.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_robustness_report.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_round3.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_sensemakr.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_sensitivity_frontier.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_sequential_sdid.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_shift_share_political.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_smart_tools_sprint_b.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_smart_tools_sprint_b_round3.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_smart_tools_sprint_b_round4.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_smart_workflow.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_sp_did_aggregation.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_spec_curve.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_subgroup.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_sumstats.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_surrogate.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_survey.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_survey_calibration.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
| tests/test_synth.py | - 新增对应的单元测试和集成测试文件，以提高代码覆盖率并验证新功能的正确性 |
