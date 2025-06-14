package files

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func RegisterFileRoutes(r *gin.RouterGroup) {
	r.POST("/uploads/:id", func(c *gin.Context) {
		reportID, err := strconv.Atoi(c.Params.ByName("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid report ID"})
			return
		}
		file, err := c.FormFile("file")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Debe adjuntar un archivo!"})
			return
		}
		saveFile, err := SaveReportFile(file, uint(reportID))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al guardar el archivo"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"data": saveFile})
	})
	r.GET("/files/:filename", func(c *gin.Context) {
		filename := c.Params.ByName("filename")

		filePath, err := GetFilePatch(filename)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener el archivo"})
			return
		}
		c.File(filePath)
	})
}
