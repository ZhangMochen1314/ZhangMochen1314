import argparse
import yaml
import duckdb
import os
import json

def load_manifest():
    manifest_path = os.path.join(os.path.dirname(__file__), '..', 'references', 'data_manifest.yaml')
    with open(manifest_path, 'r', encoding='utf-8') as f:
        return yaml.safe_load(f)

def main():
    parser = argparse.ArgumentParser(description="DeepTrace Data Collector - Fast query using DuckDB")
    parser.add_argument("--dataset", required=True, help="ID of the dataset from manifest (e.g., firm_micro_data)")
    parser.add_argument("--select", help="Comma-separated list of columns to select (e.g., stkcd,year,roa). Defaults to all.")
    parser.add_argument("--where", help="SQL WHERE clause (e.g., 'year >= 2010 AND industry_code = ''C''')")
    parser.add_argument("--limit", type=int, help="Limit number of rows returned")
    parser.add_argument("--output", default="output.csv", help="Path to save the output file (.csv or .parquet)")
    args = parser.parse_args()

    manifest = load_manifest()
    if args.dataset not in manifest['datasets']:
        print(json.dumps({"error": f"Dataset '{args.dataset}' not found in manifest."}))
        return

    dataset_info = manifest['datasets'][args.dataset]
    data_path = dataset_info['path']
    
    # In a real environment, if data_path starts with s3://, DuckDB handles it natively 
    # as long as AWS credentials are set in the environment.
    # For local/mount testing, we check if the file exists:
    if not data_path.startswith("s3://") and not os.path.exists(data_path):
        # Create a mock parquet file for testing if it doesn't exist, to prevent failure in demo
        if not os.path.exists(os.path.dirname(data_path)):
            os.makedirs(os.path.dirname(data_path), exist_ok=True)
        # We will just print a warning and exit in production, but here we can mock it or just fail gracefully.
        print(json.dumps({"error": f"Data file '{data_path}' not found on disk. Please ensure the dataset is mounted or downloaded."}))
        return

    # Build SQL Query
    select_cols = args.select if args.select else "*"
    
    # DuckDB can query parquet directly: SELECT * FROM 'path/to/file.parquet'
    # If it's a CSV, DuckDB reads it similarly: SELECT * FROM read_csv_auto('path/to/file.csv')
    if data_path.endswith('.csv'):
        from_clause = f"read_csv_auto('{data_path}')"
    else:
        from_clause = f"'{data_path}'"

    query = f"SELECT {select_cols} FROM {from_clause}"
    
    if args.where:
        query += f" WHERE {args.where}"
    
    if args.limit:
        query += f" LIMIT {args.limit}"

    # Execute with DuckDB
    try:
        con = duckdb.connect(database=':memory:') # Use in-memory db
        
        # Determine output format
        if args.output.endswith('.parquet'):
            export_query = f"COPY ({query}) TO '{args.output}' (FORMAT PARQUET);"
        else:
            export_query = f"COPY ({query}) TO '{args.output}' (HEADER, DELIMITER ',');"
            
        con.execute(export_query)
        
        # Get stats for summary
        count_query = f"SELECT COUNT(*) as cnt FROM ({query})"
        row_count = con.execute(count_query).fetchone()[0]
        
        result = {
            "status": "success",
            "dataset": args.dataset,
            "rows_exported": row_count,
            "output_file": args.output,
            "query_executed": query
        }
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()
