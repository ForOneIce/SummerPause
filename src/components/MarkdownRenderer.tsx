import { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = content;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [content]);

  return (
    <div className={`relative group ${className}`}>
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
          bg-white/80 dark:bg-[#162a40]/80 backdrop-blur-sm border border-brand-divider dark:border-[#1e3448]
          text-brand-secondary dark:text-[#8aa4bc] hover:text-brand-primary hover:border-brand-primary
          opacity-0 group-hover:opacity-100 transition-all duration-200
          active:scale-95"
        title="复制 Markdown 原文"
      >
        {copied ? (
          <>
            <Check size={12} className="text-green-500" />
            <span className="text-green-500">已复制</span>
          </>
        ) : (
          <>
            <Copy size={12} />
            <span>复制</span>
          </>
        )}
      </button>
      <div className="markdown-body">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
