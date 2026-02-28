import React from 'react';
import { ModelConfig } from './ModelConfig';
import { Button } from './Components';

interface Props {
   isOpen: boolean;
   onClose: () => void;
   apiKey: string;
   setApiKey: (key: string) => void;
   selectedModel: string;
   setModel: (model: string) => void;
   onSave: () => void;
}

export const SettingsModal: React.FC<Props> = ({
   isOpen, onClose, apiKey, setApiKey, selectedModel, setModel, onSave
}) => {
   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
         <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={onClose}></div>
         <div className="bg-[#1E293B] border border-white/10 rounded-[2rem] shadow-2xl w-full max-w-lg relative z-10 animate-fade-in-up overflow-hidden backdrop-blur-2xl">
            {/* Header */}
            <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between bg-white/5">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl shadow-lg shadow-blue-500/20">
                     <i className="fas fa-cog fa-spin-slow"></i>
                  </div>
                  <div>
                     <h3 className="text-xl font-extrabold text-white">Model & API Key Settings</h3>
                     <p className="text-sm text-slate-400 font-medium">Configure AI for your application</p>
                  </div>
               </div>
               <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white flex items-center justify-center transition-colors">
                  <i className="fas fa-times"></i>
               </button>
            </div>

            {/* Body */}
            <div className="p-8">
               <ModelConfig
                  apiKey={apiKey}
                  onApiKeyChange={setApiKey}
                  selectedModel={selectedModel}
                  onSelectModel={setModel}
               />

               <div className="mt-8">
                  <Button onClick={onSave} className="w-full py-4 text-lg shadow-xl shadow-blue-600/20">
                     <i className="fas fa-save mr-2"></i> Save & Continue
                  </Button>
               </div>
            </div>
         </div>
      </div>
   );
};
