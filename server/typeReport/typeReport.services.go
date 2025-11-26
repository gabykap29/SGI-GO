package typereport

import (
	"errors"
	"log"
	"sgi-go/database"
	"sgi-go/entities"
)

func GetTypeReports() ([]entities.TypeReport, error) {
	var typeReports []entities.TypeReport

	result := database.DB.Find(&typeReports)
	if result.Error != nil {
		return nil, result.Error
	}
	return typeReports, nil
}

func CreateTypeReportDefault() error {
	var list []string = []string{
		"Politica",
		"Institucional",
		"Educación",
		"Religioso",
		"Proselitismo",
		"Salud",
		"Seguridad",
		"Eventos Climáticos",
		"Hídricos",
		"Económicos",
		"Ambientales",
		"Sociales",
		"Turismo",
		"Deportivos",
		"OTROS",
	}
	var count int64

	if err := database.DB.Model(&entities.TypeReport{}).Count(&count).Error; err != nil {
		return err
	}
	if count > 0 {
		log.Println("Los tipos de reportes ya se encuentran cargados!")
		return nil // EVITAR DUPLICADOS
	} else {
		for _, element := range list {
			typeReport := entities.TypeReport{Name: element}
			if err := database.DB.Create(&typeReport).Error; err != nil {
				return err
			}
		}
		log.Println("Los tipos de reportes se cargaron correctamente!")
		return nil
	}
}
func AddTypeReport(typeReport *entities.TypeReport) (*entities.TypeReport, error) {
	if typeReport.Name == "" {
		return nil, errors.New("el campo nombre no puede ser vacío")
	}
	result := database.DB.Create(typeReport)

	if result.Error != nil {
		return nil, result.Error
	}
	return typeReport, nil
}
func DeleteTypeReport(id string) (string, error) {
	if id == "" {
		return "Error", errors.New("campos requeridos inválidos")
	}
	result := database.DB.Model(&entities.TypeReport{}).Where("id").Delete(id)
	if result.Error != nil {
		return "Error al intentar eliminar!", result.Error
	}
	return "Tipo de reporte eliminado con éxito!", nil
}
