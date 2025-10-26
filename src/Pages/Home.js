import React from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../Context/LangContext";
import Badge from "../components/Badge";
import { Brain, Zap, ShieldCheck, Stethoscope } from "lucide-react";


export default function Home() {
  const { t, lang } = useI18n();

  const features = [
    { 
      icon: <Brain className="w-8 h-8 text-white" />, 
    title: t("features.f1"), 
    desc: t("features.f1d"),
    },
    { 
      icon: <Zap className="w-8 h-8 text-white" />, 
      title: t("features.f2"), 
      desc: t("features.f2d"),
    },
    { 
      icon: <ShieldCheck className="w-8 h-8 text-white" />, 
      title: t("features.f3"), 
      desc: t("features.f3d"),
    },
    { 
      icon: <Stethoscope className="w-8 h-8 text-white" />, 
      title: t("features.f4"), 
      desc: t("features.f4d"),
    },
  ];

  return (
    <>
      {/* ===== Modern Gradient Hero Section ===== */}
      <section className="relative overflow-hidden bg-hero-gradient">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 grid-pattern opacity-50" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        
        {/* Circuit Line Animations - Premium Tech Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent circuit-line"></div>
          <div className="absolute top-1/3 right-1/4 w-48 h-1 bg-gradient-to-r from-transparent via-teal-200/30 to-transparent circuit-line" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/3 left-1/3 w-32 h-1 bg-gradient-to-r from-transparent via-emerald-200/30 to-transparent circuit-line" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-32 lg:py-40">
          <div className="text-center">
            {/* Hero Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
              <span className="block animate-slide-down">{t("hero.title1") || "Your Child's Smile"}</span>
              <span className="block text-gradient-light mt-2 animate-slide-down" style={{animationDelay: '0.1s'}}>
                {t("hero.title2") || "Deserves Early Care"}
              </span>
            </h1>

            {/* Hero Subtitle */}
            <p className="mt-8 text-xl md:text-2xl text-emerald-50 max-w-3xl mx-auto leading-relaxed animate-slide-up">
              {t("hero.subtitle") ||
                "AI dental screening in minutes. Detect cavities and issues before they become problems."}
            </p>

            {/* CTA Buttons */}
            <div className="mt-12 flex flex-wrap gap-6 justify-center animate-slide-up" style={{animationDelay: '0.2s'}}>
              <Link
                to="/capture"
                className="group relative px-10 py-5 bg-white text-emerald-600 font-bold text-lg rounded-full shadow-2xl hover:shadow-glow-emerald-lg hover:scale-105 transition-all duration-300 ease-out"
              >
                <span className="relative z-10">{t("hero.cta1") || "Start Diagnosis"} </span>
              </Link>
              <Link
                to="/how"
                className="px-10 py-5 bg-white/10 backdrop-blur-md text-white font-semibold text-lg rounded-full border-2 border-white/30 hover:bg-white/20 hover:border-white/50 hover:scale-105 transition-all duration-300 ease-out"
              >
                {t("hero.cta2") || "Learn More"}
              </Link>
            </div>

            {/* Trust Badges */}
            {/* Trust Badges Section */}
            {/* <div className="mt-12 flex flex-wrap justify-center gap-6 animate-slide-up" style={{animationDelay: '0.3s'}}>
              {lang === "ar" ? (
                <>
                  <Badge variant="animated" icon="✔">*معتمد من هيئة الغذاء والدواء</Badge>
                  <Badge variant="animated" icon="🔒">متوافق مع HIPAA</Badge>
                  <Badge variant="animated" icon="👥">أكثر من 10,000 مستخدم</Badge>
                </>
              ) : (
                <>
                  <Badge variant="animated" icon="✔">FDA Approved*</Badge>
                  <Badge variant="animated" icon="🔒">HIPAA Compliant</Badge>
                  <Badge variant="animated" icon="👥">10,000+ Users</Badge>
                </>
              )}
            </div> */}
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <path 
              d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" 
              fill="#f8fafc"
            />
          </svg>
        </div>
      </section>

      {/* ===== Features Section ===== */}
      <section className="py-16 md:py-24 lg:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              {t("features.why")}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mx-auto" />
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl p-6 md:p-8 shadow-premium border border-slate-100 hover:shadow-card-hover hover:border-emerald-200 hover:scale-[1.02] transition-all duration-300 ease-out"
                style={{animationDelay: `${i * 0.1}s`}}
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-3xl group-hover:shadow-glow-emerald transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA Section ===== */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative overflow-hidden bg-cta-gradient rounded-3xl p-10 md:p-12 shadow-2xl">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 text-center">
              <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                {t("features.ready")}
              </h3>
              <p className="text-xl text-emerald-50 mb-8 max-w-2xl mx-auto leading-relaxed">
                {t("features.ready_d")}
              </p>
              <Link
                to="/how"
                className="inline-flex items-center px-10 py-4 bg-white text-emerald-600 font-bold text-lg rounded-full shadow-xl hover:shadow-2xl hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300 ease-out"
              >
                {t("features.get_started")} →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
