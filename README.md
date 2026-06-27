# 养娃新手村

> 养娃路上，先来村里问问。

[English](./README.en.md) · [开源发布方案](./docs/open-source-launch-plan.md) · [贡献指南](./CONTRIBUTING.md) · [安全与健康内容边界](./SECURITY.md)

![Sanity Check](https://github.com/500daddy/parenting-consensus-miniprogram/actions/workflows/sanity.yml/badge.svg)
![WeChat Mini Program](https://img.shields.io/badge/WeChat-Mini%20Program-07C160)
![License: MIT](https://img.shields.io/badge/Code%20License-MIT-blue)
![Content License](https://img.shields.io/badge/Content%20License-CC%20BY--NC--SA%204.0-lightgrey)

![养娃新手村产品预览](./miniprogram/assets/hero/village-hero.png)

**养娃新手村** 是一个原生微信小程序 MVP，帮助新手爸妈把育儿问题从“全家说法不一”整理成更清楚的参考信息：先看多数观点，再看风险提醒、不同观点、参考依据和就医前记录工具。

当前版本使用本地 mock 数据，不依赖后端、不依赖 npm，也不会把宝宝档案、收藏或历史上传到服务器。

## 为什么做

第一次当父母时，很多问题不是“完全不知道”，而是信息太多、观点冲突、当下又很焦虑。

比如宝宝发烧、咳嗽、有痰、辅食过敏、疫苗后低烧时，家长常常会同时看到亲友经验、短视频观点、搜索结果和医生建议。这个项目尝试做一件小事：**把混乱信息摆整齐，让家长更容易知道下一步该观察什么、记录什么、什么时候该线下就医。**

## 功能亮点

- **育儿问题搜索**：支持高频问题搜索、推荐问题和场景化建议。
- **多数观点汇总**：把主流做法、补充观点和少数观点分层展示。
- **风险优先**：在发热、呕吐、误食、安全急救等问题里优先展示健康提醒。
- **术语解释**：对“脱水”“喷射状呕吐”等专业词做轻量解释。
- **宝宝档案提醒**：本地记录昵称、月龄、性别、过敏史，用于结果页的轻量提醒。
- **就医前记录工具**：把体温、精神状态、进食、尿量、用药和想问医生的问题整理成清单。
- **收藏与历史**：常查问题可以本地收藏和回看。

## 健康内容边界

本项目不是医疗产品，也不提供诊断、处方、急救决策或个体化治疗建议。

页面内容仅用于育儿科普参考和就医沟通前的信息整理。遇到精神差、呼吸异常、抽搐、明显脱水、持续高热、便血、误食/噎住、意识异常，或任何家长无法判断的情况，请优先线下就医或拨打当地急救电话。

## 快速开始

1. 安装并打开微信开发者工具。
2. 选择“导入项目”。
3. 项目目录选择当前仓库根目录。
4. `project.config.json` 已配置小程序根目录为 `miniprogram/`。如需使用自己的测试号，可在微信开发者工具里切换 AppID。
5. 运行本地静态校验：

```bash
node scripts/sanity-check.js
```

成功时会输出：

```text
project sanity ok
```

## 项目结构

```text
.
├── miniprogram/              # 原生微信小程序源码
│   ├── pages/                # 首页、搜索、结果、收藏、我的等页面
│   ├── components/           # 通用卡片组件
│   ├── mock/                 # 本地问题库与共识结果 mock 数据
│   ├── utils/mockService.js  # 搜索、收藏、历史、档案等本地服务
│   └── assets/               # 品牌、tab、分类和像素图标资源
├── docs/                     # 发布、验收、开源和内容质量文档
├── scripts/sanity-check.js   # CI 与本地共用的静态校验
├── broll/                    # 项目演示素材
└── project.config.json       # 微信开发者工具项目配置
```

## 路线图

- [x] 原生微信小程序 MVP。
- [x] 首页、搜索、问题结果、权威观点、收藏、历史、我的。
- [x] 本地宝宝档案、收藏、历史和缺失问题记录。
- [x] 问题结果页的风险提醒、术语解释和就医前记录工具。
- [x] GitHub Actions sanity check。
- [ ] 将题库内容拆出更清晰的内容审核流程。
- [ ] 接入真实后端和账号体系时，迁移当前本地 profile 结构。
- [ ] 增加更多可复核的来源标注和内容审校记录。
- [ ] 引入更多贡献者友好的问题库编辑格式。

## 贡献

欢迎贡献三类内容：

- **产品与代码**：页面体验、组件复用、测试、微信开发者工具兼容性。
- **问题库与内容质量**：高频育儿问题、参考来源、风险提醒、术语解释。
- **开源协作**：文档、翻译、issue triage、演示素材。

开始前请阅读 [CONTRIBUTING.md](./CONTRIBUTING.md)。如果涉及健康内容，请同时阅读 [SECURITY.md](./SECURITY.md) 里的内容边界。

## 许可证

- 代码：MIT License，见 [LICENSE](./LICENSE)。
- 育儿内容、文档和非代码素材：CC BY-NC-SA 4.0，见 [CONTENT_LICENSE.md](./CONTENT_LICENSE.md)。

## Star History

如果这个项目对你有启发，欢迎 star、fork，或者在 issue 里留下你最希望补进“养娃新手村”的育儿问题。
