# Parenting Starter Village

> A clearer first stop for messy parenting questions.

[简体中文](./README.md) · [Open-source launch plan](./docs/open-source-launch-plan.md) · [Contributing](./CONTRIBUTING.md) · [Safety boundary](./SECURITY.md)

![Sanity Check](https://github.com/500daddy/parenting-consensus-miniprogram/actions/workflows/sanity.yml/badge.svg)
![WeChat Mini Program](https://img.shields.io/badge/WeChat-Mini%20Program-07C160)
![License: MIT](https://img.shields.io/badge/Code%20License-MIT-blue)
![Content License](https://img.shields.io/badge/Content%20License-CC%20BY--NC--SA%204.0-lightgrey)

![Product preview](./miniprogram/assets/hero/village-hero.png)

**Parenting Starter Village** is a native WeChat Mini Program MVP for first-time parents. It turns stressful, conflicting parenting information into a more structured reference: majority views first, then risk reminders, alternative viewpoints, source notes, and pre-visit checklists.

The current version runs entirely on local mock data. It has no backend, no npm dependency, and does not upload baby profiles, favorites, or browsing history to a server.

## Why This Exists

New parents are often not short of information. The hard part is making decisions when family advice, short videos, search results, and medical guidance all appear at once.

This project tries to do one small thing well: **organize messy information so parents can see what to observe, what to record, and when offline medical care should come first.**

## Highlights

- **Parenting question search**: high-frequency questions, recommendations, and scenario-aware suggestions.
- **Consensus-style summaries**: majority practice, complementary views, and minority views shown separately.
- **Risk-first reading**: health reminders appear early for fever, vomiting, accidental ingestion, choking, and other high-risk scenarios.
- **Glossary support**: lightweight explanations for terms such as dehydration or projectile vomiting.
- **Local baby profile**: nickname, age, gender, and allergy history are stored locally and used for light reminders.
- **Pre-visit checklist**: helps parents record temperature, mental state, feeding, urine output, medication, and questions for doctors.
- **Favorites and history**: frequently checked questions stay available locally.

## Health Boundary

This is not a medical product. It does not provide diagnosis, prescriptions, emergency decisions, or individualized treatment advice.

The content is for parenting education and pre-visit organization only. If a child has poor mental state, breathing difficulty, seizures, obvious dehydration, persistent high fever, bloody stool, accidental ingestion, choking, abnormal consciousness, or any situation the caregiver cannot judge, seek offline medical care or local emergency help first.

## Quick Start

1. Install and open WeChat DevTools.
2. Choose “Import Project”.
3. Select this repository root as the project directory.
4. `project.config.json` points the Mini Program root to `miniprogram/`. You can switch to your own test AppID in WeChat DevTools.
5. Run the sanity check:

```bash
node scripts/sanity-check.js
```

Expected output:

```text
project sanity ok
```

## Project Structure

```text
.
├── miniprogram/              # Native WeChat Mini Program source
│   ├── pages/                # Home, search, result, favorites, profile, etc.
│   ├── components/           # Reusable card components
│   ├── mock/                 # Local question bank and result data
│   ├── utils/mockService.js  # Local search, favorites, history, and profile service
│   └── assets/               # Brand, tab, category, and pixel icon assets
├── docs/                     # Release, QA, open-source, and content quality docs
├── scripts/sanity-check.js   # Shared local and CI sanity check
├── broll/                    # Product demo assets
└── project.config.json       # WeChat DevTools project config
```

## Roadmap

- [x] Native WeChat Mini Program MVP.
- [x] Home, search, result, authority, favorites, history, and profile pages.
- [x] Local baby profile, favorites, history, and missing-question records.
- [x] Risk reminders, glossary terms, and pre-visit checklist on result pages.
- [x] GitHub Actions sanity check.
- [ ] Separate question-bank editing into a clearer content review workflow.
- [ ] Migrate the local profile model when a real backend and account system are added.
- [ ] Add more reviewable source notes and content audit records.
- [ ] Make the question bank easier for contributors to edit.

## Contributing

Contributions are welcome in three areas:

- **Product and code**: UX polish, component reuse, tests, and WeChat DevTools compatibility.
- **Question bank and content quality**: high-frequency parenting questions, source notes, risk reminders, and glossary terms.
- **Open-source collaboration**: docs, translation, issue triage, and demo assets.

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a PR. For health-related content, also read the boundaries in [SECURITY.md](./SECURITY.md).

## License

- Code: MIT License. See [LICENSE](./LICENSE).
- Parenting content, documentation, and non-code assets: CC BY-NC-SA 4.0. See [CONTENT_LICENSE.md](./CONTENT_LICENSE.md).

## Star History

If this project is useful or thought-provoking, a star, fork, issue, or question suggestion is warmly appreciated.
