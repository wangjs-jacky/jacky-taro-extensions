// 内置的公共配置
export const DEFAULT_SUPPORTEXTS = [".ts", ".tsx", ".js", ".jsx", ".scss", ".css"];

// 需要监听的 源码 目录（默认 src）
export const DEFAULT_SRCS = [
	{
		path: "./src",
		ignore: ""
	}
];

export const DEFAULT_DISTS = [
	{
		path: "./dist-crn/xtaro-tnt-trip/src/taro",
		prefix: ".crn",
		ignore: ""
	},
	{
		path: "./dist-nfes/src",
		prefix: ".h5",
		ignore: ""
	},
];

export const DEFAULT_CROSS_PLATFORM = {
	".h5": {
		"label": "H5",
	},
	".crn": {
		"label": "crn",
	}
} as any;

// 维护一套映射路径规则：
export const temp_patterns = [
	{
		"ignore": "",
		"relativePath": "./src",
		"source": "./src/**/*{.ts,.tsx,.js,.jsx,.scss,.css}",
		"target": [
			"./src/<reldir>/<basename>.h5<ext>",
			"./src/<reldir>/<basename>.crn<ext>",
			"./src/<reldir>/<basename><ext>",
			"./dist-crn/xtaro-tnt-trip/src/taro/<reldir>/<basename><ext>",
			"./dist-nfes/src/<reldir>/<basename><ext>",
		],
	},
	{
		"ignore": "",
		"relativePath": "./dist-crn/xtaro-tnt-trip/src/taro",
		"source": "./dist-crn/xtaro-tnt-trip/src/taro/**/*{.ts,.tsx,.js,.jsx,.scss,.css}",
		"target": [
			"./src/<reldir>/<basename>.crn<ext>",
			"./src/<reldir>/<basename><ext>",
		],
	},
	{
		"ignore": "",
		"relativePath": "./dist-nfes/src",
		"source": "./dist-nfes/src/**/*{.ts,.tsx,.js,.jsx,.scss,.css}",
		"target": [
			"./src/<reldir>/<basename>.h5<ext>",
			"./src/<reldir>/<basename><ext>",
		],
	},
];