package departments

import (
	"errors"
	"log"

	"sgi-go/database"
	department "sgi-go/entities"
)

func GetDeparts() ([]department.Department, error) {
	var departments []department.Department
	results := database.DB.Find(&departments)
	if results.Error != nil {
		return nil, results.Error
	}
	return departments, nil
}

func CreateDepartments() error {
	var list_departments []string = []string{
		"Formosa",
		"Pilcomayo",
		"Pilagás",
		"Bermejo",
		"Pirané",
		"Laishi",
		"Patiño",
		"Ramon_Lista",
		"Matacos"}

	var count int64

	if err := database.DB.Model(&department.Department{}).Count(&count).Error; err != nil {
		return err
	}

	if count > 0 {
		log.Println("Los departamentos ya se encuentran cargados!")
		return nil
	}

	for _, name := range list_departments {
		depto := department.Department{Name: name}
		if err := database.DB.Create(&depto).Error; err != nil {
			return err
		}
	}
	return nil
}

func AddDepartment(department *department.Department) (*department.Department, error) {
	if department.Name == "" {
		return nil, errors.New("el campo nombre no puede ser vacío")
	}
	result := database.DB.Create(department)

	if result.Error != nil {
		return nil, result.Error
	}
	return department, nil
}

func UpdateDepartment(id string, depart *department.Department) (*department.Department, error) {
	if depart.Name == "" && id == "" {
		return nil, errors.New("campos requeridos inválidos")
	}
	result := database.DB.Model(&department.Department{}).Where("id").Updates(depart)
	if result.Error != nil {
		return nil, result.Error
	}
	return depart, nil
}

func DeleteDepartment(id string) (string, error) {
	if id == "" {
		return "Error", errors.New("campos requeridos inválidos")
	}
	result := database.DB.Model(&department.Department{}).Where("id").Delete(id)
	if result.Error != nil {
		return "Error al intentar eliminar!", result.Error
	}
	return "Departamento eliminado con éxito!", nil
}
