import React, { useState, useMemo } from 'react';
import { TrendingUp, Calculator, Zap, Info, PlusCircle, MinusCircle, RefreshCw, Layers } from 'lucide-react';
import { DashboardData } from '../types';
import { getJobInfo, getImprovement, transformDashboardData, PowerStats, getEquivalent } from '../services/powerService';

interface Props {
  data: DashboardData;
}

const PowerEffectiveness: React.FC<Props> = ({ data }) => {
  const jobInfo = useMemo(() => getJobInfo(data.basic.character_class), [data.basic.character_class]);
  const baseStats = useMemo(() => transformDashboardData(data), [data]);

  const [deltas, setDeltas] = useState<any>({
    attack: 0,
    attackP: 0,
    bossP: 0,
    dmgP: 0,
    strikeP: 0,
    ignoreP: 0,
    finalDmgP: 0,
    allP: 0,
    str: { clear: 0, p: 0, unique: 0 },
    dex: { clear: 0, p: 0, unique: 0 },
    int: { clear: 0, p: 0, unique: 0 },
    luk: { clear: 0, p: 0, unique: 0 },
  });

  const improvement = useMemo(() => {
    return getImprovement(baseStats, jobInfo, deltas);
  }, [baseStats, jobInfo, deltas]);

  const equivalents = useMemo(() => {
    return getEquivalent(baseStats, jobInfo, 1.01);
  }, [baseStats, jobInfo]);

  const updateDelta = (path: string, value: string, isPercentage = false) => {
    const num = (parseFloat(value) || 0) / (isPercentage ? 100 : 1);
    const keys = path.split('.');
    
    setDeltas(prev => {
      const next = { ...prev };
      let current = next;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = num;
      return next;
    });
  };

  const resetDeltas = () => {
    setDeltas({
      attack: 0,
      attackP: 0,
      bossP: 0,
      dmgP: 0,
      strikeP: 0,
      ignoreP: 0,
      finalDmgP: 0,
      allP: 0,
      str: { clear: 0, p: 0, unique: 0 },
      dex: { clear: 0, p: 0, unique: 0 },
      int: { clear: 0, p: 0, unique: 0 },
      luk: { clear: 0, p: 0, unique: 0 },
    });
  };

  return (
    <div className="bg-[#161b22] border border-slate-800 rounded-xl p-6 shadow-xl space-y-6 my-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Calculator className="w-5 h-5 text-indigo-400" /> 戰力效益計算
        </h3>
        <button 
          onClick={resetDeltas}
          className="p-2 text-slate-500 hover:text-white transition-colors"
          title="重置"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left/Middle: Inputs */}
        <div className="lg:col-span-2 space-y-8">
          {/* Attack & Damage Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-4 h-4" /> 攻擊與傷害
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <StatInput label="增加攻擊力/魔力" value={deltas.attack} onChange={v => updateDelta('attack', v)} />
              <StatInput label="攻擊/魔力 (%)" value={deltas.attackP * 100} onChange={v => updateDelta('attackP', v, true)} />
              <StatInput label="BOSS 傷害 (%)" value={deltas.bossP * 100} onChange={v => updateDelta('bossP', v, true)} />
              <StatInput label="傷害 (%)" value={deltas.dmgP * 100} onChange={v => updateDelta('dmgP', v, true)} />
              <StatInput label="爆擊傷害 (%)" value={deltas.strikeP * 100} onChange={v => updateDelta('strikeP', v, true)} />
              <StatInput label="無視防禦 (%)" value={deltas.ignoreP * 100} onChange={v => updateDelta('ignoreP', v, true)} />
              <StatInput label="最終傷害 (%)" value={deltas.finalDmgP * 100} onChange={v => updateDelta('finalDmgP', v, true)} />
            </div>
          </div>

          {/* Attributes Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
              <Layers className="w-4 h-4" /> 屬性增幅
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <AttributeInputs label="STR" deltas={deltas.str} onChange={(f, v) => updateDelta(`str.${f}`, v, f === 'p')} />
              <AttributeInputs label="DEX" deltas={deltas.dex} onChange={(f, v) => updateDelta(`dex.${f}`, v, f === 'p')} />
              <AttributeInputs label="INT" deltas={deltas.int} onChange={(f, v) => updateDelta(`int.${f}`, v, f === 'p')} />
              <AttributeInputs label="LUK" deltas={deltas.luk} onChange={(f, v) => updateDelta(`luk.${f}`, v, f === 'p')} />
            </div>
            <div className="w-full sm:w-1/4">
               <StatInput label="全屬性 (%)" value={deltas.allP * 100} onChange={v => updateDelta('allP', v, true)} />
            </div>
          </div>
          
          <div className="p-3 bg-indigo-950/20 border border-indigo-500/20 rounded-lg flex gap-3 text-xs text-indigo-300">
            <Info className="w-4 h-4 shrink-0 text-indigo-400" />
            <p className="leading-relaxed">輸入預計增加的屬性值。右側顯示當前配置對總傷害的預估提升率。</p>
          </div>
        </div>

        {/* Right: Results & Equivalents */}
        <div className="space-y-6">
          <div className="bg-[#0d1117] border border-indigo-500/30 rounded-2xl p-8 text-center relative overflow-hidden group shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="text-slate-500 text-[10px] font-bold mb-3 flex items-center justify-center gap-2 uppercase tracking-widest">
              <TrendingUp className="w-4 h-4 text-indigo-400" /> 預估總傷增幅
            </div>
            <div className="text-6xl font-mono font-bold text-indigo-400 mb-2 drop-shadow-[0_0_15px_rgba(129,140,248,0.4)] transition-all group-hover:scale-105">
              {((improvement.total - 1) * 100).toFixed(2)}%
            </div>
            <div className="text-[10px] text-slate-600 font-medium">
              基於目前 {data.basic.character_class} 屬性計算
            </div>
          </div>

          <div className="bg-[#0d1117] border border-slate-800 rounded-xl p-4 space-y-4">
             <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2 border-b border-slate-800 pb-2">
               <Info className="w-3.5 h-3.5 text-indigo-400" /> 1% 總傷等價值參考
             </h4>
             <div className="space-y-2">
               <EquivalentItem label="攻擊力/魔力" value={`+${Math.ceil(equivalents.attack || 0)}`} />
               <EquivalentItem label="攻擊力/魔力 %" value={`+${(equivalents.attackP ? equivalents.attackP * 100 : 0).toFixed(2)}%`} />
               <EquivalentItem label="BOSS 傷害" value={`+${(equivalents.bossP ? equivalents.bossP * 100 : 0).toFixed(2)}%`} />
               <EquivalentItem label="爆擊傷害" value={`+${(equivalents.strikeP ? equivalents.strikeP * 100 : 0).toFixed(2)}%`} />
               <EquivalentItem label="無視防禦" value={`+${(equivalents.ignoreP ? equivalents.ignoreP * 100 : 0).toFixed(2)}%`} />
             </div>
          </div>

          <div className="space-y-3">
             <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
               <Zap className="w-3.5 h-3.5 text-yellow-500" /> 分項增幅細節
             </h4>
             <div className="grid grid-cols-2 gap-2">
                <ResultItem label="基礎攻/魔" value={improvement.breakdown.attBonus} />
                <ResultItem label="攻/魔 %" value={improvement.breakdown.attPBonus} />
                <ResultItem label="BOSS/總傷" value={improvement.breakdown.dmgBonus} />
                <ResultItem label="爆擊傷害" value={improvement.breakdown.strikeBonus} />
                <ResultItem label="無視防禦" value={improvement.breakdown.ignoreBonus} />
                <ResultItem label="屬性增幅" value={improvement.breakdown.attrBonus} />
                <ResultItem label="最終傷害" value={improvement.breakdown.finalDmgBonus} />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatInput = ({ label, value, onChange }: { label: string; value: number; onChange: (v: string) => void }) => (
  <div className="space-y-1.5">
    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</label>
    <input 
      type="number"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder="0"
      className="w-full bg-[#0d1117] border border-slate-700 rounded-lg py-2 px-3 text-white text-sm focus:border-indigo-500 outline-none transition-colors"
    />
  </div>
);

const AttributeInputs = ({ label, deltas, onChange }: { label: string; deltas: any; onChange: (f: string, v: string) => void }) => (
  <div className="bg-[#0d1117] p-3 rounded-lg border border-slate-800 space-y-3 shadow-inner">
    <div className="text-[10px] font-bold text-slate-400 border-b border-slate-800 pb-1 mb-2 tracking-widest">{label}</div>
    <div className="space-y-2">
      <div className="flex flex-col gap-1">
        <span className="text-[8px] text-slate-600 uppercase font-bold">基本 (+n)</span>
        <input 
          type="number" 
          value={deltas.clear || ''} 
          onChange={(e) => onChange('clear', e.target.value)}
          className="bg-transparent border-b border-slate-800 text-xs text-white focus:border-emerald-500 outline-none p-1"
        />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[8px] text-slate-600 uppercase font-bold">百分比 (%)</span>
        <input 
          type="number" 
          value={deltas.p ? (deltas.p * 100).toFixed(0) : ''} 
          onChange={(e) => onChange('p', e.target.value)}
          className="bg-transparent border-b border-slate-800 text-xs text-white focus:border-emerald-500 outline-none p-1"
        />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[8px] text-slate-600 uppercase font-bold">固定 (+n)</span>
        <input 
          type="number" 
          value={deltas.unique || ''} 
          onChange={(e) => onChange('unique', e.target.value)}
          className="bg-transparent border-b border-slate-800 text-xs text-white focus:border-emerald-500 outline-none p-1"
        />
      </div>
    </div>
  </div>
);

const EquivalentItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center text-xs py-1 border-b border-slate-800/30 last:border-0">
    <span className="text-slate-400">{label}</span>
    <span className="font-mono text-white font-bold">{value}</span>
  </div>
);

const ResultItem = ({ label, value }: { label: string; value: number }) => (
  <div className="bg-[#0d1117] p-3 rounded-lg border border-slate-800 flex flex-col gap-1 transition-all hover:border-slate-700">
    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{label}</span>
    <span className="text-sm font-mono text-slate-200">
      {value > 1 ? '+' : ''}{((value - 1) * 100).toFixed(2)}%
    </span>
  </div>
);


export default PowerEffectiveness;
