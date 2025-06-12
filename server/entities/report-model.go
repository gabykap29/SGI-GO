package entities

import (
	"time"
)

type Report struct {
	ID           uint       `json:"id" gorm:"primaryKey"`
	DepartmentID uint       `json:"department_id"`
	Department   Department `json:"department" gorm:"foreignKey:DepartmentID"`
	LocalityID   uint       `json:"locality_id"`
	Locality     Locality   `json:"locality" gorm:"foreignKey:LocalityID"`
	Date         time.Time  `json:"date" gorm:"autoCreateTime"`
	TypeReportID uint       `json:"type_report_id"`
	TypeReport   TypeReport `json:"type_report" gorm:"foreignKey:TypeReportID"`
	Title        string     `json:"title" gorm:"not null"`
	Content      string     `json:"content" gorm:"not null"`
	Files        []File     `json:"files" gorm:"foreignKey:ReportID"`
	Description  string     `json:"description"`
	Persons      []Person   `json:"persons" gorm:"many2many:person_report;"`
}
