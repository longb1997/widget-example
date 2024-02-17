/* eslint-disable react-native/no-inline-styles */
import moment from 'moment';
import React from 'react';
import {
  FlexWidget,
  ListWidget,
  SvgWidget,
  TextWidget,
  TextWidgetProps,
} from 'react-native-android-widget';
import {TextWidgetStyle} from 'react-native-android-widget/src/widgets/TextWidget';
import {
  Meeting,
  NO_ACCESS_ERROR,
  baseDeepLink,
  svgRefresh,
  svgStringPlus,
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

function CollectionData({data}: {data: Meeting[]}) {
  const daysOfWeek = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  const today = moment();
  const startDay = today.clone().startOf('month').startOf('week');
  const endDay = today.clone().endOf('month').endOf('week');
  let date = startDay.clone().subtract(1, 'day');

  const daysMatrix = [];
  while (date.isBefore(endDay, 'day')) {
    daysMatrix.push(
      Array(7)
        .fill(0)
        .map(() => date.add(1, 'day').clone()),
    );
  }

  const isSameMonth = (day: moment.Moment) => {
    return day.isSame(today, 'month');
  };

  const getEventsForDay = (day: moment.Moment) => {
    if (!data) return [];
    return data.filter(event =>
      day.isSame(moment.unix(parseInt(event.time)), 'day'),
    );
  };

  return (
    <ListWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
      }}>
      <FlexWidget
        style={{
          width: 'match_parent',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          marginBottom: 5,
        }}>
        {daysOfWeek.map((weekday, index) => (
          <STextWidget
            text={weekday}
            textStyle={{
              fontSize: 14,
              width: 40,
              textAlign: 'center',
              color: index === 6 ? '#d63031' : '#FFF',
            }}
          />
        ))}
      </FlexWidget>
      <FlexWidget
        style={{
          width: 'match_parent',
          backgroundColor: '#636e72',
          height: 1,
        }}
      />
      <FlexWidget
        style={{
          width: 'match_parent',
          alignItems: 'center',
          height: 'match_parent',
        }}>
        {daysMatrix.map((week, index) => (
          <FlexWidget
            key={index}
            style={{
              width: 'match_parent',
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}>
            {week.map((day, dayIndex) => {
              const isCurrentDay = day.isSame(moment(), 'day');
              const eventOfTheDay = getEventsForDay(day);
              return (
                <FlexWidget
                  style={{
                    width: 40,
                    height: 60,
                  }}>
                  <STextWidget
                    text={day.format('D')}
                    key={day.format('DDMMYYYY')}
                    textStyle={{
                      textAlign: 'center',
                      color: isCurrentDay
                        ? '#74b9ff'
                        : isSameMonth(day)
                        ? dayIndex === 6
                          ? '#d63031'
                          : '#FFF'
                        : '#636e72',
                      fontSize: 14,
                      width: 'match_parent',
                    }}
                  />
                  <FlexWidget style={{marginTop: 4, width: 40}}>
                    {eventOfTheDay.slice(0, 1).map(event => (
                      <STextWidget
                        truncate={'END'}
                        maxLines={1}
                        text={event.name}
                        key={event.id}
                        textStyle={{
                          fontSize: 10,
                          width: 'match_parent',
                          backgroundColor: '#74b9ff',
                          color: '#FFF',
                          textAlign: 'center',
                        }}
                        clickAction="OPEN_URI" //This cause error
                        clickActionData={{
                          //This cause error
                          uri: `${baseDeepLink}${event.id}`,
                        }}
                      />
                    ))}
                    {eventOfTheDay.length > 1 && (
                      <STextWidget
                        text={`+${eventOfTheDay.length - 1}`}
                        textStyle={{
                          width: 'match_parent',
                          fontSize: 10,
                          color: '#74b9ff',
                          marginTop: 2,
                          textAlign: 'center',
                        }}
                      />
                    )}
                  </FlexWidget>
                </FlexWidget>
              );
            })}
          </FlexWidget>
        ))}
      </FlexWidget>
    </ListWidget>
  );
}

function ErrorView({error}: {error: string}) {
  if (
    NO_ACCESS_ERROR.some((errorCode: (typeof NO_ACCESS_ERROR)[number]) =>
      error.includes(errorCode),
    )
  ) {
    return (
      <FlexWidget
        style={{
          width: 'match_parent',
          height: 'match_parent',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <STextWidget
          text="Vui lòng đăng nhập để sử dụng Widget!"
          textStyle={{fontSize: 18, color: '#FFF'}}
        />
      </FlexWidget>
    );
  }

  return (
    <FlexWidget
      style={{
        width: 'match_parent',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <STextWidget
        text={`Something wrong: ${error}`}
        textStyle={{fontSize: 18, color: '#FFF'}}
      />
    </FlexWidget>
  );
}

export function CalendarWidget({
  data,
  error = '',
}: {
  data: Meeting[];
  error?: string;
}) {
  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#000',
        paddingHorizontal: 16,
        paddingTop: 16,
        borderRadius: 16,
      }}>
      <FlexWidget
        style={{
          width: 'match_parent',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: 16,
        }}>
        <STextWidget
          text={moment().format('MM/YY')}
          textStyle={{
            textAlign: 'left',
            fontSize: 14,
            color: '#FFF',
          }}
        />
        <FlexWidget style={{flexDirection: 'row', alignItems: 'center'}}>
          <SvgWidget
            svg={svgRefresh}
            style={{height: 20, width: 20}}
            clickAction="RELOAD_WIDGET"
          />
          <SvgWidget
            svg={svgStringPlus}
            style={{height: 20, width: 20, marginLeft: 8}}
            clickAction="OPEN_URI"
            clickActionData={{
              uri: `${baseDeepLink}`,
            }}
          />
        </FlexWidget>
      </FlexWidget>
      {error ? <ErrorView error={error} /> : <CollectionData data={data} />}
    </FlexWidget>
  );
}
