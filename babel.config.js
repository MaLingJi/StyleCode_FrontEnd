// babel.config.js
module.exports = {
    presets: [
      '@babel/preset-env', // 处理 JavaScript 的语法转换
      '@babel/preset-typescript' // 如果使用 TypeScript，可以添加这个预设
    ],
    plugins: [
      '@babel/plugin-transform-runtime' // 优化 Babel 的转换功能
    ]
};
