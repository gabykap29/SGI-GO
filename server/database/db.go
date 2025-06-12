package database

import (
	"fmt"
	"log"
	"sgi-go/config"
	department "sgi-go/entities"
	locality "sgi-go/entities"
	model_user "sgi-go/entities"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// Connect to the database
var DB *gorm.DB
var configDb *config.DbConfig

func Connect() {

	configDb = config.NewDbConfig()

	dsn := "host=" + configDb.Host + " user=" + configDb.User + " password=" + configDb.Pass + " dbname=" + configDb.DbName + " port=" + fmt.Sprint(configDb.Port) + " sslmode=" + configDb.SslMode
	var err error

	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)

	}
	//migrar modelos
	err = DB.AutoMigrate(&model_user.User{}, &department.Department{}, &locality.Locality{})
	if err != nil {
		log.Fatalf("Failed to migrate models: %v", err)
	}

	log.Println("Connected to database successfully")

}
