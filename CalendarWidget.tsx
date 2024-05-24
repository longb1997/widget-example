/* eslint-disable react-native/no-inline-styles */
import moment from 'moment';
import React from 'react';
import {
  FlexWidget,
  ListWidget,
  OverlapWidget,
  SvgWidget,
  TextWidget,
  TextWidgetProps,
  WidgetInfo,
} from 'react-native-android-widget';
import {TextWidgetStyle} from 'react-native-android-widget/src/widgets/TextWidget';
import {
  Meeting,
  NO_ACCESS_ERROR,
  baseDeepLink,
} from './widgetUtils';

interface ISTextWidget extends TextWidgetProps {
  type?: 'regular' | 'bold' | 'semi-bold';
  textStyle: TextWidgetStyle;
  text: string;
}

function STextWidget({
  type = 'regular',
  text,
  textStyle = {},
  ...props
}: ISTextWidget) {
  return (
    <TextWidget
      {...props}
      text={text}
      style={{
        ...textStyle,
      }}
    />
  );
}

function calculateEventHeight(meeting: Meeting, hourHeight: number) {
  let eventDuration = (Number(meeting.duration) || 0) <= 20 ? 20 : Number(meeting.duration);
  let eventDurationHours = eventDuration / 60; // Convert minutes to hours
  return hourHeight * eventDurationHours - 2;
}

function calculateEventTopOffset(meeting: Meeting, hourHeight: number, index: number) {
  let PADDING_TITLE = 8;
  let eventStartTime = moment(meeting.time, 'X');
  let eventStartMinute = eventStartTime.minute();
  let minuteOffset = (eventStartMinute / 60) * (hourHeight) + (index * hourHeight)
  return minuteOffset + PADDING_TITLE;
}

function calculateEventOffsetX(widgetWidth: number, meetingIndex: number){
  let eventWidth = widgetWidth / 4
  return meetingIndex * eventWidth + (widgetWidth / 7 + (4 * meetingIndex))
}

function MeetingItem({meeting, widgetWidth, hourHeight, index, meetingIndex}: {meeting: Meeting; widgetWidth: number; hourHeight: number, index: number, meetingIndex: number}) {
  const meetingTime = moment(meeting.time, 'X');
  let eventHeight = calculateEventHeight(meeting, hourHeight);
  let eventTopOffset = calculateEventTopOffset(meeting, hourHeight, index);
  let eventOffsetX = calculateEventOffsetX(widgetWidth, meetingIndex)
  return (
    <FlexWidget
      key={meeting.id}
      clickAction="OPEN_MEETING"
      clickActionData={{
        uri: `${baseDeepLink}${meeting.id}`,
      }}
      style={{
        height: eventHeight,
        backgroundColor: '#FFF',
        borderRadius: 4,
        width: widgetWidth / 4,
        marginTop: eventTopOffset,
        marginLeft: eventOffsetX,
        borderColor: '#1E88E5',
        borderWidth: 1,
      }}
    >
      <STextWidget
        truncate="END"
        maxLines={1}
        text={`${meeting.name} - ${meetingTime}`}
        type={'bold'}
        textStyle={{
          fontSize: 8,
          color: '#2F3139',
          paddingHorizontal: 2
        }}
      />
    </FlexWidget>
  );
}

function CollectionData({
  widgetInfo,
  currentHour,
  eventsGroupedByHour,
}: {
  widgetInfo: any;
  currentHour: number;
  eventsGroupedByHour: Record<number, Meeting[]>;
}) {
  const widgetWidth = widgetInfo?.width;
  const hours = Array.from({length: 8}, (_, index) => currentHour - 2 + index);
  const hourHeight = widgetInfo?.height / 8;

  return (
    <OverlapWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
      }}
    >
      {hours.map((hour, index) => {
        return (
          <FlexWidget
            style={{
              width: 'match_parent',
              height: hourHeight,
              marginTop: index * hourHeight,
            }}
          >
            <FlexWidget
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: 'match_parent',
              }}
            >
              <STextWidget
                text={`${hour}:00`}
                type="bold"
                textStyle={{
                  fontSize: 10,
                  width: widgetWidth / 9,
                  paddingHorizontal: 2,
                }}
              />
              <FlexWidget style={{width: widgetWidth / 1.3, height: 1, backgroundColor: '#000000'}} />
            </FlexWidget>
          </FlexWidget>
        );
      })}
      {hours.map((hour, index) => {
        let eventsThisHour = eventsGroupedByHour[hour] ?? [];
        return (
          <OverlapWidget style={{width:'match_parent', height:'match_parent'}}>
            {eventsThisHour.map((meeting, meetingIndex) => (
              <MeetingItem hourHeight={hourHeight} meeting={meeting} widgetWidth={widgetWidth} index={index} meetingIndex={meetingIndex}/>
            ))}
          </OverlapWidget>
        );
      })}
    </OverlapWidget>
  );
}

const groupEventsByHour = (events: Meeting[], currentHour: number) => {
  const groupedEvents: Record<number, Meeting[]> = {};

  let eventsToday = events.filter((event: Meeting) => moment(event?.time || 0, 'X').isSame(moment(), 'day'));

  for (const event of eventsToday) {
    const eventDate = moment(event.time, 'X');
    const eventHour = eventDate.hour();

    if (eventHour >= currentHour - 2 && eventHour <= currentHour + 5) {
      groupedEvents[eventHour] = groupedEvents[eventHour] || [];
      groupedEvents[eventHour].push(event);
    }
  }

  return groupedEvents;
};

export function CalendarWidget({
  data,
  widgetInfo,
}: {
  data: Meeting[];
  error?: string;
  loading?: boolean;
  widgetInfo: WidgetInfo;
}) {
  const currentHour = moment('1716507317', 'X').hour();
  const groupedByHour = groupEventsByHour(data, currentHour);

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#F0F0F1',
        paddingHorizontal: 16,
      }}
    >
      <CollectionData
        eventsGroupedByHour={groupedByHour}
        widgetInfo={widgetInfo}
        currentHour={currentHour}
      />
    </FlexWidget>
  );
}
