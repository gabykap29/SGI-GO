package users

import (
	utils_auth "sgi-go/auth/utils"
	model_user "sgi-go/entities"

	"github.com/gin-gonic/gin"
)

func GetUser(r *gin.RouterGroup) {
	r.GET("/users", func(c *gin.Context) {
		users, err := GetUsers()
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, users)
	})
	r.GET("/user/:id", func(c *gin.Context) {
		var id string = c.Params.ByName("id")
		user, err := GetUserById(id)
		if err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, gin.H{"user": user})
	})
	r.GET("/user/getUsername", func(c *gin.Context) {
		user, err := utils_auth.DecodeJWT(c.Request.Header.Get("Authorization"))
		if err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		userId, err := GetUserById(user)

		if err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, gin.H{"user": userId.Name})
	})
	r.POST("/users", func(c *gin.Context) {
		var user model_user.User
		if err := c.ShouldBindJSON(&user); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		createdUser, err := CreateUser(&user)
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		c.JSON(201, "Ususario creado correctamente: "+createdUser.Name)
	})

	r.PUT("/users/:id", func(c *gin.Context) {
		id := c.Params.ByName("id")
		var user model_user.User

		if err := c.ShouldBindJSON(&user); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		edit := EditUser(id, &user)
		if edit != nil {
			c.JSON(400, gin.H{"error": edit.Error()})
			return
		}
		c.JSON(200, gin.H{"message": "Usuario editado correctamente", "user": user.Name})
	})
	r.DELETE("/users/:id", func(c *gin.Context) {
		id := c.Params.ByName("id")
		if err := DeleteUser(id); err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, gin.H{"message": "Usuario eliminado correctamente"})
	})
}
