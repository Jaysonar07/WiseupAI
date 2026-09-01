
import React, { useRef, useEffect, useState } from 'react';

interface ScanScreenProps {
  onCapture: (image: string) => void;
  onBack: () => void;
}

const ScanScreen: React.FC<ScanScreenProps> = ({ onCapture, onBack }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isStartingRef = useRef(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    if (isStartingRef.current) return;
    isStartingRef.current = true;
    setError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API not supported in this browser.");
      }

      // Stop any existing tracks before starting a new stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error("Camera error detail:", err);
      
      let message = "Could not access camera.";
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError' || err.message?.toLowerCase().includes('denied')) {
        message = "Camera access was denied. Please check your browser's site settings to allow camera access for this app, then try again.";
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        message = "No camera was found on this device.";
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        message = "Camera is already in use by another application.";
      } else {
        message = err.message || "An unexpected camera error occurred.";
      }
      
      setError(message);
    } finally {
      isStartingRef.current = false;
    }
  };

  useEffect(() => {
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Use video display size for canvas
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        onCapture(dataUrl);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col">
      <div className="absolute top-0 inset-x-0 z-50 p-6 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
        <button onClick={onBack} className="size-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
          <span className="material-symbols-outlined">close</span>
        </button>
        <p className="text-white font-bold text-sm tracking-widest uppercase">Scan Receipt</p>
        <div className="size-10"></div>
      </div>

      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        {error ? (
          <div className="p-8 text-center flex flex-col items-center gap-6 z-10 max-w-sm animate-in fade-in zoom-in">
            <div className="size-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-2">
              <span className="material-symbols-outlined text-5xl">videocam_off</span>
            </div>
            <h3 className="text-white text-xl font-bold tracking-tight">Camera Error</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              {error}
            </p>
            <div className="flex flex-col w-full gap-3">
              <button 
                onClick={startCamera}
                className="bg-primary text-background-dark font-black px-8 py-4 rounded-2xl active:scale-95 transition-all shadow-xl shadow-primary/20"
              >
                Try Again
              </button>
              <button 
                onClick={onBack}
                className="text-white/40 text-sm font-bold uppercase tracking-widest hover:text-white transition-colors py-2"
              >
                Go Back
              </button>
            </div>
          </div>
        ) : (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted
              className="h-full w-full object-cover"
            />
            
            {/* Scanner UI Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[80%] aspect-[3/4] border-2 border-primary/30 rounded-[2rem] relative">
                {/* Corner Accents */}
                <div className="absolute -top-1 -left-1 size-12 border-t-4 border-l-4 border-primary rounded-tl-2xl"></div>
                <div className="absolute -top-1 -right-1 size-12 border-t-4 border-r-4 border-primary rounded-tr-2xl"></div>
                <div className="absolute -bottom-1 -left-1 size-12 border-b-4 border-l-4 border-primary rounded-bl-2xl"></div>
                <div className="absolute -bottom-1 -right-1 size-12 border-b-4 border-r-4 border-primary rounded-br-2xl"></div>
                
                {/* Animated Scanning Line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-primary/60 shadow-[0_0_20px_rgba(208,187,149,0.8)] animate-[scan_2.5s_infinite_ease-in-out]"></div>
              </div>
            </div>

            <div className="absolute bottom-10 inset-x-0 flex flex-col items-center gap-8">
              <div className="bg-black/60 backdrop-blur-xl px-6 py-2.5 rounded-full border border-white/10 shadow-2xl">
                <p className="text-white/80 text-[10px] font-black uppercase tracking-[0.2em]">
                  Align receipt within frame
                </p>
              </div>
              
              <button 
                onClick={takePhoto}
                className="group relative size-24 rounded-full border-4 border-white/30 flex items-center justify-center active:scale-90 transition-all duration-300"
              >
                <div className="size-20 rounded-full bg-white shadow-2xl group-hover:scale-105 transition-transform"></div>
                <div className="absolute inset-0 rounded-full border-2 border-white scale-110 opacity-0 group-active:opacity-100 group-active:scale-100 transition-all"></div>
              </button>
            </div>
          </>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <style>{`
        @keyframes scan {
          0% { top: 5%; opacity: 0.3; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { top: 95%; opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

export default ScanScreen;
