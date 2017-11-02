const path = require("path");
const webpack = require("webpack");
const webpackMerge = require("webpack-merge");
const ExtractTextPlugin = require("extract-text-webpack-plugin"); 
const HTMLWebpackPlugin = require("html-webpack-plugin");
const autoprefixer = require("autoprefixer");
const precss = require("precss");
const baseConfig = require("./webpack.base.js");
const config = require("./config.js");
const vendor = config.vendor;
const commonPath = path.resolve('node_modules');
let url = "tpl/customer.html";
const addTemplate = (env) => {
	let resetBaseconfig = baseConfig(env);
	config.entries.forEach( (val,key) => {
		if(val === 'index') return;
		let url = "tpl/"+val+".html";
		resetBaseconfig.plugins.push(new HTMLWebpackPlugin(
			{
				filename : val+'.html',
				template: path.resolve("src",url),
				chunks: ['manifest', 'vendor',val]
			}
		));
	})
	return resetBaseconfig;
}
module.exports = function(env){
	//添加页面模板文件
	//console.log(JSON.stringify(addTemplate(env)))
	return webpackMerge(addTemplate(env),{
		entry: config.setEntries(env),
		output: {
			publicPath:"http://122.112.12.102/public/dist/"
	    },
	    module : {
	    	loaders : [
	    		{ 
                    test: /\.scss$/, 
                    use:ExtractTextPlugin.extract({
                    	fallback : "style-loader",
                    	use : ["css-loader","postcss-loader","px2rem-loader?remUnit=64","sass-loader"]
                    }),
                    exclude: commonPath
                },
                { 
                    test: /\.css$/, 
                    use: ExtractTextPlugin.extract({
                    	fallback : "style-loader",
                    	use : ["css-loader","postcss-loader"]
                    }),
                },
                { 
					test: /\.(png)$/, 
					use: ["url-loader?limit=8192&name=images/[hash:8].[ext]"], 
					exclude: commonPath
				},{
			        test: /\.(jpg|jpeg|gif)$/,
			        use: [
			          {
			            loader: 'file-loader',
			            options: { name: "images/[hash:8].[ext]"}  
			          }
			        ],
			        exclude: commonPath
			    }
	    	]
	    },
		plugins:[
			new webpack.optimize.UglifyJsPlugin({
				compress: {
					warnings: false,
					screw_ie8: true,
					conditionals: true,
					unused: true,
					comparisons: true,
					sequences: true,
					dead_code: true,
					evaluate: true,
					if_return: true,
					join_vars: true,
				},
				output: {
					comments: false,
				},
			}),
			new ExtractTextPlugin({
				filename:"css/[name]/style.[contenthash:16].css",
				allChunks:true
			}),
			new webpack.optimize.CommonsChunkPlugin({
        		name: ["vendor","manifest"]
    		}),
    		new webpack.DefinePlugin({
				"process.env": { 
					NODE_ENV: JSON.stringify("production") 
				}
			}),
			new webpack.LoaderOptionsPlugin({
				options:{
					postcss(){
						return[precss, autoprefixer];
					},
					sassLoader: {
                        sourceMap: true
                    }
				}
			})
		]
	})
}