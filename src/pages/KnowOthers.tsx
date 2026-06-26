import { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  BarChart3, Briefcase, TrendingUp, MessageSquareHeart,
  ShieldCheck, Cpu, Sparkles, Search, Loader2, ChevronRight, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { analyzeIndustry } from '../lib/gemini';
import { format } from 'date-fns';
import html2canvas from 'html2canvas';

interface ResourceLink {
  name: string;
  url: string;
  desc: string;
}

interface ResourceCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  items: ResourceLink[];
}

const RESOURCE_CATEGORIES: ResourceCategory[] = [
  {
    id: 'macro',
    label: '宏观数据',
    icon: <BarChart3 size={16} />,
    items: [
      { name: '国家统计局', url: 'https://www.stats.gov.cn/', desc: '中国官方宏观经济与就业数据' },
      { name: 'ILO 国际劳工组织', url: 'https://www.ilo.org/zh-hans', desc: '全球劳动力市场趋势与报告' },
      { name: '世界银行公开数据', url: 'https://data.worldbank.org/', desc: '各国经济指标与发展数据' },
      { name: 'OECD 经济数据', url: 'https://data.oecd.org/', desc: '经合组织成员国就业与经济统计' },
      { name: '中国人力资源市场信息监测中心', url: 'https://www.mohrss.gov.cn/', desc: '季度劳动力供求分析报告' },
    ]
  },
  {
    id: 'reports',
    label: '行业研报',
    icon: <Briefcase size={16} />,
    items: [
      { name: '发现报告', url: 'https://www.fxbaogao.com/', desc: '免费研报聚合平台，覆盖各行各业' },
      { name: '麦肯锡洞见', url: 'https://www.mckinsey.com.cn/insights/', desc: '全球顶尖咨询公司的行业趋势分析' },
      { name: 'Harvard Business Review 中文版', url: 'https://www.hbrchina.org/', desc: '商业管理前沿洞察' },
      { name: '艾瑞咨询', url: 'https://www.iresearch.cn/', desc: '互联网行业深度报告与数据' },
      { name: '亿欧智库', url: 'https://www.iyiou.com/research', desc: '新经济领域产业研究报告' },
    ]
  },
  {
    id: 'salary',
    label: '薪酬需求',
    icon: <TrendingUp size={16} />,
    items: [
      { name: '看准网', url: 'https://www.kanzhun.com/', desc: '企业点评、薪酬数据与面试经验' },
      { name: 'Levels.fyi', url: 'https://www.levels.fyi/', desc: '科技行业全球薪酬对标工具' },
      { name: '脉脉', url: 'https://maimai.cn/', desc: '职场社交平台，真实薪资讨论' },
      { name: '职友集', url: 'https://www.jobui.com/', desc: '城市、行业薪酬水平横向对比' },
      { name: '猎聘大数据研究院', url: 'https://www.liepin.com/', desc: '中高端人才市场薪酬趋势报告' },
    ]
  },
  {
    id: 'news',
    label: '行业资讯',
    icon: <MessageSquareHeart size={16} />,
    items: [
      { name: '36氪', url: 'https://36kr.com/', desc: '科技与创业领域最新资讯' },
      { name: '虎嗅', url: 'https://www.huxiu.com/', desc: '商业科技深度分析与观点' },
      { name: '雪球', url: 'https://xueqiu.com/', desc: '投资视角看行业与公司动态' },
      { name: '少数派', url: 'https://sspai.com/', desc: '数字生活与效率工具前沿' },
      { name: '品玩', url: 'https://www.pingwest.com/', desc: '全球科技商业新知' },
    ]
  },
  {
    id: 'policy',
    label: '政策风口',
    icon: <ShieldCheck size={16} />,
    items: [
      { name: '工业和信息化部', url: 'https://www.miit.gov.cn/', desc: '产业政策与数字经济规划' },
      { name: '国家发展和改革委员会', url: 'https://www.ndrc.gov.cn/', desc: '宏观经济政策与产业扶持方向' },
      { name: '科学技术部', url: 'https://www.most.gov.cn/', desc: '科技创新与研发政策动态' },
      { name: '人力资源和社会保障部', url: 'https://www.mohrss.gov.cn/', desc: '就业创业政策与补贴信息' },
      { name: '各地人才引进政策汇总', url: 'https://www.gov.cn/', desc: '城市落户、人才补贴等地方政策' },
    ]
  },
  {
    id: 'ai',
    label: 'AI研判',
    icon: <Cpu size={16} />,
    items: [
      { name: 'Perplexity AI', url: 'https://www.perplexity.ai/', desc: 'AI 驱动的实时信息搜索引擎' },
      { name: 'ChatGPT', url: 'https://chat.openai.com/', desc: '行业分析、岗位理解的对话式 AI 助手' },
      { name: 'Kimi (月之暗面)', url: 'https://kimi.moonshot.cn/', desc: '长文本阅读与研报解析' },
      { name: '通义千问', url: 'https://tongyi.aliyun.com/', desc: '阿里大模型，擅长中文语境分析' },
      { name: 'DeepSeek', url: 'https://chat.deepseek.com/', desc: '高性价比推理模型，适合深度分析' },
    ]
  },
];

export default function KnowOthers() {
  const [keyword, setKeyword] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('macro');
  const resultRef = useRef<HTMLDivElement>(null);

  const handleSearch = async () => {
    const trimmed = keyword.trim();
    if (!trimmed) return;
    setLoading(true);
    setResult('');
    try {
      const res = await analyzeIndustry(trimmed);
      setResult(res);
    } catch (e: any) {
      setResult(`❌ 分析失败：${e.message || '请检查 API 配置'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!resultRef.current) return;
    try {
      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `行业分析_${keyword}_${format(new Date(), 'yyyyMMdd_HHmm')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch {
      console.error('截图下载失败');
    }
  };

  const activeCategory = RESOURCE_CATEGORIES.find(c => c.id === activeTab)!;

  return (
    <div className="space-y-8 pb-12">
      <header className="space-y-2">
        <h2 className="text-3xl font-serif font-medium italic text-brand-ink dark:text-[#e0eaf4]">
          广度知彼：外部全景指南
        </h2>
        <p className="text-sm text-brand-secondary dark:text-[#8aa4bc] max-w-2xl leading-relaxed">
          用 AI 做行业调研，用资源库做信息补盲。既看见森林，也看清道路——让每一次投递都建立在真实认知之上。
        </p>
      </header>

      {/* AI Industry Analysis */}
      <div className="glass-card p-8 bg-white dark:bg-[#0f1c2e] dark:border-[#1e3448] space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-hover rounded-xl">
            <Sparkles size={20} className="text-brand-primary" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-brand-ink dark:text-[#e0eaf4]">AI 行业深度研判</h3>
            <p className="text-xs text-brand-secondary dark:text-[#8aa4bc]">输入行业关键词，AI 将为你生成定制化的行业分析报告</p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
            <input
              type="text"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="输入行业关键词，如：新能源、AI大模型、跨境电商..."
              className="w-full bg-brand-surface border border-brand-divider dark:border-[#1e3448] rounded-2xl pl-11 pr-6 py-4 outline-none focus:ring-2 focus:ring-brand-primary transition-all text-sm"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading || !keyword.trim()}
            className="px-8 py-4 bg-brand-primary text-white rounded-2xl font-bold text-sm shadow-sm hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 flex items-center gap-2 shrink-0"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            {loading ? '分析中...' : '开始研判'}
          </button>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-brand-primary">
                  <Sparkles size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">AI 分析结果</span>
                </div>
                <button
                  onClick={handleDownloadImage}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-surface border border-brand-divider dark:border-[#1e3448] rounded-xl text-xs font-medium text-brand-secondary hover:text-brand-primary hover:bg-brand-hover transition-all"
                >
                  <Download size={12} />
                  保存为图片
                </button>
              </div>
              <div
                ref={resultRef}
                className="p-8 bg-brand-surface rounded-3xl border border-brand-divider dark:border-[#1e3448] prose prose-sm max-w-none
                  prose-headings:text-brand-ink prose-headings:font-serif prose-headings:italic
                  prose-p:text-brand-secondary prose-p:leading-relaxed
                  prose-strong:text-brand-ink
                  prose-li:text-brand-secondary
                  dark:prose-headings:text-[#e0eaf4] dark:prose-p:text-[#8aa4bc] dark:prose-strong:text-[#e0eaf4] dark:prose-li:text-[#8aa4bc]"
              >
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Resource Explorer */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-brand-primary rounded-full" />
          <h3 className="font-bold text-lg text-brand-ink dark:text-[#e0eaf4]">信息补盲资源库</h3>
        </div>

        <div className="flex border-b border-brand-divider dark:border-[#1e3448] overflow-x-auto no-scrollbar">
          {RESOURCE_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-medium transition-all whitespace-nowrap border-b-2 ${
                activeTab === cat.id
                  ? 'border-brand-primary text-brand-primary'
                  : 'border-transparent text-brand-muted dark:text-[#5a7a96] hover:text-brand-secondary'
              }`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {activeCategory.items.map((item, idx) => (
            <a
              key={idx}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card p-6 group hover:border-brand-primary bg-white dark:bg-[#0f1c2e] dark:border-[#1e3448] flex items-start gap-4 transition-all"
            >
              <div className="p-2 bg-brand-hover rounded-xl shrink-0 group-hover:bg-brand-primary/10 transition-colors">
                {activeCategory.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-sm text-brand-ink dark:text-[#e0eaf4] group-hover:text-brand-primary transition-colors truncate">
                    {item.name}
                  </h4>
                  <ChevronRight size={14} className="text-brand-muted shrink-0 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-xs text-brand-secondary dark:text-[#8aa4bc] leading-relaxed line-clamp-2">
                  {item.desc}
                </p>
              </div>
            </a>
          ))}
        </motion.div>
      </div>

      {/* Tips Banner */}
      <div className="p-8 bg-brand-primary text-white rounded-[40px] custom-shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Sparkles size={120} />
        </div>
        <h4 className="text-lg font-serif italic mb-4">💡 高效调研小贴士</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium relative z-10">
          <div className="bg-[#ffffff1a] p-4 rounded-2xl">
            <span className="block opacity-60 mb-2">步骤 01</span>
            先用 AI 研判获取行业全貌，建立基础认知框架
          </div>
          <div className="bg-[#ffffff1a] p-4 rounded-2xl">
            <span className="block opacity-60 mb-2">步骤 02</span>
            查阅宏观数据与研报，用数据验证 AI 的分析结论
          </div>
          <div className="bg-[#ffffff1a] p-4 rounded-2xl">
            <span className="block opacity-60 mb-2">步骤 03</span>
            关注薪酬与政策动态，找到供需缺口与入场时机
          </div>
        </div>
      </div>
    </div>
  );
}
