module.exports = {
    extends: 'eslint:recommended',
    env: {
        browser: true,
        commonjs: true,
        amd: true,
        es6: true,
        jquery: true
    },
    parser: 'babel-eslint',
    parserOptions: {
        // ECMA 版本
        ecmaVersion: 6,
        sourceType: 'module', // module
        experimentalObjectRestSpread: true,
        classes: true
    },
    // 不用检查的全局变量
    globals: {
        'Handlebars': false,
        '__dirname': false
    },
    /**
     *  'off' 或 0 - 关闭规则
     *	'warn' 或 1 - 开启规则，使用警告级别的错误：warn（不会导致程序退出）
     *  'error' 或 2 - 开启规则，使用错误级别的错误：error（当触发的时候，程序会退出）
     */
    rules: {
        // 禁用 console
        'no-console': 0,
        // 数组和对象键值对最后一个逗号， never参数：不能带末尾的逗号, always参数：必须带末尾的逗号，
        // always-multiline：多行模式必须带逗号，单行模式不能带逗号
        'comma-dangle': [1, 'never'],
        // 禁用 debugger
        'no-debugger': 0,
        // 强制数组方法的回调函数中有 return 语句
        'array-callback-return': 1,
        // 要求 switch 语句中有 default 分支
        'default-case': 2,
        // 要求使用 === 和 !==
        'eqeqeq': 1,
        // 禁止不必要的 .bind() 调用
        'no-extra-bind': 2,
        // 强制使用驼蜂式命名法
        'camelcase': 1,
        // 强制使用一致的缩进，四个空格
        'indent': 1,
        // 强制使用一致的反勾号（ `），双引号（"）或者单引号（'）
        'quotes': [1, 'single'],
        // ES6：要求箭头函数的参数使用圆括号
        'arrow-parens': 1
    }
};