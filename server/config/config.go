package config

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
	return &DbConfig{
		Host:    "localhost",
		Port:    5432,
		User:    "postgres",
		Pass:    "1234",
		DbName:  "sgi_go",
		PortDB:  5432,
		SslMode: "disable",
	}
}
