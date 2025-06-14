package main

import (
	"log"
	"sgi-go/database"
	departments "sgi-go/department"
	"sgi-go/files"
	"sgi-go/locality"
	"sgi-go/persons"
	"sgi-go/reports"
	typereport "sgi-go/typeReport"
	"sgi-go/users"

	"github.com/gin-gonic/gin"
)

func main() {
	database.Connect()

	r := gin.Default()

	apiGroup := r.Group("/api/")
	users.GetUser(apiGroup)
	departments.DepartmentRoutes(apiGroup)
	locality.LocalityRoutes(apiGroup)
	typereport.TypeReportRouter(apiGroup)
	persons.PersonRouter((apiGroup))
	reports.ReportRouter(apiGroup)
	files.RegisterFileRoutes(apiGroup)

	if err := departments.CreateDepartments(); err != nil {
		log.Println("error al crear los departamentos", err)
	}
	if err := locality.CreateLocality(); err != nil {
		log.Println("error al crear las localidades", err)
	}
	if err := typereport.CreateTypeReportDefault(); err != nil {
		log.Println("error al crear los tipos de reportes", err)
	}
	r.Run(":3000")
}
