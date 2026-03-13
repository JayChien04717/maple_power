import { DashboardData } from '../types';

export interface PowerStats {
  level: number;
  attack: number;
  attackP: number;
  dmgP: number;
  bossP: number;
  strikeP: number;
  ignoreP: number;
  finalDmgP: number;
  defenseP: number;
  str: { clear: number; p: number; unique: number; total: number };
  dex: { clear: number; p: number; unique: number; total: number };
  int: { clear: number; p: number; unique: number; total: number };
  luk: { clear: number; p: number; unique: number; total: number };
  allP: number;
}

export interface JobInfo {
  name: string;
  wpValue: number;
  strRole: 'main' | 'minor' | '';
  dexRole: 'main' | 'minor' | '';
  intRole: 'main' | 'minor' | '';
  lukRole: 'main' | 'minor' | '';
}

export const getJobInfo = (jobName: string): JobInfo => {
  // Mapping logic port from Charactor.py
  // Default values
  const info: JobInfo = {
    name: jobName,
    wpValue: 1.0,
    strRole: '',
    dexRole: '',
    intRole: '',
    lukRole: '',
  };

  // Roles assignment (Simplified port from Python)
  if (jobName === '傑諾') {
    info.strRole = 'main'; info.dexRole = 'main'; info.lukRole = 'main';
    info.wpValue = 1.3125;
  } else if (['英雄(單手武器)', '聖騎士(單手武器)', '黑騎士', '拳霸', '重砲指揮官', '聖魂劍士(單)', '閃雷悍將', '米哈逸', '爆拳槍神', '惡魔殺手', '狂狼勇士', '隱月', '凱撒', '亞克', '阿戴爾', '神之子(琉)', '神之子(璃)', '劍豪(一般狀態)', '劍豪(拔刀狀態)', '英雄', '聖騎士', '狂戰士', '騎士', '槍騎兵', '龍騎士', '阿戴爾'].some(k => jobName.includes(k))) {
    info.strRole = 'main'; info.dexRole = 'minor';
  } else if (['箭神', '神射手', '開拓者', '槍神', '破風使者', '狂豹獵人', '機甲戰神', '精靈遊俠', '天使破壞者', '凱殷', '墨玄'].some(k => jobName.includes(k))) {
    info.strRole = 'minor'; info.dexRole = 'main';
  } else if (['大魔導士(火、毒)', '大魔導士(冰、雷)', '主教', '烈焰巫師', '煉獄巫師', '龍魔導士', '夜光', '伊利恩', '凱內西斯', '菈菈', '琳恩', '陰陽師', '火、毒', '冰、雷', '靈魂', '琳恩'].some(k => jobName.includes(k))) {
    info.intRole = 'main'; info.lukRole = 'minor';
  } else if (['夜使者', '暗夜行者', '幻影俠盜', '虎影', '卡莉'].some(k => jobName.includes(k))) {
    info.dexRole = 'minor'; info.lukRole = 'main';
  } else if (['暗影神偷', '影武者', '卡蒂娜'].some(k => jobName.includes(k))) {
    info.strRole = 'minor'; info.dexRole = 'minor'; info.lukRole = 'main';
  }

  // Weapon Coefficient assignment
  const wp12 = ['聖騎士(單手武器)', '大魔導士(火、毒)', '大魔導士(冰、雷)', '主教', '聖魂劍士(單)', '烈焰巫師', '米哈逸', '煉獄巫師', '惡魔殺手', '龍魔導士', '伊利恩', '凱內西斯', '菈菈', '火、毒', '冰、雷'];
  const wp125 = ['劍豪(一般狀態)', '劍豪(拔刀狀態)'];
  const wp13 = ['英雄(單手武器)', '箭神', '開拓者', '暗影神偷', '影武者', '破風使者', '精靈遊俠', '夜光', '幻影俠盜', '卡蒂娜', '凱殷', '阿戴爾', '虎影', '卡莉'];
  const wp134 = ['聖騎士(雙手武器)', '聖魂劍士(雙)', '凱撒', '神之子(璃)', '琳恩'];
  const wp135 = ['陰陽師', '神射手', '狂豹獵人'];
  const wp144 = ['英雄(雙手武器)', '英雄']; // Adventures 2H hero is 1.44
  const wp149 = ['黑騎士', '狂狼勇士', '神之子(琉)'];
  const wp15 = ['槍神', '重砲指揮官', '機甲戰神'];
  const wp17 = ['拳霸', '閃雷悍將', '爆拳槍神', '隱月', '天使破壞者', '亞克'];
  const wp175 = ['夜使者', '暗夜行者', '墨玄'];

  if (wp12.some(k => jobName.includes(k))) info.wpValue = 1.2;
  else if (wp125.some(k => jobName.includes(k))) info.wpValue = 1.25;
  else if (wp13.some(k => jobName.includes(k))) info.wpValue = 1.3;
  else if (wp134.some(k => jobName.includes(k))) info.wpValue = 1.34;
  else if (wp135.some(k => jobName.includes(k))) info.wpValue = 1.35;
  else if (wp144.some(k => jobName.includes(k))) info.wpValue = 1.44;
  else if (wp149.some(k => jobName.includes(k))) info.wpValue = 1.49;
  else if (wp15.some(k => jobName.includes(k))) info.wpValue = 1.5;
  else if (wp17.some(k => jobName.includes(k))) info.wpValue = 1.7;
  else if (wp175.some(k => jobName.includes(k))) info.wpValue = 1.75;

  return info;
};

const calcAttribute = (job: JobInfo, stats: PowerStats): number => {
  let mainAp = 0;
  let minorAp = 0;

  if (job.strRole === 'main') mainAp += stats.str.total;
  if (job.dexRole === 'main') mainAp += stats.dex.total;
  if (job.intRole === 'main') mainAp += stats.int.total;
  if (job.lukRole === 'main') mainAp += stats.luk.total;

  if (job.strRole === 'minor') minorAp += stats.str.total;
  if (job.dexRole === 'minor') minorAp += stats.dex.total;
  if (job.intRole === 'minor') minorAp += stats.int.total;
  if (job.lukRole === 'minor') minorAp += stats.luk.total;

  return (4 * mainAp) + minorAp;
};

const calculateIgnore = (origin: number, range: number): number => {
  let ignoreP = origin;
  if (range > 0) {
    ignoreP = 1 - ((1 - ignoreP) * (1 - range));
  } else if (range < 0) {
    ignoreP = 1 - ((1 - ignoreP) / (1 + range));
  }
  return Math.min(1, ignoreP);
};

export const getImprovement = (current: PowerStats, job: JobInfo, deltas: Partial<PowerStats & { allP: number }>): { total: number; breakdown: Record<string, number> } => {
  const estimate = JSON.parse(JSON.stringify(current)) as PowerStats;

  if (deltas.dmgP !== undefined) estimate.dmgP += deltas.dmgP;
  if (deltas.bossP !== undefined) estimate.bossP += deltas.bossP;
  if (deltas.attack !== undefined) estimate.attack += deltas.attack;
  if (deltas.attackP !== undefined) estimate.attackP += deltas.attackP;
  if (deltas.strikeP !== undefined) estimate.strikeP += deltas.strikeP;
  if (deltas.ignoreP !== undefined) estimate.ignoreP = calculateIgnore(current.ignoreP, deltas.ignoreP);
  if (deltas.finalDmgP !== undefined) estimate.finalDmgP += deltas.finalDmgP;

  const allStatP = deltas.allP || 0;
  
  const updateStat = (key: 'str' | 'dex' | 'int' | 'luk') => {
    const d = deltas[key] as any;
    if (d) {
      if (typeof d === 'number') {
        // Fallback for simple numeric delta (assumed clear base)
        estimate[key].clear += d;
      } else {
        if (d.clear) estimate[key].clear += d.clear;
        if (d.p) estimate[key].p += d.p;
        if (d.unique) estimate[key].unique += d.unique;
      }
    }
    estimate[key].total = estimate[key].clear * (1 + estimate[key].p + allStatP) + estimate[key].unique;
  };

  updateStat('str');
  updateStat('dex');
  updateStat('int');
  updateStat('luk');

  const dmgImprove = (1 + estimate.dmgP + estimate.bossP) / (1 + current.dmgP + current.bossP);
  const attImprove = estimate.attack / current.attack;
  const attPImprove = (1 + estimate.attackP) / (1 + current.attackP);
  const strikeImprove = (1.35 + estimate.strikeP) / (1.35 + current.strikeP);
  const ignoreImprove = (1 - (current.defenseP * (1 - estimate.ignoreP))) / (1 - (current.defenseP * (1 - current.ignoreP)));
  const finalDmgImprove = (1 + estimate.finalDmgP) / (1 + current.finalDmgP);
  
  const currentAttr = calcAttribute(job, current);
  const estimateAttr = calcAttribute(job, estimate);
  const attrImprove = estimateAttr / currentAttr;

  const total = dmgImprove * attImprove * attPImprove * strikeImprove * ignoreImprove * finalDmgImprove * attrImprove;

  return {
    total,
    breakdown: {
      dmgBonus: dmgImprove,
      attBonus: attImprove,
      attPBonus: attPImprove,
      strikeBonus: strikeImprove,
      ignoreBonus: ignoreImprove,
      finalDmgBonus: finalDmgImprove,
      attrBonus: attrImprove,
    }
  };
};

export const getEquivalent = (current: PowerStats, job: JobInfo, targetImprove: number): Partial<PowerStats & { allP: number }> => {
  const result: any = {};
  if (targetImprove === 1) return result;

  const diff = targetImprove - 1;
  result.attack = current.attack * diff;
  result.attackP = (1 + current.attackP) * diff;
  result.dmgP = (1 + current.dmgP + current.bossP) * diff;
  result.bossP = result.dmgP;
  result.strikeP = (1.35 + current.strikeP) * diff;

  const defense = current.defenseP;
  const finalDmg = (1 - (defense * (1 - current.ignoreP))) * targetImprove;
  const newIgnore = (defense - (1 - finalDmg)) / defense;
  result.ignoreP = 1 - ((1 - newIgnore) / (1 - current.ignoreP));

  const currentAttr = calcAttribute(job, current);
  
  // Attribute equivalent (simplified)
  if (job.strRole === 'main') {
    const newAp = currentAttr * targetImprove;
    // ... simplified equvalent calculation
    result.str = { clear: (newAp / 4 - current.str.total) / (1 + current.str.p) };
  }
  // more roles here...

  return result;
};

export const transformDashboardData = (data: DashboardData): PowerStats => {
  const getStat = (name: string): number => {
    const find = data.stat.final_stat.find(s => s.stat_name === name);
    return find ? parseFloat(find.stat_value.replace(/,/g, '')) : 0;
  };

  const getSubStat = (key: string, type: 'clear' | 'p' | 'unique'): number => {
    // This part requires mapping from statutory data which might not be direct.
    // We'll estimate or use default values if not clearly separated in final_stat.
    // CharacterStat in holybear.tw-main doesn't seem to have clear/p/unique separation in final_stat.
    // We might need to approximate or leave it slightly limited.
    if (type === 'p') return 0; // Defaulting % to 0 if unknown
    if (type === 'unique') return 0;
    return getStat(key);
  };

  return {
    level: data.basic.character_level,
    attack: getStat('攻擊力') || 1,
    attackP: 0, // Need to fetch from breakdown or approximate
    dmgP: getStat('傷害') / 100,
    bossP: getStat('BOSS怪物傷害') / 100,
    strikeP: getStat('爆擊傷害') / 100,
    ignoreP: getStat('無視防禦率') / 100,
    finalDmgP: getStat('最終傷害') / 100,
    defenseP: 3, // Defaulting to 300% defense for late game boss
    str: { clear: getStat('STR'), p: 0, unique: 0, total: getStat('STR') },
    dex: { clear: getStat('DEX'), p: 0, unique: 0, total: getStat('DEX') },
    int: { clear: getStat('INT'), p: 0, unique: 0, total: getStat('INT') },
    luk: { clear: getStat('LUK'), p: 0, unique: 0, total: getStat('LUK') },
    allP: 0,
  };
};
