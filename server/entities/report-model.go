package entities

import (
	"time"
)

// asdasdasdasd
type Report struct {
	ID           uint       `json:"id" gorm:"primaryKey"`
	DepartmentID uint       `json:"department_id" binding:"required"`
	Department   Department `json:"department" gorm:"foreignKey:DepartmentID"`
	LocalityID   uint       `json:"locality_id" binding:"required"`
	Locality     Locality   `json:"locality" gorm:"foreignKey:LocalityID"`
	Date         time.Time  `json:"date" gorm:"autoCreateTime" binding:"required"`
	TypeReportID uint       `json:"type_report_id" binding:"required"`
	TypeReport   TypeReport `json:"type_report" gorm:"foreignKey:TypeReportID"`
	Title        string     `json:"title" gorm:"not null" binding:"required"`
	Content      string     `json:"content" gorm:"not null" binding:"required"`
	Files        []File     `json:"files" gorm:"foreignKey:ReportID"`
	Description  string     `json:"description"`
	Persons      []Person   `json:"persons" gorm:"many2many:person_report;"`
	UserID       uint       `json:"user_id"`
	User         User       `json:"-" gorm:"foreignKey:UserID" binding:"-"`
}
