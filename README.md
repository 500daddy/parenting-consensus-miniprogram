# parenting-consensus-miniprogram

# 养娃新手村微信小程序 MVP

这是一个原生微信小程序 MVP，核心闭环是：搜索育儿问题后，展示主流共识、观点比例、权威来源、少数观点和安全提醒。当前版本全部使用本地 mock 数据，不依赖后端或 npm。品牌名为“养娃新手村”，slogan 为“养娃路上，先来村里问问”。

## 如何运行

1. 打开微信开发者工具。
2. 选择“导入项目”。
3. 项目目录选择 `C:\Users\admin\Documents\New project`。
4. 当前 `project.config.json` 已配置 AppID；如需在其他账号调试，可在微信开发者工具里切换为自己的测试号。

## 已完成

- 首页：品牌区、搜索入口、分类、热门问题、权威内容入口、今日共识。
- 问答搜索：推荐问题、历史记录、关键词跳转结果页。
- 问题汇总：主流共识、观点比例、理由卡片、权威内容、少数观点、安全提醒、收藏。
- 权威观点：来源类型筛选、可信提示、注意事项、相关问题。
- 分类：按育儿场景筛选问题。
- 我的：宝宝档案摘要、收藏、历史、反馈占位、免责声明。
- 当前热门 6 个问题均已补齐完整 mock 共识结果，可从首页、搜索、分类、收藏、历史等入口闭环查看。

## 数据与扩展

- mock 数据在 `miniprogram/mock/data.js`。
- 查询、搜索、收藏和历史逻辑在 `miniprogram/utils/mockService.js`。
- 本地缓存 key：`parenting_consensus_history`、`parenting_consensus_favorites`。
- 通用卡片组件已预留在 `miniprogram/components/`，后续可逐步替换页面内重复卡片。
- 社区功能本期不展示，但已在数据层预留 `communityPosts` 和 `relatedPostIds`，后续可新增 `pages/community/index` 并接入 tab。

## 验证建议

- 运行 `node scripts/sanity-check.js`，检查页面文件、JSON、JS 模块、tab 图标、mock 数据关联、观点比例和常见关键词路由是否完整。
- GitHub Actions 已配置同一条 sanity check，推送到 `main` 或创建 PR 时会自动执行。
- 搜索“宝宝发烧能洗澡吗”，检查结果页内容是否完整。
- 分别搜索“宝宝咳嗽有痰”“挑食不爱吃蔬菜”“疫苗后低烧”，检查是否进入对应结果页。
- 在结果页点击收藏，再到“我的 - 我的收藏”查看。
- 在首页点击分类 chip，确认进入分类 tab 后筛选正确。
- 在权威观点页切换“儿科医生 / 医学指南 / 育儿百科 / 认证达人”。
- 检查底部 tab 的选中态是否明显，页面内容是否被底栏遮挡。
