package persons

import (
	"errors"
	"sgi-go/database"
	"sgi-go/entities"

	"gorm.io/gorm"
)

func AddPerson(person *entities.Person) (*entities.Person, error) {
	if person.Name == "" || person.LastName == "" || person.Dni == "" || person.Address == "" || person.Locality == "" || person.Province == "" {
		return nil, errors.New("El nombre, apellido, dni, dirección, localidad y provincia son obligatorios")
	}
	result := database.DB.Create(&person)

	if result.Error != nil {
		return nil, result.Error
	}
	return person, nil
}
func EditPerson(id string, person *entities.Person) (*entities.Person, error) {
	if person.Name == "" || person.LastName == "" || person.Dni == "" || person.Address == "" || person.Locality == "" || person.Province == "" {
		return nil, errors.New("El nombre, apellido, dni, dirección, localidad y provincia son obligatorios")
	}

	result := database.DB.Model(&entities.Person{}).Where("id=?", id).Updates(&person)
	if result.Error != nil {
		return nil, result.Error
	}
	return person, nil
}
func GetPerson() ([]entities.Person, error) {
	var persons []entities.Person
	result := database.DB.Find(&persons)
	if result.Error != nil {
		return nil, result.Error
	}
	return persons, nil
}

func GetPersonById(id string) (*entities.Person, error) {
	var person entities.Person
	result := database.DB.Find(&person, id)
	if result.Error != nil {
		return nil, result.Error
	}
	return &person, nil
}
func DeletePerson(id string) error {
	result := database.DB.Delete(&entities.Person{}, id)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

// GetReportsByPersonId obtiene todos los reportes vinculados a una persona
func GetReportsByPersonId(personId string) ([]entities.Report, error) {
	var reports []entities.Report
	
	// Buscar reportes donde la persona esté vinculada a través de la tabla intermedia
	result := database.DB.
		Preload("Department").
		Preload("Locality").
		Preload("TypeReport").
		Preload("User", func(db *gorm.DB) *gorm.DB {
			return db.Select("id", "username", "name", "last_name")
		}).
		Joins("JOIN person_report ON person_report.report_id = reports.id").
		Where("person_report.person_id = ?", personId).
		Find(&reports)
	
	if result.Error != nil {
		return nil, result.Error
	}
	
	return reports, nil
}
