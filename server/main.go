package main

import (
	"log"
	"sgi-go/auth"
	"sgi-go/database"
	departments "sgi-go/department"
	"sgi-go/files"
	"sgi-go/locality"
	"sgi-go/middlewares"
	"sgi-go/persons"
	"sgi-go/reports"
	typereport "sgi-go/typeReport"
	"sgi-go/users"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	database.Connect()

	r := gin.Default()
	config := cors.Config{
		AllowOrigins:     []string{"*"}, // O la URL de tu frontend
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}
	r.Use(cors.New(config))
	apiGroup := r.Group("/")
	auth.AuthRoutes(apiGroup)

	protected := r.Group("/api/")
	protected.Use(middlewares.AuthMiddleware())
	{
		users.GetUser(protected)
		departments.DepartmentRoutes(protected)
		locality.LocalityRoutes(protected)
		typereport.TypeReportRouter(protected)
		persons.PersonRouter((protected))
		reports.ReportRouter(protected)
		files.RegisterFileRoutes(protected)

	}

	if err := departments.CreateDepartments(); err != nil {
		log.Println("error al crear los departamentos", err)
	}
	if err := locality.CreateLocality(); err != nil {
		log.Println("error al crear las localidades", err)
	}
	if err := typereport.CreateTypeReportDefault(); err != nil {
		log.Println("error al crear los tipos de reportes", err)
	}
	if err := users.CreateUserDefault(); err != nil {
		log.Println("error al crear el usuario", err)
	}
	r.Run(":4000")
}
