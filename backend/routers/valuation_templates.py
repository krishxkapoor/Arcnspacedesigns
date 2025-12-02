from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from datetime import datetime
import os
import shutil
from .. import models, schemas, database

try:
    from pptx import Presentation
    from pptx.util import Pt
    PPTX_AVAILABLE = True
except ImportError:
    PPTX_AVAILABLE = False
    Presentation = None
    Pt = None

router = APIRouter(
    prefix="/valuation-templates",
    tags=["valuation-templates"],
)

TEMPLATES_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "templates")
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "generated_valuations")

# Ensure output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

@router.post("/generate/{template_type}")
async def generate_valuation(
    template_type: str,
    valuation_id: str,
    db: AsyncSession = Depends(database.get_db)
):
    """
    Generate a filled PowerPoint valuation document
    template_type: 'agriculture', 'commercial', or 'residential'
    """
    if not PPTX_AVAILABLE:
        raise HTTPException(status_code=500, detail="PowerPoint library not available. Please install python-pptx.")
    
    # Validate template type
    template_files = {
        "agriculture": "Agriculture.pptx",
        "commercial": "Commercial.pptx",
        "residential": "Residential.pptx"
    }
    
    if template_type.lower() not in template_files:
        raise HTTPException(status_code=400, detail="Invalid template type")
    
    # Get valuation data from database
    result = await db.execute(
        select(models.Valuation).where(models.Valuation.id == valuation_id)
    )
    valuation = result.scalar_one_or_none()
    
    if not valuation:
        raise HTTPException(status_code=404, detail="Valuation not found")
    
    # Load template
    template_path = os.path.join(TEMPLATES_DIR, template_files[template_type.lower()])
    if not os.path.exists(template_path):
        raise HTTPException(status_code=404, detail="Template file not found")
    
    # Create a copy of the template
    prs = Presentation(template_path)
    
    # Fill in the data (this is a basic implementation - you'll need to customize based on your template structure)
    # For now, we'll just save the template as-is with a unique name
    
    output_filename = f"{template_type}_{valuation.client_name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pptx"
    output_path = os.path.join(OUTPUT_DIR, output_filename)
    
    prs.save(output_path)
    
    return {
        "message": "Valuation generated successfully",
        "filename": output_filename,
        "download_url": f"/valuation-templates/download/{output_filename}"
    }

@router.get("/download/{filename}")
async def download_valuation(filename: str):
    """Download a generated valuation file"""
    file_path = os.path.join(OUTPUT_DIR, filename)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(
        path=file_path,
        filename=filename,
        media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation"
    )

@router.get("/list-templates")
async def list_templates():
    """List available templates"""
    templates = []
    if os.path.exists(TEMPLATES_DIR):
        for file in os.listdir(TEMPLATES_DIR):
            if file.endswith('.pptx'):
                templates.append({
                    "name": file,
                    "type": file.replace('.pptx', '').lower()
                })
    return templates
