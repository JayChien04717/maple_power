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

  const [deltas, setDeltas] = useState<Partial<PowerStats & { allP: number }>>({
    attack: 0,
    bossP: 0,
    strikeP: 0,
    ignoreP: 0,
  });

  const improvement = useMemo(() => {
    return getImprovement(baseStats, jobInfo, deltas);
  }, [baseStats, jobInfo, deltas]);

  // Calculate equivalents for a 1% damage increase
  const equivalents = useMemo(() => {
    return getEquivalent(baseStats, jobInfo, 1.01);
  }, [baseStats, jobInfo]);

  const handleInputChange = (field: string, value: string) => {
    const num = parseFloat(value) || 0;
    setDeltas(prev => ({ ...prev, [field]: num }));
  };

  const handlePercentageChange = (field: string, value: string) => {
    const num = (parseFloat(value) || 0) / 100;
    setDeltas(prev => ({ ...prev, [field]: num }));
  };

  const resetDeltas = () => {
    setDeltas({
      attack: 0,
      bossP: 0,
      strikeP: 0,
      ignoreP: 0,
      dmgP: 0,
      attackP: 0,
      allP: 0,
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Inputs */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">增加攻擊力</label>
              <input 
                type="number"
                value={deltas.attack || ''}
                onChange={(e) => handleInputChange('attack', e.target.value)}
                placeholder="0"
                className="w-full bg-[#0d1117] border border-slate-700 rounded-lg py-2 px-3 text-white text-sm focus:border-indigo-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">增加 BOSS 傷害 (%)</label>
              <input 
                type="number"
                value={deltas.bossP ? (deltas.bossP * 100).toFixed(0) : ''}
                onChange={(e) => handlePercentageChange('bossP', e.target.value)}
                placeholder="0"
                className="w-full bg-[#0d1117] border border-slate-700 rounded-lg py-2 px-3 text-white text-sm focus:border-indigo-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">增加爆擊傷害 (%)</label>
              <input 
                type="number"
                value={deltas.strikeP ? (deltas.strikeP * 100).toFixed(0) : ''}
                onChange={(e) => handlePercentageChange('strikeP', e.target.value)}
                placeholder="0"
                className="w-full bg-[#0d1117] border border-slate-700 rounded-lg py-2 px-3 text-white text-sm focus:border-indigo-500 outline-none transition-colors"
              />
            </div>
             <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">增加無視防禦 (%)</label>
              <input 
                type="number"
                value={deltas.ignoreP ? (deltas.ignoreP * 100).toFixed(0) : ''}
                onChange={(e) => handlePercentageChange('ignoreP', e.target.value)}
                placeholder="0"
                className="w-full bg-[#0d1117] border border-slate-700 rounded-lg py-2 px-3 text-white text-sm focus:border-indigo-500 outline-none transition-colors"
              />
            </div>
          </div>
          
          <div className="p-3 bg-indigo-950/20 border border-indigo-500/20 rounded-lg flex gap-3 text-xs text-indigo-300">
            <Info className="w-4 h-4 shrink-0 text-indigo-400" />
            <p className="leading-relaxed">輸入預計增加的屬性值，查看對總傷的提升。下方顯示提升 1% 總傷所需的各項屬性參考值。</p>
          </div>

          <div className="space-y-3">
             <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
               <Layers className="w-3.5 h-3.5 text-indigo-400" /> 1% 總傷等價值參考
             </h4>
             <div className="grid grid-cols-2 gap-3">
               <EquivalentItem label="攻擊力" value={`+${Math.ceil(equivalents.attack || 0)}`} />
               <EquivalentItem label="BOSS 傷害" value={`+${(equivalents.bossP ? equivalents.bossP * 100 : 0).toFixed(1)}%`} />
               <EquivalentItem label="爆擊傷害" value={`+${(equivalents.strikeP ? equivalents.strikeP * 100 : 0).toFixed(1)}%`} />
               <EquivalentItem label="無視防禦" value={`+${(equivalents.ignoreP ? equivalents.ignoreP * 100 : 0).toFixed(1)}%`} />
             </div>
          </div>
        </div>

        {/* Right: Results */}
        <div className="flex flex-col justify-center gap-6">
          <div className="bg-[#0d1117] border border-indigo-500/30 rounded-2xl p-8 text-center relative overflow-hidden group shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="text-slate-500 text-xs font-bold mb-3 flex items-center justify-center gap-2 uppercase tracking-widest">
              <TrendingUp className="w-4 h-4 text-indigo-400" /> 預估總傷增幅
            </div>
            <div className="text-6xl font-mono font-bold text-indigo-400 mb-2 drop-shadow-[0_0_15px_rgba(129,140,248,0.3)]">
              {((improvement.total - 1) * 100).toFixed(2)}%
            </div>
            <div className="text-xs text-slate-600 font-medium">
              基於目前 {data.basic.character_class} 屬性計算
            </div>
          </div>

          <div className="space-y-3">
             <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
               <Zap className="w-3.5 h-3.5 text-yellow-500" /> 分項增幅細節
             </h4>
             <div className="grid grid-cols-2 gap-2">
                <ResultItem label="攻擊力" value={improvement.breakdown.attBonus} />
                <ResultItem label="BOSS/總傷" value={improvement.breakdown.dmgBonus} />
                <ResultItem label="爆擊傷害" value={improvement.breakdown.strikeBonus} />
                <ResultItem label="無視防禦" value={improvement.breakdown.ignoreBonus} />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResultItem = ({ label, value }: { label: string; value: number }) => (
  <div className="bg-[#0d1117] p-3 rounded-lg border border-slate-800 flex flex-col gap-1 transition-all hover:border-slate-700">
    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{label}</span>
    <span className="text-sm font-mono text-slate-200">
      {value > 1 ? '+' : ''}{((value - 1) * 100).toFixed(2)}%
    </span>
  </div>
);

const EquivalentItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-800/50">
    <span className="text-slate-400">{label}</span>
    <span className="font-mono text-white font-bold">{value}</span>
  </div>
);

export default PowerEffectiveness;
