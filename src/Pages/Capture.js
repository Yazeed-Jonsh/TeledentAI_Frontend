import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../Context/LangContext";
import { 
  Camera, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  Clipboard,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Smile
} from "lucide-react";

const SLOTS = ["front", "left", "right", "upper", "lower"];

export default function Capture() {
  const { t, lang } = useI18n();
  const [images, setImages] = useState({});
  const [current, setCurrent] = useState("front");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [streamOn, setStreamOn] = useState(false);
  const navigate = useNavigate();

  // ==================================================================================
  // FIX: Calculate how many images have been captured (matches Integration)
  // Only allow proceeding to Results when ALL 5 images are captured
  // ==================================================================================
  const capturedCount = Object.values(images).filter(img => img).length;
  const allImagesRequired = SLOTS.length; // 5 images required
  const allImagesCaptured = capturedCount === allImagesRequired;

  const startCam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setStreamOn(true);
    } catch (e) {
      alert("Camera not available. Use Upload instead.");
    }
  };

  const snap = () => {
    if (!videoRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0);
    
    // ==================================================================================
    // FIX #1: Use JPEG format with 80% quality (matches Integration project)
    // This significantly reduces image size for faster API upload and processing
    // PNG was causing large file sizes that could timeout during API calls
    // ==================================================================================
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
    setImages((prev) => ({ ...prev, [current]: dataUrl }));
  };

  const onUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImages((p) => ({ ...p, [current]: reader.result }));
    reader.readAsDataURL(file);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-emerald-400 to-teal-400 py-16 md:py-20">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        
        {/* Circuit Line Animations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent circuit-line"></div>
          <div className="absolute top-2/3 right-1/4 w-48 h-1 bg-gradient-to-r from-transparent via-teal-200/30 to-transparent circuit-line" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 animate-fade-in">
            {t("capture.title")}
          </h1>
          <p className="text-xl text-emerald-50 max-w-2xl mx-auto animate-fade-in" style={{animationDelay: '0.1s'}}>
            {t("capture.subtitle") || "Capture images from 5 different angles for comprehensive AI analysis"}
          </p>
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

      <section className="py-12 md:py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Progress Indicator */}
          <div className="mb-8 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-6 shadow-premium animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-glow-emerald animate-pulse-slow">
                  {capturedCount}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">
                    {t("capture.progress")}: {capturedCount} {t("capture.of")} {allImagesRequired}
                  </h3>
                  <p className="text-sm text-slate-600">{t("capture.imagesCaptured")}</p>
                </div>
              </div>
              {allImagesCaptured ? (
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 font-semibold rounded-full border border-green-300 shadow-md hover:shadow-glow-emerald transition-all duration-300">
                  <span className="animate-pulse-glow">✓</span> {t("capture.allReady")}
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 font-semibold rounded-full border border-orange-300 shadow-md hover:shadow-lg transition-all duration-300">
                  <span className="animate-pulse-slow">⏳</span> {t("capture.pleaseCapture")} {allImagesRequired - capturedCount} {t("capture.viewsText")}
                </span>
              )}
            </div>
            
            {/* Progress Bar */}
            <div className="relative w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500 ease-out shadow-lg"
                style={{ width: `${(capturedCount / allImagesRequired) * 100}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* View Selector */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-glow-emerald">
                  <Clipboard className="w-6 h-6 text-white" />
                </div>
                {t("capture.selectView") || "Select View"}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {SLOTS.map((key) => {
                  const icons = {
                    front: <Smile className="w-6 h-6" />,
                    left: <ArrowLeft className="w-6 h-6" />,
                    right: <ArrowRight className="w-6 h-6" />,
                    upper: <ArrowUp className="w-6 h-6" />,
                    lower: <ArrowDown className="w-6 h-6" />
                  };
                  
                  return (
                    <button
                      key={key}
                      onClick={() => setCurrent(key)}
                      className={`
                        group relative border-2 rounded-xl p-4 text-left 
                        transition-all duration-300 ease-out
                        ${current === key 
                          ? "border-emerald-500 bg-emerald-50 shadow-glow-emerald scale-105" 
                          : "border-slate-200 hover:border-emerald-300 hover:bg-slate-50 hover:shadow-premium"}
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`
                          w-12 h-12 rounded-xl flex items-center justify-center text-3xl
                          ${current === key 
                            ? "bg-gradient-to-br from-emerald-500 to-teal-500 shadow-glow-emerald" 
                            : "bg-slate-100 group-hover:bg-gradient-to-br group-hover:from-emerald-500/80 group-hover:to-teal-500/80"}
                          transition-all duration-300
                        `}>
                          {icons[key]}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-slate-900 capitalize">
                            {t(`capture.views.${key}`)}
                          </div>
                          <div className={`text-xs mt-1 font-medium ${images[key] ? "text-green-600" : "text-slate-500"}`}>
                            {images[key] ? (
                              <span className="flex items-center gap-1">
                                <CheckCircle className="w-4 h-4 text-green-600 animate-pulse-glow" /> {t("capture.captured")}
                              </span>
                            ) : (
                              <span>{t("capture.notCaptured")}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      {current === key && (
                        <div className="absolute top-2 right-2 w-3 h-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full animate-pulse shadow-glow-emerald" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Camera/Preview Panel */}
            <div className="bg-white rounded-2xl shadow-premium border border-slate-100 p-6 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900 capitalize flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-glow-emerald">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  {t("capture.current")} {t(`capture.views.${current}`)}
                </h3>
                {images[current] && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 font-semibold text-sm rounded-full shadow-glow-emerald animate-pulse-slow">
                    <CheckCircle className="w-4 h-4 text-green-600 animate-pulse-glow" /> {t("capture.saved")}
                  </span>
                )}
              </div>
              
              {/* Preview Area */}
              <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden shadow-inner border-2 border-slate-200">
                {images[current] ? (
                  <img src={images[current]} alt="preview" className="w-full h-full object-contain" />
                ) : (
                  <video ref={videoRef} className="w-full h-full object-cover" />
                )}
                {!images[current] && !streamOn && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center mb-4">
                        <Camera className="w-16 h-16 text-white/50" />
                      </div>
                      <p className="text-lg font-semibold">{t("capture.noPreview") || "No preview available"}</p>
                      <p className="text-sm text-slate-300 mt-2">{t("capture.startCameraOrUpload") || "Start camera or upload an image"}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-6">
                <label className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl border-2 border-slate-200 hover:bg-slate-200 hover:border-slate-300 hover:shadow-premium cursor-pointer transition-all duration-300 ease-out">
                  <div className="w-6 h-6 bg-slate-200 rounded-lg flex items-center justify-center group-hover:bg-slate-300 transition-colors">
                    <Upload className="w-4 h-4 text-slate-600" />
                  </div>
                  {t("capture.upload")}
                  <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
                </label>
                
                {!streamOn && (
                  <button 
                    className="group flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 hover:scale-105 hover:shadow-glow-emerald transition-all duration-300 ease-out shadow-lg"
                    onClick={startCam}
                  >
                    <div className="w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                      <Camera className="w-4 h-4 text-white" />
                    </div>
                    {t("capture.startCam")}
                  </button>
                )}
                
                {streamOn && (
                  <button 
                    className="group flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:scale-105 hover:shadow-glow-emerald-lg transition-all duration-300 ease-out shadow-lg"
                    onClick={snap}
                  >
                    <div className="w-6 h-6 bg-emerald-400 rounded-lg flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                      <Camera className="w-4 h-4 text-white" />
                    </div>
                    {t("capture.snap")}
                  </button>
                )}
                
                {images[current] && (
                  <button 
                    className="group flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-3 bg-orange-100 text-orange-700 font-semibold rounded-xl border-2 border-orange-300 hover:bg-orange-200 hover:border-orange-400 hover:shadow-lg transition-all duration-300 ease-out"
                    onClick={() => setImages((p) => ({ ...p, [current]: undefined }))}
                  >
                    <div className="w-6 h-6 bg-orange-200 rounded-lg flex items-center justify-center group-hover:bg-orange-300 transition-colors">
                      <RefreshCw className="w-4 h-4 text-orange-700" />
                    </div>
                    {t("capture.replace")}
                  </button>
                )}
              </div>

              {/* Tips */}
              <div className="mt-6 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 shadow-premium animate-fade-in">
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center shadow-glow-emerald">
                      <AlertTriangle className="w-5 h-5 text-white" />
                    </div>
                  <p className="text-sm text-slate-700 flex-1">
                    <strong className="text-emerald-700">{t(`capture.viewTips.${current}.tips`)}:</strong> {t(`capture.viewTips.${current}.tipsText`)}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Warning/CTA Section */}
          <div className="mt-8 space-y-6">
            {/* Warning Card */}
            {!allImagesCaptured && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl p-6 shadow-premium animate-fade-in">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center shadow-lg animate-pulse-slow">
                    <AlertTriangle className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-yellow-900 mb-2">
                      {t("capture.warning")} {allImagesRequired} {t("capture.beforeProceeding")}
                    </h4>
                    <p className="text-yellow-800">
                      <span className="font-semibold">{t("capture.missing")}: </span>
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-yellow-200 to-orange-200 text-yellow-900 font-bold rounded-full shadow-md">
                        {allImagesRequired - capturedCount} {t("capture.images")}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Proceed Button */}
            <div className="flex justify-center">
              <button 
                onClick={() => {
                  if (!allImagesCaptured) {
                    const alertMsg = t("capture.alertMessage").replace("{0}", allImagesRequired).replace("{1}", capturedCount);
                    alert(alertMsg);
                    return;
                  }
                  
                  console.log(`[Capture] All ${allImagesRequired} images captured - proceeding to Results`);
                  // FIX: Pass images via React Router state instead of sessionStorage
                  // This keeps images in memory only and avoids QuotaExceededError
                  navigate("/results", { state: { dentalImages: images } });
                }}
                disabled={!allImagesCaptured}
                className={`
                  group relative px-10 py-5 rounded-full font-bold text-lg shadow-2xl
                  transition-all duration-300 min-w-[280px]
                  ${allImagesCaptured 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:scale-105 hover:shadow-glow-emerald-lg cursor-pointer' 
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'}
                `}
              >
                {allImagesCaptured ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    {t("capture.next")} {t("capture.analyzeAll")}
                    <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-6 h-6 bg-slate-400 rounded-lg flex items-center justify-center">
                      <Camera className="w-4 h-4 text-white" />
                    </div>
                    {t("capture.captureFirst")} {allImagesRequired - capturedCount} {t("capture.imagesFirst")}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      <canvas ref={canvasRef} className="hidden" />
    </>
  );
}