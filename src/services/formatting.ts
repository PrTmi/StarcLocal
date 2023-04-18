// @ts-ignore
import { DateTime } from 'luxon';

export const formatDateTime = (date: string) => {
  if (date == null || date === '0001-01-01') {
    return '';
  } else {
    return DateTime.fromISO(date).toFormat('dd.LL.yyyy HH:mm');
  }
};

export const formatDate = (date: string) => {
  if (date == null || date === '0001-01-01') {
    return '';
  } else {
    return DateTime.fromISO(date).toFormat('dd.LL.yyyy');
  }
};

export const formatTime = (date: string) => {
  if (date == null || date === '0001-01-01') {
    return '';
  } else {
    return DateTime.fromISO(date).toFormat('HH:mm');
  }
};
