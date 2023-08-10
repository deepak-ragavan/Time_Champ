package service

import (
	"bytes"
	"fmt"
	"image"
	"image/png"
	"io"
	"mime/multipart"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/tracker/middleware"
	"github.com/tracker/pkg/constant"
	"github.com/tracker/pkg/constant/message"
	"github.com/tracker/pkg/dto"
	"github.com/tracker/pkg/repository"
	"golang.org/x/exp/slices"
)

func SaveIcons(c *gin.Context) {
	userId, err := middleware.GetUserObject(c)
	if err != nil || userId == constant.ZERO {
		return
	}
	form, err := c.MultipartForm()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{message.ERROR: message.FAILED_TO_GET_FORM_DATA})
		return
	}
	files := form.File["image"]
	tx := repository.TX()
	appNameList, err := tx.GetAllAppIconName()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{message.ERROR: err.Error()})
		return
	}
	for _, file := range files {
		if !slices.Contains(appNameList, file.Filename) {
			var systemImage dto.AppIcon
			buffer, msg := ConvertByteArray(file)
			if msg != constant.NULL {
				c.JSON(http.StatusInternalServerError, gin.H{message.ERROR: msg})
				return
			}
			systemImage.AppName = file.Filename
			systemImage.AppIcon = buffer
			tx.SaveAppIcons(systemImage)
		}
	}
	tx.Instance.Commit()
	c.JSON(http.StatusCreated, appNameList)
}

func ConvertByteArray(file *multipart.FileHeader) ([]byte, string) {
	src, err := file.Open()
	if err != nil {
		return nil, message.IMAGE_OPENING_FAILED
	}
	defer src.Close()
	data, err := io.ReadAll(src)
	if err != nil {
		if err == io.EOF {
			return nil, message.THE_FILE_IS_EMPTY
		}
		return nil, message.FILE_SIZE_RETRIEVAL_FAILED
	}
	return data, constant.NULL
}

func ConvertByteArrayToImage(imageBytes []byte, filename string) {
	buffer := bytes.NewReader(imageBytes)
	// Decode the image from the buffer
	img, _, err := image.Decode(buffer)
	if err != nil {
		fmt.Println("Error decoding image:", err)
		return
	}
	// Save the decoded image to a PNG file
	outputFile, err := os.Create("C:/Users/softsuave/Music/New folder/" + filename)
	if err != nil {
		fmt.Println("Error creating output file:", err)
		return
	}
	defer outputFile.Close()
	err = png.Encode(outputFile, img)
	if err != nil {
		fmt.Println("Error encoding PNG:", err)
		return
	}
	fmt.Println("Image saved to output.png")
}
