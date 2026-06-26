import { useState, useRef } from 'react';
import { ArrowLeft, Download, Sparkles, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { generateIkigaiSynthesis } from '../../lib/gemini';
import { format } from 'date-fns';
import html2canvas from 'html2canvas';
import { IkigaiInput } from '../../components/IkigaiInput';
import { MarkdownRenderer } from '../../components/MarkdownRenderer';

export default function IkigaiTool({ onBack }: { onBack: () => void }) {
  const [love, setLove] = useState('');
  const [goodAt, setGoodAt] = useState('');
  const [need, setNeed] = useState('');
  const [pay, setPay] = useState('');
  const [synthesis, setSynthesis] = useState('');
  const [loading, setLoading] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleSynthesize = async () => {
    if (!love || !goodAt || !need || !pay) return;
    setLoading(true);
    try {
      const res = await generateIkigaiSynthesis(love, goodAt, need, pay);
      setSynthesis(res || '');
    } catch (e) {
      setSynthesis('分析中遇到了一些波折，请稍后再试。');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!resultRef.current) return;
    const canvas = await html2canvas(resultRef.current, {
      backgroundColor: '#F0F6FA',
      scale: 2,
    });
    const link = document.createElement('a');
    link.download = `ikigai-${format(new Date(), 'yyyyMMdd')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="text-brand-primary flex items-center gap-2 font-medium text-sm hover:opacity-70 transition-opacity">
          <ArrowLeft size={18} /> 返回深度知己
        </button>
        {synthesis && (
          <button
            onClick={handleDownload}
            className="text-brand-primary flex items-center gap-2 font-medium text-sm hover:opacity-70 transition-opacity bg-brand-hover px-4 py-2 rounded-full"
          >
            <Download size={18} /> 保存结果图
          </button>
        )}
      </div>

      <div ref={resultRef} className="p-8 rounded-[40px] bg-[#F0F6FA] dark:bg-[#0a1628]">
        <header className="space-y-2 mb-8">
          <h2 className="text-3xl font-serif font-medium italic text-brand-ink dark:text-[#e0eaf4]">Ikigai (生之意义) 图谱</h2>
          <p className="text-sm text-brand-secondary dark:text-[#8aa4bc] max-w-2xl">找回与世界对话节奏的探索，锁定最佳职业交集。</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6 print:hidden">
            <IkigaiInput
              label="我热爱的 (Love)"
              placeholder="什么事让你忘记时间？你的热情所在？"
              value={love}
              onChange={setLove}
              color="text-[#EC4899]"
              bgColor="bg-[#FDF2F8]"
            />
            <IkigaiInput
              label="我擅长的 (Good At)"
              placeholder="你的天赋、技能、学识？别人夸你什么？"
              value={goodAt}
              onChange={setGoodAt}
              color="text-[#3B82F6]"
              bgColor="bg-[#EFF6FF]"
            />
            <IkigaiInput
              label="世界需要的 (Need)"
              placeholder="社会有哪些痛点你可以解决？哪些行业在增长？"
              value={need}
              onChange={setNeed}
              color="text-[#22C55E]"
              bgColor="bg-[#F0FDF4]"
            />
            <IkigaiInput
              label="能获报酬的 (Paid For)"
              placeholder="哪些技能可以变现？市场上愿意买单的职位？"
              value={pay}
              onChange={setPay}
              color="text-[#CA8A04]"
              bgColor="bg-[#FEFCE8]"
            />

            <button
              onClick={handleSynthesize}
              disabled={loading || !love || !goodAt || !need || !pay}
              className="w-full py-4 bg-brand-primary text-white rounded-[24px] font-bold custom-shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
              AI 深度合成职业交集
            </button>
          </div>

          <div className="space-y-8">
            <div className="relative w-full aspect-square max-w-[400px] mx-auto flex items-center justify-center">
              <div className={`absolute top-0 w-2/3 h-2/3 rounded-full bg-[rgba(244,114,182,0.2)] border-2 border-[#F472B6] flex items-center justify-center mix-blend-multiply transition-all ${love ? 'opacity-100' : 'opacity-30'}`}>
                <span className="text-[10px] uppercase font-bold text-[#DB2777]">Love</span>
              </div>
              <div className={`absolute left-0 w-2/3 h-2/3 rounded-full bg-[rgba(96,165,250,0.2)] border-2 border-[#60A5FA] flex items-center justify-center mix-blend-multiply transition-all ${goodAt ? 'opacity-100' : 'opacity-30'}`}>
                <span className="text-[10px] uppercase font-bold text-[#2563EB]">Good At</span>
              </div>
              <div className={`absolute right-0 w-2/3 h-2/3 rounded-full bg-[rgba(74,222,128,0.2)] border-2 border-[#4ADE80] flex items-center justify-center mix-blend-multiply transition-all ${need ? 'opacity-100' : 'opacity-30'}`}>
                <span className="text-[10px] uppercase font-bold text-[#16A34A]">Need</span>
              </div>
              <div className={`absolute bottom-0 w-2/3 h-2/3 rounded-full bg-[rgba(250,204,21,0.2)] border-2 border-[#FACC15] flex items-center justify-center mix-blend-multiply transition-all ${pay ? 'opacity-100' : 'opacity-30'}`}>
                <span className="text-[10px] uppercase font-bold text-[#CA8A04]">Paid For</span>
              </div>

              <div className="absolute z-10 w-12 h-12 bg-white dark:bg-[#0f1c2e] rounded-full custom-shadow-lg flex items-center justify-center border-2 border-brand-primary">
                <span className="text-xl">✨</span>
              </div>
            </div>

            <AnimatePresence>
              {synthesis && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-8 bg-white dark:bg-[#0f1c2e] dark:border-[#1e3448] border-[#3B82C44D]"
                >
                  <div className="flex items-center gap-2 text-brand-primary border-b border-brand-divider dark:border-[#1e3448] pb-4 mb-4">
                    <Sparkles size={20} />
                    <h4 className="font-bold">Ikigai 合成报告</h4>
                  </div>
                  <MarkdownRenderer content={synthesis} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
