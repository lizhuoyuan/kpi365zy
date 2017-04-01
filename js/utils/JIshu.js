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
let writePath = dirName + "/js/utils/JishuCalendarHolidayDataTemp.js";
let i = 0;
/**
*写文件
*/
function writeFile(path,content){
	//fs.writeFileSync(path, content,{flag:"a"});
   fs.writeFile(path, content,{flag:"a"},function (err) {
    if(err) {
      console.log("file write error!")
    }else{
      console.log("file write success!");
    }
  });
}

function getMessage(resource,year,month,day){
   let date =  year+"-"+month+"-"+day;
   let date2 = year;
   if(month < 10){
   	 date2 += "-0" + month;
   }else{
   	 date2 += "-" + month;
   }
   if(day < 10){
   	 date2 += "-0" + day;
   }else{
   	 date2 += "-" + day;
   }
   if(date2 <= "2030-12-31"){
   	 let url = "http://api.jisuapi.com/calendar/query?appkey=8403cf5426f619f4&";
	 url = url+"date="+date;
   	 request(url, function (error, response, body) {
	   if(!error && response.statusCode == 200) {
	   		 let content = JSON.parse(body)
	   		 console.log(year + "-" + month + "-" +day);
	   		 //console.log(content);
	   		 if(content.status == 0){
	   		 	//resource.push(content.result);
	   		 	 let obj = content.result;
			     let str= "'" + obj.year + "-"+obj.month+"-"+obj.day+"':";
			     str += JSON.stringify(obj);		   
				//str += "";
			    //str["year-month"]
			   	 str = str + ",\n";
			   	 writeFile(writePath,str);
	   		 }	
	   		 
	   		day = day + 1;
	   		let d = new Date(date);
			//let currentDay = d.getDate();
			//let monthTemp = d.getMonth()+1;
			let monthDays = new Date(d.getFullYear(),(d.getMonth()+1),0).getDate();
            if(day > monthDays){
            	day = 1;
            	month = month + 1;
            }
	    	if(month > 12){
		   	 	month = 1;
		   	 	year++;
		   	}
	    	getMessage(resource,year,month,day);
	    //console.log(content.result.data)
	  }
	});
   }else{
   	 /* var imageResourceContent = "";//" const calendar = { \n";
		for(let i=0; i < ImageResourceArray.length; i++){
		    let obj = ImageResourceArray[i];
		     let str= "'" + obj.year + "-"+obj.month+"-"+obj.day+"':";
		     str += JSON.stringify(obj);		   
			//str += "";
		    //str["year-month"]
		   	 imageResourceContent += str + ",\n";
		}
		//imageResourceContent += "}\n"
		//imageResourceContent += "export default calendar";
		writeFile(writePath,imageResourceContent);*/
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
 getMessage(ImageResourceArray,2021,11,4)
