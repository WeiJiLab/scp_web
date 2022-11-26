import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { ObjectUtils } from './ObjectUtils';

export class TimeUtils {
  public static formatDatetime = (data?: string): string | null => {
    if (ObjectUtils.isEmpty(data)) {
      return null;
    }
    return dayjs(data).tz('Asia/ShangHai').format('YYYY-MM-DD HH:mm:ss');
  };

  public static dateFromNow = (data?: string): string | null => {
    if (ObjectUtils.isEmpty(data)) {
      return null;
    }
    return dayjs(data).tz('Asia/ShangHai').locale('zh-cn').fromNow();
  };
}
