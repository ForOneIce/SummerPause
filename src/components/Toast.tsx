import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import type { ToastItem } from '../hooks/useToast';

const icons = {
  success: <CheckCircle2 size={18} />,
  error: <AlertTriangle size={18} />,
  info: <Info size={18} />,
};

const styles = {
  success: 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700',
  error: 'bg-red-50 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700',
  info: 'bg-brand-hover dark:bg-[#1a2d40] text-brand-primary border-brand-border dark:border-[#2a4a66]',
};

export function ToastContainer({ toasts, onRemove }: { toasts: ToastItem[]; onRemove: (id: number) => void }) {
  return (
    <div className="fixed top-6 right-6 z-[300] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 80, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={`pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-2xl border backdrop-blur-sm shadow-lg max-w-sm ${styles[toast.type]}`}
          >
            <span className="shrink-0">{icons[toast.type]}</span>
            <span className="text-sm font-medium flex-1">{toast.message}</span>
            <button
              onClick={() => onRemove(toast.id)}
              className="shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
