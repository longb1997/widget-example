import React from 'react';
import type {WidgetTaskHandlerProps} from 'react-native-android-widget';
import {CalendarWidget} from './CalendarWidget';
import {Linking} from 'react-native';
import {Meeting} from './widgetUtils';

const nameToWidget = {
  Calendar: CalendarWidget,
};

const SAMPLE_DATA: Meeting[] = [
  {id: '1', name: 'Mobile meeting 1', time: '1706759540', duration: '30'},
  {id: '2', name: 'Mobile meeting 2', time: '1707623540', duration: '30'},
  {id: '3', name: 'Mobile meeting 3', time: '1707709940', duration: '30'},
  {id: '4', name: 'Mobile meeting 4', time: '1707709940', duration: '30'},
  {id: '5', name: 'Mobile meeting 5', time: '1709005940', duration: '30'},
];

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const widgetInfo = props.widgetInfo;
  const Widget = nameToWidget[
    widgetInfo.widgetName as keyof typeof nameToWidget
  ] as any;

  switch (props.widgetAction) {
    case 'WIDGET_RESIZED':
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE':
      try {
        // Call API here and send data to Widget
        // const meetings = await requestCalendarData();

        const meetings: any = SAMPLE_DATA;

        if (meetings) {
          props.renderWidget(<Widget {...widgetInfo} data={meetings} />);
        }
      } catch (error: any) {
        props.renderWidget(
          <Widget {...widgetInfo} data={[]} error={error.toString()} />,
        );
      }
      break;

    case 'WIDGET_CLICK':
      if (props.clickAction === 'RELOAD_WIDGET') {
        // Re-call API when click "reload" icon
        try {
          //   const meetings = await requestCalendarData();
          const meetings: any = SAMPLE_DATA;
          props.renderWidget(<Widget {...widgetInfo} data={meetings} />);
        } catch (error: any) {
          props.renderWidget(
            <Widget {...widgetInfo} data={[]} error={error.toString()} />,
          );
        }
      }

      if (props.clickAction === 'OPEN_MEETING') {
        const uri = (props.clickActionData?.uri || '') as string;
        Linking.openURL(uri);
      }
      break;

    case 'WIDGET_DELETED':
      // Do nothing
      break;
    default:
      break;
  }
}
