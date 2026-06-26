import { useState } from 'react';
import { ArrowLeft, PenLine, ChevronRight, Sparkles, Compass, Search } from 'lucide-react';
import type { Tool } from '../types';
import IkigaiTool from './tools/IkigaiTool';
import HollandTestTool from './tools/HollandTestTool';
import CareerAnchorsTool from './tools/CareerAnchorsTool';
import StrengthsTool from './tools/StrengthsTool';

export default function KnowSelf() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);

  const dimensions: { id: number; title: string; subtitle: string; tools: Tool[] }[] = [
    {
      id: 0,
      title: '性格与偏好',
      subtitle: '我是谁？适合什么环境？',
      tools: [
        { name: '霍兰德职业兴趣测试 (RIASEC)', value: '职场定位金标准', desc: '将职业兴趣分为六种类型，帮助你缩小行业范围。', toolId: 'riasec' }
      ]
    },
    {
      id: 1,
      title: '价值观与动机',
      subtitle: '我想要什么？什么能驱动我？',
      tools: [
        { name: '埃德加·施恩的职业锚', value: '不愿放弃的核心观', desc: '识别八大锚点，提前过滤"三观不合"的岗位。', toolId: 'career_anchors' }
      ]
    },
    {
      id: 2,
      title: '天赋与优势',
      subtitle: '我擅长什么？核心竞争力在哪？',
      tools: [
        { name: '盖洛普优势识别器 (CliftonStrengths)', value: '四大天赋领域测评', desc: '识别执行、影响、关系建立与战略思考维度。', toolId: 'strengths' }
      ]
    },
    {
      id: 3,
      title: '整合与聚焦',
      subtitle: '如何避免目标发散？',
      tools: [
        { name: 'Ikigai (生之意义) 图谱', value: '跨领域整合框架', desc: '结合热爱、擅长、世界需要、能获报酬四个圆圈。', toolId: 'ikigai' }
      ]
    }
  ];

  if (selectedToolId === 'ikigai') return <IkigaiTool onBack={() => setSelectedToolId(null)} />;
  if (selectedToolId === 'riasec') return <HollandTestTool onBack={() => setSelectedToolId(null)} />;
  if (selectedToolId === 'career_anchors') return <CareerAnchorsTool onBack={() => setSelectedToolId(null)} />;
  if (selectedToolId === 'strengths') return <StrengthsTool onBack={() => setSelectedToolId(null)} />;

  return (
    <div className="space-y-8 pb-12">
      <header className="space-y-2">
        <h2 className="text-3xl font-serif font-medium italic text-brand-ink dark:text-[#e0eaf4]">深度知己：建立清晰自知</h2>
        <p className="text-sm text-brand-secondary dark:text-[#8aa4bc] max-w-2xl leading-relaxed">
          "了解自己"是求职中最能节省时间的环节。通过多维度的深度剖析，将模糊的感觉转化为清晰的策略，避免盲目投递产生的内耗。
        </p>
      </header>

      <div className="flex border-b border-brand-divider dark:border-[#1e3448] overflow-x-auto no-scrollbar">
        {dimensions.map((dim) => (
          <button
            key={dim.id}
            onClick={() => setActiveTab(dim.id)}
            className={`px-6 py-4 text-sm font-medium transition-all whitespace-nowrap border-b-2 ${
              activeTab === dim.id
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-brand-muted dark:text-[#5a7a96] hover:text-brand-secondary'
            }`}
          >
            {dim.title}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <div className="w-1.5 h-6 bg-brand-primary rounded-full"></div>
          <span className="text-brand-secondary dark:text-[#8aa4bc] italic text-sm">{dimensions[activeTab].subtitle}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dimensions[activeTab].tools.map((tool, idx) => (
            <div key={idx} className="glass-card p-8 group hover:border-brand-primary bg-white dark:bg-[#0f1c2e] dark:border-[#1e3448] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-xl text-brand-ink dark:text-[#e0eaf4] group-hover:text-brand-primary transition-colors">{tool.name}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary bg-brand-hover px-2 py-1 rounded">
                    {tool.value}
                  </span>
                </div>
                <p className="text-sm text-brand-secondary dark:text-[#8aa4bc] leading-relaxed mb-6">
                  {tool.desc}
                </p>
              </div>
              {tool.toolId ? (
                <button
                  onClick={() => setSelectedToolId(tool.toolId)}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-primary hover:gap-3 transition-all pt-4 border-t border-brand-divider dark:border-[#1e3448] w-full text-left"
                >
                  开启站内互动工具 <PenLine size={14} className="ml-1" />
                </button>
              ) : (
                <a
                  href={tool.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-primary hover:gap-3 transition-all pt-4 border-t border-brand-divider dark:border-[#1e3448] w-full"
                >
                  查看资源/测试 <ChevronRight size={14} />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-8 bg-brand-primary text-white rounded-[40px] custom-shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Sparkles size={120} />
        </div>
        <h4 className="text-lg font-serif italic mb-4">💡 整合聚焦建议</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-medium">
          <div className="bg-[#ffffff1a] p-4 rounded-2xl">
            <span className="block opacity-60 mb-2">步骤 01</span>
            测霍兰德 (定行业大方向)
          </div>
          <div className="bg-[#ffffff1a] p-4 rounded-2xl">
            <span className="block opacity-60 mb-2">步骤 02</span>
            测职业锚 (定公司类型/价值观)
          </div>
          <div className="bg-[#ffffff1a] p-4 rounded-2xl">
            <span className="block opacity-60 mb-2">步骤 03</span>
            测盖洛普 (定具体岗位职能)
          </div>
          <div className="bg-white text-brand-primary p-4 rounded-2xl border-2 border-brand-active custom-shadow-lg relative overflow-hidden group">
            <span className="block text-brand-muted mb-2 font-bold uppercase">步骤 04</span>
            <span className="font-bold block">开启 Ikigai 互动工具 (做最终决策)</span>
            <div className="mt-2 text-[10px] opacity-80 leading-snug">
              ✨ 如果你已经足够了解自己，可以跳过前三步直接开始这里。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
