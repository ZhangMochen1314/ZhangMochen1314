#!/usr/bin/env python3
"""
Sandbox Cleanup Script
----------------------
This script scans the sandbox temporary directories (threads data) and deletes 
files or directories that haven't been modified for a specified number of days 
(default is 7 days).

Usage:
    python cleanup_sandbox.py [--days 7]

Cron Job Setup Guide:
---------------------
To run this script automatically (e.g., every day at 3:00 AM), you can set up a Cron job.

1. Make the script executable:
   chmod +x /path/to/backend/scripts/cleanup_sandbox.py

2. Open your crontab editor:
   crontab -e

3. Add the following line to run it daily at 3:00 AM:
   0 3 * * * /usr/bin/python3 /path/to/backend/scripts/cleanup_sandbox.py --days 7 >> /var/log/deerflow_cleanup.log 2>&1

(Adjust `/usr/bin/python3` to the path of your Python executable or virtual environment,
and `/path/to/backend/scripts/...` to the actual absolute path of this script.)
"""

import os
import sys
import time
import shutil
import logging
import argparse
from pathlib import Path
from datetime import timedelta

# Configure logging
logging.basicConfig(
    level=logging.INFO, 
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

def get_base_dir() -> Path:
    """Resolve the DeerFlow base directory where sandbox data is stored."""
    script_dir = Path(__file__).resolve().parent
    backend_dir = script_dir.parent
    try:
        # Try to import Paths from deerflow.config.paths if available in the backend environment
        sys.path.insert(0, str(backend_dir / "packages" / "harness"))
        
        from deerflow.config.paths import Paths
        return Paths().base_dir
    except ImportError:
        # Fallback resolution identical to paths.py
        if env_home := os.getenv("DEER_FLOW_HOME"):
            return Path(env_home).resolve()
        # Default local base dir fallback
        return backend_dir / ".deer-flow"

def get_tree_latest_mtime(path: Path) -> float:
    """Get the latest modification time of a file or directory tree."""
    latest_time = path.stat().st_mtime
    if path.is_dir():
        for root, dirs, files in os.walk(path):
            for name in dirs + files:
                try:
                    item_path = Path(root) / name
                    item_mtime = item_path.stat().st_mtime
                    if item_mtime > latest_time:
                        latest_time = item_mtime
                except OSError:
                    # Ignore files that might have been deleted or have permission issues
                    pass
    return latest_time

def cleanup_sandbox(days: int):
    """
    Scan the sandbox threads directory and delete thread directories 
    whose latest modified time is older than `days` days.
    """
    base_dir = get_base_dir()
    threads_dir = base_dir / "threads"
    
    if not threads_dir.exists():
        logger.info(f"Threads directory {threads_dir} does not exist. Nothing to clean up.")
        return

    now = time.time()
    cutoff_time = now - timedelta(days=days).total_seconds()
    
    logger.info(f"Scanning {threads_dir} for items not modified in the last {days} days...")
    
    deleted_count = 0
    error_count = 0
    
    # Iterate over thread directories
    for thread_dir in threads_dir.iterdir():
        if not thread_dir.is_dir():
            continue
            
        try:
            latest_mtime = get_tree_latest_mtime(thread_dir)
            if latest_mtime < cutoff_time:
                logger.info(f"Deleting old sandbox thread directory: {thread_dir} (Last modified: {time.ctime(latest_mtime)})")
                shutil.rmtree(thread_dir)
                deleted_count += 1
            else:
                logger.debug(f"Keeping {thread_dir} (Last modified: {time.ctime(latest_mtime)})")
        except Exception as e:
            logger.error(f"Error checking or deleting {thread_dir}: {e}")
            error_count += 1
            
    logger.info(f"Cleanup finished. Deleted {deleted_count} thread directories. Errors: {error_count}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Cleanup DeerFlow sandbox temporary files.")
    parser.add_argument("--days", type=int, default=7, help="Delete items not modified in this many days.")
    args = parser.parse_args()
    
    cleanup_sandbox(days=args.days)
