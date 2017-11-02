const path = require("path")
const webpack = require("webpack")
const config = require("./config");
const publicPath = config.publicPath;
const commonPath = path.resolve('node_modules');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = function(env){
	return{
		output: {
			path:path.resolve(__dirname,"../dist"),
            sourceMapFilename: "[name].map",
            filename: (env==="dev")?"[name].js":"js/[name]/[name].[hash:16].js"
        },
        resolve: {
            extensions: [".ts", ".js", ".json"],
            modules: [path.join(__dirname, "../src"), "node_modules"]
        },
        module:{
			loaders:[
				{
					test:/\.(jsx|js)?$/,
					use:["babel-loader"],
					exclude: commonPath
				},
			    {
				    test: /\.html$/,
				    loader: 'html-withimg-loader',
				    exclude: commonPath
				}
			]
		},
		plugins : [
			new webpack.ProvidePlugin({
		        $:"jquery",
		        jQuery:"jquery",
		        "window.jQuery":"jquery"
		    })
		]
	}
}