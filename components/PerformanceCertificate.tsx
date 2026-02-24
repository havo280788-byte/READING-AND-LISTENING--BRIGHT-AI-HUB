
import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { Download, Award, CheckCircle, Loader2, ArrowLeft, RotateCcw, Target, ChevronRight, Star } from 'lucide-react';

interface PerformanceCertificateProps {
  studentName: string;
  studentUsername?: string;
  unitTitle: string;
  type: 'Speaking' | 'Writing' | 'Vocabulary' | 'Grammar' | 'Reading' | 'Listening' | 'Challenge' | 'Forbidden Library';
  score: number;
  feedback: string;
  onSaveAndExit: () => void;
  onRetry?: () => void;
  onNextStep?: () => void;
  nextLabel?: string;
  passThreshold?: number;
  downloadText?: string;
  exitText?: string;
  customScoreDisplay?: string;
}

const TITLES: Record<string, string> = {
  'Vocabulary': 'CERTIFICATE OF VOCABULARY MASTERY',
  'Grammar': 'CERTIFICATE OF GRAMMAR PROFICIENCY',
  'Reading': 'CERTIFICATE OF READING COMPREHENSION',
  'Listening': 'CERTIFICATE OF LISTENING EXCELLENCE',
  'Speaking': 'CERTIFICATE OF SPEAKING FLUENCY',
  'Writing': 'CERTIFICATE OF WRITING ABILITY',
  'Challenge': 'CERTIFICATE OF CHALLENGE CONQUEST',
  'Forbidden Library': 'CERTIFICATE OF FORBIDDEN LIBRARY EXPLORATION'
};

const TYPE_COLOR: Record<string, string> = {
  'Vocabulary': '#8B5CF6',
  'Grammar': '#3B82F6',
  'Reading': '#22D3EE',
  'Listening': '#6366F1',
  'Speaking': '#F59E0B',
  'Writing': '#10B981',
  'Challenge': '#F59E0B',
  'Forbidden Library': '#EC4899',
};

const PerformanceCertificate: React.FC<PerformanceCertificateProps> = ({
  studentName,
  studentUsername,
  unitTitle,
  type,
  score,
  feedback,
  onSaveAndExit,
  onRetry,
  onNextStep,
  nextLabel = "CONTINUE",
  passThreshold = 70,
  downloadText = "DOWNLOAD CERTIFICATE",
  exitText = "RETURN TO HUB",
  customScoreDisplay
}) => {
  const certRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const isSuccess = score >= passThreshold;
  const accent = TYPE_COLOR[type] || '#6366F1';

  const handleDownload = async () => {
    if (certRef.current) {
      setIsDownloading(true);
      try {
        const canvas = await html2canvas(certRef.current, {
          scale: 2,
          backgroundColor: '#FFFFFF',
          logging: false,
          useCORS: true
        });
        const link = document.createElement('a');
        const safeName = studentName.replace(/\s+/g, '_');
        link.download = `Certificate_${safeName}_${type}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (err) {
        console.error("Certificate generation failed", err);
        alert("Could not generate image. Please try taking a screenshot.");
      } finally {
        setIsDownloading(false);
      }
    }
  };

  // ── FAIL SCREEN ──────────────────────────────────────────────────────────────
  if (!isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-2xl mx-auto animate-fadeIn gap-8 p-4">
        <div className="w-full rounded-3xl p-10 text-center space-y-8"
          style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto animate-pulse"
            style={{ background: 'rgba(245,158,11,0.15)', border: '2px solid rgba(245,158,11,0.3)', color: '#FBB040' }}>
            <Target size={48} />
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter" style={{ color: '#F8FAFC' }}>Keep Going!</h2>
            <p className="text-lg font-medium" style={{ color: '#94A3B8' }}>
              You haven't reached the pass threshold yet.
            </p>
          </div>
          <div className="rounded-2xl p-6 text-center space-y-2"
            style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <p className="text-base font-medium" style={{ color: '#94A3B8' }}>
              <span className="font-bold" style={{ color: '#FCD34D' }}>{studentName}</span> — you need at least{' '}
              <span className="font-black" style={{ color: '#FCA5A5' }}>{passThreshold} points</span> to earn your certificate.
            </p>
            <div className="mt-4 flex flex-col items-center gap-1">
              <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#475569' }}>Current Score</span>
              <span className="text-6xl font-black italic" style={{ color: '#F59E0B' }}>{score}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={onRetry || onSaveAndExit}
              className="w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm text-white transition-all flex items-center justify-center gap-3 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', boxShadow: '0 8px 25px rgba(245,158,11,0.35)' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <RotateCcw size={18} /><span>RETRY MODULE</span>
            </button>
            <button
              onClick={onSaveAndExit}
              className="w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-3 active:scale-95"
              style={{ background: 'rgba(255,255,255,0.04)', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.08)' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#CBD5E1'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
            >
              <ArrowLeft size={18} /><span>{exitText}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── SUCCESS / CERTIFICATE ─────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-4xl mx-auto animate-fadeIn pb-20">

      {/* Outer dark glow wrapper */}
      <div className="w-full rounded-3xl p-1 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${accent}55, #1E293B, ${accent}33)` }}>

        {/* Printable certificate (light background for download) */}
        <div ref={certRef} className="w-full bg-white p-8 md:p-12 relative rounded-[1.5rem] shadow-2xl overflow-hidden text-[#1A2F1F]">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-28 h-28 rounded-tl-[1.5rem] opacity-70"
            style={{ borderTop: `16px solid ${accent}`, borderLeft: `16px solid ${accent}` }} />
          <div className="absolute bottom-0 right-0 w-28 h-28 rounded-br-[1.5rem] opacity-70"
            style={{ borderBottom: `16px solid ${accent}`, borderRight: `16px solid ${accent}` }} />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at center, ${accent}08 0%, transparent 70%)` }} />

          <div className="relative z-10 flex flex-col items-center text-center space-y-6">
            {/* Medal */}
            <div className="w-24 h-24 rounded-full flex items-center justify-center mb-2"
              style={{ background: `${accent}18`, border: `2px solid ${accent}40` }}>
              <Award size={60} style={{ color: accent }} />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic leading-tight text-[#1A2F1F]">
                {TITLES[type] || 'CERTIFICATE OF ACHIEVEMENT'}
              </h2>
              <p className="text-xs font-black uppercase tracking-[0.4em] text-[#5D6D61]">
                TRAN HUNG DAO HIGH SCHOOL • Grade 11
              </p>
            </div>

            <div className="w-full max-w-lg h-px opacity-30" style={{ background: accent }} />

            {/* Name */}
            <div className="space-y-1">
              <p className="text-sm italic font-medium text-[#5D6D61]">This is to certify that</p>
              <h3 className="text-4xl md:text-5xl font-black italic uppercase tracking-wide" style={{ color: accent }}>
                {studentName}
              </h3>
              {studentUsername && (
                <p className="text-xs text-[#5D6D61] tracking-widest mt-1">Account: {studentUsername}</p>
              )}
            </div>

            {/* Detail */}
            <div className="space-y-2">
              <p className="text-sm italic font-medium text-[#5D6D61]">Has successfully completed the assessment for</p>
              <p className="text-2xl font-black uppercase tracking-wide text-[#2D3748]">{unitTitle}</p>
            </div>

            {/* Score panel */}
            <div className="grid grid-cols-2 gap-8 mt-4 w-full max-w-3xl p-8 rounded-2xl"
              style={{ background: `${accent}10`, border: `1px solid ${accent}30` }}>
              <div className="text-center flex flex-col justify-center">
                <p className="text-xs font-black uppercase tracking-widest text-[#5D6D61] mb-2">Performance Score</p>
                <p className="text-6xl font-black italic" style={{ color: accent }}>
                  {customScoreDisplay || `${score}%`}
                </p>
                <div className="flex justify-center gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} size={14} fill={score >= s * 20 ? accent : 'none'} style={{ color: accent }} />
                  ))}
                </div>
              </div>
              <div className="text-left pl-8 flex flex-col justify-center" style={{ borderLeft: `1px solid ${accent}25` }}>
                <p className="text-xs font-black uppercase tracking-widest text-[#5D6D61] mb-2">AI Examiner Feedback</p>
                <p className="text-base italic leading-relaxed text-[#2D3748]">"{feedback}"</p>
              </div>
            </div>

            {/* Signature */}
            <div className="pt-6 flex flex-col items-center space-y-1 opacity-70">
              <div className="w-48 border-b-2 border-[#2D3748]/20" />
              <p className="text-xs font-black tracking-widest text-[#2D3748]">Teacher Vo Thi Thu Ha</p>
              <p className="text-[8px] uppercase tracking-widest text-[#5D6D61]">Academic Director</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4 w-full max-w-2xl">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95"
          style={{ background: 'rgba(255,255,255,0.05)', color: '#94A3B8', border: `1px solid ${accent}40` }}
          onMouseEnter={e => { e.currentTarget.style.background = `${accent}20`; e.currentTarget.style.color = '#F8FAFC'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#94A3B8'; }}
        >
          {isDownloading ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
          <span>{downloadText}</span>
        </button>

        {isSuccess && onNextStep ? (
          <button
            onClick={() => { onSaveAndExit(); onNextStep(); }}
            className="flex-[2] py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-white transition-all flex items-center justify-center gap-2 active:scale-95"
            style={{ background: `linear-gradient(135deg, ${accent}, #6366F1)`, boxShadow: `0 8px 25px ${accent}50` }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <span>{nextLabel}</span><ChevronRight size={18} />
          </button>
        ) : (
          <button
            onClick={onSaveAndExit}
            className="flex-[2] py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-white transition-all flex items-center justify-center gap-2 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #1E293B, #0F172A)', border: '1px solid rgba(255,255,255,0.08)' }}
            onMouseEnter={e => { e.currentTarget.style.background = `linear-gradient(135deg, ${accent}30, #1E293B)`; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #1E293B, #0F172A)'; }}
          >
            <ArrowLeft size={18} /><span>{exitText}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default PerformanceCertificate;
