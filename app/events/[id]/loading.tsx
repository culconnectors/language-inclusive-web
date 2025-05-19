export default function EventLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section Loading */}
      <div className="relative h-[60vh] bg-[#0A0F1D] animate-pulse">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-16">
          <div className="text-white w-full">
            <div className="h-12 bg-gray-700 rounded-lg w-3/4 mb-4"></div>
            <div className="flex items-center gap-6">
              <div className="h-6 bg-gray-700 rounded w-48"></div>
              <div className="h-6 bg-gray-700 rounded w-36"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section Loading */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content Loading */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>

          {/* Sidebar Loading */}
          <div className="space-y-8">
            {/* Date & Time Loading */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>

            {/* Location Loading */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>

            {/* Organizer Loading */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>

            {/* Action Button Loading */}
            <div className="h-14 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
} 