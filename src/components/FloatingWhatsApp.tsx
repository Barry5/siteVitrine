import React, { useState } from 'react';
import { MessageCircle, X, Send, ChevronRight, Phone } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = '224611835683'; // +224 611 83 56 83

  const quickQuestions = [
    'Bonjour, je souhaite réserver pour le prochain départ.',
    'Bonjour, quel est le tarif au kilo pour New York ?',
    'Bonjour, quel est le tarif au kilo pour Montréal ?',
    'Bonjour, comment déposer un colis à l\'agence Hamdallaye ?',
    'Bonjour, j\'aimerais suivre mon colis en urgence.',
  ];

  const handleSend = (text: string) => {
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${phoneNumber}?text=${encoded}`, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Popover drawer */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-88 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-whatsapp text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm leading-tight">
                  Thiaguil Multi-services
                </h4>
                <span className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                  En ligne • Réponse rapide
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              aria-label="Fermer la fenêtre de discussion"
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-black/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-slate-50 space-y-3">
            <div className="bg-white p-3 rounded-2xl border border-slate-200 text-xs text-slate-700 shadow-2xs">
              <p className="font-medium">
                Bonjour ! 👋 Comment pouvons-nous vous assister aujourd'hui pour votre envoi de colis ?
              </p>
              <span className="text-[10px] text-slate-600 block text-right mt-1">
                Numéro direct : +224 611 83 56 83
              </span>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 px-1 block">
                Sélectionnez un sujet rapide :
              </span>
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-xs font-semibold text-slate-800 transition-all flex items-center justify-between cursor-pointer group shadow-2xs"
                >
                  <span className="truncate pr-2">{q}</span>
                  <Send className="w-3.5 h-3.5 text-emerald-600 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
              <a
                href={`tel:+${phoneNumber}`}
                className="text-slate-600 hover:text-slate-900 flex items-center gap-1 font-bold text-[11px]"
              >
                <Phone className="w-3.5 h-3.5 text-slate-700" />
                <span>Appel téléphonique direct</span>
              </a>
              <button
                onClick={() => handleSend('Bonjour Thiaguil Multi-services')}
                className="text-whatsapp font-bold hover:underline text-[11px] cursor-pointer"
              >
                Écrire librement ➔
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-whatsapp hover:bg-whatsapp-dark text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer ring-4 ring-emerald-300/40 relative group"
        aria-label="Contacter sur WhatsApp"
      >
        <MessageCircle className="w-7 h-7 fill-white" />
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand border-2 border-white flex items-center justify-center text-[9px] font-bold text-white">
          1
        </span>
      </button>
    </div>
  );
};
