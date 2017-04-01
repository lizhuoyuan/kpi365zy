import { Dimensions, StyleSheet } from 'react-native';

const DEVICE_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  calendarContainer: {
    backgroundColor: '#f7f7f7',
  },
  monthContainer: {
    width: DEVICE_WIDTH,
  },
  calendarControls: {
    flexDirection: 'row',
    flex:0,
    alignItems:"center",
    justifyContent:"center",
    height:45

  },
  controlButton: {
    flex:1,alignItems:"center",justifyContent:"center"
  },
  controlButtonText: {
    margin: 4,
    fontSize: 15,
  },
  title: {
    //flex: 1,
    textAlign: 'center',
    fontSize: 15,
    //margin: 6,
  },
  calendarHeading: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e9e9e9',
    //borderTopWidth: 1,
    //borderBottomWidth: 1,
  },
  dayHeading: {
    flex: 1,
    fontSize: 15,
    textAlign: 'center',
    padding:6,
    paddingTop:8,
    paddingBottom:8
    //marginVertical: 5,
  },
  weekendHeading: {
    flex: 1,
    fontSize: 15,
    textAlign: 'center',
   // marginVertical: 0,
   // color: '#cccccc',
     color:"red",
    padding:6,
    paddingTop:8,
    paddingBottom:8,

    //paddingTop:5,
  },
  weekRow: {
    flexDirection: 'row',
  },
  dayButton: {
    alignItems: 'center',
    padding: 4,
    width: DEVICE_WIDTH / 7,
    borderTopWidth: 1,
    borderTopColor: '#e9e9e9',
  },
  dayButtonFiller: {
    padding: 4,
    width: DEVICE_WIDTH / 7,
  },
  day: {
    fontSize: 15,
    alignSelf: 'center',
  },
  eventIndicatorFiller: {
    marginTop: 4,
    borderColor: 'transparent',
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  eventIndicator: {
    backgroundColor: '#cccccc',
  },
  dayCircleFiller: {
    justifyContent: 'center',
    backgroundColor: 'transparent',
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  currentDayCircle: {
    backgroundColor: 'red',
  },
  currentDayText: {
    color: 'red',
  },
  selectedDayCircle: {
    backgroundColor: 'black',
  },
  hasEventCircle: {
  },
  hasEventText: {
  },
  selectedDayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  weekendDayText: {
   // color: '#cccccc',
   color:"#e02d2d",
  },
  notCurrentMonthText:{
    color: '#cccccc',
  },
  useCircle:{
    backgroundColor: '#66FF66'
  },
  useCircleText:{
    color:"black"
  },
  holidayStyle:{position:'absolute',left:3,top:0,padding:2},
  holidayText:{position:"relative",marginLeft:1,marginTop:0,width:(DEVICE_WIDTH-20)/7,paddingBottom:6}
});

export default styles;
