package entities

import (
	"time"
)

type Locality struct {
	ID           uint       `json:"id" gorm:"primaryKey"`
	Name         string     `json:"name" gorm:"not null"`
	CreatedAt    time.Time  `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt    time.Time  `json:"updated_at" gorm:"autoUpdateTime"`
	DepartmentID uint       `json:"department_id"`
	Department   Department `json:"department" gorm:"foreignKey:DepartmentID"`
}
