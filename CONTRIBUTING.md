# 贡献指南 / Contributing

感谢你愿意一起完善“养娃新手村”。

Thanks for helping improve Parenting Starter Village.

## 适合贡献什么

- 小程序页面体验、组件复用、交互细节和兼容性修复。
- 高频育儿问题、问题分类、术语解释、风险提醒和参考来源。
- README、英文翻译、issue 模板、演示素材和开源协作流程。

## 内容贡献原则

涉及育儿和健康内容时，请遵守：

- 先写清楚适用范围和不适用范围。
- 优先补充“什么时候需要线下就医/急救”的边界。
- 不写诊断、处方、剂量、治疗方案或替代医生判断的绝对结论。
- 尽量提供可复核来源，例如儿科医生科普、医学指南、官方机构或权威育儿百科。
- 对争议内容保留不同观点，不把单一经验包装成通用答案。

## 本地开发

1. 用微信开发者工具导入仓库根目录。
2. 修改后运行：

```bash
node scripts/sanity-check.js
```

3. 如果改动涉及页面，请在微信开发者工具里至少检查首页、搜索、结果页、收藏和我的。

## Pull Request 建议

- 一个 PR 尽量只解决一个问题。
- 在描述里说明改了什么、为什么改、怎么验证。
- 内容类 PR 请列出参考来源和风险边界。
- 不要提交真实用户信息、宝宝个人信息、API key、AppSecret 或后台账号截图。

## English

Before opening a pull request:

- Keep each PR focused.
- Run `node scripts/sanity-check.js`.
- For UI changes, verify the core Mini Program pages in WeChat DevTools.
- For health-related content, include sources, scope, and risk boundaries.
- Never commit real user data, baby personal information, API keys, AppSecret values, or admin screenshots.
