import React, { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';
import { Camera, X, Upload, Check, AlertTriangle, Flashlight, RefreshCw, Sparkles, ShieldCheck } from 'lucide-react';

interface QRScannerModalProps {
  title?: string;
  onClose: () => void;
  onScanSuccess: (scannedData: string) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  title = 'Scan Address QR Code',
  onClose,
  onScanSuccess,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanning, setScanning] = useState<boolean>(true);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState<boolean>(false);

  const requestRef = useRef<number | null>(null);

  // Sample fallback QR payloads for easy testing in browser without physical camera
  const sampleAddresses = [
    { label: 'USDT-TRC20 Address (TRON)', address: 'TYD12aN74z34J9X2a89mZ41Pq9m5TrC20v' },
    { label: 'TRON Vault Address (TRC20)', address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t' },
    { label: 'BEP20 Vault Address (BNB Chain)', address: '0x71C82910a39B21495c0234123984A018281989A2' },
    { label: 'Bitcoin (BTC) Wallet Address', address: 'bc1q9x2a89mz41pq9m5trc20v38a1t8z34j' },
  ];

  // Clean raw QR payload (remove URI schemes like tron:, ethereum:, solana:, pay:)
  const cleanAddress = (raw: string): string => {
    let clean = raw.trim();
    if (clean.includes(':')) {
      const parts = clean.split(':');
      clean = parts[parts.length - 1];
    }
    if (clean.includes('?')) {
      clean = clean.split('?')[0];
    }
    return clean;
  };

  // Start Camera
  useEffect(() => {
    let activeStream: MediaStream | null = null;

    async function initCamera() {
      try {
        setCameraError(null);
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        });

        activeStream = mediaStream;
        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.setAttribute('playsinline', 'true'); // required for iOS safari / iframe
          await videoRef.current.play();
          setCameraActive(true);
        }
      } catch (err: any) {
        console.warn('Camera access error:', err);
        setCameraError(
          err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
            ? 'Camera permission was denied. You can still upload a QR image or select a sample address below.'
            : 'Camera device unavailable or restricted in iframe preview. Use image upload or quick sample addresses below.'
        );
      }
    }

    initCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  // Frame processing loop with jsQR
  useEffect(() => {
    if (!cameraActive || !scanning) return;

    const scanFrame = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && video.readyState === video.HAVE_ENOUGH_DATA && canvas) {
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'attemptBoth',
          });

          if (code && code.data) {
            const result = cleanAddress(code.data);
            if (result.length > 10) {
              handleDetectedResult(result);
              return;
            }
          }
        }
      }

      requestRef.current = requestAnimationFrame(scanFrame);
    };

    requestRef.current = requestAnimationFrame(scanFrame);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [cameraActive, scanning]);

  const handleDetectedResult = (address: string) => {
    setScanning(false);
    setScannedResult(address);

    // Stop camera stream on successful scan
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    // Callback after delay for visual animation
    setTimeout(() => {
      onScanSuccess(address);
    }, 1200);
  };

  // Handle file upload decoding
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'attemptBoth',
          });

          if (code && code.data) {
            handleDetectedResult(cleanAddress(code.data));
          } else {
            alert('Could not detect a valid QR code in the uploaded image. Please try another image.');
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Toggle Torch Light
  const toggleTorch = async () => {
    if (!stream) return;
    const track = stream.getVideoTracks()[0];
    if (track) {
      try {
        const capabilities: any = track.getCapabilities();
        if (capabilities.torch) {
          await track.applyConstraints({
            advanced: [{ torch: !torchOn }] as any,
          });
          setTorchOn(!torchOn);
        } else {
          setTorchOn(!torchOn); // visual fallback
        }
      } catch (e) {
        setTorchOn(!torchOn);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-[#0a0805]/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="glass-card border border-white/10 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-white/10 pb-3.5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#faf7f0]">{title}</h3>
              <p className="text-[11px] text-[#a09c8f] font-mono">Camera QR Viewfinder</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#a09c8f] hover:text-white hover:bg-[#35322d] transition-all text-sm font-bold"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Viewfinder Box */}
        <div className="relative rounded-2xl overflow-hidden bg-[#0a0805] border-2 border-[#ccff00]/40 shadow-inner flex flex-col items-center justify-center min-h-[260px]">
          {/* Hidden Canvas for Frame Processing */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Video Stream Element */}
          <video
            ref={videoRef}
            className={`w-full h-[260px] object-cover ${cameraActive ? 'block' : 'hidden'}`}
          />

          {/* Scanning Overlay Reticle & Laser Line */}
          {cameraActive && scanning && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {/* Corner Frame Lines */}
              <div className="w-48 h-48 relative border-2 border-dashed border-[#ccff00]/40 rounded-2xl">
                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-[#ccff00] rounded-tl-lg" />
                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-[#ccff00] rounded-tr-lg" />
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-[#ccff00] rounded-bl-lg" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-[#ccff00] rounded-br-lg" />

                {/* Laser Scanning Line Animation */}
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee] animate-pulse absolute top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          {/* Scanned Success Overlay */}
          {scannedResult && (
            <div className="absolute inset-0 bg-[#0a0805]/90 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center space-y-3 z-10 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-[#ccff00]/15 border border-[#ccff00]/40 text-[#ccff00] flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Check className="w-6 h-6 text-[#ccff00]" />
              </div>
              <h4 className="text-sm font-semibold text-[#faf7f0]">QR Code Detected!</h4>
              <div className="bg-[#1c180d] p-2.5 rounded-xl border border-white/10 font-mono text-xs text-amber-400 break-all max-w-[280px]">
                {scannedResult}
              </div>
              <p className="text-[11px] text-[#a09c8f]">Applying scanned address...</p>
            </div>
          )}

          {/* Camera Error / Fallback Banner */}
          {!cameraActive && !scannedResult && (
            <div className="p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <p className="text-xs text-[#e8e5dc] font-medium leading-relaxed max-w-[280px] mx-auto">
                {cameraError || 'Initializing Camera Feed...'}
              </p>
            </div>
          )}

          {/* Camera Controls Bar */}
          {cameraActive && !scannedResult && (
            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center bg-[#1c180d]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs font-mono">
              <span className="text-[#ccff00] font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-ping" />
                Camera Live
              </span>
              <button
                type="button"
                onClick={toggleTorch}
                className={`p-1.5 rounded-lg border transition-all flex items-center gap-1 ${
                  torchOn
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-[#35322d] text-[#a09c8f] border-white/5 hover:text-white'
                }`}
              >
                <Flashlight className="w-3.5 h-3.5" />
                <span className="text-[10px]">{torchOn ? 'Torch ON' : 'Torch'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Upload QR Image File Option */}
        <div className="pt-2 border-t border-white/10">
          <label className="w-full py-2.5 px-4 rounded-xl bg-[#1c180d] hover:bg-[#35322d] border border-white/10 text-xs font-bold text-[#e8e5dc] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95">
            <Upload className="w-4 h-4 text-[#ccff00]" />
            <span>Upload QR Image from Gallery</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Quick Demo Sample Address Selector (Always accessible) */}
        <div className="bg-black/40 p-3.5 rounded-2xl border border-white/5 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#e8e5dc]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Simulate Scan with Quick Sample Address:</span>
          </div>
          <div className="space-y-1.5">
            {sampleAddresses.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleDetectedResult(s.address)}
                className="w-full p-2 rounded-xl bg-[#1c180d]/80 hover:bg-[#ccff00]/15 border border-white/5 hover:border-[#ccff00]/30 text-left transition-all group flex justify-between items-center"
              >
                <div>
                  <span className="text-[11px] font-bold text-[#e8e5dc] block group-hover:text-[#ccff00]">
                    {s.label}
                  </span>
                  <span className="text-[10px] font-mono text-[#a09c8f] block truncate max-w-[240px]">
                    {s.address}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/25 group-hover:bg-[#ccff00] group-hover:text-[#110e08] transition-all">
                  Use
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#a09c8f] font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-[#ccff00]" />
          <span>Supports TRC20, BEP20 & Bitcoin QR formats</span>
        </div>
      </div>
    </div>
  );
};
