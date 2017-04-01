var fs = require('fs');  

function contains(array,obj){
    for(i in array){
      if(array[i] == obj) {
        return true;
      }
    }
    return false;
}
/* 
path 
floor  
handleFile 
messageDetail 
 
*/  
  
function walk(path, floor, handleFile,fileArray,needPath,types) {  
    floor++;  
    var files = fs.readdirSync(path);
    files.forEach(function(item) {  
    var tmpPath = path + '/' + item;  
		var stats= fs.statSync(tmpPath);	
		if (stats.isDirectory()) {  
			    var needPathTemp = needPath+"/"+item ;
              walk(tmpPath, floor, handleFile,fileArray,needPathTemp,types);  
          } else {  
              //var  message = handleFile(tmpPath, floor,needPath);
              let names = item.split('\.');
              if(contains(types,names[names.length-1]) == true){
                let message = "'"+item+"':require(\""+needPath+"/"+item+"\")";
  		          fileArray.push(message);
              }
              
          }  
              
      });  
  
}  
  
exports.walk = walk;  
