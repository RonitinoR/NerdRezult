from datetime import datetime, timezone
from typing import List, Optional
from pydantic import BaseModel, HttpUrl, field_validator, Field, ValidationInfo
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload
from sqlalchemy import select
from app.db.models import Projects, User
from app.db.database import get_db
from app.core.security import get_current_user


router = APIRouter(prefix="/projects", tags=["projects"])

class ProjectBase(BaseModel):
    """Base model for project creation and updates"""
    projectName: str = Field(min_length=3, max_length=100)
    clientName: str = Field(min_length=3, max_length=100)
    details: str = Field(min_length=10, max_length=2000)
    skills: List[str] = Field(min_items=1, max_items=20)
    paymentType: str = Field(..., pattern="^(project|hourly)$")  # Changed from hour to hourly
    projectStatus: str = Field(..., pattern="^(featured|urgent)$")
    githubLink: Optional[HttpUrl] = None
    startDate: Optional[str] = None  # Format: YYYY-MM-DD
    endDate: Optional[str] = None    # Format: YYYY-MM-DD
    payPerHour: Optional[float] = Field(None, ge=1)
    payPerProject: Optional[float] = Field(None, ge=100)
    duration: Optional[int] = Field(None, ge=1, le=365)

    @field_validator('payPerHour', 'payPerProject')
    @classmethod
    def validate_payment(cls, v, info: ValidationInfo):
        payment_type = info.data.get('paymentType')
        if payment_type == 'hourly' and info.field_name == 'payPerHour' and v is None:
            raise ValueError("Hourly rate is required for hourly payments")
        elif payment_type == 'project' and info.field_name == 'payPerProject' and v is None:
            raise ValueError("Fixed price is required for project payments")
        return v

    @field_validator('startDate', 'endDate')
    @classmethod
    def validate_date_format(cls, v):
        if v:
            try:
                datetime.strptime(v, "%Y-%m-%d")
            except ValueError:
                raise ValueError("Date must be in YYYY-MM-DD format")
        return v

class ProjectResponse(ProjectBase):
    """Response model that includes additional fields from the database"""
    project_id: int
    client_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class ProjectWithUserResponse(BaseModel):
    """Response model for dashboard view with user details"""
    project_id: int
    projectName: str
    clientName: str
    details: str
    skills: List[str]
    paymentType: str
    client_name: str
    client_email: str
    client_profile_pic: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

async def get_project_or_404(
        project_id: int,
        db: AsyncSession,
        user_id: int = None
) -> Projects:
    """Utility function to get project by ID with optional user validation"""
    query = select(Projects).where(Projects.project_id == project_id)
    result = await db.execute(query)
    project = result.scalar_one_or_none()

    if not project:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    if user_id and project.client_id != user_id:
        raise HTTPException(
            status_code = status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this project"
        )
    return project

@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    project: ProjectBase,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new project"""
    try:
        # First, validate the dates if they exist
        start_date = None
        end_date = None
        
        if project.startDate:
            try:
                start_date = datetime.strptime(project.startDate, "%Y-%m-%d")
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid start date format. Use YYYY-MM-DD"
                )
        
        if project.endDate:
            try:
                end_date = datetime.strptime(project.endDate, "%Y-%m-%d")
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid end date format. Use YYYY-MM-DD"
                )

        # Create new project with validated data
        new_project = Projects(
            client_id=current_user.id,
            project_name=project.projectName,
            client_name=project.clientName,
            details=project.details,
            skill_required=project.skills,
            payment_type=project.paymentType,  # Changed from Payment_Type
            project_status=project.projectStatus,
            github_link=str(project.githubLink) if project.githubLink else None,  # Changed from Github_link
            start_date=start_date,
            end_date=end_date,
            pay_per_hour=float(project.payPerHour) if project.payPerHour else None,
            pay_per_project=float(project.payPerProject) if project.payPerProject else None,
            duration=int(project.duration) if project.duration else None,
            created_at=datetime.now(timezone.utc)
        )

        db.add(new_project)
        await db.commit()
        await db.refresh(new_project)

        return ProjectResponse(
            project_id=new_project.project_id,
            client_id=new_project.client_id,
            projectName=new_project.project_name,
            clientName=new_project.client_name,
            details=new_project.details,
            skills=new_project.skill_required,
            paymentType=new_project.payment_type,  # Changed from Payment_Type
            projectStatus=new_project.project_status,
            githubLink=new_project.github_link,  # Changed from Github_link
            startDate=new_project.start_date.strftime("%Y-%m-%d") if new_project.start_date else None,
            endDate=new_project.end_date.strftime("%Y-%m-%d") if new_project.end_date else None,
            payPerHour=float(new_project.pay_per_hour) if new_project.pay_per_hour else None,
            payPerProject=float(new_project.pay_per_project) if new_project.pay_per_project else None,
            duration=new_project.duration,
            created_at=new_project.created_at
        )

    except Exception as e:
        await db.rollback()
        print(f"Error creating project: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create project: {str(e)}"
        )
    
@router.get("/dashboard", response_model=List[ProjectWithUserResponse])
async def get_dashboard_projects(
    skip: int = 0,
    limit: int = 10,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get projects with user details for dashboard"""
    try:
        query = (
            select(Projects)
            .join(User, Projects.client_id == User.id)
            .order_by(Projects.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        
        result = await db.execute(query)
        projects = result.scalars().all()
        
        response_data = []
        for project in projects:
            response_data.append({
                "project_id": project.project_id,
                "projectName": project.project_name,
                "clientName": project.client_name,
                "details": project.details,
                "skills": project.skill_required,
                "paymentType": project.payment_type,  # Changed from Payment_Type
                "client_name": project.client.name if project.client else None,
                "client_email": project.client.email if project.client else None,
                "client_profile_pic": project.client.profile_pic_url if project.client else None,
                "created_at": project.created_at
            })
        
        return response_data

    except Exception as e:
        print(f"Error in get_dashboard_projects: {str(e)}")  # Add this for debugging
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/", response_model=List[ProjectResponse])
async def get_all_projects(
    skip: int = 0,
    limit: int = 10,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all available projects, including client's own projects"""
    try:
        query = (
            select(Projects)
            .options(joinedload(Projects.client))
            .order_by(Projects.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        
        result = await db.execute(query)
        projects = result.unique().scalars().all()
        
        return projects

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a project by ID"""
    return await get_project_or_404(project_id, db)

@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: int,
    project_update: ProjectBase,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update the project based on ID"""
    project = await get_project_or_404(project_id, db, current_user.id)

    update_data = project_update.model_dump(exclude_unset=True)

    # Handle the date conversions
    if 'startDate' in update_data:
        update_data['start_date'] = datetime.strptime(update_data.pop('startDate'), "%m/%d/%Y")
    if 'endDate' in update_data:
        update_data['end_date'] = datetime.strptime(update_data.pop('endDate'), "%m/%d/%Y")
    
    # mapping frontend field names to databse field names
    field_mapping = {
        'projectName': 'project_name',
        'clientName': 'client_name',
        'paymentType': 'payment_type',  # Changed from Payment_Type
        'projectStatus': 'project_status',
        'githubLink': 'github_link',  # Changed from Github_link
        'payPerHour': 'pay_per_hour',
        'payPerProject': 'pay_per_project',
    }

    for key, val in update_data.items():
        db_field = field_mapping.get(key, key)
        setattr(project, db_field, val)
    try:
        await db.commit()
        await db.refresh(project)
        return project
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a project based on its ID"""
    project = await get_project_or_404(project_id, db, current_user.id)
    
    try:
        await db.delete(project)
        await db.commit()
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/", response_model=List[ProjectResponse])
async def get_all_projects(
    skip: int = 0,
    limit: int = 10,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all available projects, including client's own projects"""
    try:
        query = (
            select(Projects)
            .options(joinedload(Projects.client))
            .order_by(Projects.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        
        result = await db.execute(query)
        projects = result.unique().scalars().all()
        
        return projects

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
