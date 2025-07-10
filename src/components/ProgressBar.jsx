import { useTodos } from '../hooks/useTodos';

const ProgressBar = () => {
  const { todos, getCompletedCount, getTotalCount } = useTodos();

  const totalCount = getTotalCount();
  const completedCount = getCompletedCount();
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="mb-6">
      <div className="bg-gray-300 h-8 border-2 border-wood-brown relative overflow-hidden">
        <div 
          className="bg-success h-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-black">
          {progressPercentage}% ({completedCount}/{totalCount})
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;