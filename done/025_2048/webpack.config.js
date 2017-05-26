var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path = require('path');

module.exports = {
    // entry:   Webpack 會將每個 entry 文件編譯打包。當然，其中 require 的文件 (js, css, img) 會一起被打包進來。
    // output:  打包後生成的檔案路徑。
    // resolve: require 相關設置
    // module:  
    // devtool: 設置 eval 或 SourceMap 屬性，debug 用
    // plugins: 插件配置
    context: path.join(__dirname, "src"),
    entry: './js/client.js',
    output: {
        // path:        打包生成的目錄
        // filename:    生成的 js 檔名
        // publicPath:  CSS 打包時修改的引用檔案路徑
        path: path.join(__dirname, 'src'),
        filename: 'client.min.js',
        publicPath: '/'
    },
    resolve: {
        // root:        require 的根目錄 (模組的引用不受影響)
        // extensions:  require 可省略的副檔名
        // ailas:       屬性對應的值會形成 ailas 對應。ailas: { a:'b' } => require('a') 同於 require('b')
        // path.resolve 可以傳入任意數量的字串，會將他們以類似 cd 的方式一一執行，並回傳最後的絕對路徑
        // root: [path.resolve(__dirname, 'src')],
        extensions: ['.js', '.jsx','.less'],
        modules: [
            path.resolve('./js/reducers'),
            path.resolve('./node_modules')
        ]
    },
    module: {
        // loaders:     entry 及 require 到的檔都會依此轉換成 JS，anything to JS
        loaders: [{
            test: /\.less$/,
            include: /css/,
            loader: 'style-loader!css-loader!less-loader'
        },{ 
            test: /\.svg$/, 
            include: /images/,
            loader: 'svg-url-loader' 
        },{
            // test:指定目標檔案的檔名
            // loader:指定使用的 loader
            // include:白名單，只處理的目錄
            // exclude:黑名單，忽略、不處理的目錄
            test: /\.js[x]?$/,
            exclude: /node_modules/, // node_modules 的 JS 檔必定是瀏覽器原本就能吃的 ES5，不需要經過編譯，所以忽略以增加效率和避免錯誤
            loader: 'babel-loader',
            query: {
                presets: ['react', 'es2015', 'stage-0'],
                plugins: ['react-html-attrs']
            }
        }]
    },
    devtool: debug ? 'inline-source-map' : null,
    // 種類：
    // 'eval'
    // 'source-map'
    // 'hidden-source-map'
    // 'inline-source-map'
    // 'eval-source-map'
    // 'cheap-source-map'
    // 'cheap-module-source-map'
    plugins: debug ? [] : [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
    ],
}