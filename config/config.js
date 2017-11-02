const path = require('path');
const fs = require('fs');
const utils = require('./utils.js');

module.exports = {
	port:8080,
	localIp : utils._IP_ADD(),
	vendor:[
		"react",
		"react-dom",
		"react-router",
		"redux",
		"react-redux",
		"prop-types",
		"isomorphic-fetch",
		"es6-promise",
		"redux-thunk",
		"classnames",
	],
	entries : [
		'index',
		'customer',
		'manager',
		'member'
	],
	removeStatus : false,
	setEntries(env) {
		let entryObj = {},
			entryArr = '';
		this.entries.forEach( (v,i) => {
			this.addhtmlTemplate(v,env);
			if( v == 'index') return;
			entryObj[v] = [];
			if( env === 'dev' ) {
				entryArr = [
					"react-hot-loader/patch",
			        "webpack-dev-server/client?http://"+this.localIp+":" + this.port,
				    "webpack/hot/only-dev-server",
				    path.resolve(__dirname,`../src/${v}.js`)
				];
				entryObj[v] = entryObj[v].concat(entryArr);
			}else{
				entryArr = path.resolve(__dirname,`../src/${v}.js`);
				entryObj[v] = entryArr;
			};	
		});
		entryObj.vendor = this.vendor;
		return entryObj;
	},
	addhtmlTemplate(param,env) {
		let defaultHtml = utils.createMaps(param,env,this.entries);
		//配置模板路径
		let TEM_PATH = env=='dev'?path.resolve(__dirname,`../views/${param}.html`):
								  path.resolve(__dirname,`../src/tpl/${param}.html`);

		(param=='index'&&fs.existsSync(TEM_PATH)) &&　fs.unlinkSync(TEM_PATH);

		let checkFiles = new Promise( (resolve,reject) => {
			fs.exists(TEM_PATH, (exist) => {
				if(!exist) {
					resolve(TEM_PATH)
				}else{
					reject(param)
				}
			})
		})
		//写入程序
		let writeFile = (path) => {
			fs.writeFile(path,defaultHtml, (err,data) => {
				if(err) {
					console.log(
						'******* 创建'+param+'模板文件失败！*******'
					);
				}else{
					console.log(
						'******* 创建'+param+'模板文件成功！*******'
					);
				}
			});
		};
		checkFiles.then( (data) => {
			writeFile(data);
		}).catch( (data) => {
			console.log('********'+data+'.html文件已创建!********');
		});
	},
	removehtmlTemplate() {
		let TEM_PATH = path.resolve(__dirname,'../views');
		let removefiles = fs.readdirSync(TEM_PATH);
		removefiles.forEach( (v,i) => {
			fs.unlink(TEM_PATH+'/'+v+'.html', () => {
				if(err){
				  throw err;
				 }
				 console.log('文件:'+TEM_PATH+'/'+v+'.html删除成功！');
			});
		});
	}
}