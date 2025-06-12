package locality

import (
	"errors"
	"log"
	"sgi-go/database"
	"sgi-go/entities"
	"sgi-go/locality/utils"
)

func GetLocalities() ([]entities.Locality, error) {
	var localities []entities.Locality

	result := database.DB.Preload("Department").Find(&localities)
	if result.Error != nil {
		return nil, result.Error
	}
	return localities, nil
}

func CreateLocality() error {
	var count int64

	if err := database.DB.Model(&entities.Locality{}).Count(&count).Error; err != nil {
		return err
	}
	if count > 0 {
		log.Println("Las localidades ya se encuentran cargadas y vinculadas!")
		return nil
	}

	for i := 0; i < len(utils.LocalitiesList); i++ {
		newLocality := &entities.Locality{Name: utils.LocalitiesList[i], DepartmentID: utils.ListDepartmentsID[i]}
		if err := database.DB.Create(&newLocality).Error; err != nil {
			return err
		}
	}
	log.Println("Localidades cargadas y vinculadas!")
	return nil
}

func AddLocality(local *entities.Locality) (*entities.Locality, error) {
	if local.Name == "" {
		return nil, errors.New("campos requeridos inválidos")
	}
	depart := database.DB.First(&local.DepartmentID)
	if depart.Error != nil {
		return nil, depart.Error
	}
	result := database.DB.Create(local)
	if result.Error != nil {
		return nil, result.Error
	}
	return local, nil
}

func DeleteLocality(id string) (*entities.Locality, error) {
	if id == "" {
		return nil, errors.New("campos requeridos invalidos")
	}
	result := database.DB.Model(&entities.Locality{}).Where("id").Delete(id)
	if result.Error != nil {
		return nil, result.Error
	}

	return nil, nil
}
