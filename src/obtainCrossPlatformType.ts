import { existsSync } from "fs";
import { extname } from "path";

// 获取当前文件的类型后缀
/**
 * 
 * @param curUri 
 * @param CROSS_PLATFORM 
 * @returns 
 * 
 * @example 
 * cur:"/xxx/xxxx.h5.ts" → h5
 * cur:"/xxx/xxxx.ts" → 根据 CROSS_PLATFORM 判断类型 ["h5","crn"]
 */
export const obtainCrossPlatformType = (curUri: string, CROSS_PLATFORM: any) => {
  // 获取后缀名
  const ext = extname(curUri);

  // 正则规则
  const prefixsReg = new RegExp(`(.*)(${Object.keys(CROSS_PLATFORM).map(prefix => {
    return prefix.replace(".", "\\.");
  }).join("|")})\\${ext}$`);

  const match = curUri.match(prefixsReg);

  let curPrefixs;

  // 匹配成功
  if (match) {
    curPrefixs = [match[2]];
  } else {
    const prefixs = Object.keys(CROSS_PLATFORM);
    curPrefixs = prefixs.filter((prefix) => {
      return !existsSync(curUri.replace(ext, `${prefix}${ext}`));
    });
  }

  return curPrefixs;
};