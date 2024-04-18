const path = require('path');

module.exports = {
	entry: path.resolve(__dirname, 'src/index-build.ts'),
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: {
					loader: 'ts-loader',
					options: {
						context: __dirname,
						configFile: path.resolve(__dirname, 'tsconfig-build.json'),
					}
				},
				exclude: /node_modules/
			},
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
		modules: [
			path.resolve(__dirname, 'node_modules'),
			path.resolve(__dirname, './'),
		]
	},
	output: {
		filename: 'daisycon-bundle.min.js',
		path: path.resolve(__dirname, 'lib/build'),
		library: "daisycon"
	},
};
