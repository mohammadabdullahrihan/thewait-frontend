// Skeleton shimmer animation base
const Shimmer = ({ className = '' }) => (
  <div className={`animate-pulse bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 bg-[length:400%_100%] rounded-2xl ${className}`}
    style={{ backgroundImage: 'linear-gradient(90deg, #f3f4f6 25%, #e9eded 50%, #f3f4f6 75%)', backgroundSize: '400% 100%', animation: 'shimmer 1.4s infinite' }}
  />
);

// Card skeleton (for dashboard stats)
export const CardSkeleton = () => (
  <div className="p-6 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm space-y-4">
    <div className="flex justify-between items-start">
      <Shimmer className="w-12 h-12 rounded-2xl" />
      <Shimmer className="w-16 h-5 rounded-full" />
    </div>
    <div className="space-y-2 pt-2">
      <Shimmer className="w-20 h-3 rounded-full" />
      <Shimmer className="w-28 h-5 rounded-full" />
    </div>
  </div>
);

// Hero header skeleton
export const HeaderSkeleton = () => (
  <div className="p-8 md:p-10 rounded-[3rem] bg-white border border-gray-100 shadow-sm">
    <div className="flex flex-col md:flex-row gap-8 items-start">
      <div className="space-y-4 flex-1">
        <div className="flex gap-2">
          <Shimmer className="w-24 h-6 rounded-full" />
          <Shimmer className="w-20 h-6 rounded-full" />
        </div>
        <Shimmer className="w-64 h-10 rounded-2xl" />
        <Shimmer className="w-48 h-4 rounded-full" />
        <div className="flex gap-6 pt-2">
          <Shimmer className="w-24 h-10 rounded-2xl" />
          <Shimmer className="w-24 h-10 rounded-2xl" />
        </div>
      </div>
      <Shimmer className="w-40 h-40 rounded-[2rem]" />
    </div>
  </div>
);

// Task item skeleton (for routine)
export const TaskSkeleton = ({ count = 4 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="p-5 md:p-6 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm flex items-center gap-4">
        <Shimmer className="w-6 h-6 rounded-xl flex-shrink-0" />
        <Shimmer className="w-12 h-12 rounded-2xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Shimmer className="w-16 h-3 rounded-full" />
          <Shimmer className={`h-4 rounded-full ${i % 3 === 0 ? 'w-3/4' : i % 3 === 1 ? 'w-1/2' : 'w-2/3'}`} />
        </div>
        <Shimmer className="w-20 h-6 rounded-xl hidden md:block" />
      </div>
    ))}
  </div>
);

// Habit grid skeleton
export const HabitSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="p-6 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm space-y-4">
        <div className="flex justify-between">
          <Shimmer className="w-12 h-12 rounded-2xl" />
          <Shimmer className="w-8 h-8 rounded-xl" />
        </div>
        <Shimmer className="w-24 h-4 rounded-full" />
        <Shimmer className="w-16 h-3 rounded-full" />
      </div>
    ))}
  </div>
);

// Chart skeleton
export const ChartSkeleton = () => (
  <div className="p-8 rounded-[3rem] bg-white border border-gray-100 shadow-sm space-y-6">
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <Shimmer className="w-36 h-5 rounded-full" />
        <Shimmer className="w-24 h-3 rounded-full" />
      </div>
      <Shimmer className="w-12 h-12 rounded-2xl" />
    </div>
    {/* Fake bar chart */}
    <div className="h-40 flex items-end gap-3 pt-4">
      {[60, 80, 45, 90, 70, 55, 85].map((h, i) => (
        <div key={i} className="flex-1 flex flex-col justify-end">
          <Shimmer className="w-full rounded-t-xl" style={{ height: `${h}%` }} />
        </div>
      ))}
    </div>
    <div className="flex justify-between">
      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
        <Shimmer key={d} className="w-6 h-3 rounded-full" />
      ))}
    </div>
  </div>
);

// Journal entry skeleton
export const JournalSkeleton = () => (
  <div className="space-y-6">
    <div className="p-8 rounded-[3rem] bg-white border border-gray-100 shadow-sm space-y-6">
      <div className="flex justify-between">
        <Shimmer className="w-40 h-6 rounded-full" />
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6].map(i => <Shimmer key={i} className="w-14 h-14 rounded-2xl" />)}
        </div>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm space-y-4">
          <Shimmer className="w-32 h-4 rounded-full" />
          <Shimmer className="w-full h-24 rounded-2xl" />
        </div>
      ))}
    </div>
  </div>
);

// Dashboard skeleton (full page)
export const DashboardSkeleton = () => (
  <div className="space-y-8 pb-20 animate-pulse">
    <HeaderSkeleton />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1,2,3,4].map(i => <CardSkeleton key={i} />)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2"><ChartSkeleton /></div>
      <div className="space-y-4">
        <Shimmer className="w-full h-48 rounded-[2.5rem]" />
        <Shimmer className="w-full h-32 rounded-[2.5rem]" />
      </div>
    </div>
  </div>
);

// CSS keyframe injection
if (typeof document !== 'undefined' && !document.getElementById('skeleton-style')) {
  const style = document.createElement('style');
  style.id = 'skeleton-style';
  style.textContent = `
    @keyframes shimmer {
      0% { background-position: -400% 0; }
      100% { background-position: 400% 0; }
    }
  `;
  document.head.appendChild(style);
}

export default Shimmer;
