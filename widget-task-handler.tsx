import React from 'react';
import type {WidgetTaskHandlerProps} from 'react-native-android-widget';
import {CalendarWidget} from './CalendarWidget';
import {Linking} from 'react-native';

const nameToWidget = {
  // Reminder: ReminderWidget,
  Calendar: CalendarWidget,
};

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

        const meetings: any = [];

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
        // TODO: Create an "reload" icon
        // Do stuff when primitive with `clickAction="RELOAD_WIDGET"` is clicked
        // props.clickActionData === { id: 0 }
        try {
          //   const meetings = await requestCalendarData();
          const meetings: any = [];

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
