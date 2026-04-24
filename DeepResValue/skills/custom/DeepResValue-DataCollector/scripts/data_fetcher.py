"""
DeepTrace Data Collector - 数据获取模块
支持从多种数据源获取标准化数据
"""

import argparse
import sys
import pandas as pd
from pathlib import Path
from logger import get_logger, log_info, log_error, log_warning


class DataFetcher:
    """数据获取器"""

    def __init__(self, log_module='data_fetcher'):
        """初始化数据获取器"""
        self.logger = get_logger(log_module)
        self.data_sources = {
            'local': self._fetch_local,
            'hengsheng': self._fetch_hengsheng,
            'csmar': self._fetch_csmar,
            'wind': self._fetch_wind,
            'stats': self._fetch_statistics
        }

    def fetch(self, source, data_type, **kwargs):
        """
        获取数据

        Args:
            source: 数据源 ('local', 'hengsheng', 'csmar', 'wind', 'stats')
            data_type: 数据类型 ('financial', 'city_panel', 'province_panel', etc.)
            **kwargs: 数据获取参数

        Returns:
            DataFrame: 获取的数据
        """
        log_info('data_fetcher', f'Fetching data from {source}', type=data_type)

        if source not in self.data_sources:
            log_error('data_fetcher', f'Unsupported data source: {source}')
            raise ValueError(f'Unsupported data source: {source}')

        try:
            data = self.data_sources[source](data_type, **kwargs)
            log_info('data_fetcher', f'Successfully fetched data', rows=len(data), columns=len(data.columns))
            return data
        except Exception as e:
            log_error('data_fetcher', f'Failed to fetch data', error=str(e))
            raise

    def _fetch_local(self, data_type, **kwargs):
        """从本地数据集获取数据"""
        log_info('data_fetcher', f'Fetching local data: {data_type}')

        # 定义本地数据路径
        data_paths = {
            'city_panel': 'assets/city_panel/city_panel_processed.csv',
            'province_panel': 'assets/province_panel/province_panel_processed.csv',
            'county_panel': 'assets/county_panel/县域面板数据_2000-2023.xlsx',
            'firm_location': 'assets/firm_location/行业与所属省份城市.dta',
            'firm_controls': 'assets/firm_controls/firm_control_variables.csv'
        }

        if data_type not in data_paths:
            log_error('data_fetcher', f'Unknown local data type: {data_type}')
            raise ValueError(f'Unknown local data type: {data_type}')

        data_path = Path(data_paths[data_type])

        if not data_path.exists():
            log_error('data_fetcher', f'Data file not found: {data_path}')
            raise FileNotFoundError(f'Data file not found: {data_path}')

        # 读取数据
        if data_path.suffix == '.csv':
            df = pd.read_csv(data_path, encoding='utf-8-sig')
        elif data_path.suffix in ['.xlsx', '.xls']:
            df = pd.read_excel(data_path)
        elif data_path.suffix == '.dta':
            from pyreadstat import read_stata
            df, meta = read_stata(data_path)
        else:
            log_error('data_fetcher', f'Unsupported file format: {data_path.suffix}')
            raise ValueError(f'Unsupported file format: {data_path.suffix}')

        # 精准提取：只保留用户需要的变量和样本
        df = self._filter_data(df, **kwargs)

        return df

    def _fetch_hengsheng(self, data_type, **kwargs):
        """从恒生API获取数据"""
        log_info('data_fetcher', f'Fetching data from Hengsheng API: {data_type}')
        log_warning('data_fetcher', 'Hengsheng API integration requires license configuration')

        # TODO: 实现恒生API调用
        # 这里需要配置许可证和API调用逻辑

        # 占位实现
        df = pd.DataFrame()
        return df

    def _fetch_csmar(self, data_type, **kwargs):
        """从CSMAR获取数据"""
        log_info('data_fetcher', f'Fetching data from CSMAR: {data_type}')
        log_warning('data_fetcher', 'CSMAR integration requires configuration')

        # TODO: 实现CSMAR调用
        df = pd.DataFrame()
        return df

    def _fetch_wind(self, data_type, **kwargs):
        """从Wind获取数据"""
        log_info('data_fetcher', f'Fetching data from Wind: {data_type}')
        log_warning('data_fetcher', 'Wind integration requires configuration')

        # TODO: 实现Wind调用
        df = pd.DataFrame()
        return df

    def _fetch_statistics(self, data_type, **kwargs):
        """从国家统计局获取数据"""
        log_info('data_fetcher', f'Fetching data from Statistics Bureau: {data_type}')

        # TODO: 实现统计局数据获取
        df = pd.DataFrame()
        return df

    def _filter_data(self, df, **kwargs):
        """
        精准提取数据：只保留用户需要的变量和样本

        Args:
            df: 原始数据
            **kwargs: 过滤条件（vars, cities, years, provinces, etc.）

        Returns:
            DataFrame: 过滤后的数据
        """
        # 变量过滤
        if 'vars' in kwargs and kwargs['vars']:
            vars_list = kwargs['vars'].split(',')
            available_vars = [v for v in vars_list if v in df.columns]
            missing_vars = [v for v in vars_list if v not in df.columns]

            if missing_vars:
                log_warning('data_fetcher', 'Some variables not found', missing=', '.join(missing_vars))

            if available_vars:
                df = df[available_vars]

        # 城市过滤
        if 'cities' in kwargs and kwargs['cities']:
            cities_list = kwargs['cities'].split(',')
            if 'city' in df.columns:
                df = df[df['city'].isin(cities_list)]

        # 省份过滤
        if 'provinces' in kwargs and kwargs['provinces']:
            provinces_list = kwargs['provinces'].split(',')
            if 'province' in df.columns:
                df = df[df['province'].isin(provinces_list)]

        # 年份过滤
        if 'years' in kwargs and kwargs['years']:
            year_range = kwargs['years'].split('-')
            if len(year_range) == 2:
                start_year = int(year_range[0])
                end_year = int(year_range[1])
                if 'year' in df.columns:
                    df = df[df['year'].between(start_year, end_year)]

        # 股票代码过滤
        if 'stock_code' in kwargs and kwargs['stock_code']:
            if 'stock_code' in df.columns:
                df = df[df['stock_code'] == kwargs['stock_code']]

        log_info('data_fetcher', 'Data filtered', rows=len(df), columns=len(df.columns))

        return df


def main():
    """命令行入口"""
    parser = argparse.ArgumentParser(description='DeepTrace Data Collector - Data Fetcher')
    parser.add_argument('--source', required=True, choices=['local', 'hengsheng', 'csmar', 'wind', 'stats'],
                        help='数据源')
    parser.add_argument('--type', required=True,
                        help='数据类型 (city_panel, province_panel, financial, etc.)')
    parser.add_argument('--vars', help='变量列表（逗号分隔）')
    parser.add_argument('--cities', help='城市列表（逗号分隔）')
    parser.add_argument('--provinces', help='省份列表（逗号分隔）')
    parser.add_argument('--years', help='年份范围（如 2010-2020）')
    parser.add_argument('--stock-code', help='股票代码')
    parser.add_argument('--output', help='输出文件路径')
    parser.add_argument('--format', default='csv', choices=['csv', 'dta', 'xlsx'],
                        help='输出格式')

    args = parser.parse_args()

    try:
        # 初始化数据获取器
        fetcher = DataFetcher()

        # 获取数据
        df = fetcher.fetch(
            source=args.source,
            data_type=args.type,
            vars=args.vars,
            cities=args.cities,
            provinces=args.provinces,
            years=args.years,
            stock_code=args.stock_code
        )

        # 输出结果
        if df.empty:
            log_warning('data_fetcher', 'No data fetched')
            print('{"status": "warning", "message": "No data fetched", "rows": 0}')
        else:
            if args.output:
                # 保存到文件
                if args.format == 'csv':
                    df.to_csv(args.output, index=False, encoding='utf-8-sig')
                elif args.format == 'dta':
                    df.to_stata(args.output, write_index=False)
                elif args.format == 'xlsx':
                    df.to_excel(args.output, index=False)

                log_info('data_fetcher', f'Data saved to {args.output}')
                print(f'{{"status": "success", "rows": {len(df)}, "columns": {len(df.columns)}, "output": "{args.output}"}}')
            else:
                # 输出到标准输出
                print(df.to_json(orient='records', force_ascii=False))

    except Exception as e:
        log_error('data_fetcher', f'Error: {str(e)}')
        print(f'{{"status": "error", "message": "{str(e)}"}}')
        sys.exit(1)


if __name__ == '__main__':
    main()
