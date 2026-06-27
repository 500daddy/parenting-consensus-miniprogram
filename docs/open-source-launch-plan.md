# 养娃新手村开源发布方案

[English](#english-version)

## 1. 仓库定位

推荐公开定位：

> 一个帮助新手爸妈整理育儿问题、风险提醒和就医前记录的微信小程序 MVP。

一句话英文定位：

> A WeChat Mini Program MVP that helps first-time parents organize parenting questions, risk reminders, and pre-visit notes.

这个项目适合被看作“AI 时代的育儿信息整理产品原型”，而不是医疗建议工具。

## 2. GitHub About 设置

建议在 GitHub 仓库右侧 About 区域填写：

- Description: `养娃新手村：帮新手爸妈整理育儿问题、风险提醒和就医前记录的微信小程序 MVP`
- Website: 如果暂时没有官网，可先留空；如果后续发布小程序介绍页，再补链接。
- Topics:
  - `wechat-miniprogram`
  - `parenting`
  - `baby-care`
  - `health-information`
  - `consensus`
  - `china`
  - `mvp`
  - `open-source`
- 勾选 Use your README。
- 上传 Social preview：建议使用 `output/covers/bilibili-cover-horizontal.png` 或重新导出一张不带平台文案的 1280x640 图。

## 3. 开源许可

推荐采用双许可：

- 代码：MIT License。
- 育儿内容、文档和非代码素材：CC BY-NC-SA 4.0。

原因：

- 代码保持宽松，方便别人学习、fork 和二次开发。
- 育儿内容和素材限制商业滥用，并要求改编继续共享。
- 健康内容有风险边界，不建议被直接商业包装成医疗建议。

## 4. 分支与保护

建议设置：

- 默认分支：`main`
- 开启 Require a pull request before merging。
- 开启 Require status checks to pass before merging。
- 必选检查：`Sanity Check`
- 开启 Require branches to be up to date before merging。
- 维护者个人可以保留 bypass，但公开协作后建议也走 PR。

## 5. Issue 与 PR 工作流

建议使用三类 issue：

- Bug report：小程序页面、数据、路由、样式问题。
- Feature request：功能建议、交互建议。
- Content question：新增或修正育儿问题、术语、风险提醒和来源。

PR 描述必须回答：

- 改了什么？
- 为什么改？
- 如何验证？
- 是否涉及健康内容？如果涉及，来源和风险边界是什么？

## 6. 内容审核原则

仓库公开后，最容易出现的问题不是代码，而是健康内容贡献的质量。

建议规则：

- 内容 PR 不直接合并“个人经验型结论”。
- 涉及药物、急救、症状判断时必须保留强风险提醒。
- 不接受剂量、处方、治疗方案。
- 优先接受“问题补全、观察项、记录项、何时就医、来源链接”。
- 如果没有可靠来源，先进入 issue 讨论，不进入题库。

## 7. 发布前清单

- [ ] 确认 `project.config.json` 不包含不应公开的私密配置。
- [ ] 确认没有 AppSecret、云开发密钥、真实用户数据或后台截图。
- [ ] 确认 `project.private.config.json` 是否需要加入 `.gitignore` 或脱敏。
- [ ] 确认 README 中的演示图可以公开。
- [ ] 确认 mock 题库内容没有引用未授权来源的大段文本。
- [ ] 在 GitHub Settings 开启 Issues、Discussions（可选）和 Security advisories。
- [ ] 设置仓库 topics、description 和 social preview。

## 8. 后续运营建议

- 每周集中处理一次 content issue，避免健康内容零散进入主分支。
- 给问题库贡献者提供固定模板：问题、适用年龄、风险信号、观察项、参考来源。
- 建一个 `good first issue` 列表，让新人从文档、翻译、低风险问题开始。
- 如果产品开始接后端，第一时间补充隐私政策、数据流图和安全模型。

## English Version

## 1. Repository Positioning

Recommended positioning:

> A WeChat Mini Program MVP that helps first-time parents organize parenting questions, risk reminders, and pre-visit notes.

The project should be presented as a parenting information organization prototype, not as a medical advice product.

## 2. GitHub About Settings

Recommended settings:

- Description: `Parenting Starter Village: a WeChat Mini Program MVP for parenting questions, risk reminders, and pre-visit notes`
- Website: leave empty until there is a public landing page.
- Topics:
  - `wechat-miniprogram`
  - `parenting`
  - `baby-care`
  - `health-information`
  - `consensus`
  - `china`
  - `mvp`
  - `open-source`
- Use the README as the repository homepage.
- Social preview: use `output/covers/bilibili-cover-horizontal.png`, or export a cleaner 1280x640 image without platform-specific copy.

## 3. License

Recommended dual license:

- Code: MIT License.
- Parenting content, documentation, and non-code assets: CC BY-NC-SA 4.0.

This keeps the code easy to learn from and fork, while reducing commercial misuse of parenting and health-related content.

## 4. Branch Protection

Recommended settings:

- Default branch: `main`
- Require pull requests before merging.
- Require status checks before merging.
- Required check: `Sanity Check`
- Require branches to be up to date before merging.

## 5. Issue and PR Workflow

Recommended issue types:

- Bug report: Mini Program page, data, route, style, or compatibility problems.
- Feature request: product and UX ideas.
- Content question: parenting questions, glossary terms, risk reminders, and sources.

Each PR should explain:

- What changed?
- Why?
- How was it verified?
- Does it touch health-related content? If yes, what are the sources and risk boundaries?

## 6. Content Review Principles

For health-related content:

- Do not merge personal experience as universal advice.
- Keep strong risk reminders for medication, emergency, and symptom-judgment topics.
- Do not accept drug dosage, prescriptions, or treatment plans.
- Prefer contributions about questions, observation items, records, when to seek care, and source notes.
- If sources are unclear, discuss in an issue before adding to the question bank.

## 7. Pre-public Checklist

- [ ] Confirm `project.config.json` contains no private config.
- [ ] Confirm there are no AppSecret values, cloud keys, real user data, or admin screenshots.
- [ ] Decide whether `project.private.config.json` should be ignored or sanitized.
- [ ] Confirm README demo images are safe to publish.
- [ ] Confirm mock content does not copy long unauthorized source text.
- [ ] Enable Issues, optional Discussions, and Security advisories in GitHub Settings.
- [ ] Set repository topics, description, and social preview.

## 8. Maintenance Suggestions

- Batch-review content issues weekly.
- Give content contributors a fixed template: question, age scope, risk signals, observation items, and sources.
- Maintain a `good first issue` list for docs, translation, and low-risk tasks.
- If a backend is added, publish a privacy policy, data-flow diagram, and security model early.
