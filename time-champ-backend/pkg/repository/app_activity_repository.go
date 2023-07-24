package repository

import (
	"github.com/tracker/pkg/constant"
	"github.com/tracker/pkg/dto"
	"gorm.io/gorm"
)

func (db DbInstance) GetAppActivity(id uint) (dto.AppActivity, *gorm.DB) {
	var appActivity dto.AppActivity
	return appActivity, db.Instance.First(&appActivity, id)
}

func (db DbInstance) UpdateAppActivity(appActivity dto.AppActivity, id uint) (dto.AppActivity, *gorm.DB) {
	return appActivity, db.Instance.Save(&appActivity)
}

func (db DbInstance) SaveAppActivity(appActivity []dto.AppActivity) ([]dto.AppActivity, *gorm.DB) {
	return appActivity, db.Instance.Save(&appActivity)
}

func (db DbInstance) DeleteAppActivity(id uint) *gorm.DB {
	return db.Instance.Delete(&dto.AppActivity{}, id)
}
func (db DbInstance) GetAppActivityByUserId(userId uint) ([]dto.AppActivity, *gorm.DB) {
	var appActivity []dto.AppActivity
	return appActivity, db.Instance.Preload("User").Where("user_id = ?", userId).Find(&appActivity)
}
func (db DbInstance) CheckTodayAppActvity(userId uint, date string) (dto.AppActivity, *gorm.DB) {
	var appActivity dto.AppActivity
	return appActivity, db.Instance.Where("user_id = ? AND start_time LIKE ?", userId, date+"%").Find(&appActivity)
}
func (db DbInstance) GetLastAppActivity(userId uint) (dto.AppActivity, *gorm.DB) {
	var appActivity dto.AppActivity
	return appActivity, db.Instance.Where("user_id = ?", userId).Last(&appActivity)
}
func (db DbInstance) GetTotalAppSpendTime(userId uint) ([]dto.AppActivitySpendTimeDto, error) {
	var result []dto.AppActivitySpendTimeDto
	err := db.Instance.Table("app_activities").
		Select("app_name AS AppName, SUM(spent_time) AS TotalSpendTime").
		Where("user_id = ?", userId).
		Group("app_name").
		Scan(&result).Error
	return result, err
}
func (db DbInstance) GetSpendTimeByAppName(userId uint, appName string) ([]dto.AppSpendTimeDto, error) {
	var appSpendTime []dto.AppSpendTimeDto
	err := db.Instance.Table("app_activities").
		Select("title AS Title, spent_time AS SpendTime").
		Where("user_id = ? And app_name =?", userId, appName).
		Scan(&appSpendTime).Error
	return appSpendTime, err
}

func (db DbInstance) GetLastAppActivityData(userId uint, date string) (dto.AppActivity, *gorm.DB) {
	var appActivity dto.AppActivity
	err := db.Instance.Where("user_id = ? AND start_time LIKE ?", userId, date+"%").Last(&appActivity)
	return appActivity, err
}

func (db DbInstance) GetAppActivityByActivityStatus(userId uint, status string, fromDate string, toDate string, searchText string, limit int) ([]dto.AppActivitySpendTimeDto, *gorm.DB) {
	var result []dto.AppActivitySpendTimeDto
	query := db.Instance.Table("app_activities").
		Select("app_name AS AppName, SUM(spent_time) AS SpentTime, image_url AS ImageUrl").
		Where(" user_id = ? and app_activity_status = ? and end_time != ? and date(start_time) between ? and ? and app_name LIKE ? ", userId, status, constant.DATE_TIME, fromDate, toDate, ("%" + searchText + "%")).
		Group("app_name, image_url").Order("SpentTime desc")
	if limit > constant.ZERO {
		query.Limit(limit)
	}
	query.Scan(&result)
	return result, query
}

func (db DbInstance) GetTotalAppActivity(userId uint, fromDate string, toDate string) ([]dto.GetUserActivitySummaryDto, *gorm.DB) {
	var appActivity []dto.GetUserActivitySummaryDto
	err := db.Instance.Table("app_activities").
		Select("app_activity_status AS Status, SUM(spent_time) AS Counts").
		Where("user_id = ? and date(start_time) between ? and ?", userId, fromDate, toDate).
		Group("app_activity_status").
		Scan(&appActivity)
	return appActivity, err
}
func (db DbInstance) GetAppSummary(fromDate string, toDate string) ([]dto.AppActivitySummaryDTO, *gorm.DB) {
	var results []dto.AppActivitySummaryDTO
	err := db.Instance.Raw(`select x.* ,JSON_ARRAYAGG(AppName) as AppList from(
		Select u.id as user_id,u.employee_id,email as email,app.app_name as AppName, u.name as user_name,u.department as department, app.user_id as app_user_id,(app.spent_time) as SpentTime ,a.id as att_id,a.idle,a.working,a.non_working,a.break_time,a.total_time,a.productive,a.unproductive,a.neutral,a.user_id as att_user_id, a.start_time , ROW_NUMBER() OVER(PARTITION BY  app.user_id ) AS rowss 
		from app_activities as app
		right join users as u on u.id = app.user_id 
		left join user_attendances as a on a.user_id = u.id 	
		where date(a.start_time) = ? and date(app.start_time) = ? and u.role<>'Super-Admin'
		group by  u.id  , AppName order by  u.id  ,SpentTime desc) x where rowss <=5 group by email;`, fromDate, toDate).Scan(&results)
	return results, err
}
