package service

import (
	"bytes"
	"io"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/gin-gonic/gin"
	"github.com/tracker/middleware"
	"github.com/tracker/pkg/constant"
	"github.com/tracker/pkg/constant/message"
	"github.com/tracker/pkg/dto"
	awsconfig "github.com/tracker/utils/AwsConfig"

	"github.com/tracker/pkg/repository"
)

func UploadImage(c *gin.Context) {
	userId, err := middleware.GetUserObject(c)
	if err != nil || userId == constant.ZERO {
		return
	}
	id, _ := strconv.Atoi(c.Query("userId"))
	dateString := c.Query("Date")
	final, dateErr := time.Parse(constant.DATE_TIME_FORMAT, dateString)
	if dateErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.INVALID_DATE_TIME})
		return
	}
	sess, err := awsconfig.ConnectToAws()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.AWS_SESSION_CREATION_FAILED})
	}
	svc := s3.New(sess)
	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.IMAGE_RETRIEVAL_FAILED})
		return
	}
	// Open the uploaded file
	src, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{message.ERROR: message.IMAGE_OPENING_FAILED})
		return
	}
	defer src.Close()

	// Get the file size
	var fileSize int64
	if seeker, ok := src.(io.ReadSeeker); ok {
		_, err := seeker.Seek(0, io.SeekEnd)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{message.ERROR: message.FILE_SIZE_RETRIEVAL_FAILED})
			return
		}
		fileSize, _ = seeker.Seek(0, io.SeekCurrent)
		_, err = seeker.Seek(0, io.SeekStart)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{message.ERROR: message.FILE_POINTER_RESET_FAILED})
			return
		}
	} else {
		c.JSON(http.StatusInternalServerError, gin.H{message.ERROR: message.FILE_SIZE_RETRIEVAL_FAILED})
		return
	}
	// Read the file content into a byte slice
	buffer := make([]byte, fileSize)
	_, err = io.ReadFull(src, buffer)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{message.ERROR: message.IMAGE_READING_FAILED})
		return
	}
	// Upload the image to S3
	_, err = svc.PutObject(&s3.PutObjectInput{
		Bucket: aws.String(os.Getenv("BUCKET_NAME")),
		Key:    aws.String(file.Filename),
		Body:   bytes.NewReader(buffer),
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{message.ERROR: message.IMAGE_UPLOAD_TO_S3_FAILED})
		return
	}
	url := "https://" + os.Getenv("BUCKET_NAME") + "." + os.Getenv("SERVICE_PROVIDER") + "." + os.Getenv("SERVICE") + file.Filename
	var systemImage dto.SystemImage
	systemImage.Name = file.Filename
	systemImage.ImageUrl = url
	systemImage.CreatedAt = final
	systemImage.UserID = uint(id)
	result, er := repository.DB().SaveSystemImage(systemImage)
	if er.RowsAffected == constant.ZERO {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.IMAGE_DETAILS_STORAGE_FAILED})
		return
	}
	c.JSON(http.StatusCreated, result)
}

func GetImages(c *gin.Context) {
	userId, err := middleware.GetUserObject(c)
	if err != nil || userId == constant.ZERO {
		return
	}
	id, _ := strconv.Atoi(c.Query("userId"))
	systemImage, er := repository.DB().GetAllSystemImageByID(uint(id))
	if er.RowsAffected == constant.ZERO {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: er.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, systemImage)
}

func GetImagesByDate(c *gin.Context) {
	userId, err := middleware.GetUserObject(c)
	if err != nil || userId == constant.ZERO {
		return
	}
	id, _ := strconv.Atoi(c.Query("userId"))
	fromDate := c.Query("fromDate")
	toDate := c.Query("toDate")
	systemImage, r := repository.DB().GetSystemImagesByDate(uint(id), fromDate, toDate)
	if r.RowsAffected == constant.ZERO {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: r.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, systemImage)
}

func DeleteLastMonthScreenshots(c *gin.Context) {
	previousDate := time.Now().AddDate(0, 0, -30)
	previousDateString := previousDate.Format(constant.DATE)
	er := repository.DB().DeletePreviousMonthRecords(previousDateString)
	if er.RowsAffected == constant.ZERO {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: er.Error.Error()})
		return
	}
}
