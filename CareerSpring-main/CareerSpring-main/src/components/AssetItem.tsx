import { useState } from 'react';
import { Check, X, Trash2, Compass, Sparkles } from 'lucide-react';
import type { AssetRecord } from '../types';

export function AssetItem({ asset, onUpdate, onDelete }: { asset: AssetRecord; onUpdate: (a: AssetRecord) => void; onDelete: (id: string) => void }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className={`glass-card p-8 bg-white dark:bg-[#0f1c2e] dark:border-[#1e3448] space-y-6 transition-all group ${!asset.isVisible ? 'opacity-50 grayscale' : ''}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={asset.title}
              onChange={e => onUpdate({ ...asset, title: e.target.value })}
              className="text-xl font-bold text-brand-ink dark:text-[#e0eaf4] bg-transparent border-b border-transparent focus:border-brand-primary outline-none transition-all placeholder:text-brand-muted min-w-[200px]"
              placeholder="请输入标题 (如：某公司产品实习)"
            />
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary bg-brand-hover px-2 py-1 rounded">
              {asset.category}
            </span>
          </div>

          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-brand-muted dark:text-[#5a7a96] uppercase text-[10px] font-bold">机构</span>
              <input
                type="text"
                value={asset.organization}
                onChange={e => onUpdate({ ...asset, organization: e.target.value })}
                className="bg-transparent border-b border-transparent focus:border-brand-primary outline-none transition-all placeholder:text-brand-muted text-brand-ink dark:text-[#e0eaf4]"
                placeholder="机构名称"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-brand-muted dark:text-[#5a7a96] uppercase text-[10px] font-bold">时间</span>
              <input
                type="text"
                value={asset.timeRange}
                onChange={e => onUpdate({ ...asset, timeRange: e.target.value })}
                className="bg-transparent border-b border-transparent focus:border-brand-primary outline-none transition-all placeholder:text-brand-muted text-brand-ink dark:text-[#e0eaf4]"
                placeholder="2024.01 - 至今"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onUpdate({ ...asset, isVisible: !asset.isVisible })}
            className={`p-2 rounded-xl transition-all ${asset.isVisible ? 'bg-brand-hover text-brand-primary' : 'bg-brand-divider text-brand-muted'}`}
          >
            {asset.isVisible ? <Check size={18} /> : <X size={18} />}
          </button>
          <button
            onClick={() => onDelete(asset.id)}
            className="p-2 bg-[#DC26260D] text-[#DC2626] rounded-xl hover:bg-[#DC2626] hover:text-white transition-all shadow-inner"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-[10px] font-bold text-brand-muted dark:text-[#5a7a96] uppercase tracking-widest italic">描述/工作细节</label>
            <div className="group/tips relative cursor-help">
              <span className="text-[9px] font-bold text-brand-primary bg-brand-hover px-1.5 py-0.5 rounded flex items-center gap-1">
                STAR 法则 Tips <Compass size={10} />
              </span>
              <div className="absolute left-0 bottom-full mb-2 w-72 p-4 bg-white dark:bg-[#0f1c2e] border border-brand-divider dark:border-[#1e3448] rounded-2xl shadow-xl opacity-0 invisible group-hover/tips:opacity-100 group-hover/tips:visible transition-all z-50">
                <h5 className="text-[10px] font-bold text-brand-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Sparkles size={12} /> STAR 法则：让经历更具说服力
                </h5>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-brand-ink dark:text-[#e0eaf4] uppercase">Situation (情景)</span>
                    <p className="text-[10px] text-brand-secondary dark:text-[#8aa4bc] leading-relaxed">简短描述背景：当时面临什么问题？项目初期的状况如何？</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-brand-ink dark:text-[#e0eaf4] uppercase">Task (任务)</span>
                    <p className="text-[10px] text-brand-secondary dark:text-[#8aa4bc] leading-relaxed">你的职责是什么？具体要达到什么 KPI 或目标？</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-brand-ink dark:text-[#e0eaf4] uppercase">Action (行动)</span>
                    <p className="text-[10px] text-brand-secondary dark:text-[#8aa4bc] leading-relaxed font-bold border-l-2 border-brand-primary pl-2">重中之重：你具体做了什么？用了什么方法论、沟通技巧或专业工具？</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-brand-ink dark:text-[#e0eaf4] uppercase">Result (结果)</span>
                    <p className="text-[10px] text-brand-secondary dark:text-[#8aa4bc] leading-relaxed">数字化成果：性能提升了多少？节约了多少成本？领导的打分如何？</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <textarea
            value={asset.description}
            onChange={e => onUpdate({ ...asset, description: e.target.value })}
            className="w-full h-24 bg-brand-surface dark:bg-[#0a1628] border-2 border-transparent focus:border-brand-primary rounded-3xl p-4 text-sm serif italic outline-none transition-all text-brand-ink dark:text-[#e0eaf4]"
            placeholder="S: 背景 | T: 目标 | A: 行动 | R: 结果..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-brand-muted dark:text-[#5a7a96] uppercase tracking-widest italic">标签/关键词 (用逗号分隔)</label>
          <div className="flex flex-wrap gap-2 items-center">
            {asset.tags.map(t => (
              <span key={t} className="px-3 py-1 bg-brand-ink text-white text-[10px] font-bold rounded-full flex items-center gap-1 group/tag">
                {t}
                <button onClick={() => onUpdate({ ...asset, tags: asset.tags.filter(tag => tag !== t) })} className="hover:text-brand-primary"><X size={10} /></button>
              </span>
            ))}
            <input
              type="text"
              placeholder="+ 添加标签"
              className="bg-transparent border-none outline-none text-[10px] font-bold text-brand-primary placeholder:text-brand-muted p-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const tag = (e.currentTarget.value).trim().replace(',', '');
                  if (tag && !asset.tags.includes(tag)) {
                    onUpdate({ ...asset, tags: [...asset.tags, tag] });
                  }
                  e.currentTarget.value = '';
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
