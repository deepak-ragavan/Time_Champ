import moment from "moment";


export const formatTime = (spentTime:number) => {
  console.log("stackedData"+spentTime)
  const spentTimeMilliSecond = spentTime / 1e6;  
  console.log("stackedDataMilli"+spentTimeMilliSecond)
  if (spentTimeMilliSecond > 0 && spentTimeMilliSecond <= 60000) {
      // Format as seconds
      return moment.utc(spentTimeMilliSecond).format('s[s]');
    } else if (spentTimeMilliSecond > 60000 && spentTimeMilliSecond <= 60000 * 60) {
      // Format as minutes and seconds
      return moment.utc(spentTimeMilliSecond).format('m[m] s[s]');
    } else {
      // Format as hours, minutes, and seconds
      return moment.utc(spentTimeMilliSecond).format('H[h] m[m] s[s]');
    }
  };


export const nanoSecTOSeconds = (nanoseconds:number) => {
  console.log(Math.floor(nanoseconds / 1000000000))
    return Math.floor(nanoseconds / 1000000000);
}

export const formatTimeForAttendaceTable = (spentTime:number) => {
    const spentTimeMilliSecond = spentTime / 1e6;
    console.log(spentTimeMilliSecond)
    return moment.utc(spentTimeMilliSecond).format('HH:mm');
};

export const formatTimeIntoHoursMinutesSeconds = (spentTime:number) => {
  const spentTimeMilliSecond = spentTime / 1e6;  
  return moment.utc(spentTimeMilliSecond).format('H[h] m[m] s[s]');
};

export const verifyCurrentDate = (presentMoment:string, setVerifiedCurrentDate:(value:boolean)=>void) => {
  if (new Date().setHours(0, 0, 0, 0) === new Date(presentMoment).setHours(0, 0, 0, 0)) {
    setVerifiedCurrentDate(true);
  }
  else {
    setVerifiedCurrentDate(false);
  }
}

export const getAttendanceChartData = (data:attendaceData[]) => {
  const timings = getTimingsArray()
  const workingHoursArray = Array(timings.length).fill(0);
  const idleHoursArray = Array(timings.length).fill(0);

  data.map((value)=> {
    value.userActivity.forEach(activity => {
        const startTime = new Date(activity.start_time);
        const endTime = new Date(activity.end_time);
        const spentTimeMilliSecond = activity.spent_time / 1e6;  
        const spentTimeHours = spentTimeMilliSecond / (1000 * 60); // Convert milliseconds to hours

        for (let i = 0; i < timings.length; i++) {
      const [startTimeStr, endTimeStr] = timings[i].split(' - ');
      const [startHour, startMin] = startTimeStr.split(':');
      const [endHour, endMin] = endTimeStr.split(':');
      
      const intervalStart = new Date(startTime);
      intervalStart.setHours(parseInt(startHour));
      intervalStart.setMinutes(parseInt(startMin));

      const intervalEnd = new Date(endTime);
      intervalEnd.setHours(parseInt(endHour));
      intervalEnd.setMinutes(parseInt(endMin));

      if (startTime >= intervalStart && endTime <= intervalEnd) {
          if (activity.activity_status === 'Working') {
              workingHoursArray[i] += spentTimeHours;
          } else if (activity.activity_status === 'Idle' || activity.activity_status === 'Idle(Break)') {
              idleHoursArray[i] += spentTimeHours;
          }
          break; // No need to check other intervals
      }
        }
    });
    console.log('Working Hours Array:', workingHoursArray);
    console.log('Idle Hours Array:', idleHoursArray);
})
}

export const getTimingsArray = () => {
  return ['06:00 AM - 08:00 AM', '08:01 AM - 10:00 AM', '10:01 AM - 12:00 PM', '12:01 PM - 14:00 PM',
  '14:01 PM - 16:00 PM', '16:01 PM - 18:00 PM', '18:01 PM - 20:00 PM', '20:01 PM - 22:00 PM', '22:01 PM - 00:00 AM',
  '00:01 AM - 02:00 AM', '02:01 AM - 04:00 AM', '04:01 AM - 06:00 AM',
]
} 