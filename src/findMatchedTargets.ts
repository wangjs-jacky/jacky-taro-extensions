import { MatchPattern, normalizePatterns } from "./utils";
import mm from "micromatch";
import { existsSync } from 'fs';
import { workspace } from "vscode";
import { join, parse, relative, resolve } from "path";

// 找到符合条件的规则
// source - 绝对路径
// patterns - 相对路径
export const findMatchedTargets = (source: string, patterns: MatchPattern[], supportPlatForm: Record<string, any>) => {
    const folderPath = workspace.workspaceFolders![0]!.uri.fsPath;

    const postfixs = Object.keys(supportPlatForm);

    const _patterns = normalizePatterns(folderPath, patterns);
    if (!source) {
        return [];
    }

    const pattern = _patterns.find(p => {
        console.log("targetPath-a", source, p.source, mm.isMatch(source, p.source));
        return mm.isMatch(source, p.source);
    });

    // 匹配后返回
    if (!pattern) {
        return [];
    }

    // 收集存在的 targets
    const targets = [] as string[];

    const parsed = parse(source);
    for (const target of pattern.target) {
        let targetPath = target;
        const postfix = (postfixs || []).find(postfix => {
            return parsed.name.endsWith(postfix);
        });

        Object.entries({
            ...parsed,
            basename: postfix ? parsed.name.split(".").slice(0, -1).join(".") : parsed.name,
            postfix: postfix ?? "",
            dirname: parsed.dir,
            reldir: relative(join(folderPath, pattern.relativePath), parsed.dir),
            dir: relative(folderPath, parsed.dir)
        })
            .forEach(([key, value]) => {
                targetPath = targetPath.replace(`<${key}>`, value);
            });

        targetPath = resolve(folderPath, targetPath);

        if (existsSync(targetPath)) {
            targets.push(targetPath);
        };
    }
    return targets;
};

