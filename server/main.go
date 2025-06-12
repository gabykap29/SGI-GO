package main

import (
	"log"
	"sgi-go/database"
	departments "sgi-go/department"
	"sgi-go/locality"
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

	if err := departments.CreateDepartments(); err != nil {
		log.Println("error al crear los departamentos", err)
	}
	if err := locality.CreateLocality(); err != nil {
		log.Println("error al crear las localidades", err)
	}

	r.Run(":3000")
}
