"""
DeepTrace Data Collector - 数据格式转换模块
支持CSV、DTA、XLSX、JSON等多种格式转换
"""

import argparse
import sys
import pandas as pd
from pathlib import Path
from logger import get_logger, log_info, log_error


class DataConverter:
    """数据格式转换器"""

    def __init__(self, log_module='data_converter'):
        """初始化数据转换器"""
        self.logger = get_logger(log_module)
        self.supported_formats = ['csv', 'dta', 'xlsx', 'json']

    def convert(self, input_path, output_path, target_format, encoding='utf-8'):
        """
        转换数据格式

        Args:
            input_path: 输入文件路径
            output_path: 输出文件路径
            target_format: 目标格式
            encoding: 输入文件编码

        Returns:
            bool: 转换是否成功
        """
        log_info('data_converter', f'Converting {input_path} to {target_format}')

        if target_format not in self.supported_formats:
            log_error('data_converter', f'Unsupported format: {target_format}')
            return False

        try:
            # 读取输入文件
            df = self._read_input(input_path, encoding)

            if df is None or df.empty:
                log_error('data_converter', 'Failed to read input file or file is empty')
                return False

            # 写入输出文件
            self._write_output(df, output_path, target_format)

            log_info('data_converter', f'Successfully converted to {output_path}',
                     rows=len(df), columns=len(df.columns))

            return True

        except Exception as e:
            log_error('data_converter', f'Conversion failed', error=str(e))
            return False

    def _read_input(self, input_path, encoding='utf-8'):
        """读取输入文件"""
        input_path = Path(input_path)

        if not input_path.exists():
            log_error('data_converter', f'Input file not found: {input_path}')
            return None

        # 根据扩展名读取
        if input_path.suffix == '.csv':
            df = pd.read_csv(input_path, encoding=encoding)
        elif input_path.suffix in ['.xlsx', '.xls']:
            df = pd.read_excel(input_path)
        elif input_path.suffix == '.dta':
            from pyreadstat import read_stata
            df, meta = read_stata(input_path)
        elif input_path.suffix == '.json':
            df = pd.read_json(input_path)
        else:
            log_error('data_converter', f'Unsupported input format: {input_path.suffix}')
            return None

        return df

    def _write_output(self, df, output_path, target_format):
        """写入输出文件"""
        output_path = Path(output_path)

        # 根据格式写入
        if target_format == 'csv':
            df.to_csv(output_path, index=False, encoding='utf-8-sig')
        elif target_format == 'dta':
            df.to_stata(output_path, write_index=False)
        elif target_format == 'xlsx':
            df.to_excel(output_path, index=False)
        elif target_format == 'json':
            df.to_json(output_path, orient='records', force_ascii=False)

    def batch_convert(self, input_dir, output_dir, target_format, encoding='utf-8'):
        """
        批量转换目录中的所有文件

        Args:
            input_dir: 输入目录
            output_dir: 输出目录
            target_format: 目标格式
            encoding: 输入文件编码

        Returns:
            dict: 转换结果统计
        """
        input_dir = Path(input_dir)
        output_dir = Path(output_dir)
        output_dir.mkdir(parents=True, exist_ok=True)

        results = {
            'total': 0,
            'success': 0,
            'failed': 0,
            'errors': []
        }

        # 遍历输入目录
        for input_file in input_dir.iterdir():
            if not input_file.is_file():
                continue

            results['total'] += 1

            # 构造输出文件路径
            output_file = output_dir / f'{input_file.stem}.{target_format}'

            # 执行转换
            success = self.convert(input_file, output_file, target_format, encoding)

            if success:
                results['success'] += 1
            else:
                results['failed'] += 1
                results['errors'].append({
                    'input': str(input_file),
                    'output': str(output_file)
                })

        return results


def main():
    """命令行入口"""
    parser = argparse.ArgumentParser(description='DeepTrace Data Collector - Data Converter')
    parser.add_argument('--input', help='输入文件路径')
    parser.add_argument('--output', help='输出文件路径')
    parser.add_argument('--format', required=True, choices=['csv', 'dta', 'xlsx', 'json'],
                        help='目标格式')
    parser.add_argument('--encoding', default='utf-8', help='输入文件编码')
    parser.add_argument('--input-dir', help='批量转换：输入目录')
    parser.add_argument('--output-dir', help='批量转换：输出目录')

    args = parser.parse_args()

    converter = DataConverter()

    try:
        if args.input_dir and args.output_dir:
            # 批量转换
            results = converter.batch_convert(args.input_dir, args.output_dir, args.format, args.encoding)
            print('{"status": "success", "results": ' + str(results).replace("'", '"') + '}')
        elif args.input and args.output:
            # 单文件转换
            success = converter.convert(args.input, args.output, args.format, args.encoding)

            if success:
                print('{"status": "success", "message": "Conversion completed"}')
            else:
                print('{"status": "error", "message": "Conversion failed"}')
                sys.exit(1)
        else:
            log_error('data_converter', 'Must specify either --input/--output or --input-dir/--output-dir')
            print('{"status": "error", "message": "Invalid arguments"}')
            sys.exit(1)

    except Exception as e:
        log_error('data_converter', f'Error: {str(e)}')
        print(f'{{"status": "error", "message": "{str(e)}"}}')
        sys.exit(1)


if __name__ == '__main__':
    main()
