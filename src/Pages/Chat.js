import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../Context/LangContext";

export default function Chat() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [msgs, setMsgs] = useState([
    { 
      from: "doc", 
      text: t("chat.welcome") || "Hello, I'm Dr. Ahmed. I can help review your results and answer any questions you have about your dental health.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [msgs]);

  const send = () => {
    if (!text.trim()) return;
    
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Add user message
    setMsgs((m) => [...m, { 
      from: "you", 
      text,
      time: currentTime
    }]);
    setText("");
    
    // Simulate typing indicator
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMsgs((m) => [...m, { 
        from: "doc", 
        text: t("chat.response") || "Thanks for sharing. Can you describe any pain, sensitivity, or other symptoms you're experiencing?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1500);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-emerald-400 to-teal-400 py-12 sm:py-16 md:py-20">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-2 sm:mb-3">
                {t("chat.title")}
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-emerald-50 mb-4 sm:mb-6 px-4">
                {t("chat.subtitle") || "Discuss your results with our AI dental assistant"}
              </p>
              <button 
                className="px-5 py-2.5 sm:px-6 sm:py-3 bg-white/20 backdrop-blur-md text-white text-sm sm:text-base font-semibold rounded-full border-2 border-white/30 hover:bg-white/30 hover:scale-105 transition-all duration-300"
                onClick={() => navigate("/results")}
              >
                {t("chat.back")}
              </button>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" className="w-full h-auto">
            <path 
              d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V80H0V0Z" 
              fill="#f8fafc"
            />
          </svg>
        </div>
      </section>

      <section className="py-8 sm:py-12 md:py-16 lg:py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6">
          {/* Chat Container */}
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-4 sm:px-6 py-4 sm:py-5 flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-xl sm:text-2xl border-2 border-white/30 flex-shrink-0">
                👨‍⚕️
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-base sm:text-lg truncate">Dr. Ahmed</h3>
                <p className="text-emerald-50 text-xs sm:text-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                  {t("chat.online") || "Online"}
                </p>
              </div>
            </div>

            {/* Messages Container */}
            <div className="p-3 sm:p-4 md:p-6 h-[50vh] sm:h-[55vh] md:h-[60vh] overflow-y-auto bg-slate-50 scrollbar-hide">
              <div className="space-y-3 sm:space-y-4">
                {msgs.map((m, i) => (
                  <div 
                    key={i} 
                    className={`flex ${m.from === "you" ? "justify-end" : "justify-start"} animate-slide-up`}
                  >
                    {m.from === "doc" && (
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-sm sm:text-base mr-2 sm:mr-3 flex-shrink-0">
                        👨‍⚕️
                      </div>
                    )}
                    <div className={`max-w-[85%] sm:max-w-[75%] md:max-w-[70%] ${m.from === "you" ? "order-1" : "order-2"}`}>
                      <div 
                        className={`
                          px-3 py-2 sm:px-4 sm:py-3 md:px-5 md:py-3 rounded-2xl shadow-md
                          ${m.from === "you" 
                            ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-br-sm" 
                            : "bg-white text-slate-800 border border-slate-200 rounded-bl-sm"}
                        `}
                      >
                        <p className="leading-relaxed text-sm sm:text-base">{m.text}</p>
                      </div>
                      <div className={`flex items-center gap-1 sm:gap-2 mt-1 px-1 sm:px-2 ${m.from === "you" ? "justify-end" : "justify-start"}`}>
                        <span className={`text-[10px] sm:text-xs ${m.from === "you" ? "text-slate-500" : "text-slate-400"}`}>
                          {m.time}
                        </span>
                        {m.from === "you" && (
                          <span className="text-[10px] sm:text-xs text-emerald-600">✓✓</span>
                        )}
                      </div>
                    </div>
                    {m.from === "you" && (
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full flex items-center justify-center text-sm sm:text-base ml-2 sm:ml-3 flex-shrink-0">
                        👤
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start animate-slide-up">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-sm sm:text-base mr-2 sm:mr-3">
                      👨‍⚕️
                    </div>
                    <div className="bg-white border border-slate-200 px-4 py-2 sm:px-5 sm:py-3 rounded-2xl rounded-bl-sm shadow-md">
                      <div className="flex gap-1.5 sm:gap-2">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="p-3 sm:p-4 md:p-6 bg-white border-t border-slate-200">
              <div className="flex gap-2 sm:gap-3">
                <input 
                  className="flex-1 px-3 py-2 sm:px-4 sm:py-3 md:px-5 md:py-4 rounded-full border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all duration-200 text-slate-800 placeholder-slate-400 text-sm sm:text-base"
                  placeholder={t("chat.placeholder") || "Type your message..."}
                  value={text} 
                  onChange={(e) => setText(e.target.value)} 
                  onKeyDown={(e) => e.key === "Enter" && send()}
                />
                <button 
                  className={`
                    px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-full font-bold shadow-lg text-sm sm:text-base
                    transition-all duration-300 whitespace-nowrap
                    ${text.trim() 
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:scale-105 hover:shadow-xl" 
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"}
                  `}
                  onClick={send}
                  disabled={!text.trim()}
                >
                  <span className="flex items-center gap-1 sm:gap-2">
                    <span className="hidden sm:inline">{t("chat.send")}</span>
                    <span className="sm:hidden">➤</span>
                  </span>
                </button>
              </div>
              
              {/* Quick Suggestions */}
              <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2">
                <button 
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-emerald-50 text-emerald-700 text-xs sm:text-sm font-medium rounded-full border border-emerald-200 hover:bg-emerald-100 transition-colors duration-200"
                  onClick={() => setText(t("chat.suggestion1") || "What do these results mean?")}
                >
                   {t("chat.suggestion1") || "What do these results mean?"}
                </button>
                <button 
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-emerald-50 text-emerald-700 text-xs sm:text-sm font-medium rounded-full border border-emerald-200 hover:bg-emerald-100 transition-colors duration-200"
                  onClick={() => setText(t("chat.suggestion2") || "Should I see a dentist?")}
                >
                   {t("chat.suggestion2") || "Should I see a dentist?"}
                </button>
                <button 
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-emerald-50 text-emerald-700 text-xs sm:text-sm font-medium rounded-full border border-emerald-200 hover:bg-emerald-100 transition-colors duration-200"
                  onClick={() => setText(t("chat.suggestion3") || "What treatments are available?")}
                >
                   {t("chat.suggestion3") || "What treatments are available?"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
