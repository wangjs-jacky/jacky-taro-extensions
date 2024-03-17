import { relative } from "path";
import { workspace } from "vscode";

export const getQuickItems = (arr: any[], curPath: string) => {
    const folderPath = workspace.workspaceFolders![0]!.uri.fsPath;

    return arr.map((target) => {
        // 过滤自身
        if (target === curPath) {
            return undefined;
        }
        return {
            label: relative(folderPath, target),
            value: relative(folderPath, target),
        };
    }).filter(Boolean);
}