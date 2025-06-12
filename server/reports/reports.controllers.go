package reports

import (
	"errors"
	"log"
	"sgi-go/entities"
	"strconv"

	"github.com/gin-gonic/gin"
)

func ReportRouter(r *gin.RouterGroup) {
	r.GET(("/reports"), func(c *gin.Context) {
		page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
		limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
		title := c.Query("title")
		departmentIDStr := c.Query("department_id")
		departmentID, err := strconv.Atoi(departmentIDStr)
		if err != nil {
			departmentID = 0
		}
		localityIDStr := c.Query("locality_id")
		localityID, err := strconv.Atoi(localityIDStr)
		if err != nil {
			localityID = 0
		}
		typeReportIDStr := c.Query("type_report_id")
		typeReportID, err := strconv.Atoi(typeReportIDStr)
		if err != nil {
			typeReportID = 0
		}
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
			c.JSON(400, gin.H{"error": errors.New("Error al obtener los informes, verifique los campos!")})
			log.Println(err.Error())
			return
		}
		c.JSON(200, gin.H{"data": reports, "total": total})
	})
	r.POST("/reports", func(c *gin.Context) {
		var report entities.Report
		if err := c.ShouldBindJSON(&report); err != nil {
			c.JSON(400, gin.H{"error": errors.New("Error al crear el informe, verifique los campos e intente nuevamente!")})
			log.Println(err.Error())
			return
		}
		result, err := AddReport(&report)
		if err != nil {
			c.JSON(400, gin.H{"error": errors.New("Error al crear el informe, verifique los campos e intente nuevamente!")})
			log.Println(err.Error())
			return
		}
		c.JSON(200, result)
	})
	r.GET("/reports/:id", func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(400, gin.H{"error": errors.New("Invalid ID")})
			return
		}
		result, err := GetReportById(int64(id))
		if err != nil {
			c.JSON(500, gin.H{"error": errors.New("Error al obtener el informe!... Comuniquese con un administrador!")})
			log.Println(err.Error())
			return
		}
		c.JSON(200, result)
	})
	r.PUT("/reports/:id", func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(400, gin.H{"error": errors.New("Invalid ID")})
			return
		}
		var report entities.Report
		if errr := c.ShouldBindJSON(&report); errr != nil {
			c.JSON(400, gin.H{"error": errors.New("Error al actualizar el informe, verifique los campos e intente nuevamente!")})
			log.Println(errr.Error())
			return
		}
		result, err := EditReport(int64(id), &report)
		if err != nil {
			c.JSON(500, gin.H{"error": errors.New("Error al actualizar el informe, comuniquese con un administrador!")})
			log.Println(err.Error())
			return
		}
		c.JSON(200, result)
	})
	r.DELETE("/reports/:id", func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(400, gin.H{"error": errors.New("Invalid ID")})
			return
		}
		err = DeleteReport(int64(id))
		if err != nil {
			c.JSON(500, gin.H{"error": errors.New("Error al eliminar el informe, comuniquese con un administrador!")})
			log.Println(err.Error())
			return
		}
		c.JSON(200, gin.H{"message": "Report deleted"})
	})
	r.PUT("/report/:report_id/assign/:person_id", func(c *gin.Context) {
		reportID, err := strconv.Atoi(c.Param("report_id"))
		if err != nil {
			c.JSON(400, gin.H{"error": errors.New("Invalid ID")})
			return
		}
		personID, err := strconv.Atoi(c.Param("person_id"))
		if err != nil {
			c.JSON(400, gin.H{"error": errors.New("Invalid ID")})
			return
		}

		result, err := AddPersonToReport(int64(reportID), int64(personID))
		if err != nil {
			c.JSON(400, gin.H{"error": err})
			log.Println(err)
			return
		}
		c.JSON(200, result)
	})
}
