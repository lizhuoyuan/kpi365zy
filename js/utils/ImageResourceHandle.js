var imageResourceWalk = require('./ImageResourceWalker');  
var fs = require('fs');  
var process = require('process');

/**
* 文件处理
*/
function handleFile(path, floor,needPath) {  
    var blankStr = ''; 
    var message = '';
    for (var i = 0; i < floor; i++) {  
        blankStr += '    ';  
    }  
  var stats = fs.statSync(path);
   if (stats.isDirectory()) {   
     } else {  
  		var temp1 = path.split('/');
  		message = "'"+temp1[temp1.length]+"':require(\""+needPath+"/"+temp1[temp1.length-1]+"\")";
    }  
   return message;
  
}  
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
let dirName = process.cwd();
var ImageResourceArray = [];
let types = ["png","jpg","jpeg"];
//let path = C:/Users/xuyuanzhou/Desktop/resource"
let path = dirName+"/js/resource";
let needPath = "../resource";
let writePath = dirName + "/js/utils/ImageResource.js";
imageResourceWalk.walk(path, 0, handleFile,ImageResourceArray,needPath,types);
var imageResourceContent = " const ImageResource = { \n";
for(let i=0; i < ImageResourceArray.length; i++){
    let str = ImageResourceArray[i];
    imageResourceContent += str + ",\n";
}
imageResourceContent += "}\n"
imageResourceContent += "export default ImageResource";
writeFile(writePath,imageResourceContent);