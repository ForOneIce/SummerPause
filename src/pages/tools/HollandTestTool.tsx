import { useState, useRef } from 'react';
import { ArrowLeft, Download, Compass } from 'lucide-react';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import html2canvas from 'html2canvas';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export default function HollandTestTool({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<'intro' | 'test' | 'result'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({
    R: 0, I: 0, A: 0, S: 0, E: 0, C: 0
  });
  const resultRef = useRef<HTMLDivElement>(null);

  const questions = [
    { text: "修理或装置电器零件", type: "R" },
    { text: "修理机械器具", type: "R" },
    { text: "使用木工工具制造或修理家具等", type: "R" },
    { text: "在农庄工作，种植植物或饲养动物", type: "R" },
    { text: "从事户外体力工作", type: "R" },
    { text: "做科学实验，研究物质的特性", type: "I" },
    { text: "阅读科学性或技术性的书籍、杂志", type: "I" },
    { text: "研究或试图解决数学问题", type: "I" },
    { text: "编写电脑程序", type: "I" },
    { text: "对自然界的奥秘感兴趣", type: "I" },
    { text: "素描、绘图或油画", type: "A" },
    { text: "学习乐器或参加合唱团", type: "A" },
    { text: "创作诗、小说、文章或剧本", type: "A" },
    { text: "表演短剧、话剧或舞台剧", type: "A" },
    { text: "设计时装、海报或室内装饰", type: "A" },
    { text: "向他人解释一些困难的事", type: "S" },
    { text: "训练他人或辅导学生学习", type: "S" },
    { text: "乐于助人并为他人提供服务", type: "S" },
    { text: "参加社团活动或志愿者项目", type: "S" },
    { text: "对心理学或人际关系感兴趣", type: "S" },
    { text: "说服他人接受自己的观点", type: "E" },
    { text: "策划、安排并领导一些活动", type: "E" },
    { text: "在团队中担任领导者角色", type: "E" },
    { text: "推销某种商品或服务", type: "E" },
    { text: "对经营管理或创业感兴趣", type: "E" },
    { text: "负责文职工作、整理文件资料", type: "C" },
    { text: "按照详细的计划或流程工作", type: "C" },
    { text: "处理财务报表、计算开支", type: "C" },
    { text: "在一个固定的办公室内工作", type: "C" },
    { text: "对追求效率与准确性感兴趣", type: "C" }
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
    setScores({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 });
  };

  const chartData = [
    { subject: '现实型 (R)', A: scores.R },
    { subject: '研究型 (I)', A: scores.I },
    { subject: '艺术型 (A)', A: scores.A },
    { subject: '社会型 (S)', A: scores.S },
    { subject: '企业型 (E)', A: scores.E },
    { subject: '常规型 (C)', A: scores.C },
  ];

  const resultType = (Object.entries(scores) as [string, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(i => i[0])
    .join("");

  const typeDescriptions: Record<string, string> = {
    R: "现实型：擅长使用机器工具，喜欢户外活动和体力劳动。",
    I: "研究型：喜欢观察、学习、研究和分析，追求真理。",
    A: "艺术型：富有想象力和创造力，追求美感，讨厌条条框框。",
    S: "社会型：愿意帮助、指导或教育他人，关注人与人的连接。",
    E: "企业型：喜欢领导和说服他人，追求地位、权力和物质成就。",
    C: "常规型：喜欢有计划地做事情，注重细节、准确和高效。"
  };

  const handleDownload = async () => {
    if (!resultRef.current) return;
    const canvas = await html2canvas(resultRef.current, {
      backgroundColor: '#F0F6FA',
      scale: 2,
    });
    const link = document.createElement('a');
    link.download = `riasec-${format(new Date(), 'yyyyMMdd')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

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
            <Download size={18} /> 保存结果图
          </button>
        )}
      </div>

      <div ref={resultRef} className="p-8 rounded-[40px] bg-[#F0F6FA] dark:bg-[#0a1628]">
        <header className="space-y-2 mb-8">
          <h2 className="text-3xl font-serif font-medium italic text-brand-ink dark:text-[#e0eaf4]">霍兰德职业兴趣测试 (RIASEC)</h2>
          <p className="text-sm text-brand-secondary dark:text-[#8aa4bc] max-w-2xl">发现你的职业兴趣基因，找到让你更有激情的工作领域。</p>
        </header>

        {step === 'intro' && (
          <div className="glass-card p-10 bg-white dark:bg-[#0f1c2e] dark:border-[#1e3448] space-y-6 text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-brand-hover rounded-full flex items-center justify-center mx-auto text-brand-primary">
              <Compass size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-brand-ink dark:text-[#e0eaf4]">准备好探索内心了吗？</h3>
              <p className="text-sm text-brand-secondary dark:text-[#8aa4bc] leading-relaxed italic">
                这个测试包含 30 个关于工作活动的问题。<br />不需要过多思考，凭第一反应选择。
              </p>
            </div>
            <button
              onClick={() => setStep('test')}
              className="px-10 py-4 bg-brand-primary text-white rounded-full font-bold custom-shadow-lg hover:-translate-y-1 transition-all"
            >
              开启探索测验
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
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary italic">Question {currentQuestion + 1} of {questions.length}</span>
              <h3 className="text-2xl md:text-3xl font-serif text-brand-ink dark:text-[#e0eaf4] italic leading-snug">
                你是否喜欢：{questions[currentQuestion].text}?
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => handleAnswer(2)}
                  className="p-6 bg-white dark:bg-[#0f1c2e] border border-brand-divider dark:border-[#1e3448] rounded-3xl hover:border-brand-primary hover:bg-brand-hover transition-all font-bold text-brand-ink dark:text-[#e0eaf4]"
                >
                  很喜欢 (+2)
                </button>
                <button
                  onClick={() => handleAnswer(1)}
                  className="p-6 bg-white dark:bg-[#0f1c2e] border border-brand-divider dark:border-[#1e3448] rounded-3xl hover:border-brand-primary hover:bg-brand-hover transition-all font-bold text-brand-ink dark:text-[#e0eaf4]"
                >
                  还可以 (+1)
                </button>
                <button
                  onClick={() => handleAnswer(0)}
                  className="p-6 bg-white dark:bg-[#0f1c2e] border border-brand-divider dark:border-[#1e3448] rounded-3xl hover:border-brand-primary hover:bg-brand-hover transition-all font-bold text-brand-ink dark:text-[#e0eaf4]"
                >
                  没兴趣 (+0)
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'result' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-6">
              <div className="glass-card p-8 bg-white dark:bg-[#0f1c2e] dark:border-[#1e3448] space-y-6">
                <h3 className="text-2xl font-serif font-bold text-brand-ink dark:text-[#e0eaf4] italic">测验结果报告</h3>
                <div className="inline-block px-4 py-2 bg-brand-primary text-white rounded-full font-mono font-bold tracking-widest text-xl">
                  Code: {resultType}
                </div>
                <p className="text-sm text-brand-secondary dark:text-[#8aa4bc] leading-relaxed">
                  根据测试，你的职业兴趣主要集中在以下三个领域。这反映了你最核心的职业偏好与潜力。
                </p>

                <div className="space-y-4 pt-4">
                  {resultType.split("").map((t, idx) => (
                    <div key={idx} className="flex gap-4 items-start border-l-2 border-brand-divider dark:border-[#1e3448] pl-4 hover:border-brand-primary transition-colors">
                      <span className="text-2xl font-serif italic text-brand-primary font-bold">{t}</span>
                      <p className="text-sm text-brand-ink dark:text-[#e0eaf4] font-medium leading-relaxed">{typeDescriptions[t]}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={reset}
                  className="mt-8 text-xs font-bold uppercase tracking-widest text-brand-muted dark:text-[#5a7a96] hover:text-brand-primary transition-colors border-t border-brand-divider dark:border-[#1e3448] pt-6 w-full text-center"
                >
                  重新测验
                </button>
              </div>
            </div>

            <div className="space-y-8">
              <div className="glass-card p-4 bg-white dark:bg-[#0f1c2e] dark:border-[#1e3448] aspect-square flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#6B8BA4', fontSize: 12, fontWeight: 500 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                    <Radar
                      name="Interest"
                      dataKey="A"
                      stroke="#3B82C4"
                      fill="#3B82C4"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="p-8 bg-brand-primary text-white rounded-[40px] custom-shadow-sm italic text-sm">
                💡 <strong>小贴士</strong>：RIASEC 结果不是终点，而是起点。它能帮你缩小行业选择的范围。例如如果你 A (艺术型) 很高，也许那些需要高度创造力和自由度的岗位会让你更有成就感。
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
