// ==================================================================================
// Results Page - Displays AI Detection Results
// ==================================================================================
// INTEGRATION: This page now processes images using the FastAPI backend
// API calls are made to detect dental conditions in captured images
// ==================================================================================

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useI18n } from "../Context/LangContext";

// ==================================================================================
// API INTEGRATION: Import individual API functions (matches Integration pattern)
// Using individual functions instead of batch functions for better error handling
// ==================================================================================
import { 
  detectObjectsFromImage,   // Get JSON detection results for single image
  getAnnotatedImage,         // Get annotated image with bounding boxes
  checkApiHealth             // Verify API server is running
} from "../services/api";

export default function Results() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  
  // ==================================================================================
  // STATE MANAGEMENT: Matches Integration project structure
  // ==================================================================================
  const [images, setImages] = useState({});
  const [detectionResults, setDetectionResults] = useState({});
  const [annotatedImages, setAnnotatedImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [apiConnected, setApiConnected] = useState(false);
  const [error, setError] = useState(null);
  
  // ==================================================================================
  // FIX: Add processing progress state to show real-time feedback during AI analysis
  // This helps users see which images are being processed (matches Integration UX)
  // ==================================================================================
  const [processingProgress, setProcessingProgress] = useState({
    current: 0,
    total: 0,
    currentView: '',
    status: 'Initializing...'
  });

  // ==================================================================================
  // CRITICAL FIX: Read images from React Router state instead of sessionStorage
  // This prevents QuotaExceededError by keeping images in memory (React state) only
  // Images are passed via navigate("/results", { state: { dentalImages: images } })
  // ==================================================================================
  useEffect(() => {
    const routerImages = location.state?.dentalImages;
    if (routerImages && Object.keys(routerImages).length > 0) {
      console.log('[Results] Images received from router state:', Object.keys(routerImages));
      setImages(routerImages);
    } else {
      console.error('[Results] No images found in router state');
      setError(t("results.noImagesFound"));
      setLoading(false);
    }
  }, [location.state]);

  // ==================================================================================
  // FIX #4: Process images using exact Integration pattern
  // Process each image individually with Promise.all for parallel execution
  // This matches the working Integration implementation exactly
  // ==================================================================================
  useEffect(() => {
    const processImages = async () => {
      // Check if we have images to process
      if (!images || Object.keys(images).length === 0) {
        return; // Will be handled by previous useEffect
      }

      try {
        // Step 1: Check if FastAPI server is running (health check)
        console.log('[API] Checking API health...');
        const isHealthy = await checkApiHealth();
        setApiConnected(isHealthy);

        if (!isHealthy) {
          console.error('[API] Health check failed - server not responding');
          // ==================================================================================
          // i18n: Error message uses translation key
          // ==================================================================================
          setError(t("results.errorMessage"));
          setLoading(false);
          return;
        }

        console.log('[API] Health check passed - server is running');

        // ==================================================================================
        // Step 2: Process each image with Promise.all (EXACT Integration pattern)
        // Each image is processed independently, allowing partial success
        // FIX: Added real-time progress updates for better user feedback
        // ==================================================================================
        const imageEntries = Object.entries(images);
        console.log(`[API] Processing ${imageEntries.length} images...`);
        
        setProcessingProgress({
          current: 0,
          total: imageEntries.length,
          currentView: '',
          status: `Starting AI analysis of ${imageEntries.length} images...`
        });

        const analysisPromises = imageEntries.map(async ([viewName, imageDataUrl], index) => {
          try {
            // ==================================================================================
            // FIX: Update progress in real-time as each image is being processed
            // ==================================================================================
            setProcessingProgress({
              current: index + 1,
              total: imageEntries.length,
              currentView: viewName,
              status: `Analyzing ${viewName} view... (${index + 1}/${imageEntries.length})`
            });
            
            console.log(`[API] Processing ${viewName} view...`);
            
            // Get detection results (JSON) - calls /img_object_detection_to_json
            const detectionResult = await detectObjectsFromImage(imageDataUrl);
            console.log(`[API] ${viewName} detection complete:`, detectionResult);
            
            // Get annotated image with bounding boxes - calls /img_object_detection_to_img
            let annotatedImage = null;
            try {
              annotatedImage = await getAnnotatedImage(imageDataUrl);
              console.log(`[API] ${viewName} annotation complete`);
            } catch (error) {
              console.error(`[API] Failed to get annotated image for ${viewName}:`, error);
              // Continue even if annotation fails - use original image
            }
            
            return {
              viewName,
              success: true,
              data: detectionResult,
              annotatedImage
            };
          } catch (error) {
            console.error(`[API] Error processing ${viewName}:`, error);
            return {
              viewName,
              success: false,
              error: error.message,
              data: null,
              annotatedImage: null
            };
          }
        });
        
        // Wait for all images to be processed
        const results = await Promise.all(analysisPromises);
        console.log('[API] All images processed:', results);
        
        // ==================================================================================
        // Step 3: Organize results into state (keyed by view name)
        // ==================================================================================
        const resultsMap = {};
        const annotatedMap = {};
        
        results.forEach(result => {
          resultsMap[result.viewName] = {
            success: result.success,
            data: result.data,
            error: result.error
          };
          if (result.annotatedImage) {
            annotatedMap[result.viewName] = result.annotatedImage;
          }
        });
        
        setDetectionResults(resultsMap);
        setAnnotatedImages(annotatedMap);
        setLoading(false);
        
        console.log('[API] Processing complete - results saved to state');
      } catch (err) {
        console.error("[API] Error during image processing:", err);
        setError(`Error: ${err.message}`);
        setLoading(false);
      }
    };

    processImages();
  }, [images]);

  // ==================================================================================
  // HELPER FUNCTION: Calculate overall health status
  // ==================================================================================
  const getOverallStatus = () => {
    let totalDetections = 0;
    let hasIssues = false;

    Object.values(detectionResults).forEach(result => {
      if (result.success && result.data?.detect_objects) {
        totalDetections += result.data.detect_objects.length;
        if (result.data.detect_objects.length > 0) {
          hasIssues = true;
        }
      }
    });

    return { totalDetections, hasIssues };
  };

  const { totalDetections, hasIssues } = getOverallStatus();

  // ==================================================================================
  // RENDER: Loading state with real-time progress
  // FIX: Enhanced loading display showing which image is being processed
  // This matches the Integration project's user experience
  // ==================================================================================
  if (loading) {
    return (
      <>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-emerald-400 to-teal-400 py-16 md:py-20">
          <div className="absolute inset-0 grid-pattern opacity-30" />
          <div className="relative max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
              {t("results.title")}
            </h1>
            <p className="text-xl text-emerald-50">
              {t("results.aiAnalysisInProgress")}
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

        <section className="py-16 md:py-24 bg-slate-50">
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-10 md:p-12">
              {/* Animated Spinner */}
              <div className="flex flex-col items-center justify-center mb-8">
                <div className="relative">
                  <div className="inline-block animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-emerald-500"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl">🤖</span>
                  </div>
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-6 mb-2">
                  {t("results.aiAnalysisInProgress")}
                </h2>
                <p className="text-slate-600 text-center">
                  {t("results.processingImages")}
                </p>
              </div>

              {/* Progress Bar */}
              {processingProgress.total > 0 && (
                <div className="mt-8">
                  <div className="flex justify-between text-sm mb-3">
                    <span className="font-bold text-emerald-700">
                      {processingProgress.status}
                    </span>
                    <span className="font-semibold text-slate-600">
                      {processingProgress.current} / {processingProgress.total}
                    </span>
                  </div>
                  
                  {/* Animated Progress Bar */}
                  <div className="relative w-full bg-slate-200 rounded-full h-4 overflow-hidden shadow-inner">
                    <div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500 ease-out shadow-lg"
                      style={{ 
                        width: `${(processingProgress.current / processingProgress.total) * 100}%` 
                      }}
                    />
                  </div>
                  
                  {processingProgress.currentView && (
                    <div className="text-center text-sm text-slate-600 mt-3 font-medium">
                      {t("results.currentlyProcessing")} <span className="font-bold text-emerald-600">{t(`capture.views.${processingProgress.currentView}`)}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Processing Steps */}
              <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="text-3xl mb-2">✓</span>
                  <span className="font-semibold text-emerald-700">{t("results.loadingImages")}</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-emerald-50 rounded-xl border border-emerald-200 animate-pulse">
                  <span className="text-3xl mb-2">⏳</span>
                  <span className="font-semibold text-emerald-700">{t("results.detectingConditions")}</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-slate-100 rounded-xl border border-slate-200">
                  <span className="text-3xl mb-2">◯</span>
                  <span className="font-semibold text-slate-500">{t("results.generatingReport")}</span>
                </div>
              </div>
              
              <p className="text-sm text-slate-500 text-center mt-8 p-4 bg-slate-50 rounded-xl">
                💡 {t("results.usuallyTakes")}
              </p>
            </div>
          </div>
        </section>
      </>
    );
  }

  // ==================================================================================
  // RENDER: Error state
  // ==================================================================================
  if (error) {
    return (
      <>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-red-500 via-red-400 to-orange-400 py-16 md:py-20">
          <div className="absolute inset-0 grid-pattern opacity-30" />
          <div className="relative max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
              {t("results.error")}
            </h1>
            <p className="text-xl text-red-50">
              {t("results.errorMessage")}
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

        <section className="py-16 md:py-24 bg-slate-50">
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-300 rounded-3xl shadow-2xl p-8 md:p-10">
              <div className="flex items-start gap-4 mb-6">
                <div className="text-5xl">⚠️</div>
                <div className="flex-1">
                  <h2 className="text-2xl font-extrabold text-red-900 mb-3">
                    {t("results.error")}
                  </h2>
                  <p className="text-lg text-red-700 bg-red-100 p-4 rounded-xl border border-red-300">
                    {error}
                  </p>
                </div>
              </div>

              {!apiConnected && (
                <div className="mt-6 bg-white rounded-2xl shadow-lg border border-red-200 p-6">
                  <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                    <span>🔧</span> {t("results.startServer")}
                  </h3>
                  <ol className="space-y-3 text-slate-700">
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</span>
                      <span>{t("results.navigateFolder")}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</span>
                      <div>
                        <span>{t("results.runCommand")}</span>
                        <code className="block mt-2 bg-slate-900 text-emerald-400 px-4 py-2 rounded-lg font-mono text-sm">
                          uvicorn main:app --reload
                        </code>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</span>
                      <span>{t("results.waitStartup")}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm">4</span>
                      <span>{t("results.refreshPage")}</span>
                    </li>
                  </ol>
                </div>
              )}

              <div className="mt-8 flex justify-center">
                <button 
                  className="px-10 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg rounded-full shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300"
                  onClick={() => navigate("/capture")}
                >
                  ← {t("results.backToCapture")}
                </button>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  // ==================================================================================
  // RENDER: Results display with AI detections
  // ==================================================================================
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-emerald-400 to-teal-400 py-16 md:py-20">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            {t("results.title")}
          </h1>
          <p className="text-xl text-emerald-50 max-w-2xl mx-auto">
            {t("results.sub")}
          </p>
          
          {/* API Status Badge */}
          <div className="mt-6 inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
            <span className={`w-3 h-3 rounded-full ${apiConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></span>
            <span className="text-white font-semibold">
              {t("results.aiServer")}: {apiConnected ? t("results.connected") : t("results.disconnected")}
            </span>
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

      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Overall Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-12">
            {/* Health Status Card */}
            <div className={`
              relative overflow-hidden rounded-2xl shadow-2xl p-6 md:p-8 border-2
              ${hasIssues 
                ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300' 
                : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-300'}
            `}>
              <div className="relative z-10">
                <div className="text-4xl md:text-5xl mb-3 md:mb-4">
                  {hasIssues ? '⚠️' : '✅'}
                </div>
                <h3 className={`text-xl md:text-2xl font-extrabold mb-2 ${hasIssues ? 'text-yellow-900' : 'text-emerald-900'}`}>
                  {hasIssues 
                    ? `${totalDetections} ${t("results.issuesDetected")}` 
                    : t("results.status_ok")}
                </h3>
                <p className={`text-sm md:text-base ${hasIssues ? 'text-yellow-700' : 'text-emerald-700'}`}>
                  {hasIssues 
                    ? t("results.reviewResults")
                    : t("results.status_warn")}
                </p>
              </div>
              <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 
                ${hasIssues ? 'bg-yellow-400' : 'bg-emerald-400'}`} />
            </div>

            {/* Consultation Card */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-2xl p-6 md:p-8 border-2 border-emerald-600 relative overflow-hidden">
              <div className="relative z-10">
                <div className="text-4xl md:text-5xl mb-3 md:mb-4">👨‍⚕️</div>
                <h3 className="text-xl md:text-2xl font-extrabold text-white mb-2">
                  {t("results.manage")}
                </h3>
                <p className="text-emerald-50 text-sm md:text-base mb-4 md:mb-6">
                  {t("results.consultDesc") || "Discuss your results with an expert dentist"}
                </p>
                <button 
                  className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-white text-emerald-600 font-bold text-base md:text-lg rounded-full shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300"
                  onClick={() => navigate("/chat")}
                >
                  {t("results.goChat")} 
                </button>
              </div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            </div>
          </div>

          {/* ==================================================================================
              INTEGRATION: Detailed Results for Each Image View
              i18n: Section heading localized
              ================================================================================== */}
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                {t("results.detailedAnalysis")}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mx-auto" />
            </div>

            <div className="space-y-8">
              {Object.entries(detectionResults).map(([viewName, result]) => {
                const icons = {
                  front: "",
                  left: "",
                  right: "",
                  upper: "",
                  lower: ""
                };

                return (
                  <div key={viewName} className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4">
                      <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        <span className="text-2xl">{icons[viewName]}</span>
                        {t(`capture.views.${viewName}`)}
                      </h3>
                    </div>
                    
                    <div className="p-6">
                      {result.success ? (
                        <>
                          {/* Images Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
                            <div>
                              <p className="text-sm md:text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
                                <span className="text-lg">📷</span> {t("results.originalImage")}
                              </p>
                              <img 
                                src={images[viewName]} 
                                alt={`${viewName} view`}
                                className="w-full rounded-xl border-2 border-slate-200 shadow-md hover:shadow-xl transition-shadow duration-300"
                              />
                            </div>

                            <div>
                              <p className="text-sm md:text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
                                <span className="text-lg">🤖</span> {t("results.aiAnalysis")}
                              </p>
                              <img 
                                src={annotatedImages[viewName] || images[viewName]} 
                                alt={`${viewName} view annotated`}
                                className="w-full rounded-xl border-2 border-emerald-200 shadow-md hover:shadow-xl transition-shadow duration-300"
                              />
                            </div>
                          </div>

                          {/* Detection Results */}
                          <div>
                            <h4 className="font-bold text-lg md:text-xl text-slate-900 mb-4 flex items-center gap-2">
                              <span className="text-2xl">🔍</span> {t("results.detectedConditions")}
                            </h4>
                            {result.data?.detect_objects && result.data.detect_objects.length > 0 ? (
                              <div className="space-y-3 md:space-y-4">
                                {result.data.detect_objects.map((detection, idx) => (
                                  <div 
                                    key={idx} 
                                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gradient-to-r from-yellow-50 to-orange-50 p-4 md:p-5 rounded-xl border-2 border-yellow-300 shadow-sm hover:shadow-lg transition-all duration-300"
                                  >
                                    <div className="flex items-center gap-3 flex-1">
                                      <span className="text-2xl md:text-3xl flex-shrink-0">⚠️</span>
                                      <span className="font-bold text-slate-900 text-base md:text-lg">{detection.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 self-start sm:self-center">
                                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-400 rounded-lg shadow-sm">
                                        <span className="text-xs font-semibold text-yellow-700 uppercase tracking-wide">
                                          {t("results.confidence")}
                                        </span>
                                        <span className="text-xl sm:text-2xl font-extrabold text-yellow-900">
                                          {(detection.confidence * 100).toFixed(1)}%
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 md:p-5 rounded-xl border-2 border-emerald-300">
                                <span className="text-3xl md:text-4xl">✅</span>
                                <span className="font-bold text-emerald-700 text-base md:text-lg">
                                  {t("results.noIssuesAll")}
                                </span>
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="flex items-start gap-4 bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-xl border-2 border-red-300">
                          <span className="text-3xl">⚠️</span>
                          <div>
                            <h4 className="font-bold text-red-900 mb-2">{t("results.errorProcessing")}</h4>
                            <p className="text-red-700">{result.error}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row flex-wrap gap-4 justify-center px-4">
            <button 
              className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-white text-slate-700 font-semibold text-base md:text-lg rounded-full border-2 border-slate-300 hover:bg-slate-50 hover:border-emerald-500 hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
              onClick={() => navigate("/capture")}
            >
              <span></span> {t("results.retakeImages")}
            </button>
            <button 
              className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-base md:text-lg rounded-full hover:scale-105 hover:shadow-2xl transition-all duration-300 shadow-xl flex items-center justify-center gap-2"
              onClick={() => navigate("/chat")}
            >
              {t("results.discussAI")} <span></span>
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
