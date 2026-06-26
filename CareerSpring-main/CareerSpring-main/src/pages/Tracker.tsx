import { useState } from 'react';
import {
  PlusCircle, BarChart2, Filter, Briefcase, MapPin, Star,
  Edit2, Trash2, Sparkles, Loader2, ArrowLeft, Check, X,
  MessageSquare, Flag, Trees, User,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { parseJobPosting } from '../lib/gemini';
import type { JobApplication, Interview } from '../types';
import { ForestPath } from '../components/ForestPath';
import { EditorField } from '../components/EditorField';
import { ReviewField } from '../components/ReviewField';
import { StatCard } from '../components/StatCard';

const STATUS_OPTIONS = [
  { value: '待投递', cls: 'bg-brand-surface text-brand-muted dark:bg-[#1a2d40] dark:text-[#5a7a96]' },
  { value: '已投递', cls: 'bg-brand-hover text-brand-primary' },
  { value: '筛选中', cls: 'bg-[#FEF3C7] text-[#D97706] dark:bg-[#78350F33] dark:text-[#FBBF24]' },
  { value: '面试中', cls: 'bg-[#EDE9FE] text-[#7C3AED] dark:bg-[#5B21B633] dark:text-[#A78BFA]' },
  { value: '已拿offer', cls: 'bg-[#D1FAE5] text-[#059669] dark:bg-[#06513533] dark:text-[#34D399]' },
  { value: '已拒绝', cls: 'bg-[#DC26260D] text-[#DC2626]' },
  { value: '已放弃', cls: 'bg-brand-divider text-brand-muted dark:bg-[#1e3448] dark:text-[#5a7a96]' },
];

const statusCls = (v: string) => STATUS_OPTIONS.find(s => s.value === v)?.cls ?? STATUS_OPTIONS[0].cls;

const EMPTY_INTERVIEW: Interview = { round: '', format: '', interviewer: '', date: '', nextStep: '', result: '' };

function emptyJob(): JobApplication {
  return {
    id: crypto.randomUUID(),
    companyName: '',
    positionName: '',
    keywords: '',
    location: '',
    salaryRange: '',
    postDate: '',
    channel: '',
    jdLink: '',
    applyDate: format(new Date(), 'yyyy-MM-dd'),
    cvVersion: '',
    currentStatus: '待投递',
    statusUpdateDate: format(new Date(), 'yyyy-MM-dd'),
    interviews: [],
    notes: { techQuestions: '', projectFocus: '', improvementPoints: '', interviewerStyle: '', techStack: '' },
    decision: { intentRating: 0, matchRating: 0, companyEvaluation: '', concerns: '', offerDecision: '' },
    followUp: { hrContact: '', offerDetails: '', deadline: '', entryDate: '', isFinal: false },
  };
}

interface Props {
  jobs: JobApplication[];
  setJobs: React.Dispatch<React.SetStateAction<JobApplication[]>>;
}

export default function Tracker({ jobs, setJobs }: Props) {
  const [showStats, setShowStats] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null);
  const [jdText, setJdText] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  const interviewing = jobs.filter(j => j.currentStatus === '面试中').length;
  const offers = jobs.filter(j => j.currentStatus === '已拿offer').length;
  const conversionRate = jobs.length > 0 ? ((interviewing + offers) / jobs.length * 100).toFixed(1) : '0';

  const filtered = jobs.filter(j => {
    if (!filterText) return true;
    const q = filterText.toLowerCase();
    return (
      j.companyName.toLowerCase().includes(q) ||
      j.positionName.toLowerCase().includes(q) ||
      j.keywords.toLowerCase().includes(q)
    );
  });

  const addJob = () => setEditingJob(emptyJob());

  const saveJob = () => {
    if (!editingJob) return;
    setJobs(prev => {
      const idx = prev.findIndex(j => j.id === editingJob.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = editingJob;
        return next;
      }
      return [editingJob, ...prev];
    });
    setEditingJob(null);
  };

  const deleteJob = (id: string) => setJobs(prev => prev.filter(j => j.id !== id));

  const handleParseJD = async () => {
    if (!jdText.trim() || !editingJob) return;
    setIsParsing(true);
    try {
      const parsed = await parseJobPosting(jdText);
      if (parsed) {
        setEditingJob(prev => prev && ({
          ...prev,
          companyName: parsed.companyName && parsed.companyName !== '未知' ? parsed.companyName : prev.companyName,
          positionName: parsed.positionName && parsed.positionName !== '未知' ? parsed.positionName : prev.positionName,
          keywords: parsed.keywords && parsed.keywords !== '未知' ? parsed.keywords : prev.keywords,
          location: parsed.location && parsed.location !== '未知' ? parsed.location : prev.location,
          salaryRange: parsed.salaryRange && parsed.salaryRange !== '未知' ? parsed.salaryRange : prev.salaryRange,
          notes: { ...prev.notes, techStack: parsed.teamTechStack && parsed.teamTechStack !== '未知' ? parsed.teamTechStack : prev.notes.techStack },
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsParsing(false);
    }
  };

  const updateEditing = (patch: Partial<JobApplication>) => {
    setEditingJob(prev => prev && ({ ...prev, ...patch }));
  };

  const setInterview = (idx: number, patch: Partial<Interview>) => {
    if (!editingJob) return;
    const next = [...editingJob.interviews];
    next[idx] = { ...next[idx], ...patch };
    updateEditing({ interviews: next });
  };

  const addInterview = () => {
    if (!editingJob) return;
    updateEditing({ interviews: [...editingJob.interviews, { ...EMPTY_INTERVIEW }] });
  };

  const removeInterview = (idx: number) => {
    if (!editingJob) return;
    updateEditing({ interviews: editingJob.interviews.filter((_, i) => i !== idx) });
  };

  const renderStars = (rating: number, onChange?: (v: number) => void) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange?.(n === rating ? 0 : n)}
          className={`transition-colors ${onChange ? 'cursor-pointer' : 'cursor-default'}`}
        >
          <Star
            size={16}
            className={n <= rating ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-brand-divider dark:text-[#1e3448]'}
          />
        </button>
      ))}
    </div>
  );

  /* ─── Full-screen Editor Modal ─── */
  if (editingJob) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-8 pb-12"
      >
        {/* Editor Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setEditingJob(null)}
            className="flex items-center gap-2 text-sm text-brand-secondary dark:text-[#8aa4bc] hover:text-brand-primary transition-colors"
          >
            <ArrowLeft size={18} /> 返回列表
          </button>
          <button
            onClick={saveJob}
            className="flex items-center gap-2 px-6 py-2.5 bg-brand-primary text-white rounded-xl text-sm font-bold hover:-translate-y-0.5 transition-all"
          >
            <Check size={16} /> 保存档案
          </button>
        </div>

        <h2 className="text-2xl font-serif font-medium italic text-brand-ink dark:text-[#e0eaf4]">
          {editingJob.companyName || '新求职档案'} {editingJob.positionName && `· ${editingJob.positionName}`}
        </h2>

        {/* ── Section: AI 自动同步 JD ── */}
        <section className="glass-card p-6 bg-white dark:bg-[#0f1c2e] dark:border-[#1e3448] space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-bold text-brand-primary uppercase tracking-widest">
            <Sparkles size={14} /> AI 自动同步 JD
          </div>
          <textarea
            value={jdText}
            onChange={e => setJdText(e.target.value)}
            rows={5}
            className="w-full bg-brand-surface dark:bg-[#0a1628] border-2 border-transparent focus:border-brand-primary rounded-2xl p-4 text-sm outline-none transition-all placeholder:text-brand-muted text-brand-ink dark:text-[#e0eaf4]"
            placeholder="粘贴 JD 原文或链接，AI 将自动提取关键信息并填充下方字段..."
          />
          <button
            onClick={handleParseJD}
            disabled={isParsing || !jdText.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-ink text-white rounded-xl text-sm font-bold hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isParsing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {isParsing ? '解析中...' : '智能解析'}
          </button>
        </section>

        {/* ── Section: 基础档案 ── */}
        <section className="glass-card p-6 bg-white dark:bg-[#0f1c2e] dark:border-[#1e3448] space-y-4">
          <h3 className="text-[10px] font-bold text-brand-muted dark:text-[#5a7a96] uppercase tracking-widest flex items-center gap-2">
            <Briefcase size={14} /> 基础档案
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EditorField label="公司名称" value={editingJob.companyName} onChange={v => updateEditing({ companyName: v })} />
            <EditorField label="岗位名称" value={editingJob.positionName} onChange={v => updateEditing({ positionName: v })} />
            <EditorField label="核心关键词" value={editingJob.keywords} onChange={v => updateEditing({ keywords: v })} />
            <EditorField label="工作地点" value={editingJob.location} onChange={v => updateEditing({ location: v })} />
            <EditorField label="薪资范围" value={editingJob.salaryRange} onChange={v => updateEditing({ salaryRange: v })} />
            <EditorField label="发布日期" value={editingJob.postDate} onChange={v => updateEditing({ postDate: v })} type="date" />
            <EditorField label="投递渠道" value={editingJob.channel} onChange={v => updateEditing({ channel: v })} />
            <EditorField label="JD 链接" value={editingJob.jdLink} onChange={v => updateEditing({ jdLink: v })} />
          </div>
        </section>

        {/* ── Section: 进度跟踪 ── */}
        <section className="glass-card p-6 bg-white dark:bg-[#0f1c2e] dark:border-[#1e3448] space-y-4">
          <h3 className="text-[10px] font-bold text-brand-muted dark:text-[#5a7a96] uppercase tracking-widest flex items-center gap-2">
            <Flag size={14} /> 进度跟踪
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EditorField label="投递日期" value={editingJob.applyDate} onChange={v => updateEditing({ applyDate: v })} type="date" />
            <EditorField label="简历版本" value={editingJob.cvVersion} onChange={v => updateEditing({ cvVersion: v })} />
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-brand-muted dark:text-[#5a7a96] uppercase tracking-widest italic">当前状态</label>
              <select
                value={editingJob.currentStatus}
                onChange={e => updateEditing({ currentStatus: e.target.value, statusUpdateDate: format(new Date(), 'yyyy-MM-dd') })}
                className="w-full bg-white dark:bg-[#0f1c2e] border border-brand-divider dark:border-[#1e3448] rounded-xl p-3 text-sm focus:border-brand-primary outline-none transition-all text-brand-ink dark:text-[#e0eaf4]"
              >
                {STATUS_OPTIONS.map(s => (
                  <option key={s.value} value={s.value}>{s.value}</option>
                ))}
              </select>
            </div>
            <EditorField label="状态更新日期" value={editingJob.statusUpdateDate} onChange={v => updateEditing({ statusUpdateDate: v })} type="date" />
          </div>
        </section>

        {/* ── Section: 面试流程 ── */}
        <section className="glass-card p-6 bg-white dark:bg-[#0f1c2e] dark:border-[#1e3448] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold text-brand-muted dark:text-[#5a7a96] uppercase tracking-widest flex items-center gap-2">
              <MessageSquare size={14} /> 面试流程
            </h3>
            <button
              onClick={addInterview}
              className="flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:bg-brand-hover px-3 py-1.5 rounded-lg transition-all"
            >
              <PlusCircle size={14} /> 添加面试轮次
            </button>
          </div>

          {editingJob.interviews.length === 0 && (
            <p className="text-xs text-brand-muted dark:text-[#5a7a96] italic py-4">暂无面试记录，点击上方添加</p>
          )}

          <AnimatePresence>
            {editingJob.interviews.map((iv, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border border-brand-divider dark:border-[#1e3448] rounded-2xl p-5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-ink dark:text-[#e0eaf4]">第 {idx + 1} 轮</span>
                  <button onClick={() => removeInterview(idx)} className="p-1.5 text-[#DC2626] hover:bg-[#DC26260D] rounded-lg transition-all">
                    <X size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <EditorField label="面试轮次" value={iv.round} onChange={v => setInterview(idx, { round: v })} />
                  <EditorField label="面试形式" value={iv.format} onChange={v => setInterview(idx, { format: v })} />
                  <EditorField label="面试官" value={iv.interviewer} onChange={v => setInterview(idx, { interviewer: v })} />
                  <EditorField label="面试日期" value={iv.date} onChange={v => setInterview(idx, { date: v })} type="date" />
                  <EditorField label="下一步" value={iv.nextStep} onChange={v => setInterview(idx, { nextStep: v })} />
                  <EditorField label="结果" value={iv.result} onChange={v => setInterview(idx, { result: v })} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </section>

        {/* ── Section: 决策评估 ── */}
        <section className="glass-card p-6 bg-white dark:bg-[#0f1c2e] dark:border-[#1e3448] space-y-4">
          <h3 className="text-[10px] font-bold text-brand-muted dark:text-[#5a7a96] uppercase tracking-widest flex items-center gap-2">
            <Star size={14} /> 决策评估
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-brand-muted dark:text-[#5a7a96] uppercase tracking-widest italic">意向度</label>
              {renderStars(editingJob.decision.intentRating, v => updateEditing({ decision: { ...editingJob.decision, intentRating: v } }))}
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-brand-muted dark:text-[#5a7a96] uppercase tracking-widest italic">匹配度</label>
              {renderStars(editingJob.decision.matchRating, v => updateEditing({ decision: { ...editingJob.decision, matchRating: v } }))}
            </div>
          </div>
          <ReviewField label="公司整体评价" value={editingJob.decision.companyEvaluation} onChange={v => updateEditing({ decision: { ...editingJob.decision, companyEvaluation: v } })} />
          <ReviewField label="顾虑与风险" value={editingJob.decision.concerns} onChange={v => updateEditing({ decision: { ...editingJob.decision, concerns: v } })} isWarning />
          <ReviewField label="Offer 决策" value={editingJob.decision.offerDecision} onChange={v => updateEditing({ decision: { ...editingJob.decision, offerDecision: v } })} />
        </section>

        {/* ── Section: 面经与复盘 ── */}
        <section className="glass-card p-6 bg-white dark:bg-[#0f1c2e] dark:border-[#1e3448] space-y-4">
          <h3 className="text-[10px] font-bold text-brand-muted dark:text-[#5a7a96] uppercase tracking-widest flex items-center gap-2">
            <User size={14} /> 面经与复盘
          </h3>
          <ReviewField label="技术问题" value={editingJob.notes.techQuestions} onChange={v => updateEditing({ notes: { ...editingJob.notes, techQuestions: v } })} />
          <ReviewField label="项目追问方向" value={editingJob.notes.projectFocus} onChange={v => updateEditing({ notes: { ...editingJob.notes, projectFocus: v } })} />
          <ReviewField label="待改进的点" value={editingJob.notes.improvementPoints} onChange={v => updateEditing({ notes: { ...editingJob.notes, improvementPoints: v } })} isWarning />
          <ReviewField label="面试官风格" value={editingJob.notes.interviewerStyle} onChange={v => updateEditing({ notes: { ...editingJob.notes, interviewerStyle: v } })} />
          <ReviewField label="团队技术栈" value={editingJob.notes.techStack} onChange={v => updateEditing({ notes: { ...editingJob.notes, techStack: v } })} />
        </section>

        {/* ── Section: 后续跟进 ── */}
        <section className="glass-card p-6 bg-white dark:bg-[#0f1c2e] dark:border-[#1e3448] space-y-4">
          <h3 className="text-[10px] font-bold text-brand-muted dark:text-[#5a7a96] uppercase tracking-widest flex items-center gap-2">
            <Trees size={14} /> 后续跟进
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EditorField label="HR 联系方式" value={editingJob.followUp.hrContact} onChange={v => updateEditing({ followUp: { ...editingJob.followUp, hrContact: v } })} />
            <EditorField label="Offer 详情" value={editingJob.followUp.offerDetails} onChange={v => updateEditing({ followUp: { ...editingJob.followUp, offerDetails: v } })} />
            <EditorField label="答复截止日期" value={editingJob.followUp.deadline} onChange={v => updateEditing({ followUp: { ...editingJob.followUp, deadline: v } })} type="date" />
            <EditorField label="入职日期" value={editingJob.followUp.entryDate} onChange={v => updateEditing({ followUp: { ...editingJob.followUp, entryDate: v } })} type="date" />
          </div>
          <label className="flex items-center gap-3 cursor-pointer pt-2">
            <div
              onClick={() => updateEditing({ followUp: { ...editingJob.followUp, isFinal: !editingJob.followUp.isFinal } })}
              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                editingJob.followUp.isFinal
                  ? 'bg-brand-primary border-brand-primary text-white'
                  : 'border-brand-divider dark:border-[#1e3448]'
              }`}
            >
              {editingJob.followUp.isFinal && <Check size={14} />}
            </div>
            <span className="text-sm text-brand-ink dark:text-[#e0eaf4]">已最终确认 (流程结束)</span>
          </label>
        </section>
      </motion.div>
    );
  }

  /* ─── Main List View ─── */
  return (
    <div className="space-y-8 pb-12">
      <header className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-3xl font-serif font-medium italic text-brand-ink dark:text-[#e0eaf4]">
            探索记录：求职管理面板
          </h2>
          <p className="text-sm text-brand-secondary dark:text-[#8aa4bc] max-w-xl leading-relaxed">
            每一次投递都是一次勇敢的对话。用系统化的记录，把焦虑转化为清晰的路径。
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowStats(s => !s)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              showStats
                ? 'bg-brand-hover text-brand-primary'
                : 'text-brand-muted dark:text-[#5a7a96] hover:bg-brand-hover'
            }`}
          >
            <BarChart2 size={16} /> 数据概览
          </button>
          <button
            onClick={addJob}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white rounded-xl text-sm font-bold hover:-translate-y-0.5 transition-all"
          >
            <PlusCircle size={16} /> 新增求职档案
          </button>
        </div>
      </header>

      {/* Forest Path */}
      <ForestPath totalJobs={jobs.length} interviewing={interviewing} offers={offers} />

      {/* Stats */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="累计投递" value={`${jobs.length}`} icon={<Briefcase size={14} />} />
              <StatCard label="面试转化率" value={`${conversionRate}%`} icon={<BarChart2 size={14} />} />
              <StatCard label="面试中" value={`${interviewing}`} icon={<MessageSquare size={14} />} />
              <StatCard label="已拿 Offer" value={`${offers}`} icon={<Sparkles size={14} />} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter */}
      <div className="relative">
        <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted dark:text-[#5a7a96]" />
        <input
          type="text"
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
          className="w-full bg-white dark:bg-[#0f1c2e] border border-brand-divider dark:border-[#1e3448] rounded-xl pl-11 pr-4 py-3 text-sm focus:border-brand-primary outline-none transition-all placeholder:text-brand-muted text-brand-ink dark:text-[#e0eaf4]"
          placeholder="搜索公司、岗位或关键词..."
        />
      </div>

      {/* Job Cards */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 text-brand-muted dark:text-[#5a7a96] space-y-4"
            >
              <Trees size={48} className="mx-auto opacity-30" />
              <p className="text-sm">{jobs.length === 0 ? '还没有求职记录，开始你的第一次探索吧' : '没有匹配的结果'}</p>
            </motion.div>
          ) : (
            filtered.map(job => (
              <motion.div
                key={job.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card p-6 bg-white dark:bg-[#0f1c2e] dark:border-[#1e3448] group hover:border-brand-primary transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-lg font-bold text-brand-ink dark:text-[#e0eaf4]">{job.companyName || '未命名公司'}</h3>
                      <span className="text-sm text-brand-secondary dark:text-[#8aa4bc]">{job.positionName}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${statusCls(job.currentStatus)}`}>
                        {job.currentStatus}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-brand-secondary dark:text-[#8aa4bc]">
                      {job.location && (
                        <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                      )}
                      {job.salaryRange && (
                        <span className="flex items-center gap-1"><Briefcase size={12} /> {job.salaryRange}</span>
                      )}
                      {job.applyDate && (
                        <span className="flex items-center gap-1"><Flag size={12} /> {job.applyDate}</span>
                      )}
                      {job.channel && (
                        <span className="flex items-center gap-1"><MessageSquare size={12} /> {job.channel}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {renderStars(job.decision.intentRating)}
                    </div>
                  </div>

                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={() => setEditingJob({ ...job })}
                      className="p-2 bg-brand-hover text-brand-primary rounded-xl hover:bg-brand-primary hover:text-white transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => deleteJob(job.id)}
                      className="p-2 bg-[#DC26260D] text-[#DC2626] rounded-xl hover:bg-[#DC2626] hover:text-white transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
