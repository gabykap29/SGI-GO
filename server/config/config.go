package config

import (
	"fmt"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type DbConfig struct {
	Host    string
	Port    int
	User    string
	Pass    string
	DbName  string
	PortDB  int
	SslMode string
}

func NewDbConfig() *DbConfig {
	godotenv.Load()
	dbHost := os.Getenv("DB_HOST")
	if dbHost == "" {
		fmt.Println("El host de la base de datos es invalido!")
	}
	port, err := strconv.Atoi(os.Getenv("DB_PORT"))
	if err != nil {
		panic(err)
	}
	userDb := os.Getenv("DB_USER")
	if userDb == "" {
		fmt.Println("El usuario de la base de datos es invalido!")
	}
	passDb := os.Getenv("DB_PASS")
	if passDb == "" {
		fmt.Println("La contraseña de la base de datos es invalida!")
	}
	dbName := os.Getenv("DB_NAME")
	if dbName == "" {
		fmt.Println("El nombre de la base de datos es invalido!")
	}
	portDb, err := strconv.Atoi(os.Getenv("DB_PORT"))
	if err != nil {
		fmt.Println("Puerto de la base de datos NO VÁLIDO!")
		panic(err)
	}
	return &DbConfig{
		Host:    dbHost,
		Port:    port,
		User:    userDb,
		Pass:    passDb,
		PortDB:  portDb,
		DbName:  dbName,
		SslMode: os.Getenv("SSL_MODE"),
	}
}
