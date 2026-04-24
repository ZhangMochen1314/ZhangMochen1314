import os
import asyncio
import zipfile
import pandas as pd
import pytest
from pathlib import Path
from shapely.geometry import Point

import pyreadstat
import geopandas as gpd

from deerflow.utils.file_conversion import (
    extract_and_flatten_zip,
    parse_statistical_data,
    parse_shapefile,
    convert_file_to_markdown,
)

@pytest.fixture
def temp_dir(tmp_path):
    return tmp_path

def test_extract_and_flatten_zip(temp_dir):
    zip_path = temp_dir / "test.zip"
    with zipfile.ZipFile(zip_path, "w") as zf:
        zf.writestr("folder1/file1.txt", "content1")
        zf.writestr("folder2/subfolder/file2.txt", "content2")
        # add a directory entry
        zf.writestr("folder3/", "")

    out_dir = temp_dir / "out"
    out_dir.mkdir()
    
    extracted = extract_and_flatten_zip(zip_path, out_dir)
    assert len(extracted) == 2
    assert (out_dir / "file1.txt").exists()
    assert (out_dir / "file2.txt").exists()
    assert not (out_dir / "folder3").exists()

def test_convert_zip(temp_dir):
    zip_path = temp_dir / "test_convert.zip"
    with zipfile.ZipFile(zip_path, "w") as zf:
        zf.writestr("fileA.txt", "A")
    
    md_path = asyncio.run(convert_file_to_markdown(zip_path))
    assert md_path is not None
    assert md_path.exists()
    content = md_path.read_text()
    assert "ZIP Archive: test_convert.zip" in content
    assert "fileA.txt" in content

def test_parse_statistical_data_sav(temp_dir):
    df = pd.DataFrame({"A": [1, 2], "B": [3, 4]})
    sav_path = temp_dir / "test.sav"
    pyreadstat.write_sav(df, str(sav_path), column_labels={"A": "Label A"})
    
    md_content = parse_statistical_data(sav_path)
    assert "Statistical Data: test.sav" in md_content
    assert "**Rows:** 2 | **Columns:** 2" in md_content
    assert "- **A**: Label A" in md_content

def test_parse_shapefile(temp_dir):
    gdf = gpd.GeoDataFrame({"col1": [1, 2]}, geometry=[Point(0, 0), Point(1, 1)])
    shp_path = temp_dir / "test.shp"
    gdf.to_file(str(shp_path))
    
    md_content = parse_shapefile(shp_path)
    assert "Shapefile: test.shp" in md_content
    assert "**Rows (Features):** 2 | **Columns:** 2" in md_content
    assert "- **Min X (Longitude):** 0.0" in md_content
    assert "- **Max X (Longitude):** 1.0" in md_content
    assert "col1" in md_content
    assert "geometry" in md_content

def test_convert_file_to_markdown_sav(temp_dir):
    df = pd.DataFrame({"A": [1, 2]})
    sav_path = temp_dir / "test_route.sav"
    pyreadstat.write_sav(df, str(sav_path))
    
    md_path = asyncio.run(convert_file_to_markdown(sav_path))
    assert md_path is not None
    content = md_path.read_text()
    assert "test_route.sav" in content
