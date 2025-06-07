package main

import (
	"log"
	"sgi-go/database"
	departments "sgi-go/department"
	"sgi-go/users"

	"github.com/gin-gonic/gin"
)

func main() {
	database.Connect()

	r := gin.Default()

	apiGroup := r.Group("/api/")
	users.GetUser(apiGroup)
	departments.DepartmentRoutes(apiGroup)

	if err := departments.CreateDepartments(); err != nil {
		log.Fatalf("error al crear los departamentos %v", err)
	}

	r.Run(":3000")
}
