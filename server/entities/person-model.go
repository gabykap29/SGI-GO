package entities

type Person struct {
	ID          uint     `json:"id" gorm:"primaryKey"`
	Name        string   `json:"name" gorm:"not null"`
	LastName    string   `json:"last_name" gorm:"not null"`
	Dni         string   `json:"dni" gorm:"not null"`
	Address     string   `json:"address" gorm:"not null"`
	Locality    string   `json:"locality" gorm:"not null"`
	Province    string   `json:"province" gorm:"not null"`
	Description string   `json:"description"`
	Report      []Report `json:"report" gorm:"many2many:person_report;"`
}
