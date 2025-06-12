package locality

import (
	"sgi-go/entities"

	"github.com/gin-gonic/gin"
)

func LocalityRoutes(r *gin.RouterGroup) {
	r.GET("/localities", func(c *gin.Context) {
		localities, err := GetLocalities()
		if err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, localities)
	})

	r.POST("/localities", func(c *gin.Context) {
		var newLocality entities.Locality
		if err := c.ShouldBindJSON(&newLocality); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
		}
		result, err := AddLocality(&newLocality)
		if err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		c.JSON(201, result)
	})

	r.DELETE("/localities/:id", func(c *gin.Context) {
		id := c.Params.ByName("id")

		result, err := DeleteLocality(id)
		if err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		c.JSON(201, result)
	})
}
