import { workspace } from "vscode";
import { existsSync } from "fs";
import { join } from "path";

export const getExistPathList = (pathLists: any[], curPath: string) => {
  const folderPath = workspace.workspaceFolders![0]!.uri.fsPath;

  const _pathLists = pathLists.map((path) => {
    return {
      label: path,
      value: path
    };
  });

  return _pathLists.filter((item) => {
    const path = item.value;
    return existsSync(join(folderPath, path)) && curPath !== path;
  });
};