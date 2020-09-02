const path = require('path');

module.exports = {
    mode: "production",
    entry: './src/EventEmitter.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            configFile: path.resolve(__dirname, "tsconfig.webpack.json"),
                        }
                    }
                ],
            },
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
    },
    output: {
        path: path.resolve(__dirname, "dist/browser/"),
        filename: "event-emitter.min.js",
        library: "InfEE",
        libraryTarget: "umd",
        libraryExport: 'EventEmitter'
    }
};