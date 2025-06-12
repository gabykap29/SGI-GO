package persons

import (
	"sgi-go/entities"

	"github.com/gin-gonic/gin"
)

func PersonRouter(r *gin.RouterGroup) {
	r.GET(("/persons"), func(c *gin.Context) {
		persons, err := GetPerson()
		if err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, persons)
	})

	r.GET("/persons/:id", func(c *gin.Context) {
		id := c.Params.ByName("id")
		result, err := GetPersonById(id)
		if err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, result)
	})

	r.POST("/persons", func(c *gin.Context) {
		var person entities.Person
		if err := c.ShouldBindJSON(&person); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		result, err := AddPerson(&person)
		if err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		c.JSON(201, result)
	})
	r.PUT("/persons/:id", func(c *gin.Context) {
		id := c.Params.ByName("id")
		var person entities.Person
		if err := c.ShouldBindJSON(&person); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		result, err := EditPerson(id, &person)
		if err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, result)
	})
	r.DELETE("/persons/:id", func(c *gin.Context) {
		id := c.Params.ByName("id")
		err := DeletePerson(id)
		if err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, gin.H{"message": "Person deleted"})
	})
}
