import React, { useState } from 'react';
import { Users, Mail, ExternalLink, QrCode } from 'lucide-react';
import { useI18n } from '../Context/LangContext';

export default function AboutPage() {
  const { lang } = useI18n();
  const [isQRExpanded, setIsQRExpanded] = useState(false);

  const content = {
    en: {
      title: 'About Us',
      subtitle: 'Revolutionizing dental healthcare through artificial intelligence',
      
      mission: {
        title: 'Our Mission',
        description: "Empowering parents and healthcare providers with an innovative AI-powered screening tool to detect pediatric dental problems in their early stages. Our mission is to provide an accurate and accessible preliminary screening method for everyone, enabling early intervention and prevention while protecting children's smiles wherever they are"
      },
      
      teamSection: {
        title: 'Development Team',
        subtitle: 'Meet the minds behind the innovation'
      },
      
      teamMembers: [
        { name: 'Yazeed AlOmari', department: 'Faculty of Computing & Information Technology, King Abdulaziz University', Photo: '/Yazeed.jpeg'},
        { name: 'Norah Alqahtani', department: 'Faculty of Computing & Information Technology, King Abdulaziz University', Photo: '/Norah.png' },
        { name: 'Nawaf Alghamdi', department: 'Faculty of Computing & Information Technology, King Abdulaziz University', Photo: '/Nawaf.jpeg' },
        { name: 'Ghadah Alshehri', department: 'Faculty of Computing & Information Technology, King Abdulaziz University', Photo: '/W.jpg'}
      ],
      
      story: {
        title: 'The Story Behind TeleDentAI',
        description: "This project originated during our summer internship at King Abdulaziz University's Research Center of Excellence for Artificial Intelligence and Data Science (AIADS), in partnership with Faculty of Dentistry at King Abdulaziz University. We leveraged AI to tackle a pressing challenge: the widespread prevalence of pediatric dental problems in Saudi Arabia, developing a solution to make a real impact on children and families. After completing the internship, our team independently continued development, transforming TeleDentAI from a training project into a commitment to early dental problem detection. Our mission is to provide accessible preliminary dental screening for children everywhere, empowering parents and healthcare providers with convenient monitoring tools. This achievement was made possible through the invaluable supervision of Dr. Sultanah AlShammari, Dr. Eaman AlHarbi, and Dr. Arwa AlMubarak from AIADS, who generously shared their expertise. We extend our deepest appreciation to Dr. Nermen Helal and Dr. Mohammed AlShaya for conceptualizing the project, providing essential data and insights, and to Dr. Rahaf Helal for her meticulous data annotation review."
},
      contact: {
        title: 'Connect With Us',
        email: {
          title: 'Email Contact',
          description: 'Access our team\'s email addresses and contact information through our comprehensive Linktree directory.',
          button: 'Visit Our Linktree'
        },
        qr: {
          title: 'Scan QR Code',
          description: 'Scan to connect instantly'
        }
      },
      
      footer: '© 2025 TeleDentAI. Empowering dental healthcare with artificial intelligence.',
      addPhoto: ''
    },
    
    ar: {
      title: 'عن المشروع',
      subtitle: 'إحداث ثورة في رعاية صحة الأسنان من خلال الذكاء الاصطناعي',
      
      mission: {
        title: 'مهمتنا',
        description:  "تمكين أولياء الأمور ومقدمي الرعاية الصحية بأداة فحص مبتكرة تعتمد على الذكاء الاصطناعي لإكتشاف مشاكل الأسنان لدى الأطفال في مراحلها المبكرة. مهمتنا هي توفير وسيلة فحص أولية دقيقة ومتاحة للجميع، تُمكّن من التدخل المبكر والوقاية، وتحمي ابتسامات الأطفال أينما كانوا"
      },
      
      teamSection: {
        title: 'فريق التطوير',
        subtitle: 'تعرف على العقول وراء الابتكار'
      },
      
      teamMembers: [
        { name: 'يزيد العمري', department: 'كلية الحاسبات وتقنية المعلومات، جامعة الملك عبدالعزيز', Photo: '/Yazeed.jpeg' },
        { name: 'نورة القحطاني', department: 'كلية الحاسبات وتقنية المعلومات، جامعة الملك عبدالعزيز', Photo: '/Norah.png' },
        { name: 'نواف الغامدي', department: 'كلية الحاسبات وتقنية المعلومات، جامعة الملك عبدالعزيز', Photo: '/Nawaf.jpeg' },
        { name: 'غادة الشهري', department: 'كلية الحاسبات وتقنية المعلومات، جامعة الملك عبدالعزيز', Photo: '/W.jpg' }
      ],
      
      story: {
        title: 'القصة وراء TeleDentAI',
        description: 
       "نشأت فكرة هذا المشروع خلال فترة تدريبنا الصيفي في مركز التميز البحثي بالذكاء الاصطناعي وعلم البيانات بجامعة الملك عبدالعزيز (AIADS)، بالتعاون مع كلية طب الأسنان بجامعة الملك عبدالعزيز. وقد تناول المشروع توظيف الذكاء الاصطناعي للاستجابة لتحد حقيقي: انتشار مشاكل الأسنان بشكل مقلق بين الأطفال في المملكة العربية السعودية. عملنا على بناء حل يحدث فرقاً ملموساً في حياة الأطفال وعائلاتهم. وبعد الانتهاء من التدريب وتحقيق أهدافه تم تطوير TeleDentAI كجهد مستقل من فريق التطوير وما بدأ كمشروع تدريبي تحول إلى التزام دفعنا لمواصلة تطوير أداة تساهم في الاكتشاف المبكر لمشاكل الأسنان. ونهدف من خلال TeleDentAI إلى جعل الفحص المبدئي لأسنان الأطفال متاحاً للجميع من أي مكان، مما يسهّل على الأهالي ومقدمي الرعاية الصحية مهمة المتابعة الدورية. نجاح المشروع لم يكن ليتحقق دون إشراف الدكتورة سلطانة الشمري والدكتورة إيمان الحربي والدكتورة أروى المبارك من مركز الذكاء الاصطناعي وعلم البيانات AIADS اللاتي منحونا من وقتهم وخبرتهم بسخاء. وامتناننا العميق للدكتورة نرمين هلال والدكتور محمد الشايع على مساهمتهم من خلال طرح الفكرة وتوفير البيانات الأصلية والرؤى القيّمة التي قدموها، وللدكتورة رهف هلال على دقتها في مراجعة توسيم البيانات."    
      },
      
      contact: {
        title: 'تواصل معنا',
        email: {
          title: 'التواصل عبر البريد الإلكتروني',
          description: 'احصل على عناوين البريد الإلكتروني لفريقنا ومعلومات الاتصال من خلال دليل Linktree الشامل الخاص بنا.',
          button: 'زيارة Linktree الخاص بنا'
        },
        qr: {
          title: 'امسح رمز QR',
          description: 'امسح للاتصال فورًا'
        }
      },
      
      footer: '© 2025 TeleDentAI. تمكين الرعاية الصحية للأسنان بالذكاء الاصطناعي.',
      addPhoto: ''
    }
  };

  const isRTL = lang === 'ar';
  const t = content[lang];

  return (
    <div className={`min-h-screen bg-slate-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-emerald-400 to-teal-400 text-white py-20 md:py-32">
        {/* Animated Background Effect */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-300 rounded-full mix-blend-overlay filter blur-3xl animate-pulse" style={{ animationDuration: '6s' }}></div>
        </div>
        
        {/* Decorative grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-30" />
        
        {/* Circuit Line Animations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent circuit-line"></div>
          <div className="absolute top-2/3 right-1/4 w-48 h-1 bg-gradient-to-r from-transparent via-teal-200/30 to-transparent circuit-line" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 animate-fade-in tracking-tight">
            {t.title}
          </h1>
          <p className="text-xl md:text-2xl text-emerald-50 max-w-3xl mx-auto leading-relaxed">
            {t.subtitle}
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

      {/* Mission Section */}
      <section className="max-w-5xl mx-auto px-6 py-16 md:py-24 bg-slate-50">
        <div className="bg-white rounded-3xl shadow-premium border border-slate-100 p-8 md:p-12 text-center transform transition-all duration-300 hover:shadow-card-hover hover:border-emerald-200">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            {t.mission.title}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mx-auto mb-6" />
          <p className="text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
            {t.mission.description}
          </p>
        </div>
      </section>

      {/* Development Team Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 bg-slate-50">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="w-8 h-8 text-emerald-600" />
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              {t.teamSection.title}
            </h2>
          </div>
          <p className="text-xl text-slate-600">
            {t.teamSection.subtitle}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {t.teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-premium border border-slate-100 overflow-hidden transform transition-all duration-300 hover:shadow-card-hover hover:border-emerald-200 hover:scale-[1.02] animate-fade-in"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              {/* Photo Placeholder */}
              <div className="aspect-square bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center relative group">
                {member.Photo ? (
                  <img src={member.Photo} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-white">
                    <Users className="w-16 h-16 mx-auto mb-2 opacity-80" />
                    <p className="text-sm font-medium opacity-80">{t.addPhoto}</p>
                  </div>
                )}
              </div>
              
              {/* Member Info */}
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-slate-600 text-sm">
                  {member.department}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The Story Behind TeleDentAI Section */}
      <section className="max-w-5xl mx-auto px-6 py-16 md:py-24 bg-slate-50">
        <div className="bg-white rounded-3xl shadow-premium border border-slate-100 p-8 md:p-12 text-center transform transition-all duration-300 hover:shadow-card-hover hover:border-emerald-200">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            {t.story.title}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mx-auto mb-6" />
          <p className="text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
            {t.story.description}
          </p>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-500 text-white py-16 md:py-24">
        {/* Background Animation */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-2xl animate-pulse" style={{ animationDuration: '5s' }}></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-teal-300 rounded-full mix-blend-overlay filter blur-2xl animate-pulse" style={{ animationDuration: '7s' }}></div>
        </div>
        
        {/* Decorative grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-20" />

        <div className="relative max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 tracking-tight">
            {t.contact.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Linktree Card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl transform transition-all duration-300 hover:scale-105 hover:bg-white/15">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/20 rounded-full">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold">
                  {t.contact.email.title}
                </h3>
              </div>
              <p className="text-emerald-50 mb-6 leading-relaxed">
                {t.contact.email.description}
              </p>
              <a
                href="https://linktr.ee/TeledentAI"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-600 font-semibold rounded-full hover:bg-emerald-50 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                {t.contact.email.button}
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* QR Code Card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl transform transition-all duration-300 hover:scale-105 hover:bg-white/15">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/20 rounded-full">
                  <QrCode className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold">
                  {t.contact.qr.title}
                </h3>
              </div>
              <p className="text-emerald-50 mb-6">
                {t.contact.qr.description}
              </p>
              
              {/* QR Code */}
              <div 
                onClick={() => setIsQRExpanded(!isQRExpanded)}
                className={`bg-white rounded-2xl p-6 flex items-center justify-center mx-auto cursor-pointer hover:shadow-2xl transition-all duration-500 ${
                  isQRExpanded ? 'max-w-lg scale-105' : 'max-w-xs hover:scale-105'
                }`}
              >
                <img 
                  src="/qr-code.png" 
                  alt="TeledentAI Linktree QR Code" 
                  className="max-w-full h-auto rounded-lg transition-all duration-500"
                />
              </div>
              <p className="text-center text-sm text-emerald-50 mt-4 italic">
                {isQRExpanded ? 'Click to minimize' : 'Click to expand'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm">
            {t.footer}
          </p>
        </div>
      </footer>
    </div>
  );
}

