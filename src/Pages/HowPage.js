import React from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../Context/LangContext";
import { 
  Zap,
  Lock,
  Wallet,
  Target,
  Brain,
  Shield,
  Clock,
  Users,
  Award
} from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import { Camera, Cpu, BarChart2, UserCheck } from "lucide-react";

export default function HowPage() {
  const { t } = useI18n();
  
  const steps = [
    { 
      number: "1", 
      icon: <Camera className="w-8 h-8 text-white" />, 
      title: t("how.s1Title") || "Capture Images",
      content: t("how.s1")
    },
    { 
      number: "2", 
      icon: <Cpu className="w-8 h-8 text-white" />, 
      title: t("how.s2Title") || "AI Analysis",
      content: t("how.s2")
    },
    { 
      number: "3", 
      icon: <BarChart2 className="w-8 h-8 text-white" />, 
      title: t("how.s3Title") || "View Results",
      content: t("how.s3")
    },
    { 
      number: "4", 
      icon: <UserCheck className="w-8 h-8 text-white" />, 
      title: t("how.s4Title") || "Consult Expert",
      content: t("how.s4")
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-emerald-400 to-teal-400 py-20 md:py-32">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        
        {/* Circuit Line Animations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent circuit-line"></div>
          <div className="absolute top-2/3 right-1/4 w-48 h-1 bg-gradient-to-r from-transparent via-teal-200/30 to-transparent circuit-line" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6 animate-fade-in">
            {t("how.title")}
          </h1>
          <p className="text-xl md:text-2xl text-emerald-50 leading-relaxed animate-fade-in" style={{animationDelay: '0.1s'}}>
            {t("how.subtitle") || "Follow these simple steps to get your dental health assessment"}
          </p>
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

      {/* Steps Section */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {steps.map((step, i) => (
              <div
                key={i}
                className="group relative bg-white rounded-2xl p-8 shadow-premium border border-slate-100 hover:shadow-card-hover hover:border-emerald-200 hover:scale-[1.02] transition-all duration-300 ease-out animate-fade-in"
                style={{animationDelay: `${i * 0.1}s`}}
              >
                {/* Step Number Badge */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 text-white font-extrabold text-xl rounded-full flex items-center justify-center shadow-glow-emerald group-hover:scale-110 group-hover:shadow-glow-emerald-lg transition-all duration-300">
                  {step.number}
                </div>
                
                {/* Icon */}
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-3xl group-hover:shadow-glow-emerald transition-all duration-300">
                  {step.icon}
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {step.title}
                </h3>
                
                {/* Content */}
                <p className="text-slate-600 leading-relaxed">
                  {step.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Notes Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <Card variant="premium" className="border-l-4 border-emerald-500 animate-fade-in">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-2xl shadow-glow-emerald animate-pulse-slow">
                ✅
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  {t("how.notesTitle")}
                </h3>
                <p className="text-slate-600">
                  {t("how.notesSubtitle") || "Keep these important points in mind for best results"}
                </p>
              </div>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 text-slate-700 leading-relaxed group animate-fade-in" style={{animationDelay: '0.1s'}}>
                <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center text-white group-hover:shadow-glow-emerald transition-all duration-300">•</div>
                <span>{t("how.n1")}</span>
              </li>
              <li className="flex items-start gap-3 text-slate-700 leading-relaxed group animate-fade-in" style={{animationDelay: '0.2s'}}>
                <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center text-white group-hover:shadow-glow-emerald transition-all duration-300">•</div>
                <span>{t("how.n2")}</span>
              </li>
              <li className="flex items-start gap-3 text-slate-700 leading-relaxed group animate-fade-in" style={{animationDelay: '0.3s'}}>
                <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center text-white group-hover:shadow-glow-emerald transition-all duration-300">•</div>
                <span>{t("how.n3")}</span>
              </li>
              <li className="flex items-start gap-3 text-slate-700 leading-relaxed group animate-fade-in" style={{animationDelay: '0.4s'}}>
                <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center text-white group-hover:shadow-glow-emerald transition-all duration-300">•</div>
                <span>{t("how.n4")}</span>
              </li>
            </ul>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/">
                <Button variant="outlined">
                  ← {t("how.back")}
                </Button>
              </Link>
              <Link to="/capture">
                <Button variant="secondary">
                  {t("how.start")} →
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* FAQ or Additional Info Section */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              {t("how.whyChoose") || "Why Choose AI Dental Analysis?"}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 shadow-premium hover:shadow-card-hover group animate-fade-in" style={{animationDelay: '0.1s'}}>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-glow-emerald group-hover:scale-110 transition-all duration-300">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2 mt-4">
                {t("how.benefit1") || "Instant Results"}
              </h4>
              <p className="text-slate-600">
                {t("how.benefit1Desc") || "Get your dental health assessment in minutes, not days"}
              </p>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 shadow-premium hover:shadow-card-hover group animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-glow-emerald group-hover:scale-110 transition-all duration-300">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2 mt-4">
                {t("how.benefit2") || "Secure & Private"}
              </h4>
              <p className="text-slate-600">
                {t("how.benefit2Desc") || "Your data is encrypted and HIPAA compliant"}
              </p>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 shadow-premium hover:shadow-card-hover group animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-glow-emerald group-hover:scale-110 transition-all duration-300">
                <Wallet className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2 mt-4">
                {t("how.benefit3") || "Cost Effective"}
              </h4>
              <p className="text-slate-600">
                {t("how.benefit3Desc") || "Affordable screening before expensive procedures"}
              </p>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 shadow-premium hover:shadow-card-hover group animate-fade-in" style={{animationDelay: '0.4s'}}>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-glow-emerald group-hover:scale-110 transition-all duration-300">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2 mt-4">
                {t("how.benefit4") || "High Accuracy"}
              </h4>
              <p className="text-slate-600">
                {t("how.benefit4Desc") || "AI trained on thousands of dental images"}
              </p>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
