package csvgenerator

import (
	"bytes"
	"encoding/csv"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/tracker/common/mail"
	"github.com/tracker/middleware"
	"github.com/tracker/pkg/constant"
	"github.com/tracker/pkg/constant/message"
	"github.com/tracker/pkg/dto"
	"github.com/tracker/pkg/repository"
	"github.com/tracker/pkg/service"
)

func ProductivityReport(c *gin.Context) {
	userId, err := middleware.GetUserObject(c)
	if err != nil || userId == constant.ZERO {
		return
	}
	fromDate := c.Query("fromDate")
	toDate := c.Query("toDate")
	reportType := c.Query("reportType")
	id, er := strconv.Atoi(c.Query("userId"))
	fileName := reportType + time.Now().Format(constant.DATE) + constant.CSV_FILE_FORMAT
	if er != nil {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.QUERY_PARAM_CONVERSION_TO_INT_FAILED})
		return
	}

	//Set the appropriate headers for CSV download
	c.Header("Content-Type", "text/csv")
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s", fileName))

	// Create a buffer to store CSV data
	csvBuffer := &bytes.Buffer{}

	// Create a new CSV writer using the buffer
	csvWriter := csv.NewWriter(csvBuffer)

	childsId, _ := GetChildUserIds(uint(id))

	// Query all data from the database at once
	records, recordsErr := repository.DB().GetProductivityReportCsv(childsId, fromDate, toDate)
	if recordsErr.RowsAffected == constant.ZERO {
		c.JSON(http.StatusBadRequest, gin.H{message.ERROR: message.RECORD_NOT_FOUND})
		return
	}
	if reportType == constant.CSV_NORMAL_FORMAT {
		csvWriter.Write(dto.HeadersForNormalFormat)
	} else if reportType == constant.CSV_PRODUCTIVE_FORMAT {
		csvWriter.Write(dto.HeadersForProductiveTimeFormat)
	} else if reportType == constant.CSV_UNPRODUCTIVE_FORMAT {
		csvWriter.Write(dto.HeadersForUnproductiveTimeFormat)
	} else if reportType == constant.CSV_NEUTRAL_FORMAT {
		csvWriter.Write(dto.HeadersForNormalFormat)
	}
	for _, val := range records {
		CsvWriter(val, csvWriter, reportType)
	}
	csvWriter.Flush()
	if err := csvWriter.Error(); err != nil {
		c.String(http.StatusInternalServerError, message.FAILED_TO_WRITE_CSV_DATA)
		return
	}
	// Write the buffer data to the response
	c.Data(http.StatusOK, "text/csv", csvBuffer.Bytes())
}

func CsvWriter(data dto.UserAttendanceForCsv, csvWriter *csv.Writer, format string) {
	if format == constant.CSV_NORMAL_FORMAT {
		record := []string{
			data.Name, data.EmployeeID, data.StartTime, mail.Converter(data.Productive),
			mail.Converter(data.Unproductive), mail.Converter(data.Neutral),
			mail.Converter(data.Idle), mail.Converter(data.Working), mail.Converter(data.TotalTime),
		}
		csvWriter.Write(record)
	} else if format == constant.CSV_PRODUCTIVE_FORMAT {
		record := []string{
			data.Name, data.EmployeeID, data.StartTime, mail.Converter(data.Productive),
		}
		csvWriter.Write(record)
	} else if format == constant.CSV_UNPRODUCTIVE_FORMAT {
		record := []string{
			data.Name, data.EmployeeID, data.StartTime, mail.Converter(data.Unproductive),
		}
		csvWriter.Write(record)
	} else if format == constant.CSV_NEUTRAL_FORMAT {
		record := []string{
			data.Name, data.EmployeeID, data.StartTime, mail.Converter(data.Neutral),
		}
		csvWriter.Write(record)
	}
}

func GetChildUserIds(id uint) ([]uint, string) {
	var listOfIds []uint
	childList, _ := service.GetUserData(id)
	for _, childId := range childList {
		listOfIds = append(listOfIds, childId.ID)
	}
	return listOfIds, constant.NULL
}
