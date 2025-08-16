package reports

import (
	"errors"
	utils_auth "sgi-go/auth/utils"
	"sgi-go/database"
	"sgi-go/entities"

	"gorm.io/gorm"
)

type query struct {
	title          string
	departmentID   int64
	localityID     int
	date           string
	type_report_id int64
	content        string
	description    string
}

func GetReports(query *query, page int64, limit int64) ([]entities.Report, int64, error) {
	var reports []entities.Report
	filters := database.DB.Model(&entities.Report{})
	offset := (page - 1) * limit

	if query.title != "" {
		filters = filters.Where("title LIKE ?", "%"+query.title+"%")
	}
	if query.departmentID != 0 {
		filters = filters.Where("department_id = ?", query.departmentID)
	}
	if query.localityID != 0 {
		filters = filters.Where("locality_id =?", query.localityID)
	}
	if query.date != "" {
		filters = filters.Where("date =?", query.date)
	}
	if query.type_report_id != 0 {
		filters = filters.Where("type_report_id =?", query.type_report_id)
	}
	if query.content != "" {
		filters = filters.Where("content LIKE?", "%"+query.content+"%")
	}
	if query.description != "" {
		filters = filters.Where("description LIKE?", "%"+query.description+"%")
	}
	var total int64

	filters.Count(&total)

	err := filters.Offset(int(offset)).Limit(int(limit)).Preload("Department").Preload("Locality").Preload("TypeReport").Find(&reports).Error
	if err != nil {
		return nil, 0, err
	}
	return reports, total, nil

}

func GetReportById(id int64) (*entities.Report, error) {
	var report entities.Report
	result := database.DB.Preload("Department").Preload("Locality").Preload("TypeReport").Preload("TypeReport").Preload("Persons").Preload("Files").Preload("User", func(db *gorm.DB) *gorm.DB {
		return db.Select("id", "username", "name", "last_name")
	}).First(&report, id)
	if result.Error != nil {
		return nil, result.Error
	}
	return &report, nil
}

func AddReport(report *entities.Report, token string) (*entities.Report, error) {
	if report.Title == "" || report.DepartmentID == 0 || report.LocalityID == 0 || report.TypeReportID == 0 || report.Content == "" {
		return nil, errors.New("El título, departamento, localidad, fecha, tipo de reporte y contenido son obligatorios")
	}

	userID, err := utils_auth.ValidateToken(token)
	if err != nil {
		return nil, errors.New("Token invalido: " + err.Error())
	}
	report.UserID = userID
	result := database.DB.Create(&report)

	if result.Error != nil {
		return nil, result.Error
	}
	return report, nil
}

func EditReport(id int64, report *entities.Report) (*entities.Report, error) {
	var existingReport entities.Report
	result := database.DB.First(&existingReport, id)
	if result.Error != nil {
		return nil, result.Error
	}

	existingReport.Title = report.Title
	existingReport.DepartmentID = report.DepartmentID
	existingReport.LocalityID = report.LocalityID
	existingReport.Date = report.Date
	existingReport.TypeReportID = report.TypeReportID
	existingReport.Content = report.Content
	existingReport.Description = report.Description
	existingReport.Status = report.Status

	result = database.DB.Save(&existingReport)
	if result.Error != nil {
		return nil, result.Error
	}

	return &existingReport, nil
}

func DeleteReport(id int64, userId int64) error {
	var report entities.Report
	result := database.DB.First(&report, id)
	if result.Error != nil {
		return result.Error
	}
	user := &entities.User{}
	resultUser := database.DB.First(user, userId)

	if resultUser.Error != nil {
		return resultUser.Error
	}

	if user.Role != "admin" {
		return errors.New("No tienes permisos para eliminar este informe")
	}

	result = database.DB.Delete(&report)
	if result.Error != nil {
		return result.Error
	}

	return nil
}

func UpdateReportStatus(id int64, status string) (*entities.Report, error) {
	// Validar estados permitidos
	validStatuses := []string{"pending", "complete", "urgent"}
	validStatus := false
	for _, validSt := range validStatuses {
		if status == validSt {
			validStatus = true
			break
		}
	}
	if !validStatus {
		return nil, errors.New("Estado inválido. Los estados permitidos son: pending, complete, urgent")
	}

	var existingReport entities.Report
	result := database.DB.First(&existingReport, id)
	if result.Error != nil {
		return nil, result.Error
	}

	existingReport.Status = status

	result = database.DB.Save(&existingReport)
	if result.Error != nil {
		return nil, result.Error
	}

	return &existingReport, nil
}

func AddPersonToReport(reportID int64, personID int64) (string, error) {
	var report entities.Report
	result := database.DB.First(&report, reportID)
	if result.Error != nil {
		return "Error", result.Error
	}

	var person entities.Person
	result = database.DB.First(&person, personID)
	if result.Error != nil {
		return "Error", result.Error
	}

	// Verificar si ya existe en la tabla intermedia
	var exists bool
	err := database.DB.
		Table("person_report").
		Where("report_id = ? AND person_id = ?", reportID, personID).
		Select("count(*) > 0").
		Find(&exists).Error

	if err != nil {
		return "Error", errors.New("La persona ya está asignada a este informe")
	}

	if exists {
		return "Error", errors.New("La persona ya está asignada a este informe")
	}

	database.DB.Model(&report).Association("Persons").Append(&person)
	if result.Error != nil {
		return "Error", result.Error
	}

	return "Persona vinculada al informe ", nil
}

func RemovePersonFromReport(reportID int64, personID int64) (string, error) {
	var report entities.Report
	result := database.DB.First(&report, reportID)
	if result.Error != nil {
		return "Error", result.Error
	}

	var person entities.Person
	result = database.DB.First(&person, personID)
	if result.Error != nil {
		return "Error", result.Error
	}

	// Verificar si la relación existe
	var exists bool
	err := database.DB.
		Table("person_report").
		Where("report_id = ? AND person_id = ?", reportID, personID).
		Select("count(*) > 0").
		Find(&exists).Error

	if err != nil {
		return "Error", err
	}

	if !exists {
		return "Error", errors.New("La persona no está asignada a este informe")
	}

	// Remover la asociación
	database.DB.Model(&report).Association("Persons").Delete(&person)
	if result.Error != nil {
		return "Error", result.Error
	}

	return "Persona desvinculada del informe", nil
}
