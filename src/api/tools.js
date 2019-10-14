export const resetBlank = (str) => {
    if (str){
        return str.replace(/\s*/g, '');
    } else {
        return '';
    }
}
// 获取当前星期几
export const getWeekDay = () => {
  let today = new Date();
  switch(today.getDay())
  {
    case 0:
      return '星期日';
      break;
    case 1:
      return '星期一';
      break;
    case 2:
      return '星期二';
      break;
    case 3:
      return '星期三';
      break;
    case 4:
      return '星期四';
      break;
    case 5:
      return '星期五';
      break;
    case 6:
      return '星期六';
      break;
    default:
      return '星期日'
  }
}
// 获取当前日期yyyy-MM-dd
export const getTodayStr = () => {
  let today = new Date();
  let date = today.getDate();
  let month = today.getMonth() + 1;
  let year = today.getFullYear();
  if (date < 10){
    date = '0'+date;
  }
  if (month < 10 ){
    month = '0' + month;
  }
  return year + '-' + month + '-' + date;
}
