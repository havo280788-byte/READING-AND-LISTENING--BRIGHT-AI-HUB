
import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { Download, Award, CheckCircle, Loader2, ArrowLeft, RotateCcw, Target, ChevronRight } from 'lucide-react';

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
  downloadText = "DOWNLOAD PDF",
  exitText = "RETURN TO HUB",
  customScoreDisplay
}) => {
  const certRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const isSuccess = score >= passThreshold;

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

  if (!isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-2xl mx-auto animate-fadeIn gap-8 p-4">
        <div className="bg-white rounded-[3rem] p-12 text-center shadow-2xl border-4 border-[#27AE60]/20 w-full">
          <div className="w-24 h-24 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner animate-pulse">
            <Target size={48} />
          </div>
          <h2 className="type-h3 text-[#2D3748] uppercase tracking-tighter italic mb-4">Keep Going!</h2>
          <div className="bg-green-50 border border-[#27AE60]/20 p-6 rounded-2xl mb-8">
            <p className="type-body text-slate-600 leading-relaxed">
              Don't give up <span className="font-bold text-[#27AE60]">{studentName}</span>! You need at least <span className="text-rose-500 font-black">{passThreshold} points</span> to earn your certificate.
            </p>
            <div className="mt-4 flex flex-col items-center">
              <span className="type-caption text-slate-400 tracking-widest">Current Score</span>
              <span className="type-h1 text-[#27AE60]">{score}</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={onRetry || onSaveAndExit}
              className="w-full bg-[#27AE60] text-white py-5 rounded-[2rem] type-button shadow-xl hover:bg-[#2ECC71] transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              <RotateCcw size={18} />
              <span>RETRY MODULE</span>
            </button>
            <button
              onClick={onSaveAndExit}
              className="w-full bg-white text-[#5D6D61] border-2 border-[#D6C2B0] py-5 rounded-[2rem] type-button hover:bg-green-50 hover:text-[#27AE60] transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              <ArrowLeft size={18} />
              <span>{exitText}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-4xl mx-auto animate-fadeIn pb-20">
      {/* Certificate Frame */}
      <div ref={certRef} className="w-full bg-white p-8 md:p-12 relative rounded-[2rem] shadow-2xl border-[12px] border-double border-[#27AE60] overflow-hidden text-[#1A2F1F]">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-32 h-32 border-t-[20px] border-l-[20px] border-[#27AE60] rounded-tl-[2rem] opacity-80"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 border-b-[20px] border-r-[20px] border-[#27AE60] rounded-br-[2rem] opacity-80"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/0 via-transparent to-[#27AE60]/5 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          <div className="w-24 h-24 bg-[#27AE60]/10 rounded-full flex items-center justify-center mb-2 border-2 border-[#27AE60]/20">
            <Award size={64} className="text-[#27AE60]" />
          </div>

          <div className="space-y-2">
            <h2 className="type-h1 text-[#2D3748] uppercase tracking-tighter font-serif leading-tight">
              {TITLES[type] || 'CERTIFICATE OF ACHIEVEMENT'}
            </h2>
            <p className="type-caption text-[#5D6D61] tracking-[0.4em] uppercase">TRAN HUNG DAO HIGH SCHOOL • Grade 11</p>
          </div>

          <div className="w-full h-px bg-[#27AE60]/30 my-4 max-w-lg"></div>

          <div className="space-y-1">
            <p className="type-small text-[#5D6D61] italic font-serif">This is to certify that</p>
            {/* Ensure name is uppercase and serif for classic look */}
            <h3 className="type-h1 text-[#27AE60] italic font-serif uppercase tracking-wide">{studentName}</h3>
            {studentUsername && <p className="type-caption text-[#5D6D61] tracking-widest mt-1">Account: {studentUsername}</p>}
          </div>

          <div className="space-y-2">
            <p className="type-small text-[#5D6D61] italic font-serif">Has successfully completed the assessment for</p>
            <p className="type-h2 text-[#2D3748] uppercase tracking-wide">{unitTitle}</p>
          </div>

          <div className="grid grid-cols-2 gap-12 mt-4 w-full max-w-3xl bg-green-50 p-8 rounded-2xl border border-[#27AE60]/20 shadow-sm backdrop-blur-sm">
            <div className="text-center flex flex-col justify-center">
              <p className="type-caption text-[#5D6D61] tracking-widest mb-2">Performance Score</p>
              <p className="type-h1 text-[#27AE60]">{customScoreDisplay || `${score}%`}</p>
            </div>
            <div className="text-left border-l border-[#27AE60]/20 pl-8 flex flex-col justify-center">
              <p className="type-caption text-[#5D6D61] tracking-widest mb-2">AI Examiner Feedback</p>
              <p className="type-body-reading text-[#2D3748] italic leading-relaxed">"{feedback}"</p>
            </div>
          </div>

          <div className="pt-8 flex flex-col items-center space-y-2 opacity-80">
            <div className="w-48 border-b-2 border-[#2D3748]/20"></div>
            <p className="type-caption text-[#2D3748] tracking-widest">Teacher Vo Thi Thu Ha</p>
            <p className="type-caption text-[#5D6D61] !text-[8px] uppercase tracking-widest">Academic Director</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col md:flex-row gap-4 w-full max-w-2xl">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex-1 bg-white text-[#27AE60] border-2 border-[#27AE60] py-4 rounded-2xl type-button hover:bg-[#27AE60] hover:text-white transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
        >
          {isDownloading ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
          <span>{downloadText}</span>
        </button>

        {isSuccess && onNextStep ? (
          <button
            onClick={() => { onSaveAndExit(); onNextStep(); }}
            className="flex-[2] bg-[#27AE60] text-white py-4 rounded-2xl type-button hover:bg-[#2ECC71] transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 border-b-4 border-[#1E8449] active:border-b-0 active:translate-y-1"
          >
            <span>{nextLabel}</span>
            <ChevronRight size={18} />
          </button>
        ) : (
          <button
            onClick={onSaveAndExit}
            className="flex-[2] bg-slate-800 text-white py-4 rounded-2xl type-button hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
          >
            <ArrowLeft size={18} />
            <span>{exitText}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default PerformanceCertificate;
