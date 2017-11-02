let hrefStr = '';
const os = require('os');

module.exports = {
	createMaps(param,env,entries) {
		//配置模板
		let defaultHtml = '';
		switch ( env ) {
			case 'prod' : 
				defaultHtml = '<!DOCTYPE html>\n<html lang="zh-CN">\n\t<head>\n';
				defaultHtml += '\t<meta charset="UTF-8">\n';
				defaultHtml += '\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
				defaultHtml += '\t<title>'+param+'</title>\n';
				//\t\t<link rel="stylesheet" href="css/index.css">\n
				//defaultHtml += '\t\t<link rel="stylesheet" href="css/reset.css">\n';
				defaultHtml += '\t</head>\n<body>\n\t<div id="app"></div>\n</body>\n</html>';
			break;
			default : 
				if(param == 'index') {
					entries.forEach( ( v,i ) => {
						if(v != 'index') {
							hrefStr += '<div><a href="./'+v+'.html">'+v+'页面入口</a></div>';
						}
					});
					defaultHtml = '<!DOCTYPE html>\n<html lang="zh-CN">\n\t<head>\n';
					defaultHtml += '\t<meta charset="UTF-8">\n';
					defaultHtml += '\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
					defaultHtml += '<style>#app div{width:200px;height:36px;} #app div a{display:block;font-size:16px;}</style>\n';
					defaultHtml += '\t<title>'+param+'</title>\n';
					defaultHtml += '\t</head>\n<body>\n\t<div id="app">测试入口:'+hrefStr+'</div>\n</body>\n</html>';
				}else{
					defaultHtml = '<!DOCTYPE html>\n<html lang="zh-CN">\n\t<head>\n';
					defaultHtml += '\t<meta charset="UTF-8">\n';
					defaultHtml += '\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
					defaultHtml += '\t<title>'+param+'</title>\n';
					//\t\t<link rel="stylesheet" href="css/index.css">\n
					//defaultHtml += '\t\t<link rel="stylesheet" href="css/reset.css">\n';
					defaultHtml += '\t</head>\n<body>\n\t<div id="app"></div>\n</body>\n';
					defaultHtml += '<script type="text/javascript" src="'+param+'.js"></script>\n</html>';
				}
			break;
		}
		return defaultHtml;	
	},
	_IP_ADD() {
		let interfaces = os.networkInterfaces();
		for(let devName in interfaces){    
          let iface = interfaces[devName];    
          for(let i=0;i<iface.length;i++){    
               let alias = iface[i];    
               if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){    
                     return alias.address;    
               }    
          }    
    	}    
	}
}