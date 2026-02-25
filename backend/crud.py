from sqlalchemy.orm import Session
import models, schemas
from fastapi import HTTPException
from datetime import datetime

# --- Client ---
def get_client(db: Session, client_id: int):
    return db.query(models.Client).filter(models.Client.id == client_id).first()

def get_client_by_email(db: Session, email: str):
    return db.query(models.Client).filter(models.Client.email == email).first()

def get_clients(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Client).offset(skip).limit(limit).all()

def create_client(db: Session, client: schemas.ClientCreate):
    db_client = models.Client(email=client.email, name=client.name, phone=client.phone, address=client.address)
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client

# --- Project ---
def get_project(db: Session, project_id: int):
    return db.query(models.Project).filter(models.Project.id == project_id).first()

def get_projects(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Project).offset(skip).limit(limit).all()

def create_project(db: Session, project: schemas.ProjectCreate):
    # Verify owner (client) exists
    client = get_client(db, project.owner_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    db_project = models.Project(**project.dict())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

# --- Invoice ---
def get_invoices(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Invoice).offset(skip).limit(limit).all()

def create_invoice(db: Session, invoice: schemas.InvoiceCreate):
    # Verify project exists
    project = get_project(db, invoice.project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    db_invoice = models.Invoice(**invoice.dict())
    if db_invoice.issued_date is None:
        db_invoice.issued_date = datetime.now()
        
    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)
    return db_invoice
