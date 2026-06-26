import { Headphones, ChevronRight } from 'lucide-react';

export default function PodcastPage() {
  const podcastCategories = [
    {
      name: '商业与投资',
      items: [
        { name: '大方谈钱', url: 'https://www.xiaoyuzhoufm.com/podcast/66ed1e69dbf9bb012f843e39', desc: '探讨ETF、基建、游戏、消费等领域的投资逻辑' },
        { name: '一周富盘 (有富同享)', url: 'https://www.xiaoyuzhoufm.com/podcast/67210f3733c798676ff0f99e', desc: '每周复盘财经市场热点，解读AI、算力、股市、政策等投资机会' },
        { name: '半拿铁·周刊', url: 'https://www.xiaoyuzhoufm.com/podcast/648b0b641c48983391a63f98', desc: '每周盘点商业科技领域的重要事件，涵盖公司动态、行业趋势和社会热点' },
        { name: '铜镜', url: 'https://www.xiaoyuzhoufm.com/podcast/60502e253c92d4f62c2a9577', desc: '探讨地缘政治、宏观经济、投资策略及AI技术应用的交叉影响' }
      ]
    },
    {
      name: '科技与前沿',
      items: [
        { name: '十字路口', url: 'https://www.xiaoyuzhoufm.com/podcast/6627fda4b56459544087d86a', desc: '访谈Z世代年轻人及AI领域创业者，探讨AI时代的职业选择和创业机会' },
        { name: '卫诗婕｜漫谈 Light the Star', url: 'https://www.xiaoyuzhoufm.com/podcast/5e7cc741418a84a046b0c2bd', desc: '深度访谈科技商业领域的创新者，关注技术进步与公共利益' },
        { name: '42 章经', url: 'https://www.xiaoyuzhoufm.com/podcast/685e568f8d5a9c9c2e59bc59', desc: '与商业和科技领域的"聪明人"进行深度对话，分享独到认知' },
        { name: 'She Rewires Digital (她原力数字)', url: 'https://www.xiaoyuzhoufm.com/podcast/67b92c728671d63e927d8eee', desc: '科技女性社群的知识分享，内容涉及职业发展、AI技术和可持续发展' },
        { name: '码农姐妹', url: 'https://www.xiaoyuzhoufm.com/podcast/682c566cc7c5f17595635a2c', desc: '访谈科技领域的女性从业者，分享技术岗位的成长故事和职业规划' }
      ]
    },
    {
      name: '职场与职业发展',
      items: [
        { name: '咱们女的', url: 'https://www.xiaoyuzhoufm.com/podcast/63d945ece725b5378a158d29', desc: '聚焦女性在职场、生活、自我认知方面的成长与困惑' },
        { name: 'Women at Work (职场女性说/精怪)', url: 'https://www.xiaoyuzhoufm.com/podcast/625635587bfca4e73e990703', desc: '解答具体职场困惑，如向上管理、冲突处理、焦虑应对等' },
        { name: 'BYM 职场系列', url: 'https://www.xiaoyuzhoufm.com/podcast/65b9c7c3a27e56484f5eaf54', desc: '分享职业发展中的方法论，涵盖面试、晋升、管理等话题' },
        { name: '菲说不可 | 职业规划会客厅', url: 'https://www.xiaoyuzhoufm.com/podcast/605a9eec154dad0489a292e7', desc: '由资深HR/职业规划师分享职场故事、法律知识和规划建议' },
        { name: '转行芝士', url: 'https://www.xiaoyuzhoufm.com/podcast/685d6dacf5fd5b06d4ee7c80', desc: '分享不同行业人士的转行故事和经验' },
        { name: '职场脱轨指南 Out of Office', url: 'https://www.xiaoyuzhoufm.com/podcast/6854eb7973016f3aea8a6f8f', desc: '探讨副业、创业、职场焦虑等，寻找工作与生活的其他可能性' },
        { name: '公司茶水间', url: 'https://www.xiaoyuzhoufm.com/podcast/65d41a956a963a082d9b7291', desc: '围绕职场困惑、职业选择和生活状态进行访谈' }
      ]
    },
    {
      name: '女性成长与生活',
      items: [
        { name: '岩中花述', url: 'https://www.xiaoyuzhoufm.com/podcast/65b23bb30bef6c20743377f5', desc: '主持人鲁豫与各界女性的深度对话，探讨生命体验和成长' },
        { name: '她们的选择', url: 'https://www.xiaoyuzhoufm.com/podcast/5e280fac418a84a0461fafd6', desc: '探讨25-35岁女性如何自定义人生，平衡职业、生活与外界期待' },
        { name: '与她有关', url: 'https://www.xiaoyuzhoufm.com/podcast/650a6a3e3c280acc06af6770', desc: '聚焦女性在职场、创业、生活方式和自我探索方面的成长' },
        { name: '海那边的女子', url: 'https://www.xiaoyuzhoufm.com/podcast/5e7c91bf418a84a046f9b318', desc: '记录普通女性在海外开启第二人生的真实经历与感悟' },
        { name: '姐妹悄悄話', url: 'https://www.xiaoyuzhoufm.com/podcast/6278b07ad6e7a5551f799dd0', desc: '两位女性主持人闲聊情感、关系、沟通和自我成长等生活话题' },
        { name: '搞钱女孩', url: 'https://www.xiaoyuzhoufm.com/podcast/63e33eb37cd428dce00343d7', desc: '分享女性在理财、创业、消费降级等方面的真实故事和经验' },
        { name: '看见她', url: 'https://www.xiaoyuzhoufm.com/podcast/61ab42d1d28510c8f75c7fc2', desc: '对话100个宝藏小姐姐，聚焦多元女性人生、职业突破与成长叙事' },
        { name: '闪光少女', url: 'https://www.xiaoyuzhoufm.com/podcast/604f3cd042d469df009c3e0d', desc: '陪伴年轻女孩成长的平台，分享闪闪发光的女性故事，呈现女性的状态、能量与智慧' }
      ]
    },
    {
      name: '文化与社会观察',
      items: [
        { name: '随机波动 Stochastic Volatility', url: 'https://www.xiaoyuzhoufm.com/podcast/654e17a8aa96f6e642698936', desc: '三位女性媒体人主持，深入探讨文化、社会、影视及女性议题' },
        { name: '人间，小事', url: 'https://www.xiaoyuzhoufm.com/podcast/675a4c03c3c61573b7564b74', desc: '主播分享生活感悟，内容涵盖养生、旅行、投资和心灵成长' }
      ]
    },
    {
      name: '生活方式与人物纪实',
      items: [
        { name: '100 种生活', url: 'https://www.xiaoyuzhoufm.com/podcast/645657b2a49ee05e1201aebe', desc: '每期带你走进一个不同的生活方式，采访不同背景人士，分享职场与生活的真实故事与思考' },
        { name: '半拿铁·商业沉浮录', url: 'https://www.xiaoyuzhoufm.com/podcast/65dcb1addaf4f3db3e5378d0', desc: '讲述中国商业史上的著名公司和人物沉浮故事' },
        { name: '故事FM', url: 'https://www.xiaoyuzhoufm.com/podcast/652775ef36a1383a663c94c7', desc: '亲历者自述真实故事，涵盖社会、情感、职业等多元人生体验' }
      ]
    }
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 pb-20">
      <header className="space-y-2">
        <h2 className="text-3xl font-serif font-medium text-brand-ink dark:text-[#e0eaf4] italic">听见可能：播客深度洞察</h2>
        <p className="text-sm text-brand-secondary dark:text-[#8aa4bc] max-w-2xl">
          在声音中寻找共鸣与启发。通过深度访谈与商业复盘，拓宽你的认知边界，发现职场与生活的无限可能。
        </p>
      </header>

      <div className="space-y-12">
        {podcastCategories.map((category, idx) => (
          <section key={idx} className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-brand-primary rounded-full"></div>
              <h3 className="text-lg font-bold text-brand-ink dark:text-[#e0eaf4]">{category.name}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.items.map((item, i) => (
                <a
                  key={i}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card p-6 bg-white dark:bg-[#0f1c2e] border-brand-divider dark:border-[#1e3448] hover:border-brand-primary hover:-translate-y-1 transition-all group relative overflow-hidden"
                >
                  <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                    <Headphones size={80} />
                  </div>

                  <div className="flex justify-between items-start mb-3 relative z-10">
                    <h4 className="font-bold text-brand-ink dark:text-[#e0eaf4] group-hover:text-brand-primary transition-colors pr-8">
                      {item.name}
                    </h4>
                    <Headphones size={16} className="text-brand-muted dark:text-[#5a7a96] group-hover:text-brand-primary transition-colors flex-shrink-0" />
                  </div>

                  <p className="text-xs text-brand-secondary dark:text-[#8aa4bc] leading-relaxed serif relative z-10">
                    {item.desc}
                  </p>

                  <div className="mt-4 flex items-center text-[10px] text-brand-muted dark:text-[#5a7a96] font-bold uppercase tracking-widest gap-1 group-hover:text-brand-primary transition-colors relative z-10">
                    <span>Listen on Little Universe</span>
                    <ChevronRight size={10} />
                  </div>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="p-10 text-center space-y-6 border-t border-brand-divider dark:border-[#1e3448] mt-10">
        <p className="text-lg font-serif italic text-brand-secondary dark:text-[#8aa4bc]">
          "有时候，改变人生的不是一本书，而是一段刚好在此时此地传入耳中的对话。"
        </p>
        <div className="space-y-2">
          <div className="w-12 h-0.5 bg-brand-divider dark:bg-[#1e3448] mx-auto"></div>
          <p className="text-[10px] text-brand-muted dark:text-[#5a7a96] uppercase tracking-widest font-bold">
            Released under CC BY-NC-SA 4.0
          </p>
          <p className="text-[9px] text-brand-muted dark:text-[#5a7a96] opacity-60">
            本项目采用 Creative Commons BY-NC-SA 4.0 协议开源
          </p>
        </div>
      </div>
    </div>
  );
}
