package departments

import (
	department "sgi-go/entities"

	"github.com/gin-gonic/gin"
)

func DepartmentRoutes(r *gin.RouterGroup) {
	r.GET("/departments", func(c *gin.Context) {
		departments, err := GetDeparts()
		if err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, departments)
	})

	r.POST("/departments", func(c *gin.Context) {
		var department department.Department
		if err := c.ShouldBindJSON(&department); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		result, err := AddDepartment(&department)
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		c.JSON(201, result)

	})
	r.PUT("/departments/:id", func(c *gin.Context) {
		id := c.Params.ByName("id")
		var department department.Department

		if err := c.ShouldBindJSON(&department); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		edit, err := UpdateDepartment(id, &department)
		if err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, gin.H{"message": "departamento " + edit.Name + " editado correctamente!"})
	})
	r.DELETE("/departments/:id", func(c *gin.Context) {
		id := c.Params.ByName("id")

		//Devuelve error o string
		result, err := DeleteDepartment(id)

		if err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, gin.H{"message": result})
	})
}
