import { useState } from 'react';
import { Search, Terminal, Building2, Users, Share2, FileText, ShieldCheck, Layers, Sparkles, Trash2, MessageSquareHeart, ChevronRight, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SOCIAL_PLATFORMS = [
  { name: 'X (Twitter)', url: 'https://x.com', tip: '外企/科技公司官推、CEO 招聘动态' },
  { name: '小红书', url: 'https://www.xiaohongshu.com', tip: '企业号、职场博主、内推笔记' },
  { name: '微信公众号', url: 'https://mp.weixin.qq.com', tip: '大厂/国企官方招聘推文' },
  { name: '即刻', url: 'https://okjike.com', tip: '互联网从业者圈子、内推帖' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com', tip: '外企 HR、猎头发布职位' },
  { name: '微博', url: 'https://weibo.com', tip: '企业官博、校园招聘官微' },
  { name: 'B 站', url: 'https://www.bilibili.com', tip: '企业官方账号、校招 VLOG' },
  { name: '脉脉', url: 'https://maimai.cn', tip: '实名职场社交、员工动态' },
];

export default function JobChannels() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('direct');

  const categories = [
    { id: 'direct', name: '全网职位直连', icon: <Search size={18} />, desc: '直接从全网索引中打捞最新的公开招聘信息', subtext: '基础公式: "职位名称" ("招聘" OR "求职" OR "hiring") "城市"', chips: [
      { label: '"产品经理"', val: '"产品经理"' }, { label: '"数据分析师"', val: '"数据分析师"' }, { label: '"运营"', val: '"运营"' }, { label: '"北京"', val: '"北京"' }, { label: '"上海"', val: '"上海"' }, { label: '"远程"', val: '"远程"' }, { label: '"招聘"', val: '"招聘"' }, { label: '"急招"', val: '"急招"' }, { label: 'OR', val: 'OR' }, { label: 'AND', val: 'AND' }
    ]},
    { id: 'official', name: '官网大厂直达', icon: <Building2 size={18} />, desc: '跳过中间平台，直接在企业官网搜索', subtext: '进阶: site:域名 ("招聘" OR "Careers")', chips: [
      { label: '阿里 site:alibaba.com', val: 'site:alibaba.com ("招聘" OR "职位")' }, { label: '腾讯 site:tencent.com', val: 'site:tencent.com ("加入我们" OR "careers")' }, { label: '字节 site:bytedance.com', val: 'site:bytedance.com ("招聘" OR "jobs")' }, { label: '华为 site:huawei.com', val: 'site:huawei.com ("社会招聘")' }
    ]},
    { id: 'community', name: '社群面经爆料', icon: <Users size={18} />, desc: '在垂直社区与社交媒体挖掘真实面试经验、内推与官媒动态', subtext: '示例: site:x.com "hiring" OR site:xiaohongshu.com "内推"', chips: [
      { label: 'V2EX 酷工作', val: 'site:v2ex.com "酷工作"' }, { label: '知乎', val: 'site:zhihu.com' }, { label: '牛客', val: 'site:nowcoder.com' }, { label: '"面经"', val: '"面经"' }, { label: '"薪资"', val: '"薪资"' },
      { label: 'X (Twitter)', val: 'site:x.com ("hiring" OR "we are hiring")' }, { label: '小红书', val: 'site:xiaohongshu.com ("内推" OR "招聘")' }, { label: '微信公众号', val: 'site:mp.weixin.qq.com ("招聘" OR "内推")' }, { label: '即刻', val: 'site:okjike.com ("内推" OR "招聘")' }, { label: 'LinkedIn', val: 'site:linkedin.com/jobs' }, { label: '微博', val: 'site:weibo.com ("招聘" OR "校招")' }, { label: 'B 站', val: 'site:bilibili.com ("招聘" OR "校招")' }, { label: '脉脉', val: 'site:maimai.cn ("内推" OR "招聘")' },
    ]},
    { id: 'referral', name: '校招与内推', icon: <Share2 size={18} />, desc: '锁定当季校招汇总及内推码', subtext: '关键词: ("2026" OR "2027") AND ("内推" OR "校招")', chips: [
      { label: '"2026校园招聘"', val: '"2026校园招聘"' }, { label: '"内推码"', val: '"内推码"' }, { label: '"管培生"', val: '"管培生"' }
    ]},
    { id: 'files', name: '专项文档/报告', icon: <FileText size={18} />, desc: '搜索 PDF/PPT 格式的招聘简章或薪资报告', subtext: '魔法: filetype:pdf (关键词)', chips: [
      { label: 'PDF 简章', val: 'filetype:pdf "招聘简章"' }, { label: 'PDF 薪资报告', val: 'filetype:pdf "薪酬报告"' }
    ]},
    { id: 'gov', name: '体制内/公考', icon: <ShieldCheck size={18} />, desc: '事业单位、公务员及国企招考公告', subtext: '推荐: 广东公共就业移动地图', chips: [
      { label: '"公务员公告"', val: '"国家公务员" AND "招考公告"' }, { label: '"事业单位招聘"', val: '"事业单位" AND "招聘公告"' }
    ]}
  ];

  const activeCat = categories.find(c => c.id === activeCategory)!;

  const appendToQuery = (val: string) => {
    setQuery(prev => (prev ? prev + ' ' + val : val));
  };

  const executeSearch = () => {
    if (!query.trim()) return;
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
      <header className="space-y-2">
        <h2 className="text-3xl font-serif font-medium text-brand-ink dark:text-[#e0eaf4] italic">求职渠道：Google 高级搜索指令营</h2>
        <p className="text-sm text-brand-secondary dark:text-[#8aa4bc] max-w-2xl leading-relaxed">
          掌握 Google 高级搜索语法，直接从全网精准打捞职位、面经、薪资和内推信息，绕过信息差，建立自己的情报网络。
        </p>
      </header>

      <section className="glass-card p-0 overflow-hidden bg-[#1a1a2e] dark:bg-[#0a0f1e] border-brand-divider dark:border-[#1e3448]">
        <div className="flex items-center gap-2 px-6 py-3 border-b border-[#ffffff10]">
          <Terminal size={14} className="text-green-400" />
          <span className="text-[10px] font-mono text-green-400/70 uppercase tracking-widest">Search Query Builder</span>
          {query && (
            <button
              onClick={() => setQuery('')}
              className="ml-auto flex items-center gap-1 text-[10px] text-red-400/60 hover:text-red-400 transition-colors"
            >
              <Trash2 size={12} /> 清空
            </button>
          )}
        </div>
        <div className="p-6">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='点击下方标签组合搜索指令，或直接输入...'
            rows={3}
            className="w-full bg-transparent text-green-300 font-mono text-sm outline-none resize-none placeholder:text-[#ffffff30] leading-relaxed"
          />
        </div>
        <div className="px-6 pb-4">
          <button
            onClick={executeSearch}
            disabled={!query.trim()}
            className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-2xl text-sm font-bold hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:hover:translate-y-0"
          >
            <Search size={16} />
            使用 Google 执行深度搜索
          </button>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? 'bg-brand-primary text-white custom-shadow-sm'
                  : 'bg-white dark:bg-[#0f1c2e] text-brand-secondary dark:text-[#8aa4bc] border border-brand-divider dark:border-[#1e3448] hover:border-brand-muted'
              }`}
            >
              {cat.icon}
              {cat.name}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="glass-card p-8 bg-white dark:bg-[#0f1c2e] dark:border-[#1e3448] space-y-5"
          >
            <div>
              <h3 className="font-bold text-lg text-brand-ink dark:text-[#e0eaf4] flex items-center gap-2">
                {activeCat.icon}
                {activeCat.name}
              </h3>
              <p className="text-sm text-brand-secondary dark:text-[#8aa4bc] mt-1">{activeCat.desc}</p>
              <p className="text-xs font-mono text-brand-muted dark:text-[#5a7a96] mt-2 bg-brand-hover dark:bg-[#0a1628] px-3 py-1.5 rounded-lg inline-block">{activeCat.subtext}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {activeCat.chips.map((chip, i) => (
                <button
                  key={i}
                  onClick={() => appendToQuery(chip.val)}
                  className="px-4 py-2 rounded-full text-sm font-medium bg-brand-hover dark:bg-[#1a2d40] text-brand-ink dark:text-[#e0eaf4] border border-brand-divider dark:border-[#1e3448] hover:border-brand-primary hover:text-brand-primary transition-all hover:-translate-y-0.5"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      <section className="p-8 bg-brand-primary text-white rounded-[40px] custom-shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <MessageSquareHeart size={120} />
        </div>
        <div className="flex items-center gap-2 mb-6">
          <Sparkles size={18} />
          <h4 className="text-lg font-serif italic">💡 主动出击：不止于搜索</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm relative z-10">
          <div className="bg-[#ffffff1a] p-5 rounded-2xl space-y-2">
            <div className="font-bold flex items-center gap-2">
              <Layers size={16} />
              建立信息流
            </div>
            <p className="text-xs opacity-80 leading-relaxed">
              将常用搜索指令保存为 Google Alerts，让职位信息主动找到你，而不是每天重复搜索。
            </p>
          </div>
          <div className="bg-[#ffffff1a] p-5 rounded-2xl space-y-3 md:col-span-1">
            <div className="font-bold flex items-center gap-2">
              <Users size={16} />
              社群渗透
            </div>
            <p className="text-xs opacity-80 leading-relaxed">
              关注目标公司在各平台的官方账号与员工动态，主动建立弱关系网络，第一时间捕捉内推与急招信息。
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {SOCIAL_PLATFORMS.map((platform) => (
                <a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={platform.tip}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium
                    bg-[#ffffff26] hover:bg-[#ffffff40] transition-colors"
                >
                  {platform.name}
                  <ExternalLink size={9} className="opacity-60" />
                </a>
              ))}
            </div>
          </div>
          <div className="bg-[#ffffff1a] p-5 rounded-2xl space-y-2">
            <div className="font-bold flex items-center gap-2">
              <ChevronRight size={16} />
              直接触达
            </div>
            <p className="text-xs opacity-80 leading-relaxed">
              用 Google 搜索 "site:linkedin.com [公司名] [职位] recruiter" 找到招聘负责人，礼貌地直接联系。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
