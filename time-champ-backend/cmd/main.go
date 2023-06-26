package main

import (
	"fmt"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/tracker/initializers"
	"github.com/tracker/pkg/controller"
)

func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectToDB()
	initializers.SyncDatabase()

}

func main() {
	fmt.Println("hello")
	r := gin.Default()
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3001"}
	r.Use(cors.New(config))
	r.SetTrustedProxies(nil)
	controller.AuthenticationController(r)
	controller.LoadUserController(r)
	controller.LoadUserActivityController(r)
	controller.LoadUserAttendanceController(r)
	controller.LoadSystemImageController(r)
	r.Run(os.Getenv("IP_ADDRESS") + ":" + os.Getenv("SERVER_PORT"))
}
