import {Dimensions} from 'react-native'

var deviceHeight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get('window').width;

const dpi = Math.sqart(deviceWidth*deviceWidth+deviceHeight*deviceHeight)/4

export function getDpi(){
	if(dpi <= 160){
		return "drawable-ldpi"
	}else if(dpi > 160 && dpi <= 240){
		return "drawable-mdpi"
	}else{
		return "drawable-hdpi"
	}
}