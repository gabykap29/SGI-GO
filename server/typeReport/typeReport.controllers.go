package typereport

import (
	"sgi-go/entities"

	"github.com/gin-gonic/gin"
)

func TypeReportRouter(r *gin.RouterGroup) {
	r.GET(("/typereports"), func(c *gin.Context) {
		typereports, err := GetTypeReports()
		if err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, typereports)
	})

	r.POST("/typereports", func(c *gin.Context) {
		var typereports entities.TypeReport
		if err := c.ShouldBindJSON(&typereports); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
		}
		result, err := AddTypeReport(&typereports)
		if err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		c.JSON(201, result)
	})
	r.DELETE("/typereport/:id", func(c *gin.Context) {
		id := c.Params.ByName("id")

		result, err := DeleteTypeReport(id)
		if err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
		}
		c.JSON(200, gin.H{"data": result})
	})
}
