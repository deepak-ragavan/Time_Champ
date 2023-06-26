package initializers

import (
	"log"
	"path/filepath"
	"strings"

	"github.com/joho/godotenv"
)

func LoadEnvVariables() {
	dir, err := filepath.Abs("")
	if err != nil {
		log.Fatal(err)
	}
	path := strings.Replace((strings.Replace(dir, "\\", "/", -1)), "cmd", ".env", -1)
	err = godotenv.Load(path)
	if err != nil {
		log.Fatal("Error loading .env file", err)
	}
}
