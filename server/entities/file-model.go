package entities

type File struct {
	ID       uint   `json:"id" gorm:"primaryKey"`
	Name     string `json:"name" gorm:"not null"`
	Path     string `json:"path" gorm:"not null"`
	Type     string `json:"type" gorm:"not null"`
	ReportID uint   `json:"report_id"`
}
