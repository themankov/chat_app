import { ru } from 'date-fns/locale';
import { formatDistanceToNow, setDefaultOptions } from 'date-fns';
setDefaultOptions({ locale: ru });
const DateToStr = (date: string): string => {
  const newDate = new Date(date);
  const result = formatDistanceToNow(newDate, {
    addSuffix: true,
  });
  return result;
};
export default DateToStr;
