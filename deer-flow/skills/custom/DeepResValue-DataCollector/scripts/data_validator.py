"""
DeepTrace Data Collector - 数据验证模块
提供数据质量检查和验证功能
"""

import argparse
import sys
import pandas as pd
from pathlib import Path
from logger import get_logger, log_info, log_error, log_warning


class DataValidator:
    """数据验证器"""

    def __init__(self, log_module='data_validator'):
        """初始化数据验证器"""
        self.logger = get_logger(log_module)

    def validate(self, data_path, rules=None):
        """
        验证数据质量

        Args:
            data_path: 数据文件路径
            rules: 验证规则（字典）

        Returns:
            dict: 验证结果
        """
        log_info('data_validator', f'Validating data: {data_path}')

        results = {
            'status': 'success',
            'errors': [],
            'warnings': [],
            'statistics': {}
        }

        try:
            # 读取数据
            df = self._read_data(data_path)

            if df is None or df.empty:
                results['status'] = 'error'
                results['errors'].append('Data file is empty or cannot be read')
                return results

            # 执行验证
            self._check_missing_values(df, results)
            self._check_data_range(df, results, rules)
            self._check_duplicates(df, results)
            self._check_data_types(df, results)

            # 统计信息
            results['statistics'] = {
                'rows': len(df),
                'columns': len(df.columns),
                'memory_usage': f'{df.memory_usage(deep=True).sum() / 1024 / 1024:.2f} MB'
            }

            # 汇总状态
            if results['errors']:
                results['status'] = 'error'
            elif results['warnings']:
                results['status'] = 'warning'

            log_info('data_validator', 'Validation completed',
                     status=results['status'],
                     errors=len(results['errors']),
                     warnings=len(results['warnings']))

            return results

        except Exception as e:
            log_error('data_validator', f'Validation failed', error=str(e))
            results['status'] = 'error'
            results['errors'].append(str(e))
            return results

    def _read_data(self, data_path):
        """读取数据文件"""
        data_path = Path(data_path)

        if not data_path.exists():
            log_error('data_validator', f'Data file not found: {data_path}')
            return None

        if data_path.suffix == '.csv':
            df = pd.read_csv(data_path, encoding='utf-8-sig')
        elif data_path.suffix in ['.xlsx', '.xls']:
            df = pd.read_excel(data_path)
        elif data_path.suffix == '.dta':
            from pyreadstat import read_stata
            df, meta = read_stata(data_path)
        else:
            log_error('data_validator', f'Unsupported format: {data_path.suffix}')
            return None

        return df

    def _check_missing_values(self, df, results):
        """检查缺失值"""
        missing_stats = df.isnull().sum()

        for col, missing_count in missing_stats.items():
            if missing_count > 0:
                missing_rate = missing_count / len(df) * 100

                if missing_rate > 50:
                    results['errors'].append(
                        f'Column "{col}" has {missing_rate:.2f}% missing values ({missing_count}/{len(df)})'
                    )
                elif missing_rate > 10:
                    results['warnings'].append(
                        f'Column "{col}" has {missing_rate:.2f}% missing values ({missing_count}/{len(df)})'
                    )

    def _check_data_range(self, df, results, rules):
        """检查数据范围"""
        if not rules:
            return

        # 检查数值范围
        if 'numeric_ranges' in rules:
            for col, (min_val, max_val) in rules['numeric_ranges'].items():
                if col in df.columns and df[col].dtype in ['int64', 'float64']:
                    out_of_range = df[(df[col] < min_val) | (df[col] > max_val)]
                    if len(out_of_range) > 0:
                        results['warnings'].append(
                            f'Column "{col}" has {len(out_of_range)} values outside range [{min_val}, {max_val}]'
                        )

        # 检查年份范围
        if 'year_range' in rules and 'year' in df.columns:
            min_year, max_year = rules['year_range']
            out_of_range = df[(df['year'] < min_year) | (df['year'] > max_year)]
            if len(out_of_range) > 0:
                results['errors'].append(
                    f'Column "year" has {len(out_of_range)} values outside range [{min_year}, {max_year}]'
                )

    def _check_duplicates(self, df, results):
        """检查重复数据"""
        duplicate_rows = df.duplicated().sum()

        if duplicate_rows > 0:
            duplicate_rate = duplicate_rows / len(df) * 100

            if duplicate_rate > 1:
                results['errors'].append(
                    f'Found {duplicate_rows} duplicate rows ({duplicate_rate:.2f}%)'
                )
            else:
                results['warnings'].append(
                    f'Found {duplicate_rows} duplicate rows ({duplicate_rate:.2f}%)'
                )

    def _check_data_types(self, df, results):
        """检查数据类型"""
        # 检查是否有过多的object类型
        object_cols = df.select_dtypes(include=['object']).columns

        if len(object_cols) > len(df.columns) * 0.5:
            results['warnings'].append(
                f'More than 50% of columns are object type ({len(object_cols)}/{len(df.columns)})'
            )


def main():
    """命令行入口"""
    parser = argparse.ArgumentParser(description='DeepTrace Data Collector - Data Validator')
    parser.add_argument('--input', required=True, help='数据文件路径')
    parser.add_argument('--output', help='验证结果输出文件（JSON）')

    args = parser.parse_args()

    validator = DataValidator()

    try:
        # 执行验证
        results = validator.validate(args.input)

        # 输出结果
        import json

        if args.output:
            with open(args.output, 'w', encoding='utf-8') as f:
                json.dump(results, f, ensure_ascii=False, indent=2)
            print(f'{{"status": "success", "output": "{args.output}"}}')
        else:
            print(json.dumps(results, ensure_ascii=False, indent=2))

        # 根据验证结果返回退出码
        if results['status'] == 'error':
            sys.exit(1)

    except Exception as e:
        log_error('data_validator', f'Error: {str(e)}')
        print(f'{{"status": "error", "message": "{str(e)}"}}')
        sys.exit(1)


if __name__ == '__main__':
    main()
