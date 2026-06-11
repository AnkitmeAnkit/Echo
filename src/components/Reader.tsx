import React, { useState, useEffect, useRef } from 'react';
import { useAppState } from '../store';
import { PLAYBOOKS } from '../data';
import { 
  ChevronLeft, Menu, X, Type, Download, 
  Moon, Sun, Check, ExternalLink, Printer 
} from 'lucide-react';

export const Reader: React.FC = () => {
  const { routeParams, navigate, purchasedSlugs, saveScrollPosition, getScrollPosition } = useAppState();
  
  const slug = routeParams.slug || '';
  const playbook = PLAYBOOKS.find(p => p.slug === slug);

  useEffect(() => {
    if (!playbook) return;
    const isOwned = purchasedSlugs.includes(playbook.slug);
    if (!isOwned) {
      navigate(`/playbooks/${playbook.slug}`);
    }
  }, [playbook, purchasedSlugs]);

  if (!playbook || !purchasedSlugs.includes(playbook.slug)) {
    return (
      <div className="py-24 text-center px-6">
        <p className="text-error font-medium text-sm mb-4">Unauthorized access</p>
        <span className="text-muted text-sm block">Redirecting to preview...</span>
      </div>
    );
  }

  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [tocOpen, setTocOpen] = useState(true);
  const [readingTheme, setReadingTheme] = useState<'dark' | 'light'>('light');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'huge'>('normal');
  const [saveStatus, setSaveStatus] = useState<'synced' | 'saving'>('synced');
  const [exporterOpen, setExporterOpen] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const savedPct = getScrollPosition(playbook.slug);
    if (savedPct > 0 && scrollContainerRef.current) {
      setTimeout(() => {
        if (scrollContainerRef.current) {
          const scrollContainer = scrollContainerRef.current;
          scrollContainer.scrollTop = (scrollContainer.scrollHeight - scrollContainer.clientHeight) * savedPct;
        }
      }, 400);
    }
  }, [currentChapterIndex]);

  useEffect(() => {
    const handleSave = () => {
      if (!scrollContainerRef.current) return;
      setSaveStatus('saving');
      
      const el = scrollContainerRef.current;
      const pct = el.scrollTop / (el.scrollHeight - el.clientHeight || 1);
      
      saveScrollPosition(playbook.slug, Number(pct.toFixed(3)));
      
      setTimeout(() => {
        setSaveStatus('synced');
      }, 600);
    };

    const interval = setInterval(handleSave, 15000);

    return () => clearInterval(interval);
  }, [playbook.slug]);

  const handleScrollCheckpoint = () => {
    if (!scrollContainerRef.current) return;
    const el = scrollContainerRef.current;
    const pct = el.scrollTop / (el.scrollHeight - el.clientHeight || 1);
    saveScrollPosition(playbook.slug, Number(pct.toFixed(3)));
  };

  const handleChapterSwitch = (idx: number) => {
    setCurrentChapterIndex(idx);
    handleScrollCheckpoint();
  };

  const handleExportHTML = () => {
    try {
      const template = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${playbook.title}</title>
    <style>
        body {
            background-color: #ffffff;
            color: #111111;
            font-family: system-ui, -apple-system, sans-serif;
            line-height: 1.7;
            padding: 40px 24px;
            max-width: 800px;
            margin: 0 auto;
        }
        h1 { font-size: 36px; border-bottom: 1px solid #e5e7eb; padding-bottom: 12px; color: #111111; font-weight: 600; letter-spacing: -0.02em; }
        h2 { font-size: 24px; color: #111111; margin-top: 40px; font-weight: 600; }
        .meta { font-size: 14px; color: #6b7280; margin-bottom: 30px; font-weight: 500; }
        .chapter { padding: 24px 0; margin-bottom: 24px; border-bottom: 1px solid #e5e7eb; }
        pre { background: #f8f9fa; padding: 16px; border-radius: 8px; overflow-x: auto; font-family: monospace; font-size: 14px; }
        code { font-family: monospace; }
    </style>
</head>
<body>
    <div class="meta">Offline Playbook Export</div>
    <h1>${playbook.title}</h1>
    <p>${playbook.subtitle}</p>
    
    ${playbook.chapters.map(c => `
      <div class="chapter">
        <h2>${c.title}</h2>
        <div>${c.content}</div>
      </div>
    `).join('')}
</body>
</html>`;

      const blob = new Blob([template], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `echoglitch_${playbook.slug}_offline.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Error generating single-file HTML', e);
    }
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const activeChapter = playbook.chapters[currentChapterIndex];

  const fontSizeClass = {
    normal: 'text-base leading-relaxed',
    large: 'text-lg leading-relaxed',
    huge: 'text-xl leading-loose'
  }[fontSize];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col font-sans selection:bg-surface-strong selection:text-ink">
      
      {/* Toolbar */}
      <section className="h-14 bg-canvas border-b border-hairline-soft flex items-center justify-between px-6 shrink-0 relative z-10">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-1 text-sm font-semibold text-muted hover:text-ink transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>
          
          <div className="h-4 w-px bg-hairline hidden sm:block" />
          
          <button
            onClick={() => setTocOpen(!tocOpen)}
            className="flex items-center space-x-2 text-sm font-semibold text-muted hover:text-ink transition-colors cursor-pointer"
          >
            {tocOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            <span>Menu</span>
          </button>
        </div>

        <div className="flex-1 text-center truncate mx-4 hidden lg:block">
          <span className="text-sm font-medium text-ink">{playbook.title}</span>
          <span className="text-sm text-muted mx-2">/</span>
          <span className="text-sm text-muted">{activeChapter.title}</span>
        </div>

        <div className="flex items-center space-x-4 text-sm font-semibold text-muted">
          <span className="hidden sm:inline">
            {saveStatus === 'saved' ? 'Saved' : 'Saving...'}
          </span>

          <div className="h-4 w-px bg-hairline hidden sm:block" />

          <button
            onClick={() => setReadingTheme(readingTheme === 'dark' ? 'light' : 'dark')}
            className="p-1 hover:text-ink cursor-pointer transition-colors"
          >
            {readingTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              const sizes: Array<'normal' | 'large' | 'huge'> = ['normal', 'large', 'huge'];
              const nextIndex = (sizes.indexOf(fontSize) + 1) % sizes.length;
              setFontSize(sizes[nextIndex]);
            }}
            className="p-1 hover:text-ink flex items-center space-x-1 cursor-pointer transition-colors"
          >
            <Type className="w-4 h-4" />
          </button>

          <button
            onClick={() => setExporterOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-sm font-semibold bg-surface-soft hover:bg-surface-strong text-ink transition-colors rounded-md cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </section>

      {/* Main Area */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Sidebar */}
        {tocOpen && (
          <aside className="w-64 bg-canvas border-r border-hairline overflow-y-auto shrink-0 z-20 absolute lg:relative inset-y-0 left-0">
            <div className="p-4 border-b border-hairline text-xs font-semibold text-muted uppercase tracking-wider">
              Chapters
            </div>
            <nav className="p-2 space-y-1">
              {playbook.chapters.map((chapter, index) => {
                const isActive = index === currentChapterIndex;
                return (
                  <button
                    key={chapter.id}
                    onClick={() => handleChapterSwitch(index)}
                    className={`w-full text-left p-3 text-sm font-medium transition-colors rounded-md ${
                      isActive 
                        ? 'bg-surface-soft text-ink font-semibold' 
                        : 'bg-transparent text-muted hover:bg-surface-soft hover:text-ink'
                    }`}
                  >
                    <div className="flex justify-between items-baseline">
                      <span className="line-clamp-2">{chapter.title}</span>
                      {isActive && <Check className="w-4 h-4 ml-2 shrink-0 text-ink" />}
                    </div>
                  </button>
                );
              })}
            </nav>
          </aside>
        )}

        {/* Reader body */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScrollCheckpoint}
          className={`flex-1 overflow-y-auto p-8 md:p-16 transition-colors duration-200 ${
            readingTheme === 'dark' 
              ? 'bg-surface-dark text-on-dark' 
              : 'bg-canvas text-ink'
          }`}
        >
          <div className="max-w-2xl mx-auto space-y-10 relative">
            
            <div className={`flex justify-between items-baseline border-b pb-4 mb-8 ${readingTheme === 'dark' ? 'border-surface-strong' : 'border-hairline'}`}>
              <span className={`text-sm font-medium ${readingTheme === 'dark' ? 'text-on-dark-soft' : 'text-muted'}`}>
                Chapter {currentChapterIndex + 1} of {playbook.chapters.length}
              </span>
              <span className={`text-sm font-medium ${readingTheme === 'dark' ? 'text-on-dark-soft' : 'text-muted'}`}>
                {activeChapter.estimatedMinutes} min read
              </span>
            </div>

            <div className={`font-sans overflow-x-hidden ${fontSizeClass}`}>
              <h2 className="font-display font-semibold tracking-tight text-3xl md:text-4xl mb-8">
                {activeChapter.title}
              </h2>
              
              <div className="space-y-6 whitespace-pre-line text-body text-pretty">
                {activeChapter.content}
              </div>
            </div>

            <div className={`border-t pt-8 mt-16 flex justify-between text-sm font-semibold ${readingTheme === 'dark' ? 'border-surface-strong' : 'border-hairline'}`}>
              <button
                disabled={currentChapterIndex === 0}
                onClick={() => handleChapterSwitch(currentChapterIndex - 1)}
                className="disabled:opacity-30 hover:underline px-4 py-2 cursor-pointer transition-all"
              >
                ← Previous
              </button>

              <button
                disabled={currentChapterIndex === playbook.chapters.length - 1}
                onClick={() => handleChapterSwitch(currentChapterIndex + 1)}
                className="disabled:opacity-30 hover:underline px-4 py-2 cursor-pointer transition-all"
              >
                Next →
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Export Modal */}
      {exporterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/20 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-canvas rounded-lg p-6 shadow-xl text-ink">
            <button 
              onClick={() => setExporterOpen(false)}
              className="absolute top-4 right-4 text-muted hover:text-ink transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 mb-6 border-b border-hairline pb-4">
              <h3 className="font-display text-xl tracking-tight font-semibold">
                Export Playbook
              </h3>
              <p className="text-sm text-body">
                Download a local copy of this playbook for offline access.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  handleExportHTML();
                  setExporterOpen(false);
                }}
                className="w-full flex items-center justify-between p-4 border border-hairline hover:border-surface-strong transition-colors text-left bg-canvas rounded-md cursor-pointer group"
              >
                <div>
                  <div className="font-semibold text-sm">HTML Document</div>
                  <div className="text-xs text-muted mt-1">Single-file format for browser viewing.</div>
                </div>
                <ExternalLink className="w-5 h-5 text-muted group-hover:text-ink" />
              </button>

              <button
                onClick={() => {
                  handlePrintPDF();
                  setExporterOpen(false);
                }}
                className="w-full flex items-center justify-between p-4 border border-hairline hover:border-surface-strong transition-colors text-left bg-canvas rounded-md cursor-pointer group"
              >
                <div>
                  <div className="font-semibold text-sm">Print / PDF</div>
                  <div className="text-xs text-muted mt-1">Optimize layout for printing or saving as PDF.</div>
                </div>
                <Printer className="w-5 h-5 text-muted group-hover:text-ink" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
