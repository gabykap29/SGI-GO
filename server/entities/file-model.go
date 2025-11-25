package entities

type File struct {
	ID          uint   `json:"id" gorm:"primaryKey"`
	Name        string `json:"name" gorm:"not null"`
	Path        string `json:"path" gorm:"not null"`
	Filename    string `json:"filename"`
	Type        string `json:"type" gorm:"not null"`
	ReportID    *uint  `json:"report_id" gorm:"index"`
	PersonID    *uint  `json:"person_id" gorm:"index"`
	Description string `json:"description"`
}
