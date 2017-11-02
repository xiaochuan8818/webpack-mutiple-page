const path = require("path");
const webpack = require("webpack")
const webpackMerge = require("webpack-merge");
const OpenBrowserPlugin = require("open-browser-webpack-plugin");
const autoprefixer = require("autoprefixer");
const precss = require("precss");
const commonPath = path.resolve('node_modules');

const baseConfig = require("./webpack.base.js");
const config = require("./config");
const port = config.port;
let localIp = config.localIp; 

module.exports = function(env){
	console.log(`
#################################################
  Server is listening at: http://localhost:${localIp} 
#################################################
	`);
	return webpackMerge(baseConfig(env),{
		entry: config.setEntries(env),
		output: {
			publicPath:"/"
        },
        module:{
			loaders:[
				{ 
                    test: /\.css$/, 
                    use: ["style-loader","css-loader","postcss-loader"],
                },
                { 
                    test: /\.scss$/, 
                    use: ["style-loader","css-loader","postcss-loader","px2rem-loader?remUnit=64","sass-loader"],
                    exclude:commonPath
                },{ 
					test: /\.(png)$/, 
					use: ["url-loader?limit=8192&name=images/[name].[ext]"], 
					exclude: commonPath
				},{
			        test: /\.(jpg|jpeg|gif)$/,
			        use: [
			          {
			            loader: 'file-loader',
			            options: { name: "images/[name].[ext]"}  
			          }
			        ],
			        exclude: commonPath
			    }
			],
		},
	    devtool: "cheap-module-source-map",
		plugins:[
			new webpack.HotModuleReplacementPlugin(),
			new OpenBrowserPlugin({ url: 'http://'+localIp+':' + port }),
			new webpack.LoaderOptionsPlugin({
				options:{
					postcss(){
						return[precss, autoprefixer];
					}
				}
			})
		],
		devServer:{
			host : localIp,
			contentBase:'./views',
			hot:true,
			port:config.port,
			historyApiFallback:true,
		}
	})
}