import { useState, useRef } from 'react';
import { ArrowLeft, Download, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import html2canvas from 'html2canvas';

export default function StrengthsTool({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<'intro' | 'test' | 'result'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({
    E: 0, I: 0, R: 0, S: 0
  });
  const resultRef = useRef<HTMLDivElement>(null);

  const questions = [
    { text: "我喜欢制定详细的计划并严格执行", type: "E" },
    { text: "我更倾向于直接指出问题并推动解决", type: "E" },
    { text: "完成待办清单上的任务让我非常有成就感", type: "E" },
    { text: "我非常看重准时和规则的严谨性", type: "E" },
    { text: "我喜欢掌控局面并带领他人实现目标", type: "I" },
    { text: "我不怕站在人群面前表达自己的观点", type: "I" },
    { text: "说服他人接受我的想法让我很有动力", type: "I" },
    { text: "我喜欢结识新朋友并给他们留下深刻印象", type: "I" },
    { text: "我非常在意他人的感受和需求", type: "R" },
    { text: "建立深厚的人际关系比单纯完成任务更重要", type: "R" },
    { text: "我喜欢在一个和谐、合作的团队中工作", type: "R" },
    { text: "我能轻易察觉到他人情绪的变化", type: "R" },
    { text: "我喜欢分析数据并预测未来的趋势", type: "S" },
    { text: "面对复杂问题，我总能找到多种解决方案", type: "S" },
    { text: "我经常思考\u201C如果...会怎样\u201D的可能性", type: "S" },
    { text: "我对事物的底层逻辑和运行模式非常着迷", type: "S" },
    { text: "我喜欢独立思考并追求卓越的质量", type: "E" },
    { text: "为了达到目标，我可以非常坚韧不拔", type: "E" },
    { text: "向他人展示成果并获得认可很重要", type: "I" },
    { text: "我能很好地平衡团队中不同人的利益", type: "R" }
  ];

  const handleAnswer = (val: number) => {
    const q = questions[currentQuestion];
    setScores(prev => ({ ...prev, [q.type]: prev[q.type] + val }));

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStep('result');
    }
  };

  const reset = () => {
    setStep('intro');
    setCurrentQuestion(0);
    setScores({ E: 0, I: 0, R: 0, S: 0 });
  };

  const handleDownload = async () => {
    if (!resultRef.current) return;
    const canvas = await html2canvas(resultRef.current, {
      backgroundColor: '#F0F6FA',
      scale: 2,
    });
    const link = document.createElement('a');
    link.download = `strengths-${format(new Date(), 'yyyyMMdd')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const domainData = [
    { name: '执行力 (Executing)', score: scores.E, color: '#4B5563', desc: '将想法转化为现实，高效完成任务。' },
    { name: '影响力 (Influencing)', score: scores.I, color: '#B45309', desc: '掌控局势、说服他人并产生影响。' },
    { name: '关系建立 (Relationship)', score: scores.R, color: '#059669', desc: '建立深厚的联系，凝聚团队力量。' },
    { name: '战略思考 (Strategic)', score: scores.S, color: '#2563EB', desc: '分析信息、思考未来并制定方案。' }
  ];

  const topDomain = [...domainData].sort((a, b) => b.score - a.score)[0];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="text-brand-primary flex items-center gap-2 font-medium text-sm hover:opacity-70 transition-opacity">
          <ArrowLeft size={18} /> 返回深度知己
        </button>
        {step === 'result' && (
          <button
            onClick={handleDownload}
            className="text-brand-primary flex items-center gap-2 font-medium text-sm hover:opacity-70 transition-opacity bg-brand-hover px-4 py-2 rounded-full"
          >
            <Download size={18} /> 保存天赋报告
          </button>
        )}
      </div>

      <div ref={resultRef} className="p-8 rounded-[40px] bg-[#F0F6FA] dark:bg-[#0a1628]">
        <header className="space-y-2 mb-8">
          <h2 className="text-3xl font-serif font-medium italic text-brand-ink dark:text-[#e0eaf4]">盖洛普优势识别初步测评</h2>
          <p className="text-sm text-brand-secondary dark:text-[#8aa4bc] max-w-2xl">探索你的四大天赋领域，发掘你独特的天生才干。</p>
        </header>

        {step === 'intro' && (
          <div className="glass-card p-10 bg-white dark:bg-[#0f1c2e] dark:border-[#1e3448] space-y-6 text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-brand-hover rounded-full flex items-center justify-center mx-auto text-brand-primary">
              <Sparkles size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-brand-ink dark:text-[#e0eaf4]">发现你的"天赋原动力"</h3>
              <p className="text-sm text-brand-secondary dark:text-[#8aa4bc] leading-relaxed italic">
                本测验包含 20 个关于行为偏好的简短问题。<br />请根据你最真实、最自然的状态进行选择。
              </p>
            </div>
            <button
              onClick={() => setStep('test')}
              className="px-10 py-4 bg-brand-primary text-white rounded-full font-bold custom-shadow-lg hover:-translate-y-1 transition-all"
            >
              启动赋能测验
            </button>
          </div>
        )}

        {step === 'test' && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="w-full h-1.5 bg-brand-divider dark:bg-[#1e3448] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-brand-primary"
                initial={{ width: 0 }}
                animate={{ width: `${(currentQuestion / questions.length) * 100}%` }}
              />
            </div>

            <div className="text-center space-y-8">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary italic">Statement {currentQuestion + 1} of {questions.length}</span>
              <h3 className="text-2xl md:text-3xl font-serif text-brand-ink dark:text-[#e0eaf4] italic leading-snug">
                {questions[currentQuestion].text}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => handleAnswer(2)}
                  className="p-6 bg-white dark:bg-[#0f1c2e] border border-brand-divider dark:border-[#1e3448] rounded-3xl hover:border-brand-primary hover:bg-brand-hover transition-all font-bold text-brand-ink dark:text-[#e0eaf4]"
                >
                  非常符合 (+2)
                </button>
                <button
                  onClick={() => handleAnswer(1)}
                  className="p-6 bg-white dark:bg-[#0f1c2e] border border-brand-divider dark:border-[#1e3448] rounded-3xl hover:border-brand-primary hover:bg-brand-hover transition-all font-bold text-brand-ink dark:text-[#e0eaf4]"
                >
                  基本符合 (+1)
                </button>
                <button
                  onClick={() => handleAnswer(0)}
                  className="p-6 bg-white dark:bg-[#0f1c2e] border border-brand-divider dark:border-[#1e3448] rounded-3xl hover:border-brand-primary hover:bg-brand-hover transition-all font-bold text-brand-ink dark:text-[#e0eaf4]"
                >
                  不太符合 (+0)
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'result' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="glass-card p-8 bg-white dark:bg-[#0f1c2e] dark:border-[#1e3448] space-y-6">
                  <h3 className="text-2xl font-serif font-bold text-brand-ink dark:text-[#e0eaf4] italic">天赋领域分布图</h3>
                  <div className="space-y-6">
                    {domainData.map((d, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                          <span className="text-brand-ink dark:text-[#e0eaf4]">{d.name}</span>
                          <span className="font-mono" style={{ color: d.color }}>{((d.score / 10) * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full h-2 bg-brand-divider dark:bg-[#1e3448] rounded-full overflow-hidden">
                          <motion.div
                            className="h-full"
                            style={{ backgroundColor: d.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${(d.score / 10) * 100}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-brand-secondary dark:text-[#8aa4bc] italic">{d.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="glass-card p-8 bg-brand-primary text-white space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#ffffff33] rounded-lg">
                      <Sparkles size={24} />
                    </div>
                    <h4 className="text-xl font-bold italic">主导天赋：{topDomain.name.split(' ')[0]}</h4>
                  </div>
                  <p className="text-sm leading-relaxed serif italic opacity-90">
                    你的核心优势在于"{topDomain.name}"。这意味着你天生具备强大的{topDomain.desc}。在求职中，你应该重点寻找那些能让你发挥这一才干的岗位。
                  </p>
                  <div className="pt-4 border-t border-[#ffffff33] text-xs">
                    💡 <strong>建议</strong>：将你的优势写在简历的"个人总结"中，并用具体的案例（STAR原则）来支撑它。
                  </div>
                </div>

                <div className="glass-card p-8 bg-white dark:bg-[#0f1c2e] dark:border-[#1e3448] border-brand-divider">
                  <h5 className="font-bold text-brand-ink dark:text-[#e0eaf4] mb-2">如何使用这份报告？</h5>
                  <ul className="space-y-2 text-xs text-brand-secondary dark:text-[#8aa4bc] leading-relaxed list-disc pl-4">
                    <li><strong>自我肯定</strong>：专注于你的高分项，这是你的"超级力量"。</li>
                    <li><strong>职业对齐</strong>：分析你目前投递的岗位，是否需要这些天赋？</li>
                    <li><strong>面试叙事</strong>：在面试时，用这些词汇来精准描述你的竞争力。</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              onClick={reset}
              className="w-full py-4 text-xs font-bold uppercase tracking-widest text-brand-muted dark:text-[#5a7a96] hover:text-brand-primary transition-colors border-t border-brand-divider dark:border-[#1e3448]"
            >
              重新测验
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
