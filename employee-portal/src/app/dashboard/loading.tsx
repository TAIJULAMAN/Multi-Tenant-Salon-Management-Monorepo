export default function Loading() {
  return (
    <div className="w-full h-full min-h-screen p-6 sm:p-8 bg-[#F4F6FA] animate-pulse space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="space-y-2">
          <div className="h-8 bg-[#E2E8F0] rounded-lg w-48 sm:w-64"></div>
          <div className="h-4 bg-[#E2E8F0] rounded-lg w-32 sm:w-48"></div>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="h-11 bg-[#E2E8F0] rounded-xl w-full sm:w-32"></div>
          <div className="h-11 bg-[#E2E8F0] rounded-xl w-full sm:w-32"></div>
        </div>
      </div>

      {/* Grid Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#F1F5F9]"></div>
              <div className="space-y-2">
                <div className="h-4 bg-[#F1F5F9] rounded w-20"></div>
                <div className="h-3 bg-[#F1F5F9] rounded w-12"></div>
              </div>
            </div>
            <div className="h-8 bg-[#F1F5F9] rounded-lg w-32"></div>
          </div>
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="flex flex-col lg:flex-row gap-6 mt-6">
        <div className="flex-1 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-8">
            <div className="h-6 bg-[#F1F5F9] rounded-lg w-48"></div>
            <div className="h-8 bg-[#F1F5F9] rounded-lg w-24"></div>
          </div>
          <div className="h-[300px] bg-[#F8FAFC] rounded-xl w-full border border-[#F1F5F9]"></div>
        </div>
        
        <div className="w-full lg:w-1/3 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm p-6">
          <div className="h-6 bg-[#F1F5F9] rounded-lg w-32 mb-8"></div>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#F1F5F9]"></div>
                  <div className="space-y-2.5">
                    <div className="h-4 bg-[#F1F5F9] rounded-lg w-28"></div>
                    <div className="h-3 bg-[#F1F5F9] rounded-lg w-16"></div>
                  </div>
                </div>
                <div className="h-6 bg-[#F1F5F9] rounded-lg w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
