var path = require('path');
const webpack = require('webpack');

function srcPath(subdir) {
	return path.join(__dirname, "src", subdir);
}

module.exports = {
	mode: 'development',
	entry: {
		"bundle": path.join(__dirname, 'demo/src/index.tsx'),
	},
	output: {
		filename: "[name].js",
		path: path.join(__dirname, 'demo/dist'),
		publicPath: "/"
	},

	optimization: {
		splitChunks: {
			cacheGroups: {
				vendor: {
					chunks: "initial",
					test: path.resolve(process.cwd(), "node_modules"),
					name: "vendor",
					enforce: true
				}
			}
		},
		concatenateModules: true,
		usedExports: true,
		sideEffects: true
	},

	devServer: {
		contentBase: path.join(__dirname, "demo/dist"),
		compress: true,
		port: 9000,
		hot: true,
		clientLogLevel: "warning",
		historyApiFallback: true
	},

	resolve: {
		extensions: [".ts", ".tsx", ".js", ".json"],
		
		alias: {
			common: srcPath('common'),
			components: srcPath('components')
		}
	},

	devtool: 'source-map',

	module: {
		rules: [
			{
				test: /\.tsx?$/,
				include: path.resolve(__dirname, 'demo/src'),
				use: [
					"awesome-typescript-loader"
				],
			},
			
			// All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
			{ enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
		]
	},

	externals: [
		{
			"react": "React",
			"react-dom": "ReactDOM",
		}
	],

	plugins: [
		new webpack.NamedModulesPlugin(),
		new webpack.HotModuleReplacementPlugin(),

		new webpack.DefinePlugin({
			ENV: JSON.stringify("dev")
		}),

		//new BundleAnalyzerPlugin()
	]
	
};
