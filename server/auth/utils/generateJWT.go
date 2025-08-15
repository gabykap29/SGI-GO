package utils_auth

import (
	"errors"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var jwtKey []byte = SecretKey

func GenerateJWT(userID uint) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(time.Hour * 24).Unix(), // Token expiration time (1 day)
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtKey)
}

func ValidateToken(tokenString string) (uint, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrSignatureInvalid
		}
		return jwtKey, nil
	})

	if err != nil || !token.Valid {
		return 0, errors.New("Token invalido!")
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		userID := uint(claims["user_id"].(float64))
		return userID, nil
	}

	return 0, errors.New("Token invalido!")

}
func DecodeJWT(tokenString string) (string, error) {
	// Soporta "Bearer <token>" o solo "<token>"
	parts := strings.Split(tokenString, " ")
	if len(parts) == 2 {
		tokenString = parts[1]
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrSignatureInvalid
		}
		return jwtKey, nil
	})
	if err != nil || !token.Valid {
		return "", errors.New("Token inválido")
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		userIDRaw, ok := claims["user_id"]
		if !ok {
			return "", errors.New("user_id no encontrado en el token")
		}

		// Convertir a string aunque venga como número
		var userID string
		switch v := userIDRaw.(type) {
		case string:
			userID = v
		case float64:
			userID = fmt.Sprintf("%.0f", v)
		case int:
			userID = strconv.Itoa(v)
		default:
			return "", errors.New("tipo de user_id inválido en el token")
		}

		return userID, nil
	}
	return "", errors.New("Token inválido")
}
