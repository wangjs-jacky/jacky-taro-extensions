export interface TARGET_CONFIG_TYPE {
  path?: string;
  ignore?: string;
  prefix?: string,
};

export const generatePatterns = (src: TARGET_CONFIG_TYPE[], dists: TARGET_CONFIG_TYPE[], cross_platform: Record<string, any> = {}, supportExts: string[]) => {
  const src_targets = (src || []).map((p) => {
    const postfixs = Object.keys(cross_platform);
    const src_path = p.path;
    const targets = [
      ...postfixs.map((postfix) => {
        return `${src_path}/<reldir>/<basename>${postfix}<ext>`;
      }),
      `${src_path}/<reldir>/<basename><ext>`,
      ...dists.map(p => {
        const dist_path = p.path;
        return `${dist_path}/<reldir>/<basename><ext>`;
      })
    ];
    return {
      "source": `${src_path}/**/*{${supportExts.join(",")}}`,
      "relativePath": src_path,
      "ignore": p.ignore || "",
      "target": targets
    };
  });

  const dist_targets = (dists || []).map((p) => {
    const dist_path = p.path;
    const postfixs = Object.keys(cross_platform);

    return {
      "source": `${dist_path}/**/*{${supportExts.join(",")}}`,
      "relativePath": dist_path,
      "ignore": p.ignore || "",
      "target": [
        `./src/<reldir>/<basename>${p.prefix}<ext>`,
        `./src/<reldir>/<basename><ext>`,
      ]
    };
  });

  return [
    ...src_targets,
    ...dist_targets
  ];
};