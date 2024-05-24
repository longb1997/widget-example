import {requestWidgetUpdate} from 'react-native-android-widget';
import {CalendarWidget} from './CalendarWidget';

export const baseDeepLink = 'widget-example://app/';

export const svgStringPlus = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 4V20M4 12L20 12" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

export const svgRefresh = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.94252 10.2611H4.43247C4.19001 10.2611 3.99951 10.0643 3.99951 9.81381V4.49657M20.1995 10.2611C18.7923 5.98739 15.9782 3.9997 12.2258 3.99963C8.47343 3.99957 4.72116 9.46589 4.72116 9.46589" stroke="#FFFFFF" stroke-width="1.25" stroke-linecap="round"/>
<path d="M15.2565 14.9996H19.7665C20.009 14.9996 20.1995 15.1964 20.1995 15.4469V20.7641M3.99951 14.9996C5.40663 19.2733 8.22081 21.261 11.9732 21.2611C15.7256 21.2611 19.4778 15.7948 19.4778 15.7948" stroke="#FFFFFF" stroke-width="1.25" stroke-linecap="round"/>
</svg>`;

export const NO_ACCESS_ERROR = [
  'INVALID_CLIENT_KEY',
  'INVALID_ACCESS_TOKEN',
  'FORCE_LOGOUT_INVALID_TOKEN',
] as const;

export interface Meeting {
  id: string;
  name: string;
  time: string;
  duration: string;
}
export interface MeetingResponse {
  code: number;
  message: string;
  data: string;
  httpCode: string;
  meetings: Meeting[];
}