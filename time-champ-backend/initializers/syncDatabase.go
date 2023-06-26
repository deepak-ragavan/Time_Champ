package initializers

import "github.com/tracker/pkg/models"

func SyncDatabase() {
	DB.AutoMigrate(&models.User{})
	DB.AutoMigrate(&models.UserActivity{})
	DB.AutoMigrate(&models.UserAttendance{})
	DB.AutoMigrate(&models.SystemImage{})
}
