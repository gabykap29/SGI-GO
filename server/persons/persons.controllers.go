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

	r.GET("/persons/:id/reports", func(c *gin.Context) {
		id := c.Params.ByName("id")
		reports, err := GetReportsByPersonId(id)
		if err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, reports)
	})
	r.GET("/persons/search", func(c *gin.Context) {
		name := c.Query("name")
		lastName := c.Query("last_name")
		dni := c.Query("dni")
		address := c.Query("address")

		if name == "" && lastName == "" && dni == "" && address == "" {
			c.JSON(400, gin.H{"error": "Debe enviar por lo menos un termino de busqueda!"})
			return
		}

		persons, err := SearchPersons(name, lastName, dni, address)

		if err != nil {
			c.JSON(400, gin.H{"error": "Error al obtener la persona"})
			return
		}

		c.JSON(200, gin.H{"data": persons, "count": len(persons)})
	})
}
