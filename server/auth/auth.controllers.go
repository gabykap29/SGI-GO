package auth

import (
	"github.com/gin-gonic/gin"
)

type credentials struct {
	Username string `json:"username"`
	Pass     string `json:"pass"`
}

func AuthRoutes(r *gin.RouterGroup) {
	r.POST("/login", func(c *gin.Context) {
		var creds credentials
		if err := c.ShouldBindJSON(&creds); err != nil {
			c.JSON(400, gin.H{"error": "Invalid request payload"})
			return
		}
		user := credentials{
			Username: creds.Username,
			Pass:     creds.Pass,
		}
		result, err := Login(&user)

		if err != nil {
			c.JSON(401, gin.H{"error": "Invalid credentials"})
			return
		}
		c.JSON(200, gin.H{"token": result})
	})
}
