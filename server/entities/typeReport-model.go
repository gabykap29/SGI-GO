package entities

type TypeReport struct {
	ID     uint     `json:"id" gorm:"primaryKey"`
	Name   string   `json:"name" gorm:"not null"`
	Report []Report `json:"report" gorm:"foreignKey:TypeReportID"`
}
