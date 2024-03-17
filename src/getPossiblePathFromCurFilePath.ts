import { extname, join, relative } from "path";
import { workspace } from "vscode";

export const getPossiblePathFromCurFilePath = (path: string, CROSS_PLATFORM: any, OUTPUTS: any = {}) => {
  // 获取后缀名
  const ext = extname(path);

  // 获取后缀
  let curPostfix = "";
  Object.keys(CROSS_PLATFORM).some(prefix => {
    if (path.endsWith(`${prefix}${ext}`)) {
      curPostfix = prefix;
      return true;
    }
  });

  const basePath = path.replace(`${curPostfix}${ext}`, "");

  // 生成 dist 所需的路径
  const distPathLists = [] as any;
  Object.keys(OUTPUTS).forEach((distDir) => {
    if (!basePath.startsWith(distDir)) {
      distPathLists.push(join(distDir, `${basePath}${OUTPUTS[distDir]}${ext}`));
      distPathLists.push(join(distDir, `${basePath}${ext}`));
    }
  });

  console.log("distPathLists",distPathLists);
  

  // 生成 src 所需的路径
  const srcPathLists = [
    ...Object.keys(CROSS_PLATFORM).map((prefix) => {
      return basePath + prefix + ext;
    }),
    basePath + ext
  ];

  return {
    allPath: [
      ...distPathLists,
      ...srcPathLists,
    ],
    srcPathLists,
    distPathLists,
  }
};