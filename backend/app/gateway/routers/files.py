import logging
import uuid
import os
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete

from app.gateway.deps import get_current_user, get_db_session
from app.auth.models import User, File
from deerflow.sandbox.aliyun_fc.oss_manager import OSSManager

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/files",
    tags=["files"],
    dependencies=[Depends(get_current_user)]
)

class PresignedUrlRequest(BaseModel):
    filename: str
    content_type: str = "application/octet-stream"
    size: int = 0

class PresignedUrlResponse(BaseModel):
    upload_url: str
    oss_path: str
    file_id: int

class FileResponse(BaseModel):
    id: int
    filename: str
    oss_path: str
    size: int
    content_type: str
    created_at: str

def get_oss_manager() -> OSSManager:
    endpoint = os.getenv("ALIYUN_OSS_ENDPOINT")
    bucket_name = os.getenv("ALIYUN_OSS_BUCKET")
    access_key_id = os.getenv("ALIYUN_OSS_ACCESS_KEY_ID")
    access_key_secret = os.getenv("ALIYUN_OSS_ACCESS_KEY_SECRET")
    
    if not all([endpoint, bucket_name, access_key_id, access_key_secret]):
        raise HTTPException(status_code=500, detail="OSS configuration missing")
        
    return OSSManager(
        access_key_id=access_key_id,
        access_key_secret=access_key_secret,
        endpoint=endpoint,
        bucket_name=bucket_name
    )

@router.post("/presigned", response_model=PresignedUrlResponse)
async def generate_presigned_url(
    request: PresignedUrlRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    oss_manager = get_oss_manager()
        
    tenant_id = current_user.tenant_id or "default"
    unique_id = str(uuid.uuid4())
    oss_path = f"uploads/{tenant_id}/{current_user.id}/{unique_id}_{request.filename}"
    
    try:
        upload_url = oss_manager.generate_presigned_url(
            object_name=oss_path,
            method='PUT',
            expiration=3600
        )
    except Exception as e:
        logger.error(f"Failed to generate presigned URL: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate upload URL")
        
    # Create pending file record
    new_file = File(
        tenant_id=tenant_id,
        user_id=current_user.id,
        filename=request.filename,
        oss_path=oss_path,
        size=request.size,
        content_type=request.content_type
    )
    db.add(new_file)
    await db.commit()
    await db.refresh(new_file)
    
    return PresignedUrlResponse(
        upload_url=upload_url,
        oss_path=oss_path,
        file_id=new_file.id
    )

@router.post("/confirm/{file_id}", response_model=FileResponse)
async def confirm_file_upload(
    file_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    result = await db.execute(
        select(File).where(
            (File.id == file_id) & 
            (File.user_id == current_user.id)
        )
    )
    file_record = result.scalars().first()
    
    if not file_record:
        raise HTTPException(status_code=404, detail="File not found")
        
    # Optional: We could check OSS if the file actually exists
    # oss_manager = get_oss_manager()
    # file_data = oss_manager.get_object(file_record.oss_path)
    # if file_data is None: ...
    
    # Returning the file record as confirmed
    return FileResponse(
        id=file_record.id,
        filename=file_record.filename,
        oss_path=file_record.oss_path,
        size=file_record.size,
        content_type=file_record.content_type or "",
        created_at=file_record.created_at.isoformat() if file_record.created_at else ""
    )

@router.get("", response_model=List[FileResponse])
async def list_files(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    result = await db.execute(
        select(File).where(File.user_id == current_user.id)
    )
    files = result.scalars().all()
    
    return [
        FileResponse(
            id=f.id,
            filename=f.filename,
            oss_path=f.oss_path,
            size=f.size,
            content_type=f.content_type or "",
            created_at=f.created_at.isoformat() if f.created_at else ""
        )
        for f in files
    ]


@router.delete("/{file_id}")
async def delete_file(
    file_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session),
) -> dict:
    result = await db.execute(select(File).where((File.id == file_id) & (File.user_id == current_user.id)))
    file_record = result.scalars().first()
    if not file_record:
        raise HTTPException(status_code=404, detail="File not found")

    oss_manager = get_oss_manager()
    try:
        oss_manager.delete_object(file_record.oss_path)
    except Exception as e:
        logger.error(f"Failed to delete OSS object {file_record.oss_path}: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete file from storage")

    await db.execute(delete(File).where((File.id == file_id) & (File.user_id == current_user.id)))
    await db.commit()
    return {"success": True, "file_id": file_id}
