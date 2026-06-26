import { useState, useRef } from 'react';
import { ArrowLeft, Download, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import html2canvas from 'html2canvas';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export default function CareerAnchorsTool({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<'intro' | 'test' | 'result'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({
    TF: 0, GM: 0, AU: 0, SE: 0, EC: 0, SV: 0, CH: 0, LS: 0
  });
  const resultRef = useRef<HTMLDivElement>(null);

  const questions = [
    { text: "我希望能在一个领域内不仅是专家，还是权威", type: "TF" },
    { text: "我致力于通过组织和管理他人来获得成果", type: "GM" },
    { text: "对我而言，能够按自己的意愿安排工作至关重要", type: "AU" },
    { text: "稳定的收入和长期的职业保障感是我追求的目标", type: "SE" },
    { text: "我渴望通过建立自己的新公司或项目来展现创造力", type: "EC" },
    { text: "我希望我的工作能为改善社会或帮助他人做出贡献", type: "SV" },
    { text: "解决极具挑战性的、看似不可能的问题让我很有动力", type: "CH" },
    { text: "能够平衡职业发展和家庭生活是我最关心的", type: "LS" },
    { text: "我追求的是不断精进自己的专业技术和职能专长", type: "TF" },
    { text: "在职业生涯中，我更愿意承担更多的管理和领导职责", type: "GM" },
    { text: "我讨厌被过多的条条框框束缚，喜欢独立自主", type: "AU" },
    { text: "即使在变化的环境中，我也倾向于保持就业的稳定性", type: "SE" },
    { text: "能够独自启动并经营属于自己的事业非常有吸引力", type: "EC" },
    { text: "我追求的是能与我个人价值观相一致的工作", type: "SV" },
    { text: "竞争激烈的环境和克服巨大困难最能激发我的潜能", type: "CH" },
    { text: "如果工作影响了我个人生活的闲暇，我会感到很不满", type: "LS" },
    { text: "我更喜欢专注于某一具体领域的深度研究或实操", type: "TF" },
    { text: "我能在协调各部门利益并达成整体目标时找到满足感", type: "GM" },
    { text: "我愿意通过放弃高薪来换取更多的个人自由", type: "AU" },
    { text: "我渴望找到一个能让我'定居'并感觉安全的企业", type: "SE" },
    { text: "我喜欢将我的个人创意转化为有商业价值的成果", type: "EC" },
    { text: "相比于晋升，我更关注我的工作是否产生了正面影响", type: "SV" },
    { text: "对我来说，平淡的工作很难持久，我需要刺激与挑战", type: "CH" },
    { text: "工作的核心目的是为了支持我追求自己喜欢的生活方式", type: "LS" }
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
    setScores({ TF: 0, GM: 0, AU: 0, SE: 0, EC: 0, SV: 0, CH: 0, LS: 0 });
  };

  const chartData = [
    { subject: '技术/职能', A: scores.TF },
    { subject: '管理型', A: scores.GM },
    { subject: '自主/独立', A: scores.AU },
    { subject: '安全/稳定', A: scores.SE },
    { subject: '创业创造', A: scores.EC },
    { subject: '服务型', A: scores.SV },
    { subject: '挑战型', A: scores.CH },
    { subject: '生活型', A: scores.LS },
  ];

  const sortedResults = (Object.entries(scores) as [string, number][])
    .sort((a, b) => b[1] - a[1])
    .map(([key, value]) => ({ key, value }));

  const anchorDetails: Record<string, { title: string; desc: string }> = {
    TF: { title: "技术/职能型 (TF)", desc: "核心追求是专业领域内的精进。你视自己为某个领域的专家，成就感源于解决领域内的核心技术问题。" },
    GM: { title: "管理型 (GM)", desc: "核心追求是将各方资源捏合起来达成组织目标。你擅长决策、协调，比起单纯的专家，你更享受统筹全局的过程。" },
    AU: { title: "自主/独立型 (AU)", desc: "核心追求是自由。你难以忍受传统的组织约束，倾向于能够按照自己的节奏、方式和地点来开展工作。" },
    SE: { title: "安全/稳定型 (SE)", desc: "核心追求是安稳与可预测性。你更看重长期的雇佣关系、成熟的福利体系以及地理位置的稳定性。" },
    EC: { title: "创业/创造型 (EC)", desc: "核心追求是'属于自己的事业'。你并不一定追求高层管理，但你渴望创造出一个带有你个人印记的新事务。" },
    SV: { title: "服务/奉献型 (SV)", desc: "核心追求是'利他'。你重视工作的意义感和对他人的正面贡献，往往会为了使命感而牺牲一定的物质利益。" },
    CH: { title: "纯粹挑战型 (CH)", desc: "核心追求是克服困难。平庸的生活会让你窒息，你喜欢在不可能中寻找可能，竞争和战胜巨大的挑战是你的原动力。" },
    LS: { title: "生活平衡型 (LS)", desc: "核心追求是'生活质量'。工作只是生活的一部分，你寻求的是一种能将职业发展、家庭和个人爱好完美融合的方式。" }
  };

  const handleDownload = async () => {
    if (!resultRef.current) return;
    const canvas = await html2canvas(resultRef.current, {
      backgroundColor: '#F0F6FA',
      scale: 2,
    });
    const link = document.createElement('a');
    link.download = `career-anchors-${format(new Date(), 'yyyyMMdd')}.png`;
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
            <Download size={18} /> 保存职业锚报告
          </button>
        )}
      </div>

      <div ref={resultRef} className="p-8 rounded-[40px] bg-[#F0F6FA] dark:bg-[#0a1628]">
        <header className="space-y-2 mb-8">
          <h2 className="text-3xl font-serif font-medium italic text-brand-ink dark:text-[#e0eaf4]">埃德加·施恩职业锚测试</h2>
          <p className="text-sm text-brand-secondary dark:text-[#8aa4bc] max-w-2xl">识别你"不愿放弃"的核心观，锁定最符合你底层动机的职位。</p>
        </header>

        {step === 'intro' && (
          <div className="glass-card p-10 bg-white dark:bg-[#0f1c2e] dark:border-[#1e3448] space-y-6 text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-brand-hover rounded-full flex items-center justify-center mx-auto text-brand-primary">
              <MapPin size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-brand-ink dark:text-[#e0eaf4]">找到你的职业"定海神针"</h3>
              <p className="text-sm text-brand-secondary dark:text-[#8aa4bc] leading-relaxed italic">
                职业锚是你内心最真实的动机与价值观的组合。<br />请根据你在真实的职场场景中的偏好进行评分。
              </p>
            </div>
            <button
              onClick={() => setStep('test')}
              className="px-10 py-4 bg-brand-primary text-white rounded-full font-bold custom-shadow-lg hover:-translate-y-1 transition-all"
            >
              开启锚点探索
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

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {[3, 2, 1, 0].map((val) => (
                  <button
                    key={val}
                    onClick={() => handleAnswer(val)}
                    className="p-6 bg-white dark:bg-[#0f1c2e] border border-brand-divider dark:border-[#1e3448] rounded-3xl hover:border-brand-primary hover:bg-brand-hover transition-all font-bold text-brand-ink dark:text-[#e0eaf4]"
                  >
                    {val === 3 ? "非常认同" : val === 2 ? "比较认同" : val === 1 ? "部分认同" : "完全不认同"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 'result' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-6">
              <div className="glass-card p-8 bg-white dark:bg-[#0f1c2e] dark:border-[#1e3448] space-y-6">
                <h3 className="text-2xl font-serif font-bold text-brand-ink dark:text-[#e0eaf4] italic">职业锚测评结果</h3>
                <div className="space-y-5">
                  {sortedResults.slice(0, 3).map((res, idx) => (
                    <div key={idx} className={`p-6 rounded-3xl transition-all border ${idx === 0 ? 'bg-[#3B82C40D] border-brand-primary' : 'bg-white dark:bg-[#0f1c2e] border-brand-divider dark:border-[#1e3448]'}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-sm font-bold uppercase tracking-widest ${idx === 0 ? 'text-brand-primary' : 'text-brand-muted dark:text-[#5a7a96]'}`}>顶级锚点 {idx + 1}</span>
                        <span className="font-mono font-bold text-brand-ink dark:text-[#e0eaf4]">{res.value} pts</span>
                      </div>
                      <h4 className="text-lg font-bold text-brand-ink dark:text-[#e0eaf4] mb-2">{anchorDetails[res.key].title}</h4>
                      <p className="text-xs text-brand-secondary dark:text-[#8aa4bc] leading-relaxed serif italic">
                        {anchorDetails[res.key].desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="glass-card p-4 bg-white dark:bg-[#0f1c2e] dark:border-[#1e3448] aspect-square flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#6B8BA4', fontSize: 10, fontWeight: 500 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 9]} tick={false} axisLine={false} />
                    <Radar
                      name="Anchor Score"
                      dataKey="A"
                      stroke="#3B82C4"
                      fill="#3B82C4"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="p-8 bg-brand-primary text-white rounded-[40px] custom-shadow-sm italic text-sm">
                💡 <strong>反思</strong>：在这个 Gap 期，重新审视你的锚点。如果你的前任工作与你的顶级锚点背道而驰，这可能就是疲惫感的主因。在下一步投递中，请务必寻找能承载你"锚点"的容器。
              </div>

              <button
                onClick={reset}
                className="w-full py-4 text-xs font-bold uppercase tracking-widest text-[#94ACC0] hover:text-brand-primary transition-colors border-t border-[#E4EDF5] dark:border-[#1e3448]"
              >
                重新测验
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
