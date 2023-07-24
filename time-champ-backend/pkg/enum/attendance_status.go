package enum

type AttendanceStatus string

const (
	START AttendanceStatus = "Start"
	END   AttendanceStatus = "End"
	BREAK AttendanceStatus = "Break"
)
