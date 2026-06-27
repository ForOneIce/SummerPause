import { useState, useEffect, useCallback } from 'react';
import { MessageSquareHeart, Sparkles, Coffee, Heart, Headphones, ChevronDown, RefreshCw, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { GAP_ENCOURAGEMENTS } from '../data/encouragements';
import { PODCAST_EPISODES } from '../data/podcasts';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { pickRandomEncouragement, getDailyEncouragementIndex } from '../lib/driftBottle';
import type { PodcastEpisode } from '../types';

export default function Dashboard() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [quote, setQuote] = useState(GAP_ENCOURAGEMENTS[0]);
  const [fadeIn, setFadeIn] = useState(false);
  const [seenIndices, setSeenIndices] = useLocalStorage<number[]>('summer_drift_bottle_seen', []);

  useEffect(() => {
    const todayIndex = getDailyEncouragementIndex(GAP_ENCOURAGEMENTS.length);
    setQuoteIndex(todayIndex);
    setQuote(GAP_ENCOURAGEMENTS[todayIndex]);
    setSeenIndices(prev => (prev.includes(todayIndex) ? prev : [...prev, todayIndex]));
    setTimeout(() => setFadeIn(true), 100);
  }, []);

  const handleRefresh = useCallback(() => {
    setFadeIn(false);
    setTimeout(() => {
      const { index, seenIndices: nextSeen } = pickRandomEncouragement(
        quoteIndex,
        GAP_ENCOURAGEMENTS.length,
        seenIndices
      );
      setQuoteIndex(index);
      setQuote(GAP_ENCOURAGEMENTS[index]);
      setSeenIndices(nextSeen);
      setFadeIn(true);
    }, 300);
  }, [quoteIndex, seenIndices, setSeenIndices]);

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h2 className="text-3xl md:text-4xl font-serif font-light text-brand-ink dark:text-[#e0eaf4] leading-tight">
          <span className="text-brand-primary italic block">You are in Your Time Zone</span>
        </h2>
        <p className="text-brand-secondary dark:text-[#8aa4bc] leading-relaxed max-w-xl text-sm">
          求职不是一场必须按时完成的赛跑，而是找回与世界对话节奏的探索。在这里，没有未完成的焦虑，只有与当下的共振。
        </p>
      </header>

      <div className="max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative group mr-4"
        >
          <div className="absolute inset-0 bg-white dark:bg-[#0f1c2e] shadow-sm border border-brand-divider dark:border-[#1e3448] -rotate-1 rounded-sm translate-y-1 translate-x-1 group-hover:rotate-0 transition-transform duration-500"></div>

          <div className="relative glass-card p-10 space-y-6 overflow-hidden bg-gradient-to-br from-[#E8F4FD] to-[#F0F6FA] dark:from-[#0a1628] dark:to-[#0f1c2e] border-brand-divider dark:border-[#1e3448] border-t-0 shadow-lg min-h-[260px] flex flex-col justify-center">
            <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, #3B82C4 1px, transparent 1px), radial-gradient(circle at 80% 20%, #3B82C4 0.5px, transparent 0.5px)', backgroundSize: '60px 60px, 40px 40px' }}></div>

            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2 text-brand-primary opacity-70">
                <MessageSquareHeart size={16} />
                <span className="text-[9px] font-bold uppercase tracking-[0.3em]">漂流瓶 • Drift Bottle</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-[10px] text-brand-muted dark:text-[#5a7a96] font-serif italic opacity-40">
                  {format(new Date(), 'MMM dd, yyyy')}
                </div>
                <button
                  onClick={handleRefresh}
                  className="p-1.5 rounded-full hover:bg-brand-hover text-brand-muted dark:text-[#5a7a96] hover:text-brand-primary transition-all"
                  title="换一条"
                >
                  <Sparkles size={14} />
                </button>
              </div>
            </div>

            <div className="relative z-10 flex-1 flex items-center">
              <div
                className={`transition-all duration-500 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
              >
                <p className="text-2xl md:text-3xl leading-relaxed text-brand-ink dark:text-[#e0eaf4] font-handwriting tracking-wide">
                  {quote.text}
                </p>

                {quote.source && (
                  <p className="mt-4 text-sm text-brand-secondary dark:text-[#8aa4bc] font-serif italic text-right">
                    —— {quote.source}
                  </p>
                )}

                <div className="mt-6 flex justify-end">
                  <div className="w-8 h-8 rounded-full border-2 border-brand-primary/20 flex items-center justify-center -rotate-12 bg-white/50 dark:bg-[#0f1c2e]/50 backdrop-blur-sm">
                    <Coffee size={14} className="text-brand-primary/40" />
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-4 right-4 p-4 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity -rotate-12 group-hover:rotate-0 duration-700">
              <Heart size={140} />
            </div>

            <div className="absolute -top-6 -left-6 w-24 h-24 bg-brand-primary/5 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl"></div>
          </div>
        </motion.div>
      </div>

      {/* Podcast Capsule */}
      <PodcastCapsule />
    </div>
  );
}

function PodcastCapsule() {
  const [episode, setEpisode] = useState<PodcastEpisode>(() =>
    PODCAST_EPISODES[Math.floor(Math.random() * PODCAST_EPISODES.length)]
  );
  const [favPodcasts, setFavPodcasts] = useLocalStorage<string[]>('summer_fav_podcasts', []);
  const [showFavs, setShowFavs] = useState(false);

  const refreshEpisode = () => {
    let next: PodcastEpisode;
    do {
      next = PODCAST_EPISODES[Math.floor(Math.random() * PODCAST_EPISODES.length)];
    } while (next.url === episode.url && PODCAST_EPISODES.length > 1);
    setEpisode(next);
  };

  const isFaved = favPodcasts.includes(episode.url);

  const toggleFav = () => {
    if (isFaved) {
      setFavPodcasts(prev => prev.filter(u => u !== episode.url));
    } else {
      setFavPodcasts(prev => [...prev, episode.url]);
    }
  };

  const favEpisodes = PODCAST_EPISODES.filter(ep => favPodcasts.includes(ep.url));

  return (
    <div className="max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="bg-white/70 dark:bg-[#0f1c2e]/70 backdrop-blur-xl border border-white/20 dark:border-[#1e3448]/60 rounded-[32px] p-8 space-y-5 shadow-lg relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 opacity-[0.04]">
            <Headphones size={120} />
          </div>

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2 text-brand-primary">
              <Headphones size={16} />
              <span className="text-[9px] font-bold uppercase tracking-[0.3em]">播客胶囊 • Podcast Capsule</span>
            </div>
            <button
              onClick={refreshEpisode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold text-brand-secondary dark:text-[#8aa4bc] hover:text-brand-primary hover:bg-brand-hover transition-all"
            >
              <RefreshCw size={12} />
              换一期
            </button>
          </div>

          <div className="relative z-10 space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-1 space-y-2">
                <h4 className="text-base font-bold text-brand-ink dark:text-[#e0eaf4] leading-snug">{episode.title}</h4>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] text-brand-secondary dark:text-[#8aa4bc] font-medium">{episode.show}</span>
                  <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                    episode.category === 'gap'
                      ? 'bg-brand-hover text-brand-primary'
                      : 'bg-[#FDF2F8] dark:bg-[#2a1a2e] text-[#EC4899]'
                  }`}>
                    {episode.category === 'gap' ? 'gap经验' : '焦虑急救'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <a
                href={episode.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white rounded-full text-xs font-bold hover:-translate-y-0.5 transition-all shadow-sm"
              >
                <ExternalLink size={12} />
                去小宇宙收听
              </a>
              <button
                onClick={toggleFav}
                className={`p-2.5 rounded-full transition-all ${
                  isFaved
                    ? 'bg-[#FDF2F8] dark:bg-[#2a1a2e] text-[#EC4899]'
                    : 'bg-brand-hover text-brand-muted dark:text-[#5a7a96] hover:text-[#EC4899]'
                }`}
                title={isFaved ? '取消收藏' : '收藏'}
              >
                <Heart size={16} className={isFaved ? 'fill-current' : ''} />
              </button>
            </div>
          </div>

          {favEpisodes.length > 0 && (
            <div className="relative z-10 pt-4 border-t border-brand-divider/30 dark:border-[#1e3448]/50">
              <button
                onClick={() => setShowFavs(!showFavs)}
                className="flex items-center gap-2 text-[10px] font-bold text-brand-muted dark:text-[#5a7a96] uppercase tracking-widest hover:text-brand-primary transition-colors w-full"
              >
                <Heart size={10} className="fill-current text-[#EC4899]" />
                我的收藏 ({favEpisodes.length})
                <ChevronDown size={12} className={`ml-auto transition-transform ${showFavs ? 'rotate-180' : ''}`} />
              </button>

              {showFavs && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 space-y-2 overflow-hidden"
                >
                  {favEpisodes.map(ep => (
                    <a
                      key={ep.url}
                      href={ep.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-brand-hover dark:hover:bg-[#1a2d40] transition-colors group"
                    >
                      <Headphones size={12} className="text-brand-muted dark:text-[#5a7a96] shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-medium text-brand-ink dark:text-[#e0eaf4] truncate group-hover:text-brand-primary transition-colors">{ep.title}</p>
                        <p className="text-[9px] text-brand-muted dark:text-[#5a7a96]">{ep.show}</p>
                      </div>
                      <ExternalLink size={10} className="text-brand-muted dark:text-[#5a7a96] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ))}
                </motion.div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
