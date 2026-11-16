import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F4F7FB] flex flex-col items-center justify-center p-6 font-manrope">
      <div className="w-16 h-16 rounded-full bg-[#635BFF]/10 text-[#635BFF] flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-[#1E293B] mb-2">Page Not Found</h2>
      <p className="text-[#64748B] text-sm max-w-md mb-6 text-center">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/dashboard"
        className="px-5 py-2.5 bg-[#635BFF] hover:bg-[#524be0] text-white rounded-lg font-bold text-sm transition-colors"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
