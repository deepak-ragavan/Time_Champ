package enum

type AttendanceStatus string

const (
	START AttendanceStatus = "start"
	END   AttendanceStatus = "end"
	BREAK AttendanceStatus = "break"
)
