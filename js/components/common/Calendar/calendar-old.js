/**
 * 日历控件
 * 参考react-native-calendar，进行修改
 * Created by yuanzhou on 16/12.
 */
import React, { Component, PropTypes } from 'react';
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image
} from 'react-native';

import Day from './Day';

import moment from 'moment';
import styles from './styles';
import CalendarHolidayData from './CalendarHolidayData'
//import JishuCaleadar from './JishuCalendar'
const DEVICE_WIDTH = Dimensions.get('window').width;
const VIEW_INDEX = 1;
const JishuCaleadar = {};
export default class Calendar extends Component {

  state = {
    currentMonthMoment: moment(this.props.startDate),
    selectedMoment: moment(this.props.selectedDate),
  };

  static propTypes = {
    customStyle: PropTypes.object,
    dayHeadings: PropTypes.array,
    eventDates: PropTypes.array,
    monthNames: PropTypes.array,
    nextButtonText: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    onDateSelect: PropTypes.func,
    onSwipeNext: PropTypes.func,
    onSwipePrev: PropTypes.func,
    onTouchNext: PropTypes.func,
    onTouchPrev: PropTypes.func,
    prevButtonText: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    scrollEnabled: PropTypes.bool,
    selectedDate: PropTypes.any,
    showControls: PropTypes.bool,
    startDate: PropTypes.any,
    titleFormat: PropTypes.string,
    today: PropTypes.any,
    weekStart: PropTypes.number,
  };

  static defaultProps = {
    customStyle: {},
    width: DEVICE_WIDTH,
    dayHeadings: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    eventDates: [],
    monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    nextButtonText: 'Next',
    prevButtonText: 'Prev',
    scrollEnabled: false,
    showControls: false,
    startDate: moment().format('YYYY-MM-DD'),
    titleFormat: 'MMMM YYYY',
    today: moment(),
    weekStart: 1,
    showLunarInfo:false,
    showBackToToDay:false,
    showHolidayText:false,
    useFixedHeight:false,
    showWeekCircle:false,
    showHook:false,
    isPushAllday:false,
    showDayInfoHoliday:false
  };

  componentDidMount() {
    this.scrollToItem(VIEW_INDEX);
  }

  componentDidUpdate() {
    this.scrollToItem(VIEW_INDEX);
  }

  getMonthStack(currentMonth) {
    if (this.props.scrollEnabled) {
      const res = [];
      for (let i = -VIEW_INDEX; i <= VIEW_INDEX; i++) {
        res.push(moment(currentMonth).add(i, 'month'));
      }
      return res;
    }
    return [moment(currentMonth)];
  }

 prepareEventDates(eventDates, events) {
    const parsedDates = {};

    // Dates without any custom properties
    eventDates.forEach(event => {
      const date = moment(event);
      const month = moment(date).startOf('month').format();
      parsedDates[month] = parsedDates[month] || {};
      parsedDates[month][date.date() - 1] = {};
    });

    // Dates with custom properties
    if (events) {
      events.forEach(event => {
        if (event.date) {
            const date = moment(event.date);
            const month = moment(date).startOf('month').format();
            parsedDates[month] = parsedDates[month] || {};
            parsedDates[month][date.date() - 1] = event;
        }
      });
    }
    return parsedDates;
  }

  selectDate(date) {
    this.setState({ selectedMoment: date });
    this.props.onDateSelect && this.props.onDateSelect(date ? date.format("YYYY-MM-DD"): null );
  }
  selectPreMonthDate(date){
     const newMoment = moment(this.state.currentMonthMoment).subtract(1, 'month');
     this.setState({ selectedMoment: date, currentMonthMoment: newMoment });
     this.props.onDateSelect && this.props.onDateSelect(date ? date.format("YYYY-MM-DD"): null );
  }
  selectNextMonthDate(date){
     const newMoment = moment(this.state.currentMonthMoment).add(1, 'month');
     this.setState({ selectedMoment: date, currentMonthMoment: newMoment });
     this.props.onDateSelect && this.props.onDateSelect(date ? date.format("YYYY-MM-DD"): null );
  }
  backToToday(){
    // alert(moment().format('YYYY-MM-DD'))
     this.setState({ currentMonthMoment: moment(),
       selectedMoment: moment()});
      this.props.onDateSelect && this.props.onDateSelect(moment().format("YYYY-MM-DD"));
  }

  onPrev = () => {
    const newMoment = moment(this.state.currentMonthMoment).subtract(1, 'month');
    this.setState({ currentMonthMoment: newMoment });
    this.props.onTouchPrev && this.props.onTouchPrev(newMoment);
  }

  onNext = () => {
    const newMoment = moment(this.state.currentMonthMoment).add(1, 'month');
    this.setState({ currentMonthMoment: newMoment });
    this.props.onTouchNext && this.props.onTouchNext(newMoment);
  }

  scrollToItem(itemIndex) {
    const scrollToX = itemIndex * this.props.width;
    if (this.props.scrollEnabled) {
      this._calendar.scrollTo({ y: 0, x: scrollToX, animated: false });
    }
  }

  scrollEnded(event) {
    const position = event.nativeEvent.contentOffset.x;
    const currentPage = position / this.props.width;
    const newMoment = moment(this.state.currentMonthMoment).add(currentPage - VIEW_INDEX, 'month');
    this.setState({ currentMonthMoment: newMoment });

    if (currentPage < VIEW_INDEX) {
      this.props.onSwipePrev && this.props.onSwipePrev(newMoment);
    } else if (currentPage > VIEW_INDEX) {
      this.props.onSwipeNext && this.props.onSwipeNext(newMoment);
    }
  }

  renderMonthView(argMoment, eventsMap) {

    let
      renderIndex = 0,
      weekRows = [],
      days = [],
      startOfArgMonthMoment = argMoment.startOf('month');
    let argMomentString = argMoment.format('YYYY-MM-DD');
    const
      preMonent = moment(argMomentString).subtract(1,'month'),  //上月
      nextMonent = moment(argMomentString).add(1,'month'),  //下月
      preMonthDaysCount = preMonent.daysInMonth(),
      nextMonthDaysCount = nextMonent.daysInMonth(),
      startOfPreMonthMoment = preMonent.startOf('month'),
      startOfNextMonthMoment = nextMonent.startOf('month'),


      selectedMoment = moment(this.state.selectedMoment),
      weekStart = this.props.weekStart,
      todayMoment = moment(this.props.today),
      todayIndex = todayMoment.date() - 1,
      argMonthDaysCount = argMoment.daysInMonth(),
      offset = (startOfArgMonthMoment.isoWeekday() - weekStart + 7) % 7,
      argMonthIsToday = argMoment.isSame(todayMoment, 'month'),
      selectedIndex = moment(selectedMoment).date() - 1,
      selectedIndexOffset = (moment(selectedMoment).isoWeekday() - weekStart + 7) % 7,
      
      selectedMonthIsArg = selectedMoment.isSame(argMoment, 'month');
    
    let weekRowHeight = {}; 
    if(this.props.useFixedHeight && this.props.showHolidayText){
      let weekHeight = 300/5;
      if((argMonthDaysCount + offset) / 7 > 5){
          weekHeight = 300/6;
      }
      weekRowHeight = {height : weekHeight};
    }
    let messageInfo = "";
    const events = (eventsMap !== null)
      ? eventsMap[argMoment.startOf('month').format()]
      : null;

    do {
      const dayIndex = renderIndex - offset;
      const isoWeekday = (renderIndex + weekStart) % 7;
      let isUseCircle = false;
      if (dayIndex >= 0 && dayIndex < argMonthDaysCount) {
         let dayInfo = null;
          let holidayInfo = null;
          let date = moment(startOfArgMonthMoment).set('date', dayIndex + 1);
          //从极速http://api.jisuapi.com获取的每日详情，包括农历，节假日（以聚合数据为准），星座，黄历的信息等～
          if(this.props.showHolidayText && JishuCaleadar[date.format('YYYY-MM-DD')] !== undefined && JishuCaleadar[date.format('YYYY-MM-DD')] !== null){
            dayInfo = JishuCaleadar[date.format('YYYY-MM-DD')]
          }
          //从聚合数据http://japi.juhe.cn获取的月度节假日信息，最终节假日信息以这个为准～
          let holidays = CalendarHolidayData[date.format('YYYY-M')];
          if(this.props.showHolidayText && holidays !== undefined && holidays !== null){
             if(holidays[date.format('YYYY-M-D')] !== undefined && holidays[date.format('YYYY-M-D')] !== null){
                holidayInfo = holidays[date.format('YYYY-M-D')];
             }
          }
        if(dayIndex <= (selectedIndex - selectedIndexOffset + 6) && dayIndex >= (selectedIndex - selectedIndexOffset)){
            isUseCircle = true;
        }
        days.push((
          <Day
            startOfMonth={startOfArgMonthMoment}
            isWeekend={isoWeekday === 0 || isoWeekday === 6}
            key={`${renderIndex}`}
            onPress={() => {
              this.selectDate(moment(startOfArgMonthMoment).set('date', dayIndex + 1));
            }}
            isNotCurrentMonth={false}
            dayInfo={dayInfo}
            holidayInfo={holidayInfo}
            showHook={this.props.showHook}
            caption={`${dayIndex + 1}`}
            isToday={argMonthIsToday && (dayIndex === todayIndex)}
            isUseCircle={this.props.showWeekCircle && selectedMonthIsArg && isUseCircle}
            isSelected={selectedMonthIsArg && (dayIndex === selectedIndex )}
            event={events && events[dayIndex]}
            usingEvents={this.props.eventDates.length > 0}
            customStyle={this.props.customStyle}
            showHolidayText={this.props.showHolidayText}
            showDayInfoHoliday={this.props.showDayInfoHoliday}
          />
        ));
      } else {
        if(this.props.isPushAllday){
          if(dayIndex <= (selectedIndex - selectedIndexOffset + 6) && dayIndex >= (selectedIndex - selectedIndexOffset)){
              isUseCircle = true;
          }
          if(dayIndex < 0){
            let dayInfo = null;
            let holidayInfo = null;
            let date = moment(startOfPreMonthMoment).set('date', preMonthDaysCount + dayIndex + 1);
            if(this.props.showHolidayText && JishuCaleadar[date.format('YYYY-MM-DD')] !== undefined && JishuCaleadar[date.format('YYYY-MM-DD')] !== null){
              dayInfo = JishuCaleadar[date.format('YYYY-MM-DD')]
            }
            holidays = CalendarHolidayData[date.format('YYYY-M')];
            if(this.props.showHolidayText && holidays !== undefined && holidays !== null){
               //let holidayMonthTemp = holidayMonth + "-" + (dayIndex + 1);
               if(holidays[date.format('YYYY-M-D')] !== undefined && holidays[date.format('YYYY-M-D')] !== null){
                  holidayInfo = holidays[date.format('YYYY-M-D')];
               }
            }
            days.push(
                   <Day
                      startOfMonth={startOfPreMonthMoment}
                      isWeekend={isoWeekday === 0 || isoWeekday === 6}
                      key={`${renderIndex}`}
                      onPress={() => {
                        this.selectPreMonthDate(date);
                      }}
                      isNotCurrentMonth={true}
                      showHook={this.props.showHook}
                      dayInfo={dayInfo}
                      holidayInfo={holidayInfo}
                      caption={`${preMonthDaysCount + dayIndex + 1}`}
                      isToday={argMonthIsToday && (dayIndex === todayIndex)}
                      isUseCircle={this.props.showWeekCircle && selectedMonthIsArg && isUseCircle}
                      isSelected={selectedMonthIsArg && (dayIndex === selectedIndex )}
                      event={events && events[dayIndex]}
                      usingEvents={this.props.eventDates.length > 0}
                      customStyle={this.props.customStyle}
                      showHolidayText={this.props.showHolidayText}
                      showDayInfoHoliday={this.props.showDayInfoHoliday}
                    />
            )
          }else{
              let dayInfo = null;
              let holidayInfo = null;
              let date = moment(startOfNextMonthMoment).set('date',dayIndex - argMonthDaysCount + 1);
              if(this.props.showHolidayText && JishuCaleadar[date.format('YYYY-MM-DD')] !== undefined && JishuCaleadar[date.format('YYYY-MM-DD')] !== null){
                dayInfo = JishuCaleadar[date.format('YYYY-MM-DD')]
              }
              holidays = CalendarHolidayData[date.format('YYYY-M')];
              if(this.props.showHolidayText && holidays !== undefined && holidays !== null){
                 //let holidayMonthTemp = holidayMonth + "-" + (dayIndex + 1);
                 if(holidays[date.format('YYYY-M-D')] !== undefined && holidays[date.format('YYYY-M-D')] !== null){
                    holidayInfo = holidays[date.format('YYYY-M-D')];
                 }
              }
              days.push(
                     <Day
                        startOfMonth={startOfNextMonthMoment}
                        isWeekend={isoWeekday === 0 || isoWeekday === 6}
                        isNotCurrentMonth={true}
                        key={`${renderIndex}`}
                        onPress={() => {
                          this.selectNextMonthDate(date);
                        }}
                        dayInfo={dayInfo}
                        showHook={this.props.showHook}
                        holidayInfo={holidayInfo}
                        caption={`${dayIndex - argMonthDaysCount + 1}`}
                        isToday={argMonthIsToday && (dayIndex === todayIndex)}
                        isUseCircle={this.props.showWeekCircle && selectedMonthIsArg && isUseCircle}
                        isSelected={selectedMonthIsArg && (dayIndex === selectedIndex )}
                        event={events && events[dayIndex]}
                        usingEvents={this.props.eventDates.length > 0}
                        customStyle={this.props.customStyle}
                        showHolidayText={this.props.showHolidayText}
                        showDayInfoHoliday={this.props.showDayInfoHoliday}
                      />
              )
           }
         }else{
             days.push(<Day key={`${renderIndex}`} filler customStyle={this.props.customStyle} />);
         }
      }
      if (renderIndex % 7 === 6) {
        weekRows.push(
          <View
            key={weekRows.length}
            style={[styles.weekRow,weekRowHeight,this.props.customStyle.weekRow]}
          >
            {days}
          </View>);
        days = [];
        if (dayIndex + 1 >= argMonthDaysCount) {
          break;
        }
      }
      renderIndex += 1;
    } while (true)
    const containerStyle = [styles.monthContainer, this.props.customStyle.monthContainer];
    return <View key={argMoment.month()} style={containerStyle}>{weekRows}</View>;
  }

  renderHeading() {
    const headings = [];
    for (let i = 0; i < 7; i++) {
      const j = (i + this.props.weekStart) % 7;
      headings.push(
        <Text
          key={i}
          style={j === 0 || j === 6 ?
            [styles.weekendHeading, this.props.customStyle.weekendHeading] :
            [styles.dayHeading, this.props.customStyle.dayHeading]}
        >
          {this.props.dayHeadings[j]}
        </Text>
      );
    }

    return (
      <View style={[styles.calendarHeading, this.props.customStyle.calendarHeading]}>
        {headings}
      </View>
    );
  }

  renderTopBar() {
    let localizedMonth = this.props.monthNames[this.state.currentMonthMoment.month()];
    localizedMonth = this.state.currentMonthMoment.month() + 1;
    if(localizedMonth < 10){
      localizedMonth = "0" + localizedMonth + "月";
    }else{
      localizedMonth += "月";
    }
     return this.props.showControls
    ? (
        <View style={[styles.calendarControls, this.props.customStyle.calendarControls]}>
          <TouchableOpacity
            style={[styles.controlButton, this.props.customStyle.controlButton]}
            onPress={this.onPrev}
          >
           <Text style={{fontSize:20,color:"#7a7a7a",textAlign:"right",marginRight:20}}>←</Text>
          </TouchableOpacity>
          <View style={{flex:1,justifyContent:"center"}}>
            <Text style={[styles.title, this.props.customStyle.title]}>
              {this.state.currentMonthMoment.year()}年{localizedMonth} 
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.controlButton, this.props.customStyle.controlButton]}
            onPress={this.onNext}
          >
           <Text style={{fontSize:20,color:"#7a7a7a",textAlign:"left",marginLeft:20}}>→</Text>
        
          </TouchableOpacity>
        </View>
      )
    : (
      <View style={[styles.calendarControls, this.props.customStyle.calendarControls]}>
        <Text style={[styles.title, this.props.customStyle.title]}>
          {this.state.currentMonthMoment.year()}年{localizedMonth} 
        </Text>
      </View>
    );
  }

  render() {
    const calendarDates = this.getMonthStack(this.state.currentMonthMoment);
    //alert(calendarDates)
    const eventDatesMap = this.prepareEventDates(this.props.eventDates, this.props.events);
    let lunarInfo = "";
    let jishuAll = this.state.selectedMoment.format('YYYY-MM-DD');
    let yi = "";
    let ji = "";
    if(JishuCaleadar[jishuAll] !== undefined && JishuCaleadar[jishuAll] !== null){
          let dayInfo = JishuCaleadar[jishuAll];
          lunarInfo += "农历"+ dayInfo.lunaryear+"年"+dayInfo.lunarmonth+dayInfo.lunarday;
          lunarInfo += "⚬"+ dayInfo.star;
          lunarInfo += "⚬" + dayInfo.shengxiao+"年";
          if(dayInfo.huangli.yi !== ""){
            yi += "宜:";
            let i = 0;
            dayInfo.huangli.yi.forEach(function(text){
              if(i<=4){
                yi += text + "⚬";
              }
              i++;
            })
          }
          if(dayInfo.huangli.ji !== ""){
            let i=0;
            ji += "忌:";
            dayInfo.huangli.ji.forEach(function(text){
               if(i<=4){
                ji += text + "⚬";
              }
              i++;
            })
          }
    }
    return (
      <View style={[styles.calendarContainer, this.props.customStyle.calendarContainer]}>
        {this.renderTopBar()}
        {this.renderHeading(this.props.titleFormat)}
        {this.props.scrollEnabled ?
          <ScrollView
            ref={calendar => this._calendar = calendar}
            horizontal
            scrollEnabled
            pagingEnabled
            removeClippedSubviews
            scrollEventThrottle={1000}
            showsHorizontalScrollIndicator={false}
            automaticallyAdjustContentInsets
            onMomentumScrollEnd={(event) => this.scrollEnded(event)}
          >
            {calendarDates.map((date) => this.renderMonthView(moment(date), eventDatesMap))}
          </ScrollView>
          :
          <View ref={calendar => this._calendar = calendar}>
            {calendarDates.map((date) => this.renderMonthView(moment(date), eventDatesMap))}
          </View>
        }
        {this.props.showLunarInfo &&<View style={{padding:10,alignItems:"center",backgroundColor:"#5af"}}>
          <Text style={{fontSize:15,color:"#ffffff"}}>{lunarInfo}</Text>
          <Text style={{fontSize:15,color:"#ffffff"}}>{yi}</Text>
          <Text style={{fontSize:15,color:"#ffffff"}}>{ji}</Text>
        </View>}
        {this.props.showBackToToDay && <View >
           <TouchableOpacity
            style={[{flex:0,width:100,height:40,alignSelf:"center",justifyContent:"center",borderRadius:8,borderWidth:2,borderColor:"rgb(29,169,252)",margin:10}]}
            onPress={this.backToToday.bind(this)}
          >
           <Text style={{fontSize:15,color:"rgb(29,169,252)",textAlign:"center"}}>今天</Text>
          </TouchableOpacity>
        </View>
      }
      </View>
    );
  }
}
