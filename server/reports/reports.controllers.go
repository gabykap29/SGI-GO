package reports

import (
	"log"
	utils_auth "sgi-go/auth/utils"
	"sgi-go/entities"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

type ReportInput struct {
	Title        string `json:"title" binding:"required"`
	Description  string `json:"description" binding:"required"`
	Content      string `json:"content"`
	Status       string `json:"status"`
	Date         string `json:"date" binding:"required"`
	DepartmentID uint   `json:"department_id" binding:"required"`
	LocalityID   uint   `json:"locality_id" binding:"required"`
	TypeReportID uint   `json:"type_report_id" binding:"required"`
}

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
		var input ReportInput
		if err := c.ShouldBindJSON(&input); err != nil {
			log.Println(err.Error())
			c.JSON(400, gin.H{
				"error":   "Error al crear el informe, verifique los campos e intente nuevamente!",
				"details": err.Error(),
			})
			return
		}
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(401, gin.H{"error": "Token de autorización no proporcionado"})
			return
		}
		token := strings.TrimPrefix(authHeader, "Bearer ")
		if token == "" {
			c.JSON(401, gin.H{"error": "Token de autorización no proporcionado"})
			return
		}

		parsedDate, err := time.Parse("2006-01-02T15:04", input.Date)
		if err != nil {
			log.Println(err.Error())
			c.JSON(400, gin.H{
				"error":   "Formato de fecha inválido. Debe ser YYYY-MM-DDTHH:MM",
				"details": err.Error(),
			})
			return
		}

		// Mapear al modelo real
		report := entities.Report{
			Title:        input.Title,
			Description:  input.Description,
			Content:      input.Content,
			Status:       input.Status,
			Date:         parsedDate,
			DepartmentID: input.DepartmentID,
			LocalityID:   input.LocalityID,
			TypeReportID: input.TypeReportID,
		}

		result, err := AddReport(&report, token)
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
	r.PATCH("/report/status/:id", func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		status := c.Query("status")

		if err != nil {
			c.JSON(400, gin.H{"error": "ID inválido", "details": err.Error()})
			return
		}
		if status == "" {
			c.JSON(400, gin.H{"error": "Status inválido", "details": "El status es requerido"})
			return
		}

		report, err := UpdateReportStatus(int64(id), status)
		if err != nil {
			c.JSON(400, gin.H{"error": "Error al actualizar el status", "details": err.Error()})
			return
		}
		c.JSON(200, report)
	})
	r.DELETE("/reports/:id", func(c *gin.Context) {
		token := c.GetHeader("Authorization")
		token = strings.TrimPrefix(token, "Bearer ")
		userIdStr, err := utils_auth.DecodeJWT(token)
		userIdInt, err := strconv.ParseInt(userIdStr, 10, 64)
		if err != nil {
			c.JSON(401, gin.H{"error": "Token inválido", "details": err.Error()})
			return
		}
		var userId int64 = userIdInt

		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(400, gin.H{"error": "ID inválido", "details": err.Error()})
			return
		}
		if err := DeleteReport(int64(id), userId); err != nil {
			log.Println(err.Error())
			c.JSON(500, gin.H{
				"error":   "Error al eliminar el informe. Comuníquese con un administrador.",
				"details": err.Error(),
			})
			return
		}
		c.JSON(200, gin.H{"message": "Informe eliminado correctamente."})
	})

	// Ruta para vincular persona al informe (POST)
	r.POST("/reports/:id/persons/:person_id", func(c *gin.Context) {
		reportID, err := strconv.Atoi(c.Param("id"))
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

	// Ruta para desvincular persona del informe (DELETE)
	r.DELETE("/reports/:id/persons/:person_id", func(c *gin.Context) {
		reportID, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(400, gin.H{"error": "ID de informe inválido", "details": err.Error()})
			return
		}
		personID, err := strconv.Atoi(c.Param("person_id"))
		if err != nil {
			c.JSON(400, gin.H{"error": "ID de persona inválido", "details": err.Error()})
			return
		}

		result, err := RemovePersonFromReport(int64(reportID), int64(personID))
		if err != nil {
			log.Println(err.Error())
			c.JSON(400, gin.H{
				"error":   "Error al desvincular la persona del informe.",
				"details": err.Error(),
			})
			return
		}
		c.JSON(200, result)
	})

	// Mantener ruta legacy para compatibilidad
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
