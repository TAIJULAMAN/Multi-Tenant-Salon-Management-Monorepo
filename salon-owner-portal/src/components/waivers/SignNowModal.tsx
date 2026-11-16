import React, { useRef, useState } from "react";
import { X } from "lucide-react";

interface SignNowModalProps {
  signingSignerId: string | null;
  setSigningSignerId: (id: string | null) => void;
  updateSigner: (id: string, updates: any) => void;
}

export default function SignNowModal({
  signingSignerId,
  setSigningSignerId,
  updateSigner,
}: SignNowModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawingSignature, setIsDrawingSignature] = useState(false);

  if (!signingSignerId) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.nativeEvent.offsetX;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.nativeEvent.offsetY;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawingSignature(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingSignature) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.nativeEvent.offsetX;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.nativeEvent.offsetY;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawingSignature(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveDrawnSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !signingSignerId) return;
    
    const signatureData = canvas.toDataURL();
    updateSigner(signingSignerId, { signature: signatureData, isDrawing: false });
    setSigningSignerId(null);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1E293B]/40 backdrop-blur-sm">
      <div className="bg-white rounded-lg w-full max-w-[600px] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <h3 className="text-[16px] font-medium text-[#1E293B]">Sign Now</h3>
          <button
            onClick={() => setSigningSignerId(null)}
            className="text-[#64748B] hover:text-[#1E293B] transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 pt-0">
          <div className="border border-dashed border-[#635BFF]/50 rounded-lg p-2 bg-[#F8FAFC]/50">
            <canvas
              ref={canvasRef}
              width={500}
              height={240}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseOut={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="rounded-lg h-[240px] bg-white w-full cursor-crosshair border border-[#E2E8F0]"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 pb-6">
          <button
            onClick={() => setSigningSignerId(null)}
            className="px-6 py-2.5 rounded-lg text-[13px] font-medium bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0] transition-colors"
          >
            Cancel
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={clearSignature}
              className="px-6 py-2.5 rounded-lg text-[13px] font-medium bg-[#FDF2F8] text-[#F43F5E] hover:bg-[#FCE7F3] transition-colors"
            >
              Reset
            </button>
            <button
              onClick={saveDrawnSignature}
              className="px-6 py-2.5 rounded-lg text-[13px] font-medium bg-[#ECFEFF] text-[#0891B2] hover:bg-[#CFFAFE] transition-colors"
            >
              Save Signature
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
