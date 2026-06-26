import { Trees, Flag, MessageSquare, Sparkles, User } from 'lucide-react';
import { motion } from 'motion/react';

export function ForestPath({ totalJobs, interviewing, offers }: { totalJobs: number; interviewing: number; offers: number }) {
  const steps = Math.min(totalJobs, 12);
  const pathPoints = [
    { x: 50, y: 150 },
    { x: 150, y: 130 },
    { x: 250, y: 160 },
    { x: 350, y: 140 },
    { x: 450, y: 170 },
    { x: 550, y: 150 },
    { x: 650, y: 130 },
    { x: 750, y: 160 },
    { x: 850, y: 140 },
    { x: 950, y: 170 },
    { x: 1050, y: 150 },
    { x: 1150, y: 130 },
  ];

  const currentPos = pathPoints[steps] || pathPoints[pathPoints.length - 1];

  return (
    <div className="glass-card p-10 bg-white dark:bg-[#0f1c2e] dark:border-[#1e3448] overflow-hidden relative min-h-[300px] border-[#E8F0F8]">
      <div className="absolute top-6 left-10 space-y-1 z-10">
        <h3 className="text-xl font-serif font-medium text-brand-ink dark:text-[#e0eaf4] italic flex items-center gap-2">
          探索之径 <Trees className="text-brand-primary" size={20} />
        </h3>
        <p className="text-[10px] text-brand-secondary dark:text-[#8aa4bc] font-bold uppercase tracking-[0.2em]">每个足迹都是一次向内的沉淀与向外的伸手</p>
      </div>

      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <Trees className="absolute top-10 right-20 text-brand-primary" size={60} />
        <Trees className="absolute bottom-10 left-40 text-brand-primary" size={80} />
        <Trees className="absolute top-40 left-10 text-brand-primary" size={40} />
      </div>

      <div className="relative w-full h-full mt-10 overflow-x-auto pb-10 custom-scrollbar">
        <div className="min-w-[1200px] h-[200px] relative">
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1200 200">
            <path
              d="M 50 150 C 150 130, 250 160, 350 140 C 450 170, 550 150, 650 130 C 750 160, 850 140, 950 170 C 1050 150, 1150 130, 1150 130"
              fill="none"
              stroke="#E8F0F8"
              strokeWidth="24"
              strokeLinecap="round"
            />
            <path
              d="M 50 150 C 150 130, 250 160, 350 140 C 450 170, 550 150, 650 130 C 750 160, 850 140, 950 170 C 1050 150, 1150 130, 1150 130"
              fill="none"
              stroke="#3B82C4"
              strokeWidth="2"
              strokeDasharray="8 8"
              opacity="0.3"
            />

            {pathPoints.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="4" fill={i <= steps ? "#3B82C4" : "#D1D5DB"} opacity={i <= steps ? 1 : 0.5} />
            ))}

            <foreignObject x={330} y={90} width="40" height="40">
              <div className={`p-2 rounded-full border border-dashed ${totalJobs >= 4 ? 'bg-brand-primary text-white border-transparent' : 'bg-brand-surface text-brand-muted border-brand-divider'}`}>
                <Flag size={14} />
              </div>
            </foreignObject>
            <foreignObject x={630} y={80} width="40" height="40">
              <div className={`p-2 rounded-full border border-dashed ${interviewing > 0 ? 'bg-brand-primary text-white border-transparent' : 'bg-brand-surface text-brand-muted border-brand-divider'}`}>
                <MessageSquare size={14} />
              </div>
            </foreignObject>
            <foreignObject x={1130} y={80} width="40" height="40">
              <div className={`p-2 rounded-full border border-dashed ${offers > 0 ? 'bg-[#16A34A] text-white border-transparent' : 'bg-brand-surface text-brand-muted border-brand-divider'}`}>
                <Sparkles size={14} />
              </div>
            </foreignObject>
          </svg>

          <motion.div
            animate={{ left: currentPos.x - 24, top: currentPos.y - 48 }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
            className="absolute z-20"
          >
            <div className="relative">
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-brand-ink text-white text-[9px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                已步入第 {totalJobs} 份可能
              </div>

              <div className="w-12 h-12 flex flex-col items-center">
                <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white">
                  <User size={16} />
                </div>
                <div className="w-0.5 h-3 bg-brand-primary opacity-40"></div>
              </div>
            </div>
          </motion.div>

          <div className="absolute bottom-6 left-10 text-[9px] font-bold text-brand-muted dark:text-[#5a7a96] uppercase tracking-widest italic">
            起点：第一场对话
          </div>
          <div className="absolute bottom-6 right-10 text-[9px] font-bold text-brand-muted dark:text-[#5a7a96] uppercase tracking-widest italic text-right">
            终点：理想的彼岸
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between items-end border-t border-[#E8F0F8] dark:border-[#1e3448] pt-6">
        <div className="flex gap-8">
          <div className="space-y-1">
            <span className="text-[10px] text-brand-muted dark:text-[#5a7a96] uppercase tracking-widest font-bold">累计里程</span>
            <p className="text-xl font-serif italic text-brand-ink dark:text-[#e0eaf4]">{totalJobs} 份简历</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-brand-muted dark:text-[#5a7a96] uppercase tracking-widest font-bold">获得回响</span>
            <p className="text-xl font-serif italic text-brand-ink dark:text-[#e0eaf4]">{interviewing} 场面试</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-brand-muted dark:text-[#5a7a96] uppercase tracking-widest font-bold">抵达站台</span>
            <p className="text-xl font-serif italic text-brand-ink dark:text-[#e0eaf4]">{offers} 个 Offer</p>
          </div>
        </div>
        <div className="text-[10px] text-brand-muted dark:text-[#5a7a96] italic max-w-xs text-right">
          "步子慢一点没关系，只要你还在林间穿行。每一份被投出的简历，都是一封寄往未来的信。"
        </div>
      </div>
    </div>
  );
}
