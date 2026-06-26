import { useState } from 'react';
import {
  Briefcase, Layers, Globe, Cpu, ShieldCheck, Layout,
  Database, Wand2, Sparkles, TrendingUp, PlusCircle, FileText,
  MessageSquareHeart, Check, Loader2, Download,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { parseJobPosting, generateResumeOptimization } from '../lib/gemini';
import { format } from 'date-fns';
import type { AssetRecord, ResumeVersion } from '../types';
import { AssetItem } from '../components/AssetItem';
import { CategoryBtn } from '../components/CategoryBtn';
import { StatCard } from '../components/StatCard';

const CATEGORIES = [
  { key: 'work' as const, label: '工作经历', icon: <Briefcase size={16} /> },
  { key: 'project' as const, label: '项目经验', icon: <Layers size={16} /> },
  { key: 'edu' as const, label: '教育背景', icon: <Globe size={16} /> },
  { key: 'skill' as const, label: '技能特长', icon: <Cpu size={16} /> },
  { key: 'honor' as const, label: '荣誉证书', icon: <ShieldCheck size={16} /> },
  { key: 'portfolio' as const, label: '作品链接', icon: <Layout size={16} /> },
] as const;

interface Props {
  assets: AssetRecord[];
  setAssets: React.Dispatch<React.SetStateAction<AssetRecord[]>>;
  versions: ResumeVersion[];
  setVersions: React.Dispatch<React.SetStateAction<ResumeVersion[]>>;
}

export default function ResumeWorkshop({ assets, setAssets, versions, setVersions }: Props) {
  const [tab, setTab] = useState<'library' | 'editor'>('library');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [jdInput, setJdInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [versionName, setVersionName] = useState('');

  const filteredAssets = activeCategory
    ? assets.filter(a => a.category === activeCategory)
    : assets;

  const addAsset = (category: AssetRecord['category']) => {
    const newAsset: AssetRecord = {
      id: crypto.randomUUID(),
      category,
      title: '',
      organization: '',
      timeRange: '',
      description: '',
      tags: [],
      isVisible: true,
    };
    setAssets(prev => [newAsset, ...prev]);
  };

  const updateAsset = (updated: AssetRecord) => {
    setAssets(prev => prev.map(a => (a.id === updated.id ? updated : a)));
  };

  const deleteAsset = (id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
  };

  const handleAnalyze = async () => {
    if (!jdInput.trim()) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
      const resumeSummary = assets
        .filter(a => a.isVisible)
        .map(a => `[${a.category}] ${a.title}: ${a.description} (标签: ${a.tags.join(', ')})`)
        .join('\n');
      const result = await generateResumeOptimization(jdInput, resumeSummary);
      setAnalysisResult(result);
      setSelectedIds(assets.filter(a => a.isVisible).map(a => a.id));
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveVersion = () => {
    if (!versionName.trim() || selectedIds.length === 0) return;
    const newVersion: ResumeVersion = {
      id: crypto.randomUUID(),
      name: versionName,
      targetJD: jdInput,
      selectedAssetIds: selectedIds,
      lastModified: new Date().toISOString(),
      aiSuggestions: analysisResult,
    };
    setVersions(prev => [newVersion, ...prev]);
    setVersionName('');
  };

  const loadVersion = (v: ResumeVersion) => {
    setJdInput(v.targetJD);
    setSelectedIds(v.selectedAssetIds);
    setAnalysisResult(v.aiSuggestions || null);
    setTab('editor');
  };

  const toggleAssetId = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id],
    );
  };

  const categoryLabel = (key: string) =>
    CATEGORIES.find(c => c.key === key)?.label ?? key;

  return (
    <div className="space-y-8 pb-12">
      <header className="space-y-2">
        <h2 className="text-3xl font-serif font-medium italic text-brand-ink dark:text-[#e0eaf4]">
          简历工坊：从资产到武器
        </h2>
        <p className="text-sm text-brand-secondary dark:text-[#8aa4bc] max-w-2xl leading-relaxed">
          把散落的经历变成可复用的资产，再用 AI 为每一份目标岗位量身锻造你的独家武器。
        </p>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-brand-divider dark:border-[#1e3448]">
        <button
          onClick={() => setTab('library')}
          className={`px-6 py-4 text-sm font-medium transition-all border-b-2 flex items-center gap-2 ${
            tab === 'library'
              ? 'border-brand-primary text-brand-primary'
              : 'border-transparent text-brand-muted dark:text-[#5a7a96] hover:text-brand-secondary'
          }`}
        >
          <Database size={16} /> 个人经历资产库
        </button>
        <button
          onClick={() => setTab('editor')}
          className={`px-6 py-4 text-sm font-medium transition-all border-b-2 flex items-center gap-2 ${
            tab === 'editor'
              ? 'border-brand-primary text-brand-primary'
              : 'border-transparent text-brand-muted dark:text-[#5a7a96] hover:text-brand-secondary'
          }`}
        >
          <Wand2 size={16} /> 智能匹配与版本管理
        </button>
      </div>

      {/* ─── Library Tab ─── */}
      {tab === 'library' && (
        <div className="flex gap-8">
          <div className="w-56 shrink-0 space-y-3">
            <div className="text-[10px] font-bold text-brand-muted dark:text-[#5a7a96] uppercase tracking-widest mb-4">
              经历分类
            </div>
            <button
              onClick={() => setActiveCategory(null)}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                !activeCategory
                  ? 'bg-brand-hover text-brand-primary'
                  : 'text-brand-secondary dark:text-[#8aa4bc] hover:bg-brand-hover'
              }`}
            >
              全部 ({assets.length})
            </button>

            {CATEGORIES.map(cat => (
              <div
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`cursor-pointer rounded-xl px-3 py-2 transition-all ${
                  activeCategory === cat.key ? 'bg-brand-hover' : 'hover:bg-brand-hover'
                }`}
              >
                <CategoryBtn
                  icon={cat.icon}
                  label={cat.label}
                  count={assets.filter(a => a.category === cat.key).length}
                  onClick={() => addAsset(cat.key)}
                />
              </div>
            ))}
          </div>

          <div className="flex-1 space-y-6">
            <AnimatePresence mode="popLayout">
              {filteredAssets.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 text-brand-muted dark:text-[#5a7a96] space-y-4"
                >
                  <Database size={48} className="mx-auto opacity-30" />
                  <p className="text-sm">还没有经历资产，从左侧分类添加你的第一条吧</p>
                </motion.div>
              ) : (
                filteredAssets.map(asset => (
                  <motion.div
                    key={asset.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <AssetItem asset={asset} onUpdate={updateAsset} onDelete={deleteAsset} />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* ─── Editor Tab ─── */}
      {tab === 'editor' && (
        <div className="flex gap-8">
          <div className="w-72 shrink-0 space-y-6">
            {/* Saved Versions */}
            <div className="space-y-3">
              <div className="text-[10px] font-bold text-brand-muted dark:text-[#5a7a96] uppercase tracking-widest">
                已保存版本
              </div>
              {versions.length === 0 ? (
                <p className="text-xs text-brand-muted dark:text-[#5a7a96] italic">暂无版本，分析后可保存</p>
              ) : (
                versions.map(v => (
                  <button
                    key={v.id}
                    onClick={() => loadVersion(v)}
                    className="w-full text-left glass-card p-4 bg-white dark:bg-[#0f1c2e] dark:border-[#1e3448] hover:border-brand-primary transition-all space-y-1"
                  >
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-brand-primary shrink-0" />
                      <span className="text-sm font-medium text-brand-ink dark:text-[#e0eaf4] truncate">
                        {v.name}
                      </span>
                    </div>
                    <div className="text-[10px] text-brand-muted dark:text-[#5a7a96]">
                      {format(new Date(v.lastModified), 'yyyy-MM-dd HH:mm')} · {v.selectedAssetIds.length} 项资产
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* AI Engine */}
            <div className="space-y-3 border-t border-brand-divider dark:border-[#1e3448] pt-6">
              <div className="flex items-center gap-2 text-[10px] font-bold text-brand-primary uppercase tracking-widest">
                <Sparkles size={14} /> AI 定制引擎
              </div>
              <textarea
                value={jdInput}
                onChange={e => setJdInput(e.target.value)}
                rows={8}
                className="w-full bg-white dark:bg-[#0f1c2e] border border-brand-divider dark:border-[#1e3448] rounded-xl p-3 text-sm focus:border-brand-primary outline-none transition-all placeholder:text-brand-muted text-brand-ink dark:text-[#e0eaf4]"
                placeholder="粘贴目标岗位的 JD 内容..."
              />
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !jdInput.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand-primary text-white rounded-xl text-sm font-bold hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
                {isAnalyzing ? '分析中...' : '开始智能匹配'}
              </button>
            </div>
          </div>

          {/* Main Area */}
          <div className="flex-1 space-y-6">
            {isAnalyzing && (
              <div className="text-center py-20 space-y-4">
                <Loader2 size={40} className="mx-auto animate-spin text-brand-primary" />
                <p className="text-sm text-brand-secondary dark:text-[#8aa4bc]">
                  正在用 AI 深度分析岗位需求与你的资产匹配度...
                </p>
              </div>
            )}

            {!isAnalyzing && !analysisResult && (
              <div className="text-center py-20 text-brand-muted dark:text-[#5a7a96] space-y-4">
                <Wand2 size={48} className="mx-auto opacity-30" />
                <p className="text-sm">在左侧粘贴目标岗位 JD，AI 将自动分析匹配度并给出定制建议</p>
              </div>
            )}

            {!isAnalyzing && analysisResult && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Stat Cards */}
                  <div className="grid grid-cols-3 gap-4">
                    <StatCard
                      label="匹配亮点"
                      value={`${analysisResult.matches?.length || 0} 项`}
                      icon={<Check size={14} />}
                    />
                    <StatCard
                      label="待补强项"
                      value={`${analysisResult.missing?.length || 0} 项`}
                      icon={<TrendingUp size={14} />}
                    />
                    <StatCard
                      label="预测追问"
                      value={`${analysisResult.interviewQuestions?.length || 0} 题`}
                      icon={<MessageSquareHeart size={14} />}
                    />
                  </div>

                  {/* AI Suggestions Panel */}
                  <div className="p-8 bg-brand-primary text-white rounded-[32px] space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                      <Sparkles size={100} />
                    </div>

                    <div className="relative z-10 space-y-6">
                      {analysisResult.jobProfile && (
                        <div>
                          <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">岗位画像</h4>
                          <p className="text-sm leading-relaxed">
                            {analysisResult.jobProfile.category} · {analysisResult.jobProfile.coreValues}
                          </p>
                        </div>
                      )}

                      {analysisResult.matches?.length > 0 && (
                        <div>
                          <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-3">你的匹配亮点</h4>
                          <ul className="space-y-1.5">
                            {analysisResult.matches.map((m: string, i: number) => (
                              <li key={i} className="text-sm flex items-start gap-2">
                                <Check size={14} className="shrink-0 mt-0.5" /> {m}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {analysisResult.missing?.length > 0 && (
                        <div>
                          <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-3">需要补强</h4>
                          <div className="space-y-3">
                            {analysisResult.missing.map((m: { reason: string; suggestion: string }, i: number) => (
                              <div key={i} className="bg-[#ffffff1a] rounded-2xl p-4 space-y-1">
                                <p className="text-sm font-medium">{m.reason}</p>
                                <p className="text-xs opacity-80">{m.suggestion}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {analysisResult.beyondResume?.length > 0 && (
                        <div>
                          <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-3">简历之外的武器</h4>
                          <div className="space-y-2">
                            {analysisResult.beyondResume.map((b: { title: string; content: string }, i: number) => (
                              <div key={i} className="bg-[#ffffff1a] rounded-2xl p-4 space-y-1">
                                <p className="text-sm font-bold">{b.title}</p>
                                <p className="text-xs opacity-80">{b.content}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {analysisResult.interviewQuestions?.length > 0 && (
                        <div>
                          <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-3">预测面试追问</h4>
                          <ol className="space-y-2 list-decimal list-inside">
                            {analysisResult.interviewQuestions.map((q: string, i: number) => (
                              <li key={i} className="text-sm">{q}</li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Asset Selection */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-bold text-brand-muted dark:text-[#5a7a96] uppercase tracking-widest">
                        选择要包含的资产
                      </h4>
                      <span className="text-xs text-brand-secondary dark:text-[#8aa4bc]">
                        已选 {selectedIds.length} / {assets.filter(a => a.isVisible).length}
                      </span>
                    </div>

                    {assets.filter(a => a.isVisible).map(asset => (
                      <div
                        key={asset.id}
                        onClick={() => toggleAssetId(asset.id)}
                        className={`glass-card p-5 bg-white dark:bg-[#0f1c2e] dark:border-[#1e3448] cursor-pointer transition-all flex items-center gap-4 ${
                          selectedIds.includes(asset.id)
                            ? 'border-brand-primary ring-1 ring-brand-primary'
                            : 'hover:border-brand-primary'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${
                            selectedIds.includes(asset.id)
                              ? 'bg-brand-primary border-brand-primary text-white'
                              : 'border-brand-divider dark:border-[#1e3448]'
                          }`}
                        >
                          {selectedIds.includes(asset.id) && <Check size={14} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-brand-ink dark:text-[#e0eaf4] truncate">
                              {asset.title || '未命名'}
                            </span>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-brand-primary bg-brand-hover px-1.5 py-0.5 rounded shrink-0">
                              {categoryLabel(asset.category)}
                            </span>
                          </div>
                          <p className="text-xs text-brand-secondary dark:text-[#8aa4bc] truncate mt-1">
                            {asset.description}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Save Version */}
                    <div className="flex gap-3 pt-4 border-t border-brand-divider dark:border-[#1e3448]">
                      <input
                        type="text"
                        value={versionName}
                        onChange={e => setVersionName(e.target.value)}
                        className="flex-1 bg-white dark:bg-[#0f1c2e] border border-brand-divider dark:border-[#1e3448] rounded-xl p-3 text-sm focus:border-brand-primary outline-none transition-all placeholder:text-brand-muted text-brand-ink dark:text-[#e0eaf4]"
                        placeholder="为这个版本命名 (如：字节跳动-产品经理)"
                      />
                      <button
                        onClick={saveVersion}
                        disabled={!versionName.trim() || selectedIds.length === 0}
                        className="flex items-center gap-2 px-6 py-3 bg-brand-ink text-white rounded-xl text-sm font-bold hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Download size={16} /> 保存版本
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
