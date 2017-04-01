 /**
 * Http
 * Created by Jeepeng on 2015/9/10.
 */
 'use strict';
var express = require('express'); 
var request = require('request');
var fs = require('fs');  
var process = require('process');

let dirName = process.cwd();
var ImageResourceArray = [];
let writePath = dirName + "/js/utils/CalendarHolidayData.js";
let i = 0;
/**
*写文件
*/
function writeFile(path,content){
   fs.writeFile(path, content,function (err) {
    if(err) {
      console.log("file write error!")
    }else{
      console.log("file write success!");
    }
  });
}

function getMessage(resource,year,month){
   if(year <= 2018){
   	 let url = "http://japi.juhe.cn/calendar/month?";
	 let yearmonth="year-month=" + year+"-"+month+"&";
	 let key = "key=11032156c7892c1f7b9c3e1ba05cfa1d";
	 url = url+yearmonth + key;
   	 request(url, function (error, response, body) {
	   if(!error && response.statusCode == 200) {
	   		 let content = JSON.parse(body)
	   		 console.log(year + "-" + month);
	   		 if(content["error_code"] == 0 && content.reason == "Success"){
	   		 	resource.push(content.result.data)
	   		 }	    	
	    	month = month + 1;
	    	if(month > 12){
		   	 	month = 1;
		   	 	year++;
		   	}
	    	getMessage(resource,year,month)
	    //console.log(content.result.data)
	  }
	})
   }else{
   	  var imageResourceContent = " const calendar = { \n";
		for(let i=0; i < ImageResourceArray.length; i++){
		    let obj = ImageResourceArray[i];
		    
		    let holiday = [];
		    holiday = JSON.parse(obj["holiday"]);
		   // console.log(holiday[0])
		    if(holiday[0] !== undefined){
		    	let str = "\""+obj['year-month']+"\":{\n";
			    holiday.forEach(function(temp){
			    	//str += "\""+temp.festival+"\":{";
			    	let list = temp["list"];
			    	list.forEach(function(temp2){
			    		if(temp2.date.indexOf(obj['year-month']) != -1){
				    		if(temp2.status == 1 && temp.festival==temp2.date){
				    			str += "\""+temp2.date+"\":{";
				    			str += "status:"+temp2.status+",name:\""+temp.name+"\"},\n";
				    		}else{
				    			str += "\""+temp2.date+"\":{";
				    			str += "status:"+temp2.status+"},\n";
				    			str += "status:"+temp2.status+"},\n";
				    		}
			    		}
			    	});
			    	//str +=""
			    	//str +="}"
			    });
			    str += "}";
		    //str["year-month"]
		   	   imageResourceContent += str + ",\n";
			}
		}
		imageResourceContent += "}\n"
		imageResourceContent += "export default calendar";
		writeFile(writePath,imageResourceContent);
	}
}
//let url = "http://japi.juhe.cn/calendar/month?";
//let yearmonth="year-month=2016-10&";
//let key = "key=11032156c7892c1f7b9c3e1ba05cfa1d";
// url = url+yearmonth + key;
/*let years = [2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025,2026];
let months = [1,2,3,4,5,6,7,8,9,10,11,12];
years.forEach(function(year){
	months.forEach(function(month){
		yearmonth="year-month=" + year+"-"+month+"&";
 		 url = url+yearmonth + key;
 		 getMessage(url,ImageResourceArray)
	})
})*/
 /*for(let year=2015;year < 2020;year++){
 	for(let month=1;month<=12;month++){
 		 yearmonth="year-month=" + year+"-"+month+"&";
 		 url = url+yearmonth + key;
 		 getMessage(url,ImageResourceArray)
 	}
 }*/
 getMessage(ImageResourceArray,2017,1)
