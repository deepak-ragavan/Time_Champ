package service

import (
	"bytes"
	"io"
	"net/http"
	"os"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/gin-gonic/gin"
	"github.com/tracker/middleware"
	"github.com/tracker/pkg/dto"
	"github.com/tracker/pkg/enum"
	"github.com/tracker/pkg/models"
	"github.com/tracker/pkg/repository"
	awsconfig "github.com/tracker/utils/AwsConfig"
)

func UploadImage(c *gin.Context) {
	userId, err := middleware.GetUserObject(c)
	if err != nil || userId == 0 {
		return
	}
	dateString := c.Query("Date")
	final, dateErr := time.Parse(enum.DATE_TIME_FORMAT, dateString)

	if dateErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid date and time",
		})
		return
	}
	sess, err := awsconfig.ConnectToAws()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to create AWS session"})
	}
	svc := s3.New(sess)
	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to retrieve the image"})
		return
	}
	// Open the uploaded file
	src, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open the image"})
		return
	}
	defer src.Close()

	// Get the file size
	var fileSize int64
	if seeker, ok := src.(io.ReadSeeker); ok {
		_, err := seeker.Seek(0, io.SeekEnd)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get the file size"})
			return
		}
		fileSize, _ = seeker.Seek(0, io.SeekCurrent)
		_, err = seeker.Seek(0, io.SeekStart)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to reset the file pointer"})
			return
		}
	} else {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get the file size"})
		return
	}
	// Read the file content into a byte slice
	buffer := make([]byte, fileSize)
	_, err = io.ReadFull(src, buffer)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read the image"})
		return
	}
	// Upload the image to S3
	_, err = svc.PutObject(&s3.PutObjectInput{
		Bucket: aws.String(os.Getenv("BucketName")),
		Key:    aws.String(file.Filename),
		Body:   bytes.NewReader(buffer),
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload the image to S3"})
		return
	}
	url := "https://" + os.Getenv("BucketName") + "." + os.Getenv("ServiceProvider") + "." + os.Getenv("AwsRegion") + "." + os.Getenv("Service") + file.Filename
	var systemImage models.SystemImage
	systemImage.Name = file.Filename
	systemImage.ImageUrl = url
	systemImage.CreatedAt = final
	systemImage.UserID = userId
	result, er := repository.SaveSystemImage(systemImage)
	if er.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "failed to Store Image details in DB",
		})
		return
	}
	c.JSON(http.StatusCreated, result)
}

func GetImages(c *gin.Context) {
	userId, err := middleware.GetUserObject(c)
	if err != nil || userId == 0 {
		return
	}
	systemImage, er := repository.GetAllSystemImageByID(userId)
	if er.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "No Value Present",
		})
		return
	}
	c.JSON(http.StatusOK, systemImage)
}
func GetImagesByDate(c *gin.Context) {
	userId, err := middleware.GetUserObject(c)
	if err != nil || userId == 0 {
		return
	}
	var body dto.DateDto
	if c.BindJSON(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid date and time",
		})
		return
	}
	systemImage, r := repository.GetSystemImagesByDate(userId, body.Date)
	if r.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": r.Error,
		})
		return
	}
	c.JSON(http.StatusOK, systemImage)
}
func DeleteLastMonthScreenshots(c *gin.Context) {
	previousDate := time.Now().AddDate(0, 0, -30)
	previousDateString := previousDate.Format(enum.DATE)
	er := repository.DeletePreviousMonthRecords(previousDateString)
	if er.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "No value Present"})
		return
	}

}
