package reports

import (
	"log"
	"strconv"

	"sgi-go/entities"

	"github.com/gin-gonic/gin"
)

func ReportRouter(r *gin.RouterGroup) {
	r.GET("/reports", func(c *gin.Context) {
		page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
		limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
		title := c.Query("title")
		departmentID, _ := strconv.Atoi(c.DefaultQuery("department_id", "0"))
		localityID, _ := strconv.Atoi(c.DefaultQuery("locality_id", "0"))
		typeReportID, _ := strconv.Atoi(c.DefaultQuery("type_report_id", "0"))
		date := c.Query("date")
		content := c.Query("content")
		description := c.Query("description")

		filters := query{
			title:          title,
			departmentID:   int64(departmentID),
			localityID:     localityID,
			date:           date,
			type_report_id: int64(typeReportID),
			content:        content,
			description:    description,
		}

		reports, total, err := GetReports(&filters, int64(page), int64(limit))
		if err != nil {
			log.Println(err.Error())
			c.JSON(400, gin.H{
				"error":   "Error al obtener los informes, verifique los campos!",
				"details": err.Error(),
			})
			return
		}
		c.JSON(200, gin.H{"data": reports, "total": total})
	})

	r.POST("/reports", func(c *gin.Context) {
		var report entities.Report
		if err := c.ShouldBindJSON(&report); err != nil {
			log.Println(err.Error())
			c.JSON(400, gin.H{
				"error":   "Error al crear el informe, verifique los campos e intente nuevamente!",
				"details": err.Error(),
			})
			return
		}
		result, err := AddReport(&report)
		if err != nil {
			log.Println(err.Error())
			c.JSON(400, gin.H{
				"error":   "Error al crear el informe, verifique los campos e intente nuevamente!",
				"details": err.Error(),
			})
			return
		}
		c.JSON(201, result)
	})

	r.GET("/reports/:id", func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(400, gin.H{"error": "ID inválido", "details": err.Error()})
			return
		}
		result, err := GetReportById(int64(id))
		if err != nil {
			log.Println(err.Error())
			c.JSON(500, gin.H{
				"error":   "Error al obtener el informe. Comuníquese con un administrador.",
				"details": err.Error(),
			})
			return
		}
		c.JSON(200, result)
	})

	r.PUT("/reports/:id", func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(400, gin.H{"error": "ID inválido", "details": err.Error()})
			return
		}
		var report entities.Report
		if err := c.ShouldBindJSON(&report); err != nil {
			log.Println(err.Error())
			c.JSON(400, gin.H{
				"error":   "Error al actualizar el informe, verifique los campos.",
				"details": err.Error(),
			})
			return
		}
		result, err := EditReport(int64(id), &report)
		if err != nil {
			log.Println(err.Error())
			c.JSON(500, gin.H{
				"error":   "Error al actualizar el informe. Comuníquese con un administrador.",
				"details": err.Error(),
			})
			return
		}
		c.JSON(200, result)
	})

	r.DELETE("/reports/:id", func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(400, gin.H{"error": "ID inválido", "details": err.Error()})
			return
		}
		if err := DeleteReport(int64(id)); err != nil {
			log.Println(err.Error())
			c.JSON(500, gin.H{
				"error":   "Error al eliminar el informe. Comuníquese con un administrador.",
				"details": err.Error(),
			})
			return
		}
		c.JSON(200, gin.H{"message": "Informe eliminado correctamente."})
	})

	r.PUT("/report/:report_id/assign/:person_id", func(c *gin.Context) {
		reportID, err := strconv.Atoi(c.Param("report_id"))
		if err != nil {
			c.JSON(400, gin.H{"error": "ID de informe inválido", "details": err.Error()})
			return
		}
		personID, err := strconv.Atoi(c.Param("person_id"))
		if err != nil {
			c.JSON(400, gin.H{"error": "ID de persona inválido", "details": err.Error()})
			return
		}

		result, err := AddPersonToReport(int64(reportID), int64(personID))
		if err != nil {
			log.Println(err.Error())
			c.JSON(400, gin.H{
				"error":   "Error al asignar la persona al informe.",
				"details": err.Error(),
			})
			return
		}
		c.JSON(200, result)
	})
}
