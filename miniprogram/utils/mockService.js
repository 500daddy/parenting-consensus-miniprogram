const data = require('../mock/data.js')

const HISTORY_KEY = 'parenting_consensus_history'
const FAVORITES_KEY = 'parenting_consensus_favorites'
const PENDING_CATEGORY_KEY = 'pending_category_id'
const PROFILE_KEY = 'parenting_consensus_profile'
const ICON_ROOT = '/assets/icons/pixel-v2'
const categoryIconPaths = {
  fever_care: `${ICON_ROOT}/category/fever-care.png`,
  common_illness: `${ICON_ROOT}/category/common-illness.png`,
  feeding: `${ICON_ROOT}/category/feeding.png`,
  solid_food: `${ICON_ROOT}/category/solid-food.png`,
  sleep: `${ICON_ROOT}/category/sleep.png`,
  skin_allergy: `${ICON_ROOT}/category/skin-allergy.png`,
  vaccine: `${ICON_ROOT}/category/vaccine.png`,
  vaccine_check: `${ICON_ROOT}/category/vaccine.png`,
  early_education: `${ICON_ROOT}/category/early-education.png`,
  early_development: `${ICON_ROOT}/category/growth.png`,
  emotion: `${ICON_ROOT}/category/emotion.png`,
  toilet: `${ICON_ROOT}/category/toilet.png`,
  safety_first: `${ICON_ROOT}/category/safety-first.png`
}
const questionIconOverrides = {
  q_041: `${ICON_ROOT}/category/growth.png`,
  q_043: `${ICON_ROOT}/category/growth.png`,
  q_050: `${ICON_ROOT}/category/safety-first.png`
}
const sourceIconPaths = {
  doctor: `${ICON_ROOT}/source/doctor.png`,
  guide: `${ICON_ROOT}/source/medical-guide.png`,
  wiki: `${ICON_ROOT}/source/parenting-wiki.png`,
  creator: `${ICON_ROOT}/source/verified-creator.png`
}
const actionIconPaths = {
  authority: `${ICON_ROOT}/action/authority.png`,
  consensus: `${ICON_ROOT}/action/consensus.png`,
  favorite: `${ICON_ROOT}/action/favorite.png`,
  history: `${ICON_ROOT}/action/history.png`,
  hot: `${ICON_ROOT}/action/hot.png`,
  minority: `${ICON_ROOT}/action/minority.png`,
  question: `${ICON_ROOT}/action/question.png`,
  reminder: `${ICON_ROOT}/action/reminder.png`,
  search: `${ICON_ROOT}/action/search.png`,
  share: `${ICON_ROOT}/action/share.png`,
  star: `${ICON_ROOT}/action/star.png`,
  warning: `${ICON_ROOT}/action/warning.png`
}
const profileIconPaths = {
  allergy: `${ICON_ROOT}/profile/allergy.png`,
  family: `${ICON_ROOT}/profile/family.png`,
  gender: `${ICON_ROOT}/profile/gender.png`,
  month: `${ICON_ROOT}/profile/month.png`,
  name: `${ICON_ROOT}/profile/name.png`
}
const reasonIconPaths = {
  green: actionIconPaths.consensus,
  orange: actionIconPaths.reminder,
  red: actionIconPaths.warning,
  purple: actionIconPaths.question
}
const glossaryTerms = {
  '生理性溢奶': {
    title: '生理性溢奶',
    summary: '宝宝喝奶后少量奶液从嘴角流出，常见于小月龄宝宝胃容量小、食管括约肌还没发育成熟。',
    reminder: '通常量少、宝宝精神和吃奶正常；如果频繁喷射、体重增长差或精神差，要咨询医生。'
  },
  '喷射状呕吐': {
    title: '喷射状呕吐',
    summary: '呕吐力量很大，奶液或食物像被冲出来一样喷出，不是普通吐奶或嘴角流奶。',
    reminder: '如果反复出现，或伴随精神差、尿少、发热、体重增长差，应及时就医。'
  },
  '脱水': {
    title: '脱水',
    summary: '身体水分不足，宝宝可能表现为尿量明显变少、哭时眼泪少、口唇干、精神差。',
    reminder: '小宝宝脱水进展可能较快，持续呕吐、腹泻或高热时要特别留意。'
  },
  '红旗信号': {
    title: '红旗信号',
    summary: '提示可能有风险、需要优先就医或咨询医生的表现，比如呼吸费力、精神明显变差、抽搐、尿量明显减少。',
    reminder: '看到红旗信号时，不要只等平台答案，应优先线下处理。'
  },
  '精神状态': {
    title: '精神状态',
    summary: '观察宝宝是否和平时一样有反应、能安抚、能吃奶/玩耍，而不只看一个体温或症状数字。',
    reminder: '精神明显差、嗜睡、反应弱，通常比单个症状更值得重视。'
  },
  '低月龄': {
    title: '低月龄',
    summary: '一般指月龄较小的宝宝，尤其 3 个月以内。这个阶段症状变化更需要谨慎看待。',
    reminder: '低月龄宝宝发热、吃奶差、精神差时，建议更早咨询医生。'
  },
  '退烧药': {
    title: '退烧药',
    summary: '用于缓解发热不适的药物，儿童用药需要看月龄、体重、药品成分和医生/说明书建议。',
    reminder: '不要自行叠加多种退烧药，也不要只为追求降温数字而用药。'
  },
  '过敏反应': {
    title: '过敏反应',
    summary: '接触食物、药物或环境刺激后出现皮疹、呕吐、腹泻、咳喘、面部肿胀等表现。',
    reminder: '如果出现呼吸异常、面部肿胀或全身反应，要及时就医。'
  },
  '辅食过敏': {
    title: '辅食过敏',
    summary: '添加新食物后出现皮疹、呕吐、腹泻、咳喘等疑似过敏表现。',
    reminder: '添加新食物建议少量、单一、连续观察，严重反应及时就医。'
  },
  '卡噎': {
    title: '卡噎',
    summary: '食物或异物堵住气道，宝宝可能咳不出声、呼吸困难、脸色发青。',
    reminder: '这是急救场景，出现呼吸困难或意识异常时应立即急救并联系急救电话。'
  }
}

const questionCopyOverrides = {
  q_002: {
    summary: '多数情况下可短时间温水洗或擦浴，前提是精神尚可、没有寒战，洗后及时擦干保暖。',
    resultFocus: '精神尚可时可短时间温水洗或擦浴，寒战、精神差或明显不适时先不洗'
  },
  q_003: {
    summary: '温水擦浴可作为舒适护理，但不是必须退烧；避免酒精擦浴、冰水澡和反复折腾。',
    resultFocus: '温水擦浴看舒适度，避免酒精、冰水和过度降温'
  },
  q_004: {
    summary: '退烧药不只看温度，常见参考是 38.5°C 以上且明显不适时，再按月龄、体重和医嘱判断。',
    resultFocus: '不只看温度，结合不适程度、月龄、体重和医嘱判断退烧药'
  },
  q_005: {
    summary: '3 个月内发热、精神差、呼吸异常、抽搐、脱水或持续高热时，应优先线下就医。',
    resultFocus: '先识别必须就医的红旗信号'
  },
  q_006: {
    summary: '发烧不建议捂汗，穿盖以舒适透气为主，出汗后及时换干衣，避免过热或着凉。',
    resultFocus: '不捂汗，保持舒适穿盖和合适室温'
  },
  q_008: {
    summary: '多数咳嗽有痰不急着止咳药，先看呼吸、精神、进食和发热；喘憋或加重应就医。',
    resultFocus: '先观察呼吸和精神，儿童慎用复方止咳感冒药'
  },
  q_011: {
    summary: '新生儿多以按需喂养为主，常见是少量多次；重点看吃奶状态、尿量、体重和医生建议。',
    resultFocus: '按需少量多次，看尿量、体重和吃奶状态'
  },
  q_012: {
    summary: '奶量够不够不只看单次数字，更要看体重增长、尿量、精神和全天总摄入。',
    resultFocus: '看生长曲线、尿量和全天总量，不只看一顿'
  },
  q_013: {
    summary: '小月龄少量吐奶常见；喷射状呕吐、体重不增、精神差或吐绿色/带血要就医。',
    resultFocus: '少量溢奶常见，喷射呕吐和体重问题要警惕'
  },
  q_014: {
    summary: '胀气肠绞痛可先拍嗝、排气、安抚和规律喂养；发热、呕吐、便血或精神差要就医。',
    resultFocus: '先排气安抚，红旗信号及时就医'
  },
  q_017: {
    summary: '几天不拉不一定就是便秘，关键看便便是否干硬、排便是否痛苦、肚子胀不胀。',
    resultFocus: '看便便性状和宝宝状态，不只数天数'
  },
  q_018: {
    summary: '多数 6 个月前健康宝宝不需要额外喝水，母乳或配方奶通常已能满足水分需要。',
    resultFocus: '6 个月前通常不额外喝水，特殊情况听医生'
  },
  q_019: {
    summary: '多数宝宝约 6 个月开始辅食，同时要看能否坐稳、头颈控制和对食物的兴趣。',
    resultFocus: '约 6 个月且有准备信号再开始'
  },
  q_020: {
    summary: '第一口辅食优先富铁泥糊，如铁强化米粉或肉泥；少量开始，不加盐糖，观察过敏。',
    resultFocus: '优先富铁泥糊，少量单一开始并观察过敏'
  },
  q_021: {
    summary: '新食物后出现皮疹、呕吐腹泻、咳喘或面部肿胀要警惕过敏；呼吸异常需立即就医。',
    resultFocus: '先看皮肤、胃肠和呼吸反应，严重反应及时就医'
  },
  q_024: {
    summary: '1 岁前不建议额外加盐和糖，也不要给蜂蜜；让宝宝先适应食物本味。',
    resultFocus: '1 岁前少盐少糖，不给蜂蜜'
  },
  q_027: {
    summary: '夜醒先排查饥饿、出牙/不适、睡眠联想和白天作息；不必一上来就强行训练。',
    resultFocus: '先排查原因，再逐步调整作息和安抚方式'
  },
  q_028: {
    summary: '抱睡奶睡不一定立刻戒；如果安全且家里能承受，可以慢慢过渡，频繁夜醒再逐步调整。',
    resultFocus: '不必一刀切，按安全和家庭承受度逐步调整'
  },
  q_030: {
    summary: '1 岁内睡觉不建议趴睡，入睡时应仰卧，并保持床面平整、少软物，降低窒息风险。',
    resultFocus: '1 岁内入睡优先仰卧，避免趴睡和松软床品'
  },
  q_034: {
    summary: '湿疹护理以保湿、减少刺激和观察感染信号为主；渗液、破溃或反复加重要就医。',
    resultFocus: '保湿和避刺激是基础，严重或感染信号要就医'
  },
  q_039: {
    summary: '接种后短时间低热、局部红肿或轻微不适较常见；高热不退、精神差或过敏反应要咨询医生。',
    resultFocus: '短时间低热多观察，异常反应及时联系接种门诊或医生'
  },
  q_041: {
    summary: '身高体重不达标先看生长曲线趋势，不要只盯一次测量；连续偏离或增长停滞要评估。',
    resultFocus: '看连续趋势和生长曲线，不只看单点'
  },
  q_043: {
    summary: '翻身、坐、爬、走都有正常范围；明显落后、倒退、两侧不对称或家长担心时应评估。',
    resultFocus: '看里程碑范围和趋势，明显落后要评估'
  },
  q_047: {
    summary: '一直哭先排查饿、困、尿布、冷热、胀气和疼痛；哭闹难安抚或伴随异常要就医。',
    resultFocus: '先排查基础需求和不适，红旗信号及时处理'
  },
  q_050: {
    summary: '能咳能哭先鼓励咳出；不能出声、呼吸困难、脸色发青或意识异常，应立即急救并拨打急救电话。',
    resultFocus: '先判断能否呼吸和咳嗽，严重卡噎立即急救'
  }
}

function makeDirectResultOverride(id, options) {
  return {
    conclusion: options.conclusion,
    mainstreamConsensus: options.conclusion,
    viewpoints: [
      { id: `${id}_v1`, title: `主流做法：${options.mainTitle}`, percentage: options.mainPercentage || 60, type: 'majority', summary: options.mainSummary, color: '#7EA66A' },
      { id: `${id}_v2`, title: `补充观点：${options.neutralTitle}`, percentage: options.neutralPercentage || 27, type: 'neutral', summary: options.neutralSummary, color: '#F4A340' },
      { id: `${id}_v3`, title: `少数观点：${options.minorityTitle}`, percentage: options.minorityPercentage || 13, type: 'minority', summary: options.minoritySummary, color: '#F36F5B' }
    ],
    reasonUpdates: {
      [`${id}_r2`]: {
        title: options.reasonTitle,
        description: options.reasonDescription
      }
    },
    authorityView: options.authorityView
  }
}

const resultCopyOverrides = {
  q_006: makeDirectResultOverride('q_006', {
    conclusion: '主流共识认为：宝宝发烧不建议捂汗。穿盖以舒适、透气、不过热为主，环境温度保持舒服即可；如果出汗，要及时擦干并换干衣，避免一边过热一边受凉。',
    mainTitle: '不捂汗，舒适穿盖',
    mainSummary: '捂汗不能真正治疗发热，还可能让宝宝更热、更不舒服。',
    neutralTitle: '出汗后及时换干衣',
    neutralSummary: '宝宝出汗时重点是保持皮肤干爽，不要继续裹厚衣被。',
    minorityTitle: '寒战或精神差先观察风险',
    minoritySummary: '寒战、精神差、呼吸异常或持续高热时，不要只靠穿盖调整。',
    reasonTitle: '避免过热',
    reasonDescription: '发热护理的目标是舒服和安全，不是把汗捂出来。',
    authorityView: '儿科科普通常建议发热时保持舒适穿盖和适宜室温，不建议通过捂汗来退烧。'
  }),
  q_011: makeDirectResultOverride('q_011', {
    conclusion: '主流共识认为：新生儿多以按需喂养为主，常见是少量多次。不要只卡固定时间，更要看宝宝吃奶是否有力、尿量、体重增长和医生/儿保建议；早产、低体重或黄疸等情况需按医嘱。',
    mainTitle: '按需少量多次',
    mainSummary: '新生儿胃容量小，频繁吃奶很常见，重点看有效吸吮和尿量体重。',
    neutralTitle: '特殊宝宝听医嘱',
    neutralSummary: '早产、低体重、黄疸或吃奶弱时，喂养间隔和补充方式需医生指导。',
    minorityTitle: '吃奶差要及时问',
    minoritySummary: '明显嗜睡、吸吮弱、尿少或体重增长差，不建议只等下一顿。',
    reasonTitle: '看有效喂养',
    reasonDescription: '喂养够不够，要结合尿布、体重和精神状态，不只看时间间隔。',
    authorityView: '婴儿喂养建议通常强调按需喂养和生长监测；特殊医学情况应遵循医生或儿保指导。'
  }),
  q_012: makeDirectResultOverride('q_012', {
    conclusion: '主流共识认为：宝宝一天喝多少奶才够，不能只看某一顿或一个固定数字。更可靠的是看体重增长曲线、尿量、精神状态和全天总摄入；如果增长停滞、尿少或吃奶明显变差，应咨询医生。',
    mainTitle: '看生长和尿量',
    mainSummary: '体重趋势、尿量和精神状态，比单次奶量更能说明是否够。',
    neutralTitle: '全天总量比单顿重要',
    neutralSummary: '有些宝宝一顿多一顿少，只要全天和生长趋势稳定，通常不用过度焦虑。',
    minorityTitle: '增长停滞要评估',
    minoritySummary: '尿少、精神差、吃奶弱或体重曲线明显下滑，需要儿保或医生评估。',
    reasonTitle: '不盯单次数字',
    reasonDescription: '宝宝吃奶有波动，判断是否够要看连续趋势。',
    authorityView: '儿保评估通常会结合生长曲线、尿量、喂养表现和精神状态，而不是只看一次奶量。'
  }),
  q_013: makeDirectResultOverride('q_013', {
    conclusion: '主流共识认为：小月龄宝宝少量吐奶或溢奶较常见，若宝宝精神好、吃奶正常、体重增长可以，多数先观察和调整喂养姿势。若喷射状呕吐、吐绿色/带血、体重不增、精神差或反复呛咳，应及时就医。',
    mainTitle: '少量溢奶常见',
    mainSummary: '小月龄胃容量小，少量从嘴角流奶常见，重点看状态和增长。',
    neutralTitle: '调整喂养姿势',
    neutralSummary: '少量多次、拍嗝、喂后竖抱一会儿，可能减少吐奶。',
    minorityTitle: '喷射或异常呕吐要就医',
    minoritySummary: '喷射状、绿色、带血、体重不增或精神差，不按普通吐奶处理。',
    reasonTitle: '区分溢奶和呕吐',
    reasonDescription: '少量溢奶和喷射状呕吐风险不同，不能只看“吐了”。',
    authorityView: '儿科科普通常区分生理性溢奶和异常呕吐；喷射状呕吐、体重不增或精神差应就医。'
  }),
  q_014: makeDirectResultOverride('q_014', {
    conclusion: '主流共识认为：宝宝胀气或肠绞痛可先尝试拍嗝、排气操、抱哄安抚、规律喂养和减少过度刺激。若伴随发热、反复呕吐、便血、肚子明显胀硬、吃奶差或精神差，应及时就医。',
    mainTitle: '先排气和安抚',
    mainSummary: '拍嗝、排气操、轻柔安抚和规律喂养，是家庭可先尝试的低风险做法。',
    neutralTitle: '减少过度刺激',
    neutralSummary: '过度喂养、频繁换奶或环境刺激，可能让不适更明显。',
    minorityTitle: '红旗信号先就医',
    minoritySummary: '发热、呕吐、便血、肚子胀硬、精神差，不适合只按胀气处理。',
    reasonTitle: '先做低风险护理',
    reasonDescription: '多数胀气护理先从安抚和喂养节奏入手，同时盯住红旗信号。',
    authorityView: '儿科科普通常建议用拍嗝、安抚、排气等方式缓解胀气；若伴随异常症状应线下评估。'
  }),
  q_017: makeDirectResultOverride('q_017', {
    conclusion: '主流共识认为：宝宝几天不拉不一定就是便秘，尤其母乳宝宝可能出现攒肚。判断重点是便便是否干硬、排便是否痛苦、肚子是否胀、吃奶和精神是否正常；便血、呕吐、明显腹胀或精神差要就医。',
    mainTitle: '不只数天数',
    mainSummary: '几天没拉也可能正常，关键看便便性状和宝宝状态。',
    neutralTitle: '干硬痛苦更像便秘',
    neutralSummary: '干硬、颗粒状、排便费力哭闹，比天数本身更值得关注。',
    minorityTitle: '腹胀呕吐要就医',
    minoritySummary: '明显腹胀、呕吐、便血或精神差，不建议只在家等排便。',
    reasonTitle: '看便便性状',
    reasonDescription: '攒肚和便秘处理不同，不能只按“几天”判断。',
    authorityView: '儿科科普通常建议结合便便性状、排便痛苦程度、腹胀和精神吃奶情况判断便秘。'
  }),
  q_019: makeDirectResultOverride('q_019', {
    conclusion: '主流共识认为：多数宝宝约 6 个月可以开始辅食，但还要看准备信号：能较好控制头颈、能坐稳或扶坐、对食物有兴趣、挺舌反射减少。不要过早添加，也不要因为焦虑强喂。',
    mainTitle: '约 6 个月看准备信号',
    mainSummary: '月龄是参考，头颈控制、坐姿和对食物兴趣同样重要。',
    neutralTitle: '不要过早强喂',
    neutralSummary: '准备信号不明显时可稍等，并继续保证奶量。',
    minorityTitle: '特殊情况问儿保',
    minoritySummary: '早产、生长问题、吞咽困难或明显抗拒时，适合先咨询儿保医生。',
    reasonTitle: '月龄加能力一起看',
    reasonDescription: '辅食开始时间不是只看日历，还要看宝宝是否准备好吞咽和坐稳。',
    authorityView: '婴幼儿喂养建议通常以约 6 个月和发育准备信号作为开始辅食的重要参考。'
  }),
  q_024: makeDirectResultOverride('q_024', {
    conclusion: '主流共识认为：1 岁前不建议额外加盐和糖，也不要给蜂蜜。这个阶段更适合让宝宝适应食物本味；家长觉得“没味道”，不代表宝宝需要重口味。',
    mainTitle: '1 岁前少盐少糖',
    mainSummary: '辅食不需要按成人口味调味，先让宝宝接受食物本身味道。',
    neutralTitle: '蜂蜜 1 岁前不要给',
    neutralSummary: '蜂蜜不适合 1 岁内宝宝，甜味来源也不宜过早培养。',
    minorityTitle: '家庭餐要注意隐藏盐糖',
    minoritySummary: '酱油、汤汁、加工食品常有隐藏盐糖，不适合直接给小宝宝吃。',
    reasonTitle: '保护清淡口味',
    reasonDescription: '早期辅食重点是营养和适应，不是让宝宝吃得像大人一样有味。',
    authorityView: '婴幼儿喂养建议通常强调 1 岁前避免额外盐、糖和蜂蜜，减少重口味形成。'
  }),
  q_028: makeDirectResultOverride('q_028', {
    conclusion: '主流共识认为：抱睡、奶睡不一定必须立刻戒。如果宝宝睡眠安全、家长能承受，可以慢慢过渡；如果夜醒频繁、照护者很疲惫或入睡强依赖影响家庭，可以用固定流程逐步调整。',
    mainTitle: '不必一刀切',
    mainSummary: '抱睡奶睡是否调整，要看安全性、家庭承受度和夜醒影响。',
    neutralTitle: '可以逐步过渡',
    neutralSummary: '先固定睡前流程，再逐步减少抱哄或奶睡依赖，通常比突然戒更温和。',
    minorityTitle: '安全睡眠不能让步',
    minoritySummary: '无论是否抱睡奶睡，睡眠环境和入睡安全都应优先保证。',
    reasonTitle: '看家庭是否承受',
    reasonDescription: '睡眠调整不是比赛，目标是宝宝安全、家长可持续。',
    authorityView: '睡眠建议通常强调安全睡眠环境和规律流程；是否调整抱睡奶睡，可结合家庭承受度逐步处理。'
  }),
  q_034: makeDirectResultOverride('q_034', {
    conclusion: '主流共识认为：宝宝湿疹护理基础是足量保湿、减少刺激、短时间温水洗澡和避免抓挠。若渗液、破溃、明显感染、反复加重或影响睡眠，应咨询医生，不建议长期自行乱用药膏。',
    mainTitle: '保湿是基础',
    mainSummary: '湿疹护理通常从规律保湿、减少刺激和温和清洁开始。',
    neutralTitle: '找出刺激因素',
    neutralSummary: '过热、汗液、粗糙衣物、清洁剂和频繁摩擦都可能加重。',
    minorityTitle: '破溃感染要就医',
    minoritySummary: '渗液、结痂、破溃、明显红肿或睡眠受影响时，应让医生评估。',
    reasonTitle: '减少刺激',
    reasonDescription: '湿疹容易反复，护理重点是修护皮肤屏障和避开刺激。',
    authorityView: '皮肤和儿科科普通常建议湿疹护理以保湿和避刺激为基础；严重、感染或反复加重需就医。'
  }),
  q_041: makeDirectResultOverride('q_041', {
    conclusion: '主流共识认为：宝宝身高体重不达标先看生长曲线趋势，不要只盯一次测量或单个百分位。若连续增长变慢、跨越多条曲线下滑、吃奶差或伴随疾病表现，应找儿保医生评估。',
    mainTitle: '看曲线趋势',
    mainSummary: '一次测量偏低不一定代表问题，连续趋势更重要。',
    neutralTitle: '结合喂养和健康状况',
    neutralSummary: '奶量、辅食、睡眠、疾病和测量误差都可能影响判断。',
    minorityTitle: '增长停滞要评估',
    minoritySummary: '连续下滑、明显偏离或伴随精神吃奶差，应及时儿保评估。',
    reasonTitle: '不看单点',
    reasonDescription: '生长评估需要连续记录，单次数字容易误导。',
    authorityView: '儿保评估通常使用标准生长曲线，并结合喂养、疾病史和连续测量趋势。'
  }),
  q_043: makeDirectResultOverride('q_043', {
    conclusion: '主流共识认为：翻身、坐、爬、走都有正常时间范围，不是每个宝宝都按同一天完成。若明显落后、出现能力倒退、两侧动作不对称，或家长明显担心，应咨询儿保医生做发育评估。',
    mainTitle: '里程碑有范围',
    mainSummary: '大运动发展存在个体差异，不能用单一天数卡宝宝。',
    neutralTitle: '看连续进步',
    neutralSummary: '是否持续有新动作和更稳定的控制能力，比某一天会不会更重要。',
    minorityTitle: '倒退或不对称要评估',
    minoritySummary: '能力倒退、明显不对称、很晚仍无进展，需要专业评估。',
    reasonTitle: '看趋势和质量',
    reasonDescription: '发育判断既看时间，也看动作质量、对称性和持续进步。',
    authorityView: '发育评估通常参考里程碑范围和连续观察；明显落后、倒退或动作不对称需儿保评估。'
  }),
  q_047: makeDirectResultOverride('q_047', {
    conclusion: '主流共识认为：宝宝一直哭，先按顺序排查饿、困、尿布、冷热、胀气、疼痛和环境刺激。若哭闹难以安抚，或伴随发热、呕吐、呼吸异常、外伤、吃奶差、精神差，应及时就医。',
    mainTitle: '先排查基础需求',
    mainSummary: '饿、困、尿布、冷热、胀气和过度刺激，是可先快速排查的原因。',
    neutralTitle: '观察是否能安抚',
    neutralSummary: '能被安抚且状态正常，多数可以继续观察；完全哄不好要更谨慎。',
    minorityTitle: '伴随异常先就医',
    minoritySummary: '发热、呕吐、外伤、呼吸异常、吃奶差或精神差，不适合只按闹觉处理。',
    reasonTitle: '按顺序排查',
    reasonDescription: '哭闹是信号，不是诊断；先排除常见需求，再看红旗信号。',
    authorityView: '儿科科普通常建议对哭闹先排查基础需求和身体不适；难以安抚或伴随异常表现需就医。'
  }),
  q_002: {
    conclusion: '主流共识认为：宝宝精神尚可、没有寒战，且水温温和、时间短时，可以洗温水澡或温水擦浴；洗后及时擦干保暖。若精神差、寒战、高热明显不适或洗后更难受，先不洗，优先休息和观察。',
    mainstreamConsensus: '主流共识认为：宝宝精神尚可、没有寒战，且水温温和、时间短时，可以洗温水澡或温水擦浴；洗后及时擦干保暖。若精神差、寒战、高热明显不适或洗后更难受，先不洗，优先休息和观察。',
    viewpoints: [
      { id: 'q_002_v1', title: '主流做法：状态好可短时间温水洗', percentage: 60, type: 'majority', summary: '精神尚可、无寒战时，温水洗或擦浴可帮助舒适，但重点是别着凉。', color: '#7EA66A' },
      { id: 'q_002_v2', title: '补充观点：不舒服时先擦浴或休息', percentage: 27, type: 'neutral', summary: '明显乏力、畏寒、哭闹或家长不确定时，先不洗，改为休息、补液和观察。', color: '#F4A340' },
      { id: 'q_002_v3', title: '少数观点：低月龄或高风险更谨慎', percentage: 13, type: 'minority', summary: '低月龄、持续高热、精神差或伴随红旗信号时，优先咨询医生。', color: '#F36F5B' }
    ],
    reasonUpdates: {
      q_002_r2: { title: '看状态再决定', description: '洗澡不是退烧必选项，关键看精神状态、是否寒战和洗后能否保暖。' }
    },
    authorityView: '儿科医生和健康科普通常建议：发热护理以舒适、补液、休息和观察为主；温水洗浴可以用于舒适护理，但避免冷水、酒精擦浴和洗后受凉。'
  },
  q_003: {
    conclusion: '主流共识认为：温水擦浴可以作为让宝宝舒服一点的护理方式，但不是必须退烧手段。宝宝精神尚可、能接受时可短时间擦拭；不要用酒精擦浴、冰水澡或反复强行物理降温。',
    mainstreamConsensus: '主流共识认为：温水擦浴可以作为让宝宝舒服一点的护理方式，但不是必须退烧手段。宝宝精神尚可、能接受时可短时间擦拭；不要用酒精擦浴、冰水澡或反复强行物理降温。',
    viewpoints: [
      { id: 'q_003_v1', title: '主流做法：温水擦浴看舒适度', percentage: 60, type: 'majority', summary: '如果宝宝能接受，温水擦浴可帮助散热和舒适，擦后及时保暖。', color: '#7EA66A' },
      { id: 'q_003_v2', title: '补充观点：不强行反复擦', percentage: 27, type: 'neutral', summary: '如果宝宝哭闹、寒战或明显不舒服，反复擦浴可能更折腾。', color: '#F4A340' },
      { id: 'q_003_v3', title: '少数观点：红旗信号先就医', percentage: 13, type: 'minority', summary: '精神差、呼吸异常、抽搐、疑似脱水或低月龄发热时，不应只依赖物理降温。', color: '#F36F5B' }
    ],
    reasonUpdates: {
      q_003_r2: { title: '避免刺激降温', description: '酒精、冰水或过冷刺激可能让宝宝更不舒服，也不适合作为家庭常规护理。' }
    },
    authorityView: '权威健康科普更强调舒适护理和风险观察：温水擦浴不是必选项，避免酒精、冰水等刺激性降温方式。'
  },
  q_004: {
    conclusion: '主流共识认为：退烧药不建议只按一个温度数字决定。常见做法是体温约 38.5°C 以上且宝宝明显不舒服时，再结合月龄、体重、药品说明书和医生建议考虑；3 个月内发热、精神差或疑似脱水应先咨询医生。',
    mainstreamConsensus: '主流共识认为：退烧药不建议只按一个温度数字决定。常见做法是体温约 38.5°C 以上且宝宝明显不舒服时，再结合月龄、体重、药品说明书和医生建议考虑；3 个月内发热、精神差或疑似脱水应先咨询医生。',
    viewpoints: [
      { id: 'q_004_v1', title: '主流做法：看不适程度和月龄', percentage: 55, type: 'majority', summary: '发热处理目标是让宝宝舒服一些，不是单纯把体温压到正常。', color: '#7EA66A' },
      { id: 'q_004_v2', title: '补充观点：38.5°C 常作参考', percentage: 30, type: 'neutral', summary: '不少家庭会把 38.5°C 左右作为考虑退烧药的参考，但仍需看状态和说明书。', color: '#F4A340' },
      { id: 'q_004_v3', title: '少数观点：高风险先问医生', percentage: 15, type: 'minority', summary: '低月龄、精神差、脱水、持续高热或用药不确定时，不建议自行试药。', color: '#F36F5B' }
    ],
    reasonUpdates: {
      q_004_r2: { title: '不只看温度', description: '同样体温下，精神状态、月龄、体重和既往病史会影响是否需要用药。' }
    },
    authorityView: '儿科用药建议通常强调：退烧药需结合月龄、体重、说明书和医生建议；不要自行叠加多种退烧药，也不要只追求降温数字。'
  },
  q_005: {
    conclusion: '主流共识认为：宝宝发烧时，3 个月以内发热、精神明显变差、呼吸困难、抽搐、疑似脱水、持续高热不退或家长无法判断，都应优先线下就医或咨询医生。',
    mainstreamConsensus: '主流共识认为：宝宝发烧时，3 个月以内发热、精神明显变差、呼吸困难、抽搐、疑似脱水、持续高热不退或家长无法判断，都应优先线下就医或咨询医生。',
    viewpoints: [
      { id: 'q_005_v1', title: '主流做法：红旗信号先就医', percentage: 55, type: 'majority', summary: '精神差、呼吸异常、抽搐、脱水、持续高热等，比单一温度更需要重视。', color: '#7EA66A' },
      { id: 'q_005_v2', title: '补充观点：低月龄更谨慎', percentage: 30, type: 'neutral', summary: '3 个月以内宝宝发热，建议更早联系医生，不建议只在家观察。', color: '#F4A340' },
      { id: 'q_005_v3', title: '少数观点：不确定也可就医', percentage: 15, type: 'minority', summary: '家长无法判断、症状进展快或宝宝和平时明显不同，也适合尽快咨询。', color: '#F36F5B' }
    ],
    reasonUpdates: {
      q_005_r2: { title: '红旗信号优先', description: '发热是否危险，重点看精神、呼吸、尿量、抽搐和持续时间。' }
    },
    authorityView: '儿科医生和医学指南通常建议：低月龄发热、精神差、呼吸异常、抽搐、脱水或持续高热时，应优先线下评估。'
  },
  q_008: {
    conclusion: '主流共识认为：宝宝咳嗽有痰多数先不急着吃止咳药，尤其不要自行用复方感冒止咳药。先观察呼吸是否费力、精神和进食是否正常；若喘憋、呼吸急促、高热、精神差或持续加重，应及时就医。',
    mainstreamConsensus: '主流共识认为：宝宝咳嗽有痰多数先不急着吃止咳药，尤其不要自行用复方感冒止咳药。先观察呼吸是否费力、精神和进食是否正常；若喘憋、呼吸急促、高热、精神差或持续加重，应及时就医。',
    viewpoints: [
      { id: 'q_008_v1', title: '主流做法：先观察呼吸和状态', percentage: 55, type: 'majority', summary: '咳嗽本身可帮助排出分泌物，是否危险更看呼吸费力和整体状态。', color: '#7EA66A' },
      { id: 'q_008_v2', title: '补充观点：慎用止咳感冒药', percentage: 30, type: 'neutral', summary: '小宝宝不建议自行使用复方止咳感冒药，用药需看年龄和医生建议。', color: '#F4A340' },
      { id: 'q_008_v3', title: '少数观点：喘憋加重要就医', percentage: 15, type: 'minority', summary: '呼吸困难、口唇发青、精神差、高热或症状持续加重时，优先线下处理。', color: '#F36F5B' }
    ],
    reasonUpdates: {
      q_008_r2: { title: '药不一定是第一步', description: '咳嗽有痰先看呼吸和状态，儿童止咳感冒药需要谨慎使用。' }
    },
    authorityView: '儿科科普和用药建议通常提醒：儿童咳嗽先看呼吸和精神状态，不建议自行给小宝宝使用复方止咳感冒药。'
  },
  q_018: {
    conclusion: '主流共识认为：多数 6 个月前的健康宝宝不需要额外喝水，母乳或配方奶通常已经提供所需水分。若发热、腹泻、呕吐、脱水风险或医生特别建议，才需要按医生指导处理。',
    mainstreamConsensus: '主流共识认为：多数 6 个月前的健康宝宝不需要额外喝水，母乳或配方奶通常已经提供所需水分。若发热、腹泻、呕吐、脱水风险或医生特别建议，才需要按医生指导处理。',
    viewpoints: [
      { id: 'q_018_v1', title: '主流做法：6 个月前通常不额外喝水', percentage: 60, type: 'majority', summary: '母乳或配方奶是主要液体来源，天气热也通常通过增加奶量满足。', color: '#7EA66A' },
      { id: 'q_018_v2', title: '补充观点：特殊情况听医生', percentage: 27, type: 'neutral', summary: '发热、腹泻、呕吐或疑似脱水时，不要自行大量喂水，按医生建议处理。', color: '#F4A340' },
      { id: 'q_018_v3', title: '少数观点：辅食后少量尝试', percentage: 13, type: 'minority', summary: '开始辅食后可少量练习喝水，但不替代奶，也不强迫。', color: '#F36F5B' }
    ],
    reasonUpdates: {
      q_018_r2: { title: '月龄是关键', description: '6 个月前和开始辅食后，对水的需求和目的不同，不能简单照搬成人习惯。' }
    },
    authorityView: '婴幼儿喂养建议通常认为：6 个月前主要依靠母乳或配方奶提供水分；开始辅食后可逐步少量饮水。'
  },
  q_020: {
    conclusion: '主流共识认为：第一口辅食优先选择富铁泥糊类食物，例如铁强化米粉、肉泥等；从少量、单一、细腻质地开始，连续观察过敏反应，不加盐、糖和蜂蜜。',
    mainstreamConsensus: '主流共识认为：第一口辅食优先选择富铁泥糊类食物，例如铁强化米粉、肉泥等；从少量、单一、细腻质地开始，连续观察过敏反应，不加盐、糖和蜂蜜。',
    viewpoints: [
      { id: 'q_020_v1', title: '主流做法：优先富铁食物', percentage: 60, type: 'majority', summary: '6 个月左右铁需求上升，第一阶段可优先铁强化米粉、肉泥等。', color: '#7EA66A' },
      { id: 'q_020_v2', title: '补充观点：少量单一开始', percentage: 27, type: 'neutral', summary: '一次只引入一种新食物，少量尝试，便于观察皮疹、呕吐、腹泻等反应。', color: '#F4A340' },
      { id: 'q_020_v3', title: '少数观点：按宝宝准备度调整', percentage: 13, type: 'minority', summary: '如果挺舌反射明显、坐不稳或明显抗拒，可放慢节奏并咨询儿保医生。', color: '#F36F5B' }
    ],
    reasonUpdates: {
      q_020_r2: { title: '铁和过敏都要看', description: '第一口辅食既要考虑营养，也要方便观察新食物反应。' }
    },
    authorityView: '婴幼儿喂养建议通常强调：约 6 个月开始添加辅食，优先富铁食物，少量单一引入，并观察过敏反应。'
  },
  q_021: {
    conclusion: '主流共识认为：添加新食物后，如果出现皮疹、荨麻疹、呕吐、腹泻、咳喘、嘴唇或眼睑肿，要警惕过敏。轻微反应可先停止该食物并记录；呼吸异常、面部肿胀或全身反应应及时就医。',
    mainstreamConsensus: '主流共识认为：添加新食物后，如果出现皮疹、荨麻疹、呕吐、腹泻、咳喘、嘴唇或眼睑肿，要警惕过敏。轻微反应可先停止该食物并记录；呼吸异常、面部肿胀或全身反应应及时就医。',
    viewpoints: [
      { id: 'q_021_v1', title: '主流做法：看皮肤、胃肠和呼吸', percentage: 55, type: 'majority', summary: '皮疹、呕吐腹泻和咳喘是添加辅食后需要重点记录的信号。', color: '#7EA66A' },
      { id: 'q_021_v2', title: '补充观点：一次只加一种', percentage: 30, type: 'neutral', summary: '单一少量引入更容易判断是哪种食物引起反应。', color: '#F4A340' },
      { id: 'q_021_v3', title: '少数观点：严重反应立即就医', percentage: 15, type: 'minority', summary: '呼吸困难、面部肿胀、精神差或全身反应，不适合在家等待观察。', color: '#F36F5B' }
    ],
    reasonUpdates: {
      q_021_r2: { title: '先停食并记录', description: '疑似过敏时先停止该新食物，记录时间、吃了什么和出现了什么反应。' }
    },
    authorityView: '儿科和过敏科普通常建议：添加新食物时少量单一引入，出现呼吸异常、面部肿胀或全身反应要及时就医。'
  },
  q_027: {
    conclusion: '主流共识认为：宝宝夜醒频繁先不必急着“训练”。先排查饥饿、出牙或身体不适、睡眠联想、白天小睡和作息变化；如果没有红旗信号，再用固定睡前流程、逐步减少强依赖安抚来调整。',
    mainstreamConsensus: '主流共识认为：宝宝夜醒频繁先不必急着“训练”。先排查饥饿、出牙或身体不适、睡眠联想、白天小睡和作息变化；如果没有红旗信号，再用固定睡前流程、逐步减少强依赖安抚来调整。',
    viewpoints: [
      { id: 'q_027_v1', title: '主流做法：先排查原因', percentage: 52, type: 'majority', summary: '夜醒常和月龄、饥饿、睡眠联想、出牙/不适和白天作息有关。', color: '#7EA66A' },
      { id: 'q_027_v2', title: '补充观点：逐步调整作息', percentage: 33, type: 'neutral', summary: '固定睡前流程、减少过度疲劳、逐步改变入睡方式，比突然强行改变更稳。', color: '#F4A340' },
      { id: 'q_027_v3', title: '少数观点：身体不适先处理', percentage: 15, type: 'minority', summary: '发热、呼吸异常、呕吐腹泻、精神差或哭闹难安抚时，先看健康问题。', color: '#F36F5B' }
    ],
    reasonUpdates: {
      q_027_r2: { title: '别急着训练', description: '夜醒是结果，先找原因，再决定是调整作息、安抚方式还是就医评估。' }
    },
    authorityView: '睡眠建议通常强调规律作息、睡前流程和安全睡眠环境；夜醒频繁时先排查身体不适和作息变化。'
  },
  q_030: {
    conclusion: '主流共识认为：1 岁内宝宝睡觉不建议趴睡。入睡时应仰卧，床面保持平整，避免枕头、厚被、毛绒玩具等松软物，降低窒息和睡眠相关风险。',
    mainstreamConsensus: '主流共识认为：1 岁内宝宝睡觉不建议趴睡。入睡时应仰卧，床面保持平整，避免枕头、厚被、毛绒玩具等松软物，降低窒息和睡眠相关风险。',
    viewpoints: [
      { id: 'q_030_v1', title: '主流做法：入睡仰卧', percentage: 55, type: 'majority', summary: '1 岁内入睡时仰卧，是更常见的安全睡眠建议。', color: '#7EA66A' },
      { id: 'q_030_v2', title: '补充观点：床面要清爽', percentage: 30, type: 'neutral', summary: '趴睡风险常和松软床品、遮盖口鼻、无人看护等因素叠加。', color: '#F4A340' },
      { id: 'q_030_v3', title: '少数观点：会翻身也先仰卧入睡', percentage: 15, type: 'minority', summary: '宝宝能自主翻身后，仍建议放下入睡时先仰卧，睡眠环境保持安全。', color: '#F36F5B' }
    ],
    reasonUpdates: {
      q_030_r2: { title: '安全睡眠优先', description: '趴睡和松软床品可能增加窒息风险，不能只看宝宝睡得沉不沉。' }
    },
    authorityView: '安全睡眠建议通常明确：婴儿入睡时应仰卧，使用平整坚实床面，避免松软床品和遮盖物。'
  },
  q_039: {
    conclusion: '主流共识认为：宝宝接种后短时间低热、局部红肿或轻微不适较常见，通常先观察、适当休息和补充液体。若高热不退、精神差、呼吸异常、严重过敏反应或持续哭闹，应联系接种门诊或医生。',
    mainstreamConsensus: '主流共识认为：宝宝接种后短时间低热、局部红肿或轻微不适较常见，通常先观察、适当休息和补充液体。若高热不退、精神差、呼吸异常、严重过敏反应或持续哭闹，应联系接种门诊或医生。',
    viewpoints: [
      { id: 'q_039_v1', title: '主流做法：短时间低热先观察', percentage: 60, type: 'majority', summary: '接种后轻微发热、局部红肿或不适较常见，重点看精神和持续时间。', color: '#7EA66A' },
      { id: 'q_039_v2', title: '补充观点：异常反应联系医生', percentage: 27, type: 'neutral', summary: '高热不退、精神差、呼吸异常或严重过敏表现，不适合只在家等。', color: '#F4A340' },
      { id: 'q_039_v3', title: '少数观点：低月龄更谨慎', percentage: 13, type: 'minority', summary: '低月龄宝宝或既往反应明显者，可更早咨询接种门诊。', color: '#F36F5B' }
    ],
    reasonUpdates: {
      q_039_r2: { title: '看持续时间和状态', description: '接种后反应是否需要处理，重点看体温趋势、精神、呼吸和过敏表现。' }
    },
    authorityView: '疫苗科普通常提醒：接种后低热、局部红肿可先观察；严重过敏、高热不退或精神差应联系医生或接种门诊。'
  },
  q_050: {
    conclusion: '主流共识认为：先判断宝宝还能不能咳、哭和呼吸。能咳能哭时鼓励继续咳出并观察；如果不能出声、呼吸困难、脸色发青或意识异常，应立即按急救流程处理并拨打当地急救电话。',
    mainstreamConsensus: '主流共识认为：先判断宝宝还能不能咳、哭和呼吸。能咳能哭时鼓励继续咳出并观察；如果不能出声、呼吸困难、脸色发青或意识异常，应立即按急救流程处理并拨打当地急救电话。',
    viewpoints: [
      { id: 'q_050_v1', title: '主流做法：先看能否呼吸和咳嗽', percentage: 55, type: 'majority', summary: '能有效咳嗽时不要盲目抠喉；不能呼吸或发青是急救信号。', color: '#7EA66A' },
      { id: 'q_050_v2', title: '补充观点：危险物误食需咨询', percentage: 30, type: 'neutral', summary: '误食药品、清洁剂、电池、磁铁等危险物，应及时联系急救或专业机构。', color: '#F4A340' },
      { id: 'q_050_v3', title: '少数观点：不确定也别拖', percentage: 15, type: 'minority', summary: '家长无法判断、宝宝状态异常或症状进展快时，优先线下急救。', color: '#F36F5B' }
    ],
    reasonUpdates: {
      q_050_r2: { title: '这是急救场景', description: '卡噎或危险物误食不能只看经验帖，关键是先判断呼吸和意识。' }
    },
    authorityView: '急救建议通常强调：异物卡噎先判断是否能呼吸、咳嗽和出声；严重气道梗阻应立即急救并联系急救电话。'
  }
}

function sortQuestions(left, right) {
  const leftRank = typeof left.priorityRank === 'number' ? left.priorityRank : 99
  const rightRank = typeof right.priorityRank === 'number' ? right.priorityRank : 99
  if (leftRank !== rightRank) return leftRank - rightRank
  if (left.heat !== right.heat) return right.heat - left.heat
  return left.id.localeCompare(right.id)
}

function getQuestionSearchText(question) {
  return [
    question.title,
    question.shortTitle,
    question.categoryName,
    question.scene,
    question.tag,
    (question.tags || []).join(' '),
    (question.searchTerms || []).join(' '),
    question.summary
  ].filter(Boolean).join(' ').toLowerCase()
}

function getQuestionSearchScore(question, keyword) {
  const text = (keyword || '').trim().toLowerCase()
  if (!text) return 0
  const haystack = getQuestionSearchText(question)
  let score = 0
  if (question.title && question.title.toLowerCase().indexOf(text) > -1) score += 80
  if (question.shortTitle && question.shortTitle.toLowerCase().indexOf(text) > -1) score += 70
  if (haystack.indexOf(text) > -1) score += 50
  if (text.indexOf((question.shortTitle || '').toLowerCase()) > -1) score += 35
  ;(question.searchTerms || []).forEach((term) => {
    const lowerTerm = term.toLowerCase()
    if (lowerTerm.indexOf(text) > -1 || text.indexOf(lowerTerm) > -1) score += 45
  })
  ;(question.tags || []).forEach((tag) => {
    const lowerTag = tag.toLowerCase()
    if (text.indexOf(lowerTag) > -1) score += 12
  })
  return score
}

function getGlossaryEntry(term) {
  return glossaryTerms[term] || null
}

function buildGlossarySegments(text) {
  const source = text || ''
  if (!source) return []
  const terms = Object.keys(glossaryTerms).sort((left, right) => right.length - left.length)
  const segments = []
  let index = 0
  while (index < source.length) {
    const term = terms.find((item) => source.indexOf(item, index) === index)
    if (term) {
      segments.push({
        text: term,
        term,
        entry: glossaryTerms[term]
      })
      index += term.length
      continue
    }
    let nextIndex = source.length
    terms.forEach((item) => {
      const foundIndex = source.indexOf(item, index + 1)
      if (foundIndex > -1 && foundIndex < nextIndex) {
        nextIndex = foundIndex
      }
    })
    segments.push({ text: source.slice(index, nextIndex) })
    index = nextIndex
  }
  return segments
}
function getCategory(id) {
  const category = data.categories.find((item) => item.id === id)
  return category ? enrichCategory(category) : category
}

function getCategoryIconPath(categoryId) {
  return categoryIconPaths[categoryId] || actionIconPaths.question
}

function getQuestionIconPath(question) {
  if (!question) return actionIconPaths.question
  return questionIconOverrides[question.id] || getCategoryIconPath(question.categoryId)
}

function enrichCategory(category) {
  return Object.assign({}, category, {
    iconPath: getCategoryIconPath(category.id)
  })
}

function enrichQuestion(question) {
  if (!question) return question
  const copyOverride = questionCopyOverrides[question.id] || {}
  return Object.assign({}, question, copyOverride, {
    category: getCategory(question.categoryId),
    tagIconPath: getQuestionIconPath(question)
  })
}

function enrichSource(source) {
  if (!source) return source
  return Object.assign({}, source, {
    iconPath: sourceIconPaths[source.type] || actionIconPaths.authority
  })
}

function formatHeat(value) {
  if (value >= 10000) {
    return (value / 10000).toFixed(value >= 100000 ? 1 : 2).replace(/\.0$/, '') + '万'
  }
  return String(value)
}

function getQuestionById(id) {
  return enrichQuestion(data.questions.find((item) => item.id === id))
}

function hasQuestionResult(id) {
  return Boolean(id && data.questionResults[id])
}

function getAvailableQuestions() {
  return data.questions.filter((item) => hasQuestionResult(item.id)).slice().sort(sortQuestions).map(enrichQuestion)
}

function getPriorityQuestions(priority) {
  const target = priority || 'P0'
  return getAvailableQuestions().filter((item) => item.priority === target)
}

function getDefaultQuestionId(keyword) {
  const text = (keyword || '').trim()
  const availableQuestions = getAvailableQuestions()
  if (!text) return availableQuestions.length ? availableQuestions[0].id : ''
  const scored = availableQuestions.map((item) => ({
    id: item.id,
    score: getQuestionSearchScore(item, text),
    heat: item.heat
  })).filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score || right.heat - left.heat)
  return scored.length ? scored[0].id : ''
}

function searchQuestions(keyword) {
  const text = (keyword || '').trim()
  const availableQuestions = getAvailableQuestions()
  if (!text) return availableQuestions
  const direct = availableQuestions.map((item) => Object.assign({}, item, {
    searchScore: getQuestionSearchScore(item, text)
  })).filter((item) => item.searchScore > 0)
    .sort((left, right) => right.searchScore - left.searchScore || sortQuestions(left, right))
  if (direct.length) return direct
  const fallbackId = getDefaultQuestionId(text)
  return hasQuestionResult(fallbackId) ? [getQuestionById(fallbackId)] : []
}

function buildDonutStyle(viewpoints) {
  let start = 0
  const segments = viewpoints.map((item, index) => {
    const end = index === viewpoints.length - 1 ? 100 : Math.min(start + item.percentage, 100)
    const segment = `${item.color} ${start}% ${end}%`
    start = end
    return segment
  })
  return `background: conic-gradient(${segments.join(', ')});`
}

function applyResultCopyOverride(result) {
  if (!result) return result
  const copyOverride = resultCopyOverrides[result.questionId] || {}
  const reasonUpdates = copyOverride.reasonUpdates || {}
  const merged = Object.assign({}, result, copyOverride)
  delete merged.reasonUpdates
  if (copyOverride.reasonUpdates) {
    merged.reasons = (result.reasons || []).map((reason) => {
      return Object.assign({}, reason, reasonUpdates[reason.id] || {})
    })
  }
  return merged
}

function getQuestionResult(options) {
  const id = options && options.id ? options.id : getDefaultQuestionId(options && options.keyword)
  if (!id || !data.questionResults[id]) return null
  const result = applyResultCopyOverride(Object.assign({}, data.questionResults[id]))
  result.question = getQuestionById(id)
  result.category = getCategory(result.categoryId)
  result.donutStyle = buildDonutStyle(result.viewpoints)
  result.reasons = result.reasons.map((reason) => Object.assign({}, reason, {
    iconPath: reasonIconPaths[reason.tone] || actionIconPaths.question
  }))
  result.authoritySources = result.authoritySourceIds.map((sourceId) => {
    return enrichSource(data.authoritySources.find((source) => source.id === sourceId))
  }).filter(Boolean)
  result.relatedQuestionItems = result.relatedQuestions.map(getQuestionById).filter((item) => item && hasQuestionResult(item.id))
  return result
}

function getDailyQuestionId(date) {
  const questions = getAvailableQuestions()
  if (!questions.length) return ''
  const current = date instanceof Date ? date : new Date()
  const startOfDay = new Date(current.getFullYear(), current.getMonth(), current.getDate())
  const dayIndex = Math.floor(startOfDay.getTime() / 86400000)
  return questions[dayIndex % questions.length].id
}

function getTodayQuestionResult(date) {
  return getQuestionResult({ id: getDailyQuestionId(date) })
}

function getAuthoritySources(type, questionId) {
  return data.authoritySources.filter((item) => {
    const typeMatched = !type || type === 'all' || item.type === type
    const questionMatched = !questionId || item.questionIds.indexOf(questionId) > -1
    return typeMatched && questionMatched
  }).map(enrichSource)
}

function getQuestionsByCategory(categoryId) {
  const availableQuestions = getAvailableQuestions()
  if (!categoryId || categoryId === 'all') return availableQuestions
  return availableQuestions.filter((item) => item.categoryId === categoryId)
}

function getStorageList(key) {
  try {
    const value = wx.getStorageSync(key)
    return Array.isArray(value) ? value : []
  } catch (error) {
    return []
  }
}

function setStorageList(key, value) {
  try {
    wx.setStorageSync(key, value)
  } catch (error) {
    // Storage may be unavailable in some preview runtimes.
  }
}

function getStorageObject(key) {
  try {
    const value = wx.getStorageSync(key)
    return value && typeof value === 'object' && !Array.isArray(value) ? value : null
  } catch (error) {
    return null
  }
}

function setStorageObject(key, value) {
  try {
    wx.setStorageSync(key, value)
  } catch (error) {
    // Storage may be unavailable in some preview runtimes.
  }
}

function sanitizeHistory(items) {
  const seen = {}
  return items.filter((item) => typeof item === 'string')
    .map((item) => item.trim())
    .filter((item) => {
      if (!item || seen[item]) return false
      seen[item] = true
      return true
    })
    .slice(0, 12)
}

function sanitizeFavoriteIds(items) {
  const seen = {}
  return items.filter((id) => typeof id === 'string' && hasQuestionResult(id))
    .filter((id) => {
      if (seen[id]) return false
      seen[id] = true
      return true
    })
}

function addHistory(keyword) {
  const text = (keyword || '').trim()
  if (!text) return
  const history = sanitizeHistory(getStorageList(HISTORY_KEY)).filter((item) => item !== text)
  history.unshift(text)
  setStorageList(HISTORY_KEY, history.slice(0, 12))
}

function getHistory() {
  return sanitizeHistory(getStorageList(HISTORY_KEY))
}

function clearHistory() {
  setStorageList(HISTORY_KEY, [])
}

function setPendingCategory(categoryId) {
  try {
    wx.setStorageSync(PENDING_CATEGORY_KEY, categoryId)
  } catch (error) {
    // Storage may be unavailable in some preview runtimes.
  }
}

function consumePendingCategory() {
  try {
    const categoryId = wx.getStorageSync(PENDING_CATEGORY_KEY)
    wx.removeStorageSync(PENDING_CATEGORY_KEY)
    return categoryId || ''
  } catch (error) {
    return ''
  }
}

function getFavorites() {
  const ids = sanitizeFavoriteIds(getStorageList(FAVORITES_KEY))
  return ids.map(getQuestionById).filter((item) => item && hasQuestionResult(item.id))
}

function isFavorite(questionId) {
  return hasQuestionResult(questionId) && sanitizeFavoriteIds(getStorageList(FAVORITES_KEY)).indexOf(questionId) > -1
}

function toggleFavorite(questionId) {
  if (!hasQuestionResult(questionId)) return false
  const ids = sanitizeFavoriteIds(getStorageList(FAVORITES_KEY))
  const index = ids.indexOf(questionId)
  if (index > -1) {
    ids.splice(index, 1)
  } else {
    ids.unshift(questionId)
  }
  setStorageList(FAVORITES_KEY, ids)
  return index === -1
}

function normalizeProfile(profile) {
  const saved = profile || {}
  const savedBaby = saved.baby || {}
  return {
    isLoggedIn: Boolean(saved.isLoggedIn),
    nickName: saved.nickName || data.profile.nickName,
    avatarUrl: saved.avatarUrl || '',
    avatarText: saved.avatarText || data.profile.avatarText,
    baby: {
      name: savedBaby.name || data.profile.baby.name,
      age: savedBaby.age || data.profile.baby.age,
      gender: savedBaby.gender || data.profile.baby.gender,
      allergy: savedBaby.allergy || data.profile.baby.allergy
    }
  }
}

function getProfile() {
  return normalizeProfile(getStorageObject(PROFILE_KEY))
}

function saveProfile(profile) {
  const normalized = normalizeProfile(profile)
  setStorageObject(PROFILE_KEY, normalized)
  return normalized
}

function loginProfile(userInfo) {
  const current = getProfile()
  return saveProfile(Object.assign({}, current, {
    isLoggedIn: true,
    nickName: userInfo && userInfo.nickName ? userInfo.nickName : current.nickName,
    avatarUrl: userInfo && userInfo.avatarUrl ? userInfo.avatarUrl : current.avatarUrl,
    avatarText: userInfo && userInfo.nickName ? userInfo.nickName.slice(0, 1) : current.avatarText
  }))
}

function saveBabyProfile(baby) {
  const current = getProfile()
  return saveProfile(Object.assign({}, current, {
    baby: Object.assign({}, current.baby, baby || {})
  }))
}

function logoutProfile() {
  try {
    wx.removeStorageSync(PROFILE_KEY)
  } catch (error) {
    // Storage may be unavailable in some preview runtimes.
  }
  return getProfile()
}

module.exports = {
  HISTORY_KEY,
  FAVORITES_KEY,
  PENDING_CATEGORY_KEY,
  PROFILE_KEY,
  categories: data.categories.map(enrichCategory),
  questions: data.questions.map(enrichQuestion),
  profile: normalizeProfile(data.profile),
  actionIconPaths,
  profileIconPaths,
  getCategoryIconPath,
  getQuestionIconPath,
  getGlossaryEntry,
  buildGlossarySegments,
  formatHeat,
  getCategory,
  getQuestionById,
  hasQuestionResult,
  getAvailableQuestions,
  getDefaultQuestionId,
  getDailyQuestionId,
  getTodayQuestionResult,
  searchQuestions,
  getQuestionResult,
  getPriorityQuestions,
  getAuthoritySources,
  getQuestionsByCategory,
  addHistory,
  getHistory,
  clearHistory,
  setPendingCategory,
  consumePendingCategory,
  getFavorites,
  isFavorite,
  toggleFavorite,
  getProfile,
  saveProfile,
  loginProfile,
  saveBabyProfile,
  logoutProfile
}
