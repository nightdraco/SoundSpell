from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    level = Column(Integer, default=1)
    attempts = relationship("Attempt", back_populates="student")

class Attempt(Base):
    __tablename__ = "attempts"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    target_word = Column(String)
    spoken_word = Column(String)
    score = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    student = relationship("Student", back_populates="attempts")
    errors = relationship("ErrorLog", back_populates="attempt")

class ErrorLog(Base):
    __tablename__ = "error_logs"
    id = Column(Integer, primary_key=True, index=True)
    attempt_id = Column(Integer, ForeignKey("attempts.id"))
    error_type = Column(String)
    details = Column(String)
    
    attempt = relationship("Attempt", back_populates="errors")