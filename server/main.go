package main

import (
	"sgi-go/database"
	"sgi-go/users"

	"github.com/gin-gonic/gin"
)

func main() {
	database.Connect()

	r := gin.Default()

	apiGroup := r.Group("")
	users.GetUser(apiGroup)

	r.Run(":3000")
}
