export function StarRating({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-base';
  return (
    <div className={`flex items-center gap-0.5 ${sizeClass}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}>
          ★
        </span>
      ))}
      <span className="ml-1 text-gray-600 font-medium">{rating.toFixed(1)}</span>
    </div>
  );
}

export function StatCard({ label, value, subtext, icon, trend }: {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down';
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500">{label}</span>
        {icon && <span className="text-gray-400">{icon}</span>}
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {subtext && (
        <div className={`text-xs mt-1 ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500'}`}>
          {subtext}
        </div>
      )}
    </div>
  );
}

export function BarChart({ data, className }: { data: { label: string; value: number; color?: string }[]; className?: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className={`space-y-3 ${className || ''}`}>
      {data.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <span className="text-sm text-gray-600 w-24 flex-shrink-0">{item.label}</span>
          <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${item.color || 'bg-primary-500'}`}
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-900 w-10 text-right">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ icon, title, description, action }: {
  icon: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-5xl mb-4">{icon}</span>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-4 max-w-sm">{description}</p>
      {action}
    </div>
  );
}

export function Separator({ className }: { className?: string }) {
  return <hr className={`border-gray-200 ${className || ''}`} />;
}
