import React, { Component, PropTypes } from 'react';
import {
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import styles from './styles';

export default class Day extends Component {
  static defaultProps = {
    customStyle: {},
  }

  static propTypes = {
    caption: PropTypes.any,
    customStyle: PropTypes.object,
    filler: PropTypes.bool,
    event: PropTypes.object,
    isSelected: PropTypes.bool,
    isToday: PropTypes.bool,
    isWeekend: PropTypes.bool,
    onPress: PropTypes.func,
    usingEvents: PropTypes.bool,
  }

  dayCircleStyle = (isWeekend, isUseCircle,isSelected, isToday, isNotCurrentMonth, event) => {
    const { customStyle } = this.props;
    const dayCircleStyle = [styles.dayCircleFiller, customStyle.dayCircleFiller];

    if(isUseCircle){
      dayCircleStyle.push(styles.useCircle, customStyle.useCircle);
    }
    if (isSelected && !isToday) {
      dayCircleStyle.push(styles.selectedDayCircle, customStyle.selectedDayCircle);
    } else if (isSelected && isToday) {
      dayCircleStyle.push(styles.currentDayCircle, customStyle.currentDayCircle);
    }

    if (event) {
      dayCircleStyle.push(styles.hasEventCircle, customStyle.hasEventCircle, event.hasEventCircle)
    }
    return dayCircleStyle;
  }

  dayTextStyle = (isWeekend, isUseCircle,isSelected, isToday, isNotCurrentMonth, event) => {
    const { customStyle } = this.props;
    const dayTextStyle = [styles.day, customStyle.day];
    if (isToday && !isSelected) {
      dayTextStyle.push(styles.currentDayText, customStyle.currentDayText);
    } else if (isToday || isSelected) {
      dayTextStyle.push(styles.selectedDayText, customStyle.selectedDayText);
    } else if (isWeekend) {
      dayTextStyle.push(styles.weekendDayText, customStyle.weekendDayText);
      if(isUseCircle){
        dayTextStyle.push(styles.useCircleText, customStyle.useCircleText);
      }
    }
    if(isNotCurrentMonth){
       dayTextStyle.push(styles.notCurrentMonthText, customStyle.notCurrentMonthText);
      if(isUseCircle){
        dayTextStyle.push(styles.useCircleText, customStyle.useCircleText);
      }
    }
    
    if (event) {
      dayTextStyle.push(styles.hasEventText, customStyle.hasEventText, event.hasEventText)
    }
    return dayTextStyle;
  }

  dayTextContent = (isWeekend, isSelected, isToday, event) => {
    let dayText = ""
    if(event){
      dayText = event.hasEventTextContent
    }
    return dayText
  }

  hasEventTextContentStyle = (isWeekend, isSelected, isToday, event) => {
    let textContentStyle = {}
    if(event){
      textContentStyle = event.hasEventTextContentStyle
    }
    return textContentStyle
  }

  render() {
    let { caption,showHook,showDayInfoHoliday,holidayInfo,dayInfo,customStyle,showHolidayText,isNotCurrentMonth} = this.props;
    const {
      filler,
      event,
      isWeekend,
      isSelected,
      isUseCircle,
      isToday,
      usingEvents,
    } = this.props;
    let holiday = "";
    let holidayStyle = {};
    let holidayName = "";
    let isShowHoliday = false;
    let holidayColor = "#999";
    let isShowStar  = false;
    let star = "";
    if(holidayInfo !== undefined && holidayInfo !==null){
       if(holidayInfo.status !==undefined && holidayInfo.status !==null){
          if(holidayInfo.status == 1){
            holiday="休";
            holidayStyle={backgroundColor:"#f43"};
            if(holidayInfo.name !== undefined && holidayInfo.name !== null && holidayInfo.name !== ""){
              holidayName = holidayInfo.name;
              holidayColor="#e02d2d";
            }
          }else if(holidayInfo.status == 2){
            holiday="班";
            holidayStyle={backgroundColor:"#969799"};
          }else{
            if(holidayInfo.name !== undefined && holidayInfo.name !== null && holidayInfo.name !== ""){
              holidayName = holidayInfo.name;
              holidayColor="#e02d2d";
            }
          }
       }
    }

    if(holidayName !== ""){
      //isShowHoliday = true;
    }
    return filler
    ? (
        <TouchableWithoutFeedback>
          <View style={[styles.dayButtonFiller, customStyle.dayButtonFiller]}>
            <Text style={[styles.day, customStyle.day]} />
          </View>
        </TouchableWithoutFeedback>
      )
    : (
      <TouchableOpacity  onPress={this.props.onPress}>
        <View style={{flex:0}}>
        <View style={[styles.dayButton, customStyle.dayButton]}>
          <View style={[this.dayCircleStyle(isWeekend,isUseCircle,isSelected, isToday,isNotCurrentMonth, event)]}>
            <Text style={this.dayTextStyle(isWeekend,isUseCircle,isSelected, isToday,isNotCurrentMonth, event)}>{caption}</Text>
          </View>
          {usingEvents &&
            <View style={[
              styles.eventIndicatorFiller,
              customStyle.eventIndicatorFiller,
              event && styles.eventIndicator,
              event && customStyle.eventIndicator,
              event && event.eventIndicator]}
            />
          }
          </View>
           { showHolidayText && isShowHoliday && <View style={[styles.holidayText,customStyle.holidayText]}><Text numberOfLines={1} style={{color:holidayColor,fontSize:9,textAlign:"center"}}>{holidayName}</Text></View>}
           <View style={[styles.holidayStyle,holidayStyle]}><Text style={[{color:'#ffffff',fontSize:10}]}>{holiday}</Text></View>
           {showHook && <View style={{position:"absolute",right:3,bottom:0}}><Text style={[{color:'green',fontSize:10}]}>{"✓"}</Text></View>}
        </View>
      </TouchableOpacity>
    );
  }
}
