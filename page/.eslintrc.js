module.exports = {
    "env": {
        "browser": true,
        "es2017": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "@typescript-eslint"
    ],
    "rules": {
		'indent': [
			'error',
			'tab',
		], // indent는 tab으로 통일
		'react/jsx-indent' : [2, 'tab'], // jsx에서도 indent tab으로 통일
		'react/jsx-filename-extension': [1, { 'extensions': ['.js', '.jsx', '.ts'] }], // 확장자 설정
		'linebreak-style': ['error', 'windows'], // CRLF
		'no-unused-vars': 'warn', // 정의 후 사용하지 않은 변수는 경고만 하기
		'no-use-before-define': 1, // 정의 전에 사용 금지
		'no-console': 0, // console 사용하기
		'camelcase': ['error', { 'properties': 'always' }], // 속성에 camelcase 사용
		'no-tabs': 0, // tab 사용 안되는 rule
		'quote-props': 0, // property에 quote를 씌우지 말아야하는 rule
        'react/prop-types' : 0, // 으..
        'no-undef' : 0,
        'react/display-name' : 0,
    }
};
