from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# --- Client ---
class ClientBase(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    address: Optional[str] = None

class ClientCreate(ClientBase):
    pass

class Client(ClientBase):
    id: int
    created_at: datetime
    projects: List["Project"] = []

    class Config:
        orm_mode = True

# --- Project ---
class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: Optional[str] = "In Progress"
    deadline: Optional[datetime] = None
    hourly_rate: Optional[float] = None

class ProjectCreate(ProjectBase):
    owner_id: int

class Project(ProjectBase):
    id: int
    owner_id: int
    
    class Config:
        orm_mode = True

# --- Invoice ---
class InvoiceBase(BaseModel):
    amount: float
    status: Optional[str] = "Draft"
    issued_date: Optional[datetime] = None

class InvoiceCreate(InvoiceBase):
    project_id: int

class Invoice(InvoiceBase):
    id: int
    project_id: int
    project: Project

    class Config:
        orm_mode = True

# --- Time Entry ---
class TimeEntryBase(BaseModel):
    description: str
    start_time: datetime
    end_time: Optional[datetime] = None

class TimeEntryCreate(TimeEntryBase):
    project_id: int

class TimeEntryUpdate(BaseModel):
    description: Optional[str] = None
    end_time: Optional[datetime] = None

class TimeEntry(TimeEntryBase):
    id: int
    project_id: int

    class Config:
        orm_mode = True

# Update forward references
Client.update_forward_refs()
Project.update_forward_refs()
