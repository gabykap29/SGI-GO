package auth

import (
	"errors"
	utils_auth "sgi-go/auth/utils"
	"sgi-go/database"
	"sgi-go/entities"
	"sgi-go/utils"
	"time"
)

type rolAndToken struct {
	Role  string `json:"role"`
	Token string `json:"token"`
}

func Login(cred *credentials) (rolAndToken, error) {
	var user entities.User

	if err := database.DB.First(&user, "username = ?", cred.Username).Error; err != nil {
		return rolAndToken{}, err
	}

	if !utils.CheckPassHash(cred.Pass, user.Pass) {
		return rolAndToken{}, errors.New("credenciales inválidas")
	}

	token, err := utils_auth.GenerateJWT(user.ID)
	if err != nil {
		return rolAndToken{}, err
	}
	if user.Role == "" {
		user.Role = "user"
	} else if user.Role != "admin" && user.Role != "user" && user.Role != "moderator" {
		return rolAndToken{}, errors.New("rol inválido")
	}
	user.LastLogin = time.Now()
	database.DB.Save(&user)
	return rolAndToken{
		Role:  user.Role,
		Token: token,
	}, nil
}
