import { describe, expect, it } from "vitest";
import { generatePatterns } from "../../src/generatePatterns";
import { DEFAULT_SRCS, DEFAULT_DISTS, DEFAULT_CROSS_PLATFORM, DEFAULT_SUPPORTEXTS } from "../../src/commonConfig";

describe("sum 函数单元测试", () => {
  it("测试函数功能 ", () => {
    const res = generatePatterns(DEFAULT_SRCS, DEFAULT_DISTS, DEFAULT_CROSS_PLATFORM, DEFAULT_SUPPORTEXTS);
    expect(res).toMatchInlineSnapshot(`
      [
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
      ]
    `)
  })
})