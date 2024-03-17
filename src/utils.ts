import { join, posix, resolve } from "path";
import { window, workspace } from "vscode";

export function slash(path: string) {
  return path.replace(/\\/g, '/');
}

export async function vscodeReadJSON(jsonPath: string) {
  const folderUri = workspace.workspaceFolders![0]!.uri;
  const fileUri = folderUri.with({ path: posix.join(folderUri.path, jsonPath) });
  try {
    const readData = await workspace.fs.readFile(fileUri);
    const readStr = Buffer.from(readData).toString('utf8');
    return JSON.parse(readStr);
  } catch (error) {
    return;
  }
};


export const getFolderFromCurFilePath = (curPath: string, dists: any) => {
  // 获取工作区文件夹
  const folderPath = workspace.workspaceFolders![0]!.uri.fsPath;

  let targetPath = [...Object.keys(dists), "src"];

  console.log("targetPath", targetPath);


  // TODO: 使用 microMatch 替换路径匹配规则
  for (let i = 0; i < targetPath.length; i++) {
    console.log(curPath, join(folderPath, targetPath[i]));

    if (curPath.startsWith(join(folderPath, targetPath[i]))) {
      return targetPath[i];
    }
  }
};

export const toArray = <T,>(value: T | T[]) => {
  return Array.isArray(value) ? value : [value];
};

type MaybeArray<T> = T | T[];

export interface MatchPattern {
  source: MaybeArray<string>;
  target: MaybeArray<string>;
  ignore?: MaybeArray<string>;
  relativePath?: string;
  replace?: Record<string, string>;
}

interface ResolveMatchPattern {
  source: string[];
  target: string[];
  ignore?: string[];
  relativePath: string;
}

export const normalizePatterns = (cwd: string, patterns: MatchPattern[]): ResolveMatchPattern[] => {
  return patterns.map(p => {
    return {
      ...p,
      source: toArray(p.source).map(s => resolve(cwd, s)),
      target: toArray(p.target),
      ignore: toArray(p?.ignore || []),
      relativePath: p?.relativePath || ""
    };
  });
};