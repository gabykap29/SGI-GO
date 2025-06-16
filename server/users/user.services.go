package users

import (
	"log"
	"sgi-go/database"
	"sgi-go/entities"
	model_user "sgi-go/entities"
	"sgi-go/utils"
)

func GetUsers() ([]model_user.User, error) {
	var users []model_user.User
	result := database.DB.Find(&users)
	if result.Error != nil {
		return nil, result.Error
	}
	return users, nil
}

func CreateUser(user *model_user.User) (*model_user.User, error) {

	hashPass, err := utils.HashPass(user.Pass)

	if err != nil {
		return nil, err
	}
	user.Pass = hashPass
	result := database.DB.Create(&user)
	if result.Error != nil {
		return nil, result.Error
	}
	return user, nil
}

func CreateUserDefault() error {
	var users int64

	if err := database.DB.Model(entities.User{}).Count(&users).Error; err != nil {
		return err
	}

	if users > 0 {
		log.Println("Los usuarios ya se encuentran cargados!")
		return nil
	}
	hashPass, err := utils.HashPass("admin1234")
	if err != nil {
		return err
	}
	user := entities.User{
		Username: "admin",
		Pass:     hashPass,
		Name:     "admin",
		LastName: "admin",
		Role:     "admin",
	}

	result := database.DB.Create(&user)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func EditUser(id string, user *model_user.User) error {

	if user.Pass != "" {
		utils.HashPass(user.Pass)
		hashPass, err := utils.HashPass(user.Pass)
		if err != nil {
			return err
		}
		user.Pass = hashPass
	}
	result := database.DB.Model(&model_user.User{}).Where("id = ?", id).Updates(user)
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return database.DB.Error
	}

	return nil
}

func DeleteUser(id string) error {
	result := database.DB.Delete(&model_user.User{}, id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return database.DB.Error
	}
	return nil
}
func GetUserById(id string) (*model_user.User, error) {
	var user model_user.User
	result := database.DB.First(&user, id)
	if result.Error != nil {
		return nil, result.Error
	}
	return &user, nil
}
