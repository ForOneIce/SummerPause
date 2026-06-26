import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Search,
  Globe,
  Terminal,
  Layers,
  MapPin,
  Headphones,
  Settings,
  X,
  Cloud,
  CloudUpload,
  CloudDownload,
  Shield,
  FileSpreadsheet,
  FileJson,
  FileCode,
  Coffee
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PRESET_PROVIDERS,
  getStoredConfig,
  saveConfig,
  type ModelConfig
} from './lib/gemini';
import { format } from 'date-fns';

import type { Page, AssetRecord, ResumeVersion, JobApplication } from './types';
import { NavItem } from './components/NavItem';
import Dashboard from './pages/Dashboard';
import KnowSelf from './pages/KnowSelf';
import KnowOthers from './pages/KnowOthers';
import JobChannels from './pages/JobChannels';
import ResumeWorkshop from './pages/ResumeWorkshop';
import Tracker from './pages/Tracker';
import PodcastPage from './pages/PodcastPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSyncOpen, setIsSyncOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [syncMessage, setSyncMessage] = useState('');

  const [modelConfig, setModelConfig] = useState<ModelConfig>(() => getStoredConfig());
  const [selectedProvider, setSelectedProvider] = useState<string>(() => {
    const cfg = getStoredConfig();
    const match = Object.entries(PRESET_PROVIDERS).find(
      ([key, p]) => key !== 'custom' && p.baseUrl === cfg.baseUrl && p.model === cfg.model
    );
    return match ? match[0] : 'custom';
  });

  const [assets, setAssets] = useState<AssetRecord[]>(() => {
    const saved = localStorage.getItem('resilience_assets');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        category: 'work',
        title: '高级新媒体运营',
        organization: '某大厂电商',
        timeRange: '2022.01 - 2024.03',
        description: '负责公众号运营，利用数据分析提升转化。撰写10+篇爆款文章，累计获阅读量100万+。',
        tags: ['内容运营', '数据分析', '互联网'],
        results: 'DAU 提升 15%，转化率翻倍',
        isVisible: true
      }
    ];
  });

  const [versions, setVersions] = useState<ResumeVersion[]>(() => {
    const saved = localStorage.getItem('resilience_resume_versions');
    return saved ? JSON.parse(saved) : [];
  });

  const [jobs, setJobs] = useState<JobApplication[]>(() => {
    const saved = localStorage.getItem('resilience_jobs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('resilience_assets', JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
    localStorage.setItem('resilience_resume_versions', JSON.stringify(versions));
  }, [versions]);

  useEffect(() => {
    localStorage.setItem('resilience_jobs', JSON.stringify(jobs));
  }, [jobs]);

  const handleBackupToGoogle = async () => {
    setSyncStatus('loading');
    setSyncMessage('正在初始化数据同步...');

    try {
      const assetHeader = "ID,分类,标题,机构,时间范围,描述,标签,成果\n";
      const assetContent = assets.map(a =>
        `"${a.id}","${a.category}","${a.title}","${a.organization}","${a.timeRange}","${a.description.replace(/"/g, '""')}","${a.tags.join(',')}","${a.results || ''}"`
      ).join('\n');
      const assetBlob = new Blob([assetHeader + assetContent], { type: 'text/csv' });

      const jobsBlob = new Blob([JSON.stringify(jobs, null, 2)], { type: 'application/json' });
      const versionsBlob = new Blob([JSON.stringify(versions, null, 2)], { type: 'application/json' });

      const timestamp = format(new Date(), 'yyyyMMdd_HHmm');

      const download = (blob: Blob, name: string) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        a.click();
        URL.revokeObjectURL(url);
      };

      download(assetBlob, `夏一站_经验资产库_${timestamp}.csv`);
      download(jobsBlob, `夏一站_投递记录_${timestamp}.json`);
      download(versionsBlob, `夏一站_简历版本_${timestamp}.json`);

      setSyncStatus('success');
      setSyncMessage('备份文件已生成并下载。我们建议您将其保存到 Google Drive 的"夏一站"文件夹中。');
    } catch (err) {
      setSyncStatus('error');
      setSyncMessage('备份失败，请检查浏览器权限。');
    }
  };

  const handleImportAssets = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(l => l.trim());
        const imported: AssetRecord[] = [];

        for (let i = 1; i < lines.length; i++) {
          const parts = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
          if (parts && parts.length >= 6) {
            const clean = (s: string) => s.replace(/^"|"$/g, '').replace(/""/g, '"');
            imported.push({
              id: clean(parts[0]) || Date.now().toString() + i,
              category: clean(parts[1]) as any,
              title: clean(parts[2]),
              organization: clean(parts[3]),
              timeRange: clean(parts[4]),
              description: clean(parts[5]),
              tags: parts[6] ? clean(parts[6]).split(',') : [],
              results: parts[7] ? clean(parts[7]) : '',
              isVisible: true
            });
          }
        }

        if (imported.length > 0) {
          setAssets(prev => {
            const existingIds = new Set(prev.map(a => a.id));
            const uniqueNew = imported.filter(a => !existingIds.has(a.id));
            return [...uniqueNew, ...prev];
          });
          alert(`成功导入 ${imported.length} 条记录！`);
        }
      } catch (err) {
        alert('文件解析失败，请确保格式正确。');
      }
    };
    reader.readAsText(file);
  };

  const handleSaveConfig = () => {
    saveConfig(modelConfig);
    setIsSettingsOpen(false);
  };

  const handleProviderChange = (providerId: string) => {
    setSelectedProvider(providerId);
    const preset = PRESET_PROVIDERS[providerId];
    if (preset && providerId !== 'custom') {
      setModelConfig(prev => ({ ...prev, baseUrl: preset.baseUrl, model: preset.model }));
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg dark:bg-[#0a1628] text-brand-ink dark:text-[#e0eaf4] font-sans flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-[1280px] bg-white dark:bg-[#0f1c2e] rounded-[40px] custom-shadow-sm border border-brand-border dark:border-[#1e3448] overflow-hidden flex flex-col h-[calc(100vh-4rem)] md:h-[800px]">
        {/* Sync Modal */}
        <AnimatePresence>
          {isSyncOpen && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-brand-ink/40 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-[#0f1c2e] rounded-[40px] shadow-2xl p-10 w-full max-w-xl relative border border-brand-divider dark:border-[#1e3448]"
              >
                <button
                  onClick={() => setIsSyncOpen(false)}
                  className="absolute top-6 right-6 p-2 text-brand-muted hover:text-brand-ink dark:hover:text-[#e0eaf4] transition-colors"
                >
                  <X size={24} />
                </button>

                <div className="space-y-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-brand-primary mb-2">
                      <div className="p-2 bg-brand-hover rounded-xl">
                        <Cloud size={24} />
                      </div>
                      <h3 className="text-2xl font-serif font-medium text-brand-ink dark:text-[#e0eaf4] italic">云端同步与本地备份</h3>
                    </div>
                    <p className="text-xs text-brand-secondary dark:text-[#8aa4bc] leading-relaxed">
                      虽然本站不强制联网数据库以保护隐私，但我们强烈建议您定期备份数据。您可以选择"安全导出"到本地。
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 bg-brand-surface dark:bg-[#0a1628] rounded-3xl border border-brand-divider dark:border-[#1e3448] space-y-4">
                      <div className="flex items-center gap-2 text-brand-ink dark:text-[#e0eaf4] font-bold text-sm">
                        <CloudUpload size={18} className="text-brand-primary" />
                        一键导出备份
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] text-brand-secondary dark:text-[#8aa4bc]">
                          <FileSpreadsheet size={12} /> 经验资产库 (.csv)
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-brand-secondary dark:text-[#8aa4bc]">
                          <FileCode size={12} /> 简历版本 (.json)
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-brand-secondary dark:text-[#8aa4bc]">
                          <FileJson size={12} /> 投递记录 (.json)
                        </div>
                      </div>
                      <button
                        onClick={handleBackupToGoogle}
                        className="w-full py-3 bg-brand-primary text-white rounded-xl text-xs font-bold shadow-sm hover:-translate-y-0.5 transition-all"
                      >
                        生成并下载备份
                      </button>
                    </div>

                    <div className="p-6 border border-brand-divider dark:border-[#1e3448] border-dashed rounded-3xl space-y-4">
                      <div className="flex items-center gap-2 text-brand-ink dark:text-[#e0eaf4] font-bold text-sm">
                        <CloudDownload size={18} className="text-[#3B82F6]" />
                        经验资产导入
                      </div>
                      <p className="text-[10px] text-brand-muted dark:text-[#5a7a96] leading-relaxed">
                        仅支持导入之前导出的经验资产 CSV 文件。
                      </p>
                      <label
                        className="block w-full py-3 bg-white dark:bg-[#0f1c2e] border border-brand-divider dark:border-[#1e3448] text-brand-ink dark:text-[#e0eaf4] rounded-xl text-xs font-bold text-center cursor-pointer hover:bg-brand-hover transition-colors"
                      >
                        选择 CSV 文件
                        <input type="file" accept=".csv" className="hidden" onChange={handleImportAssets} />
                      </label>
                    </div>
                  </div>

                  {syncStatus !== 'idle' && (
                    <div className={`p-4 rounded-2xl text-[10px] font-medium ${
                      syncStatus === 'success' ? 'bg-[#E8F0F8] text-brand-primary border border-brand-divider' :
                      syncStatus === 'loading' ? 'bg-brand-surface text-brand-secondary' : 'bg-red-50 text-red-600 border border-red-100'
                    }`}>
                      {syncMessage}
                    </div>
                  )}

                  <div className="flex items-start gap-3 p-4 bg-brand-hover dark:bg-[#1a2d40] rounded-2xl">
                    <Shield size={20} className="text-brand-primary shrink-0 opacity-40" />
                    <p className="text-[9px] text-brand-secondary dark:text-[#8aa4bc] leading-relaxed">
                      <strong>隐私警示</strong>：本站所有数据均存储在您的本地浏览器中。如果您清除浏览器缓存或更换设备，数据将会丢失。请务必妥善保管导出的 JSON/CSV 文件。
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Top Header */}
        <header className="px-10 pt-10 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-brand-divider dark:border-[#1e3448]">
          <div>
            <h1 className="text-3xl font-serif font-medium text-brand-primary italic mb-1">夏一站</h1>
            <p className="text-sm text-brand-secondary dark:text-[#8aa4bc] tracking-wide uppercase">Summer Pause: Cool Down, Recharge, Restart</p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-3 bg-brand-surface dark:bg-[#0a1628] hover:bg-brand-hover text-brand-secondary dark:text-[#8aa4bc] rounded-full transition-all border border-brand-divider dark:border-[#1e3448] shadow-sm group"
              title="设置 API Key"
            >
              <Settings size={20} className="group-hover:rotate-90 transition-transform duration-500" />
            </button>
          </div>
        </header>

        {/* Settings Modal */}
        <AnimatePresence>
          {isSettingsOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-ink/40 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-[#0f1c2e] rounded-[40px] shadow-2xl p-10 w-full max-w-lg relative border border-brand-divider dark:border-[#1e3448] max-h-[90vh] overflow-y-auto"
              >
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="absolute top-6 right-6 p-2 text-brand-muted hover:text-brand-ink dark:hover:text-[#e0eaf4] transition-colors"
                >
                  <X size={24} />
                </button>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-serif font-medium text-brand-ink dark:text-[#e0eaf4] italic">AI 模型设置</h3>
                    <p className="text-xs text-brand-secondary dark:text-[#8aa4bc] leading-relaxed">
                      选择你喜欢的 AI 服务商，或填入任意兼容 OpenAI 格式的中转站地址。所有配置安全存储在本地浏览器中。
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-muted dark:text-[#5a7a96]">服务商预设</label>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(PRESET_PROVIDERS).map(([key, provider]) => (
                          <button
                            key={key}
                            onClick={() => handleProviderChange(key)}
                            className={`px-4 py-3 rounded-2xl text-xs font-medium transition-all text-left ${
                              selectedProvider === key
                                ? 'bg-brand-primary text-white'
                                : 'bg-brand-surface dark:bg-[#0a1628] border border-brand-divider dark:border-[#1e3448] text-brand-secondary dark:text-[#8aa4bc] hover:border-brand-muted'
                            }`}
                          >
                            {provider.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-muted dark:text-[#5a7a96]">API Key</label>
                      <input
                        type="password"
                        placeholder="sk-..."
                        value={modelConfig.apiKey}
                        onChange={(e) => setModelConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                        className="w-full bg-brand-surface dark:bg-[#0a1628] border border-brand-divider dark:border-[#1e3448] rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-brand-primary transition-all text-sm font-mono text-brand-ink dark:text-[#e0eaf4]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-muted dark:text-[#5a7a96]">API Base URL</label>
                      <input
                        type="text"
                        placeholder="https://api.deepseek.com"
                        value={modelConfig.baseUrl}
                        onChange={(e) => setModelConfig(prev => ({ ...prev, baseUrl: e.target.value }))}
                        className="w-full bg-brand-surface dark:bg-[#0a1628] border border-brand-divider dark:border-[#1e3448] rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-brand-primary transition-all text-sm font-mono text-brand-ink dark:text-[#e0eaf4]"
                      />
                      <p className="text-[10px] text-brand-muted dark:text-[#5a7a96] italic">
                        支持任何兼容 OpenAI 格式的 API 地址（自动拼接 /v1/chat/completions）
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-muted dark:text-[#5a7a96]">模型名称</label>
                      <input
                        type="text"
                        placeholder="deepseek-chat"
                        value={modelConfig.model}
                        onChange={(e) => setModelConfig(prev => ({ ...prev, model: e.target.value }))}
                        className="w-full bg-brand-surface dark:bg-[#0a1628] border border-brand-divider dark:border-[#1e3448] rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-brand-primary transition-all text-sm font-mono text-brand-ink dark:text-[#e0eaf4]"
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={handleSaveConfig}
                        className="flex-1 bg-brand-primary text-white py-4 rounded-2xl font-bold custom-shadow-sm hover:-translate-y-0.5 transition-all"
                      >
                        保存设置
                      </button>
                      <button
                        onClick={() => {
                          const defaultCfg = { apiKey: '', baseUrl: 'https://api.deepseek.com', model: 'deepseek-chat' };
                          setModelConfig(defaultCfg);
                          setSelectedProvider('deepseek');
                          saveConfig(defaultCfg);
                          setIsSettingsOpen(false);
                        }}
                        className="flex-1 bg-brand-surface dark:bg-[#0a1628] text-brand-ink dark:text-[#e0eaf4] border border-brand-divider dark:border-[#1e3448] py-4 rounded-2xl font-bold hover:bg-brand-hover transition-all"
                      >
                        恢复默认
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="flex flex-1 overflow-hidden">
          {/* Navigation Sidebar */}
          <aside className="w-20 md:w-64 border-r border-brand-divider dark:border-[#1e3448] p-6 flex flex-col gap-2 bg-white dark:bg-[#0f1c2e]">
            <div className="hidden md:block px-4 py-2 text-[11px] font-bold text-brand-muted dark:text-[#5a7a96] uppercase tracking-tighter mb-2">求职生命周期</div>
            <NavItem icon={<LayoutDashboard size={18} />} label="01. 愈心面板" active={currentPage === 'dashboard'} onClick={() => setCurrentPage('dashboard')} />
            <NavItem icon={<Search size={18} />} label="02. 深度知己" active={currentPage === 'know_self'} onClick={() => setCurrentPage('know_self')} />
            <NavItem icon={<Globe size={18} />} label="03. 广度知彼" active={currentPage === 'know_others'} onClick={() => setCurrentPage('know_others')} />
            <NavItem icon={<Terminal size={18} />} label="04. 求职渠道" active={currentPage === 'job_channels'} onClick={() => setCurrentPage('job_channels')} />
            <NavItem icon={<Layers size={18} />} label="05. 简历工坊" active={currentPage === 'resume_workshop'} onClick={() => setCurrentPage('resume_workshop')} />
            <NavItem icon={<MapPin size={18} />} label="06. 探索记录" active={currentPage === 'tracker'} onClick={() => setCurrentPage('tracker')} />
            <NavItem icon={<Headphones size={18} />} label="07. 听见可能" active={currentPage === 'podcast'} onClick={() => setCurrentPage('podcast')} />

            <div className="pt-2">
              <button
                onClick={() => setIsSyncOpen(true)}
                className="w-full py-4 bg-brand-surface dark:bg-[#0a1628] hover:bg-brand-hover text-brand-secondary dark:text-[#8aa4bc] border border-brand-divider dark:border-[#1e3448] rounded-[24px] flex items-center justify-center gap-3 text-xs font-bold transition-all group shadow-sm active:scale-95"
              >
                <Cloud size={16} className="text-brand-primary group-hover:scale-110 transition-transform" />
                <span>数据同步与备份</span>
              </button>
            </div>

            <div className="mt-auto hidden md:block p-4 bg-brand-hover dark:bg-[#1a2d40] rounded-[24px]">
              <p className="text-xs italic leading-relaxed text-brand-secondary dark:text-[#8aa4bc]">"最深沉的休息，是找回与自己价值观共振的方向。"</p>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 bg-brand-surface dark:bg-[#0a1628] overflow-y-auto relative p-6 md:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {currentPage === 'dashboard' && <Dashboard />}
                {currentPage === 'job_channels' && <JobChannels />}
                {currentPage === 'resume_workshop' && (
                  <ResumeWorkshop
                    assets={assets}
                    setAssets={setAssets}
                    versions={versions}
                    setVersions={setVersions}
                  />
                )}
                {currentPage === 'know_self' && <KnowSelf />}
                {currentPage === 'know_others' && <KnowOthers />}
                {currentPage === 'tracker' && (
                  <Tracker
                    jobs={jobs}
                    setJobs={setJobs}
                  />
                )}
                {currentPage === 'podcast' && <PodcastPage />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Ko-fi Floating Widget */}
      <a
        href="https://ko-fi.com/iceflake0"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 left-8 z-[200] group flex items-center gap-3 bg-white dark:bg-[#0f1c2e] border border-brand-divider dark:border-[#1e3448] p-3 pl-4 rounded-full custom-shadow-lg hover:border-brand-primary transition-all hover:-translate-y-1 active:translate-y-0"
      >
        <div className="flex flex-col items-start leading-none pr-1">
          <span className="text-[10px] font-bold text-brand-muted dark:text-[#5a7a96] uppercase tracking-widest group-hover:text-brand-primary transition-colors">Support Me</span>
          <span className="text-xs font-serif italic text-brand-secondary dark:text-[#8aa4bc]">Buy me a tea</span>
        </div>
        <div className="w-10 h-10 bg-brand-hover text-brand-primary rounded-full flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
          <Coffee size={20} />
        </div>

        <div className="absolute inset-0 bg-brand-primary/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
      </a>
    </div>
  );
}
