import * as vscode from 'vscode';
import { Uri, window, workspace } from "vscode";
import { basename, extname, join, posix, relative } from 'path';
import { getFolderFromCurFilePath, vscodeReadJSON } from './utils';
import { DEFAULT_CROSS_PLATFORM, DEFAULT_DISTS, DEFAULT_SRCS, DEFAULT_SUPPORTEXTS } from './commonConfig';
import { findMatchedTargets } from './findMatchedTargets';
import { getQuickItems } from './getQuickItems';
import { generatePatterns } from './generatePatterns';
import { obtainCrossPlatformType } from './obtainCrossPlatformType';
import { EXT_NAME } from './constants';
import { existsSync, readFileSync, writeFileSync } from 'fs';

export async function activate(context: vscode.ExtensionContext) {
	const quickInput = async () => {
		// 读取配置文件
		let {
			supportExts = DEFAULT_SUPPORTEXTS,
			supportPlatForm = DEFAULT_CROSS_PLATFORM,
			supportDirs = DEFAULT_DISTS,
			supportSrcs = DEFAULT_SRCS,
			alwaysShowMessage = true
		} = (await vscodeReadJSON(join(".vscode", `${EXT_NAME}.json`))) || {};

		let patterns = await vscodeReadJSON(join(".vscode", `${EXT_NAME}.tmp.json`));
		// 当前的文件的路径
		const curPath = window.activeTextEditor?.document.uri.fsPath;
		if (!curPath) {
			return;
		}

		const ext = extname(curPath);

		if (!supportExts.includes(ext)) {
			return;
		}
		if (!patterns) {
			patterns = generatePatterns(supportSrcs, supportDirs, supportPlatForm, supportExts);
		}

		const matched = findMatchedTargets(curPath, patterns, supportPlatForm);

		const quickPickItems = getQuickItems(matched, curPath);

		if (quickPickItems.length !== 0) {
			// @ts-ignore
			const { value: filePath } = (await window.showQuickPick(quickPickItems,
				{
					title: '选择需要跳转的文件',
				},
			)) || {} as any;

			return { answer: filePath };
		} else {
			window.showInformationMessage('当前文件无对应的文件');
		}
		return;
	};

	const folderPath = workspace.workspaceFolders![0]!.uri.fsPath;
	vscode.commands.executeCommand('setContext', 'showJumpIcon', true);

	// 注册指令：diff 多端文件
	let disposable = vscode.commands.registerCommand('jacky-taro-extensions.diff', async () => {
		const { answer: filePath } = (await quickInput()) || {};

		// 当前的文件的路径
		const curPath = window.activeTextEditor?.document.uri.fsPath;
		if (!curPath) {
			return;
		}

		if (filePath) {
			const fileUri = Uri.file(join(folderPath, filePath));
			vscode.commands.executeCommand(
				'vscode.diff',
				window.activeTextEditor?.document.uri,
				fileUri,
				`diff: ${basename(filePath)} ↔ ${basename(relative(folderPath, curPath))}`,
			);
		}
	});

	// 注册指令：快速跳转文件
	let disposable2 = vscode.commands.registerCommand('jacky-taro-extensions.jump', async () => {
		const { answer: filePath } = (await quickInput()) || {};
		if (filePath) {
			const fileUri = Uri.file(join(folderPath, filePath));
			vscode.window.showTextDocument(fileUri, { viewColumn: vscode.ViewColumn.Active });
		}
	});

	let disposable3 = vscode.commands.registerCommand('jacky-taro-extensions.eject_config', async () => {
		const str = readFileSync(join(__dirname, "config_file.json"));
		const output_config_path = join(".vscode", `${EXT_NAME}.json`);
		const output_config_tmp_path = join(".vscode", `${EXT_NAME}.tmp.json`);
		const folderUri = workspace.workspaceFolders![0]!.uri;
		const fileUri = folderUri.with({ path: posix.join(folderUri.path, output_config_path) });
		const fileTmpUri = folderUri.with({ path: posix.join(folderUri.path, output_config_tmp_path) });

		const { value: configType } = (await window.showQuickPick([
			{
				label: '弹出示例参考配置',
				value: "direct_output"
			}, {
				label: "弹出 micromatch 配置表（临时表）",
				value: "rewrite_output"
			}
		],
			{
				title: '选择弹出类型',
			},
		)) || {} as any;

		if (configType === "direct_output") {
			try {
				await workspace.fs.writeFile(fileUri, str);
			} catch (error) {

			}
		} else {
			if (!existsSync(posix.join(folderUri.path, output_config_path))) {
				window.showInformationMessage("不存在配置文件，参考示例写法");
				try {
					await workspace.fs.writeFile(fileUri, str);
				} catch (error) {
					return {};
				}
			} else {
				// 读取配置文件
				let {
					supportExts = DEFAULT_SUPPORTEXTS,
					supportPlatForm = DEFAULT_CROSS_PLATFORM,
					supportDirs = DEFAULT_DISTS,
					supportSrcs = DEFAULT_SRCS,
				} = (await vscodeReadJSON(join(".vscode", `${EXT_NAME}.json`))) || {};
				const patterns = generatePatterns(supportSrcs, supportDirs, supportPlatForm, supportExts);

				const JSONstr = Buffer.from(JSON.stringify(patterns, null, 2), "utf-8");

				await workspace.fs.writeFile(fileTmpUri, JSONstr);
			}
		}
	});

	window.onDidChangeActiveTextEditor(async (editor) => {
		// 读取配置文件
		let {
			supportExts = DEFAULT_SUPPORTEXTS,
			supportPlatForm = DEFAULT_CROSS_PLATFORM,
			alwaysShowMessage = true
		} = (await vscodeReadJSON(join(".vscode", `${EXT_NAME}.json`))) || {};
		const uri = editor?.document.uri;
		
		if (!uri) {
			return;
		}

		// 当前的文件的路径
		const curUri = uri.fsPath;

		if (!supportExts.includes(extname(curUri))) {
			return;
		}

		const curPrefixs = obtainCrossPlatformType(curUri, supportPlatForm);

		if (curPrefixs.length === 1) {
			alwaysShowMessage && window.showInformationMessage(`当前文件类型为${curPrefixs}`);
		} else if (curPrefixs.length > 1) {
			alwaysShowMessage && window.showInformationMessage(`当前文件类型为${curPrefixs.join('、')}`);
		} else {
			alwaysShowMessage && window.showInformationMessage(`当前文件为非跨端组件，请查看其他文件`);
		};
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(disposable2);
	context.subscriptions.push(disposable3);
}

export function deactivate() { }


