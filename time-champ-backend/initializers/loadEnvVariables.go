package initializers

import (
	"log"
	"path/filepath"
	"strings"

	"github.com/joho/godotenv"
	"github.com/tracker/pkg/constant"
)

func LoadEnvVariables() {
	path, _ := Path(constant.ENV_FILE)
	err = godotenv.Load(path)
	if err != nil {
		log.Fatal("Error loading .env file", err)
	}
}

func Path(file string) (string, error) {
	dir, err := filepath.Abs(constant.NULL)
	if err != nil {
		log.Fatal(err)
		return constant.NULL, err
	}
	path := strings.Replace((strings.Replace(dir, constant.BACKSLASH, constant.FORWARD_SLASH, constant.ONE)),
		constant.CMD, file, -constant.ONE)
	return path, err
}
