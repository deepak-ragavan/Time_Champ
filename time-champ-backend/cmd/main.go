package main

import (
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	cronjobs "github.com/tracker/common/cron_jobs"
	"github.com/tracker/initializers"
	"github.com/tracker/middleware"
	"github.com/tracker/pkg/constant"
	"github.com/tracker/pkg/controller"
	"github.com/tracker/pkg/enum"
)

func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectToDB()
	initializers.SyncDatabase()
	cronjobs.RunCron()
	cronjobs.UpdateUserActivityCron()
}

func main() {
	r := gin.Default()
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3001"}
	config.AllowHeaders = []string{"Content-Type", "Authorization"} // Include 'Authorization' header
	r.Use(cors.New(config))
	r.SetTrustedProxies(nil)
	controller.AuthenticationController(r)
	router(r)
	r.Run(os.Getenv("IP_ADDRESS") + constant.COLON + os.Getenv("SERVER_PORT"))
}

func router(r *gin.Engine) {
	superAdmin := r.Group("/super-admin")
	admin := r.Group("/admin")
	manager := r.Group("/manager")
	teamLead := r.Group("/team-lead")
	user := r.Group("/")
	user.Use(middleware.RequireAuth, middleware.Authorization(enum.USER))

	controller.LoadSuperAdminController(superAdmin)
	controller.LoadAdminController(admin)
	controller.LoadManagerController(manager)
	controller.LoadTeamLeadController(teamLead)
	controller.LoadUserController(user)
	controller.LoadUserActivityController(user)
	controller.LoadUserAttendanceController(user)
	controller.LoadAppActivityController(user)
	controller.LoadUrlActivityController(user)
	controller.LoadDomainController(user)
	controller.LoadTrackerChartDetailsController(user)
	controller.LoadScreenshotDetailsController(user)
}
