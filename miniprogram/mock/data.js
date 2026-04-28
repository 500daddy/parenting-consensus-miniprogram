const categories = [
  { id: 'feeding', name: '喂养', icon: '奶', description: '母乳、奶粉、喂养量和喂养节奏。' },
  { id: 'sleep', name: '睡眠', icon: '月', description: '夜醒、入睡、作息和睡眠倒退。' },
  { id: 'fever_care', name: '发烧护理', icon: '温', description: '发热、退烧、物理降温和就医判断。' },
  { id: 'solid_food', name: '辅食', icon: '碗', description: '辅食添加、过敏观察和进食安排。' },
  { id: 'early_education', name: '早教', icon: '积', description: '亲子互动、语言启蒙和游戏发展。' },
  { id: 'vaccine', name: '疫苗', icon: '苗', description: '疫苗接种、反应观察和补种提醒。' },
  { id: 'emotion', name: '情绪行为', icon: '笑', description: '哭闹、分离焦虑和行为边界。' },
  { id: 'toilet', name: '如厕训练', icon: '厕', description: '如厕信号、训练节奏和反复处理。' }
]

const questions = [
  {
    id: 'q_001',
    title: '宝宝发烧能洗澡吗？水温多少合适？',
    shortTitle: '宝宝发烧能洗澡吗？',
    categoryId: 'fever_care',
    heat: 126000,
    tag: '发烧护理',
    tagIcon: '温',
    summary: '多数观点认为，精神状态良好且体温不高时可短时间温水洗澡。',
    updatedAt: '2026-04-24T10:00:00Z'
  },
  {
    id: 'q_002',
    title: '宝宝夜醒频繁怎么办？如何改善睡眠？',
    shortTitle: '宝宝夜醒频繁怎么办？',
    categoryId: 'sleep',
    heat: 98000,
    tag: '睡眠',
    tagIcon: '月',
    summary: '优先排查饥饿、出牙、环境和作息，逐步建立稳定睡前流程。',
    updatedAt: '2026-04-24T10:00:00Z'
  },
  {
    id: 'q_003',
    title: '6个月宝宝第一口辅食吃什么？',
    shortTitle: '第一口辅食吃什么？',
    categoryId: 'solid_food',
    heat: 83000,
    tag: '辅食',
    tagIcon: '碗',
    summary: '高铁泥糊状食物更常被推荐，单一添加并连续观察。',
    updatedAt: '2026-04-24T10:00:00Z'
  },
  {
    id: 'q_004',
    title: '宝宝咳嗽有痰，需要立刻去医院吗？',
    shortTitle: '宝宝咳嗽有痰要就医吗？',
    categoryId: 'fever_care',
    heat: 76000,
    tag: '发烧护理',
    tagIcon: '温',
    summary: '先观察精神、呼吸和进食，出现呼吸费力等情况应及时就医。',
    updatedAt: '2026-04-24T10:00:00Z'
  },
  {
    id: 'q_005',
    title: '宝宝挑食不爱吃蔬菜怎么办？',
    shortTitle: '宝宝挑食怎么办？',
    categoryId: 'feeding',
    heat: 65000,
    tag: '喂养',
    tagIcon: '奶',
    summary: '多数建议重复暴露、减少强迫，用家庭共餐和食物造型提高接受度。',
    updatedAt: '2026-04-24T10:00:00Z'
  },
  {
    id: 'q_006',
    title: '疫苗后低烧需要吃退烧药吗？',
    shortTitle: '疫苗后低烧怎么办？',
    categoryId: 'vaccine',
    heat: 52000,
    tag: '疫苗',
    tagIcon: '苗',
    summary: '轻微低热多可观察护理，精神差或持续高热需咨询医生。',
    updatedAt: '2026-04-24T10:00:00Z'
  }
]

const authoritySources = [
  {
    id: 'a_001',
    name: '三甲医院儿科医生',
    type: 'doctor',
    typeName: '儿科医生',
    trustLevel: 'high',
    trustLabel: '高可信',
    icon: '听',
    summary: '发烧时是否洗澡取决于宝宝精神状态、体温和环境温度。体温下降、精神较好且想洗时，可用温水快速淋浴，注意保暖。',
    tags: ['临床经验', '多中心观察研究', '儿科诊疗共识'],
    questionIds: ['q_001', 'q_004']
  },
  {
    id: 'a_002',
    name: '医学指南解读',
    type: 'guide',
    typeName: '医学指南',
    trustLevel: 'high',
    trustLabel: '高可信',
    icon: '盾',
    summary: '推荐物理降温以舒适为目标。温水擦浴可作为护理方式之一，重点观察体温、精神状态、呼吸和饮水尿量。',
    tags: ['指南推荐', '循证证据', '专家共识'],
    questionIds: ['q_001', 'q_004', 'q_006']
  },
  {
    id: 'a_003',
    name: '育儿百科',
    type: 'wiki',
    typeName: '育儿百科',
    trustLevel: 'high',
    trustLabel: '高可信',
    icon: '书',
    summary: '以舒适护理为主：穿着宽松、环境通风、保证休息。有发热但状态良好时，可以在家观察并记录体温变化。',
    tags: ['育儿知识库', '家长实践经验', '健康科普'],
    questionIds: ['q_001', 'q_002', 'q_003', 'q_004']
  },
  {
    id: 'a_004',
    name: '认证育儿达人',
    type: 'creator',
    typeName: '认证达人',
    trustLevel: 'medium',
    trustLabel: '中可信',
    icon: '星',
    summary: '分享家庭护理流程：先测体温和观察精神，准备温水和干毛巾，洗后立刻擦干，避免吹风。',
    tags: ['完整经验链路', '高赞经验', '平台认证'],
    questionIds: ['q_001', 'q_005']
  },
  {
    id: 'a_005',
    name: '儿童睡眠顾问',
    type: 'creator',
    typeName: '认证达人',
    trustLevel: 'medium',
    trustLabel: '中可信',
    icon: '月',
    summary: '夜醒改善通常需要连续观察作息、白天小睡、入睡联想和夜间安抚方式，而不是只调整某一个动作。',
    tags: ['睡眠记录', '行为建议', '认证达人'],
    questionIds: ['q_002']
  },
  {
    id: 'a_006',
    name: '儿科营养门诊',
    type: 'doctor',
    typeName: '儿科医生',
    trustLevel: 'high',
    trustLabel: '高可信',
    icon: '养',
    summary: '挑食处理重点是评估生长曲线和整体摄入，不建议用强迫或追喂制造压力。可通过重复暴露、家庭共餐和食物形态调整逐步改善。',
    tags: ['营养评估', '生长曲线', '儿科门诊建议'],
    questionIds: ['q_005']
  },
  {
    id: 'a_007',
    name: '预防接种指南解读',
    type: 'guide',
    typeName: '医学指南',
    trustLevel: 'high',
    trustLabel: '高可信',
    icon: '苗',
    summary: '接种后轻微低热可先观察护理，关注精神状态、体温趋势和接种部位反应。若持续高热、精神差或局部严重红肿，应及时咨询医生。',
    tags: ['接种后观察', '指南推荐', '风险提醒'],
    questionIds: ['q_006']
  }
]

const questionResults = {
  q_001: {
    questionId: 'q_001',
    title: '宝宝发烧能洗澡吗？',
    categoryId: 'fever_care',
    conclusion: '多数观点认为：宝宝精神状态尚可、体温不过高时，可以短时间温水洗澡或温水擦浴；注意保暖，避免着凉。',
    sourceCount: 236,
    expertCount: 68,
    confidenceLevel: '较高',
    sampleNote: '观点比例基于当前样本内容和来源权重整理，仅供参考。',
    viewpoints: [
      { id: 'v_001', title: '可以洗温水澡', percentage: 68, type: 'majority', summary: '体温不高、精神状态良好时可短时间温水洗澡。', color: '#7EA66A' },
      { id: 'v_002', title: '建议温水擦浴', percentage: 21, type: 'neutral', summary: '温水擦浴更稳妥，尤其适合担心受凉的情况。', color: '#F4A340' },
      { id: 'v_003', title: '不建议立即洗澡', percentage: 11, type: 'minority', summary: '体温较高、寒战或精神状态差时不建议洗澡。', color: '#F36F5B' }
    ],
    reasons: [
      { id: 'r_001', title: '帮助降温', description: '温水可促进散热，有助于降低体温。', icon: '水', tone: 'green' },
      { id: 'r_002', title: '保持舒适', description: '清洁皮肤、减少黏腻感，睡得更好。', icon: '笑', tone: 'orange' },
      { id: 'r_003', title: '高热或寒战时不建议', description: '可能加重不适或引起不良反应。', icon: '温', tone: 'red' },
      { id: 'r_004', title: '洗后及时保暖', description: '擦干身体、穿好衣物，避免受凉。', icon: '巾', tone: 'purple' }
    ],
    authoritySourceIds: ['a_001', 'a_002', 'a_003'],
    minorityView: '少数观点认为：发烧期间宝宝身体较弱，建议先以物理降温为主，待退烧后再洗澡更稳妥。',
    warnings: ['精神差/持续高热', '呼吸急促', '抽搐', '伴随严重脱水'],
    relatedQuestions: ['q_004', 'q_006'],
    relatedPostIds: [],
    disclaimer: '本内容仅用于育儿信息参考，不能替代医生诊断。如宝宝出现精神差、呼吸困难、抽搐、持续高热、严重脱水等情况，请及时就医。'
  },
  q_002: {
    questionId: 'q_002',
    title: '宝宝夜醒频繁怎么办？',
    categoryId: 'sleep',
    conclusion: '多数观点认为：先排查饥饿、出牙、温度和白天睡眠，再用稳定睡前流程和一致安抚逐步改善夜醒。',
    sourceCount: 184,
    expertCount: 42,
    confidenceLevel: '中高',
    sampleNote: '观点比例基于当前样本内容和来源权重整理，仅供参考。',
    viewpoints: [
      { id: 'v_101', title: '建立稳定作息', percentage: 54, type: 'majority', summary: '固定睡前流程和入睡时间，减少过度疲劳。', color: '#7EA66A' },
      { id: 'v_102', title: '先排查不适', percentage: 31, type: 'neutral', summary: '关注出牙、鼻塞、湿疹、饥饿和环境温度。', color: '#F4A340' },
      { id: 'v_103', title: '减少夜奶依赖', percentage: 15, type: 'minority', summary: '适合月龄较大且生长稳定的宝宝逐步尝试。', color: '#F36F5B' }
    ],
    reasons: [
      { id: 'r_101', title: '规律更安心', description: '固定流程能帮助宝宝形成睡眠预期。', icon: '钟', tone: 'green' },
      { id: 'r_102', title: '先看身体信号', description: '夜醒可能来自不适，而不只是习惯。', icon: '心', tone: 'orange' },
      { id: 'r_103', title: '环境要稳定', description: '光线、噪音和温度都会影响睡眠。', icon: '月', tone: 'purple' },
      { id: 'r_104', title: '渐进调整', description: '突然改变安抚方式容易增加哭闹。', icon: '阶', tone: 'green' }
    ],
    authoritySourceIds: ['a_003', 'a_005'],
    minorityView: '少数观点认为：夜醒严重时可以更快减少夜间安抚，但需要结合月龄、喂养和家庭承受度。',
    warnings: ['呼吸异常', '持续哭闹无法安抚', '体重增长不佳', '明显疼痛表现'],
    relatedQuestions: ['q_001', 'q_005'],
    relatedPostIds: [],
    disclaimer: '本内容仅用于育儿信息参考，不能替代医生诊断。若宝宝持续哭闹、呼吸异常或精神状态明显变差，请及时咨询医生。'
  },
  q_003: {
    questionId: 'q_003',
    title: '6个月宝宝第一口辅食吃什么？',
    categoryId: 'solid_food',
    conclusion: '多数观点认为：第一口辅食可优先选择富含铁的泥糊状食物，少量单一添加，连续观察接受度和过敏反应。',
    sourceCount: 152,
    expertCount: 37,
    confidenceLevel: '较高',
    sampleNote: '观点比例基于当前样本内容和来源权重整理，仅供参考。',
    viewpoints: [
      { id: 'v_201', title: '高铁米粉或肉泥', percentage: 61, type: 'majority', summary: '优先补充铁，质地从细腻泥糊开始。', color: '#7EA66A' },
      { id: 'v_202', title: '蔬菜泥水果泥', percentage: 25, type: 'neutral', summary: '可作为早期尝试，但不应替代含铁食物。', color: '#F4A340' },
      { id: 'v_203', title: '暂缓复杂混合', percentage: 14, type: 'minority', summary: '避免一次添加多种食材，便于观察过敏。', color: '#F36F5B' }
    ],
    reasons: [
      { id: 'r_201', title: '铁需求增加', description: '6个月后宝宝对膳食铁的需求明显上升。', icon: '铁', tone: 'green' },
      { id: 'r_202', title: '单一添加', description: '一次一种新食材，更容易判断耐受。', icon: '一', tone: 'orange' },
      { id: 'r_203', title: '质地细腻', description: '泥糊状更适合刚开始练习吞咽。', icon: '碗', tone: 'purple' },
      { id: 'r_204', title: '观察过敏', description: '皮疹、呕吐、腹泻等需及时停食观察。', icon: '敏', tone: 'red' }
    ],
    authoritySourceIds: ['a_003'],
    minorityView: '少数观点会建议从蔬菜泥开始培养口味，但多数资料仍强调含铁食物的重要性。',
    warnings: ['明显过敏反应', '频繁呕吐', '进食后呼吸异常', '持续腹泻'],
    relatedQuestions: ['q_005'],
    relatedPostIds: [],
    disclaimer: '本内容仅用于育儿信息参考，不能替代医生诊断。如添加辅食后出现严重过敏或呼吸异常，请及时就医。'
  },
  q_004: {
    questionId: 'q_004',
    title: '宝宝咳嗽有痰，需要立刻去医院吗？',
    categoryId: 'fever_care',
    conclusion: '多数观点认为：先观察宝宝精神状态、呼吸情况、进食饮水和体温变化；若呼吸费力、精神差或持续高热，应及时就医。',
    sourceCount: 211,
    expertCount: 53,
    confidenceLevel: '较高',
    sampleNote: '观点比例基于当前样本内容和来源权重整理，仅供参考。',
    viewpoints: [
      { id: 'v_301', title: '观察护理为主', percentage: 54, type: 'majority', summary: '精神好、呼吸平稳时可先补水、保持空气湿润并观察。', color: '#7EA66A' },
      { id: 'v_302', title: '根据情况就医', percentage: 28, type: 'neutral', summary: '咳嗽加重、发热或影响睡眠进食时建议咨询医生。', color: '#F4A340' },
      { id: 'v_303', title: '建议尽快就医', percentage: 18, type: 'minority', summary: '小月龄或伴呼吸异常时不建议自行观察太久。', color: '#F36F5B' }
    ],
    reasons: [
      { id: 'r_301', title: '看精神状态', description: '精神反应是判断轻重的重要信号。', icon: '神', tone: 'green' },
      { id: 'r_302', title: '观察呼吸', description: '喘憋、胸凹或呼吸急促需要警惕。', icon: '呼', tone: 'red' },
      { id: 'r_303', title: '保证饮水', description: '少量多次补充水分，帮助保持舒适。', icon: '水', tone: 'orange' },
      { id: 'r_304', title: '避免盲目用药', description: '止咳药和抗生素不应自行使用。', icon: '药', tone: 'purple' }
    ],
    authoritySourceIds: ['a_001', 'a_002', 'a_003'],
    minorityView: '少数观点认为：咳嗽有痰提示呼吸道问题，应尽早让医生听诊，尤其是小月龄宝宝。',
    warnings: ['呼吸急促/费力', '精神差', '持续高热', '口唇发青'],
    relatedQuestions: ['q_001', 'q_006'],
    relatedPostIds: [],
    disclaimer: '本内容仅用于育儿信息参考，不能替代医生诊断。如出现呼吸困难、口唇发青、精神差或持续高热，请及时就医。'
  },
  q_005: {
    questionId: 'q_005',
    title: '宝宝挑食不爱吃蔬菜怎么办？',
    categoryId: 'feeding',
    conclusion: '多数观点认为：挑食不宜靠强迫解决，可以通过重复温和暴露、家庭共餐和变化呈现方式，逐步提高宝宝对蔬菜的接受度。',
    sourceCount: 128,
    expertCount: 31,
    confidenceLevel: '中高',
    sampleNote: '观点比例基于当前样本内容和来源权重整理，仅供参考。',
    viewpoints: [
      { id: 'v_401', title: '重复温和暴露', percentage: 57, type: 'majority', summary: '同一种蔬菜可多次少量尝试，避免一次失败就放弃。', color: '#7EA66A' },
      { id: 'v_402', title: '调整形态和搭配', percentage: 29, type: 'neutral', summary: '改变切法、软硬和搭配方式，降低宝宝尝试门槛。', color: '#F4A340' },
      { id: 'v_403', title: '避免强迫进食', percentage: 14, type: 'minority', summary: '强迫可能增加排斥，建议先保证整体饮食均衡。', color: '#F36F5B' }
    ],
    reasons: [
      { id: 'r_401', title: '接受需要时间', description: '宝宝可能需要多次接触，才愿意尝试新口味。', icon: '尝', tone: 'green' },
      { id: 'r_402', title: '家人示范有效', description: '共同进餐能让宝宝更容易模仿和尝试。', icon: '家', tone: 'orange' },
      { id: 'r_403', title: '形态影响入口', description: '颜色、大小和软硬都会影响接受程度。', icon: '菜', tone: 'purple' },
      { id: 'r_404', title: '少用压力交换', description: '把吃菜和奖励惩罚绑定，容易强化对抗。', icon: '压', tone: 'red' }
    ],
    authoritySourceIds: ['a_006', 'a_004'],
    minorityView: '少数观点认为：短期内不必执着某一种蔬菜，只要整体饮食结构可接受，可以先用水果、薯类或其他蔬菜过渡。',
    warnings: ['体重增长明显不佳', '长期只接受极少食物', '进食时频繁呕吐', '疑似吞咽困难'],
    relatedQuestions: ['q_003', 'q_002'],
    relatedPostIds: [],
    disclaimer: '本内容仅用于育儿信息参考，不能替代医生诊断。如宝宝长期摄入极少、体重增长不佳或进食伴随呕吐、吞咽困难，请及时咨询医生。'
  },
  q_006: {
    questionId: 'q_006',
    title: '疫苗后低烧需要吃退烧药吗？',
    categoryId: 'vaccine',
    conclusion: '多数观点认为：疫苗后轻微低热且精神状态尚可时，可先补水、休息并观察；若体温较高、精神差或持续不退，再咨询医生是否用药。',
    sourceCount: 116,
    expertCount: 29,
    confidenceLevel: '中高',
    sampleNote: '观点比例基于当前样本内容和来源权重整理，仅供参考。',
    viewpoints: [
      { id: 'v_501', title: '观察护理为主', percentage: 62, type: 'majority', summary: '低热、精神尚可时多先观察，注意补水和休息。', color: '#7EA66A' },
      { id: 'v_502', title: '按体温和状态判断', percentage: 26, type: 'neutral', summary: '体温升高或明显不适时，可咨询医生是否用退烧药。', color: '#F4A340' },
      { id: 'v_503', title: '不建议预防性用药', percentage: 12, type: 'minority', summary: '未发热或仅轻微不适时，不建议自行提前用退烧药。', color: '#F36F5B' }
    ],
    reasons: [
      { id: 'r_501', title: '轻微反应常见', description: '接种后短期低热可作为常见反应观察。', icon: '苗', tone: 'green' },
      { id: 'r_502', title: '精神状态更关键', description: '精神差、嗜睡或持续哭闹比数字更需要警惕。', icon: '神', tone: 'red' },
      { id: 'r_503', title: '补水和休息', description: '少量多次饮水、保证休息，有助于恢复舒适。', icon: '水', tone: 'orange' },
      { id: 'r_504', title: '用药先确认', description: '退烧药剂量需按体重和月龄判断。', icon: '药', tone: 'purple' }
    ],
    authoritySourceIds: ['a_002', 'a_007'],
    minorityView: '少数观点会建议更早使用退烧药来减轻不适，但多数建议先结合体温、精神状态和医生建议判断。',
    warnings: ['持续高热不退', '精神差或嗜睡', '呼吸异常', '接种处明显红肿化脓'],
    relatedQuestions: ['q_001', 'q_004'],
    relatedPostIds: [],
    disclaimer: '本内容仅用于育儿信息参考，不能替代医生诊断。如宝宝出现持续高热、精神差、呼吸异常或接种处严重红肿，请及时就医。'
  }
}

const profile = {
  nickName: '安心爸爸妈妈',
  avatarText: '家',
  baby: {
    name: '小满',
    age: '7个月',
    gender: '未设置',
    allergy: '暂无记录'
  }
}

module.exports = {
  categories,
  questions,
  authoritySources,
  questionResults,
  profile,
  // Reserved for the next version. The MVP keeps community hidden, but the data boundary is ready.
  communityPosts: []
}
