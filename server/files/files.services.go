package files

import (
	"errors"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"sgi-go/database"
	"sgi-go/entities"
	"strings"

	"github.com/google/uuid"
)

func SaveReportFile(fileHeader *multipart.FileHeader, reportID uint, description string) (*entities.File, error) {
	uploadsPath := "uploads"
	if _, err := os.Stat(uploadsPath); os.IsNotExist(err) {
		os.Mkdir(uploadsPath, os.ModePerm)
	}
	// vlidar MIME, solo permitir imágenes
	allowedTypes := []string{"image/jpeg", "image/png", "image/gif"}
	fileType := fileHeader.Header.Get("Content-Type")
	valid := false
	for _, t := range allowedTypes {
		if strings.EqualFold(fileType, t) {
			valid = true
			break
		}
	}
	if !valid {
		return nil, errors.New("tipo de archivo no permitido")
	}

	filename := uuid.New().String()
	filePath := filepath.Join(uploadsPath, filename)

	if err := saveFileToDisk(fileHeader, filePath); err != nil {
		return nil, err
	}

	file := &entities.File{
		Name:        fileHeader.Filename,
		Path:        filePath,
		Filename:    filename,
		ReportID:    &reportID,
		Type:        fileHeader.Header.Get("Content-Type"),
		Description: description,
	}

	if err := database.DB.Create(file).Error; err != nil {
		return nil, err
	}

	return file, nil
}

func SavePersonFile(fileHeader *multipart.FileHeader, personID uint, description string) (*entities.File, error) {
	uploadsPath := "uploads"
	if _, err := os.Stat(uploadsPath); os.IsNotExist(err) {
		os.Mkdir(uploadsPath, os.ModePerm)
	}
	// vlidar MIME, solo permitir imágenes
	allowedTypes := []string{"image/jpeg", "image/png", "image/gif"}
	fileType := fileHeader.Header.Get("Content-Type")
	valid := false
	for _, t := range allowedTypes {
		if strings.EqualFold(fileType, t) {
			valid = true
			break
		}
	}
	if !valid {
		return nil, errors.New("tipo de archivo no permitido")
	}

	filename := uuid.New().String()
	filePath := filepath.Join(uploadsPath, filename)

	if err := saveFileToDisk(fileHeader, filePath); err != nil {
		return nil, err
	}

	file := &entities.File{
		Name:        fileHeader.Filename,
		Path:        filePath,
		Filename:    filename,
		PersonID:    &personID,
		Type:        fileHeader.Header.Get("Content-Type"),
		Description: description,
	}

	if err := database.DB.Create(file).Error; err != nil {
		return nil, err
	}

	return file, nil
}

func saveFileToDisk(fileHeader *multipart.FileHeader, destination string) error {
	src, err := fileHeader.Open()
	if err != nil {
		return err
	}
	defer src.Close()

	out, err := os.Create(destination)
	if err != nil {
		return err
	}
	defer out.Close()

	_, err = io.Copy(out, src)
	return err
}

func GetFilePatch(filename string) (string, error) {
	filePath := filepath.Join("uploads", filename)
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		return "", errors.New("archivo no encontrado")
	} else {
		return filePath, nil
	}
}

func DeleteFile(id string) (string, error) {
	var file entities.File
	if err := database.DB.First(&file, id).Error; err != nil {
		return "", err
	}
	if err := os.Remove(file.Path); err != nil {
		return "", err
	}
	if err := database.DB.Delete(&file).Error; err != nil {
		return "", err
	}
	return "Archivo eliminado", nil
}
