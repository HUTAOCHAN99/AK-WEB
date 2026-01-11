interface AdminTabsProps {
  activeTab: 'timeline' | 'activities' | 'pending';
  pendingCount: number;
  onTabChange: (tab: 'timeline' | 'activities' | 'pending') => void;
}

export default function AdminTabs({ activeTab, pendingCount, onTabChange }: AdminTabsProps) {
  return (
    <div className="flex border-b border-gray-700 mb-6 overflow-x-auto">
      <button
        onClick={() => onTabChange('timeline')}
        className={`px-4 py-2 font-medium transition duration-300 whitespace-nowrap ${
          activeTab === 'timeline' 
            ? 'text-primary border-b-2 border-primary' 
            : 'text-gray-400 hover:text-white'
        }`}
      >
        Timeline Management
      </button>
      <button
        onClick={() => onTabChange('activities')}
        className={`px-4 py-2 font-medium transition duration-300 whitespace-nowrap ${
          activeTab === 'activities' 
            ? 'text-primary border-b-2 border-primary' 
            : 'text-gray-400 hover:text-white'
        }`}
      >
        Activities Management
      </button>
      <button
        onClick={() => onTabChange('pending')}
        className={`px-4 py-2 font-medium transition duration-300 whitespace-nowrap relative ${
          activeTab === 'pending' 
            ? 'text-primary border-b-2 border-primary' 
            : 'text-gray-400 hover:text-white'
        }`}
      >
        Pending Admins
        {pendingCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {pendingCount}
          </span>
        )}
      </button>
    </div>
  );
}