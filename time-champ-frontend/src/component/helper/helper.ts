import moment from "moment";


export const formatTime = (spentTime:number) => {
  const spentTimeMilliSecond = spentTime / 1e6;  
  if (spentTimeMilliSecond >= 0 && spentTimeMilliSecond <= 60000) {
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

export const convertTo12HourFormat=(time24:string)=>{
  const [hours,minutes]=time24.split(':');
  const period = Number(hours) >= 12 ? 'PM' : 'AM';
  const hours12 = (Number(hours)%12) || 12;
  const time12 = `${hours12}:${minutes} ${period}`;
  return time12;
}

export const getTimingsArray = () => {
  return ['06:00 AM - 08:00 AM', '08:01 AM - 10:00 AM', '10:01 AM - 12:00 PM', '12:01 PM - 14:00 PM',
  '14:01 PM - 16:00 PM', '16:01 PM - 18:00 PM', '18:01 PM - 20:00 PM', '20:01 PM - 22:00 PM', '22:01 PM - 00:00 AM',
  '00:01 AM - 02:00 AM', '02:01 AM - 04:00 AM', '04:01 AM - 06:00 AM',
]
} 