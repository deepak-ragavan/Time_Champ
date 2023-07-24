import moment from "moment";


export const formatTime = (spentTime:number) => {
    if (spentTime>0 && spentTime <= 60000) {
      // Format as seconds
      return moment.utc(spentTime).format('s[s]');
    } else if (spentTime > 60000 && spentTime <= 60000 * 60) {
      // Format as minutes and seconds
      return moment.utc(spentTime).format('m[m] s[s]');
    } else {
      // Format as hours, minutes, and seconds
      return moment.utc(spentTime).format('H[h] m[m] s[s]');
    }
  };


export const milliSecTOSeconds = (milliseconds:number) => {
    return Math.floor(milliseconds / 1000);
}