package auth

import (
	"errors"
	utils_auth "sgi-go/auth/utils"
	"sgi-go/database"
	"sgi-go/entities"
	"sgi-go/utils"
	"time"
)

func Login(cred *credentials) (string, error) {
	var user entities.User

	if err := database.DB.First(&user, "username = ?", cred.Username).Error; err != nil {
		return "", err
	}

	if !utils.CheckPassHash(cred.Pass, user.Pass) {
		return "", errors.New("credenciales inválidas")
	}

	token, err := utils_auth.GenerateJWT(user.ID)
	if err != nil {
		return "", err
	}
	user.LastLogin = time.Now()
	database.DB.Save(&user)
	return token, nil
}
