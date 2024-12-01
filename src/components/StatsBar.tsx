interface StatsBarProps {
  statName: string;
  statValue: number;
  maxValue?: number;
}

const StatsBar = ({ statName, statValue, maxValue = 100 }: StatsBarProps) => {
  const percentage = (statValue / maxValue) * 100;
  const maxWidthLimit = percentage > 100 ? 100 : percentage;

  return (
    <div className="flex flex-col">
      <p className="font-semibold capitalize text-sm mb-1">{statName}</p>
      <div className="w-full bg-sky-900 rounded-full h-4 relative">
        <div
          className="bg-sky-700 h-4 rounded-full"
          style={{ width: `${maxWidthLimit}%` }}
        ></div>
        <span className="absolute right-2 top-0 text-xs text-white">
          {statValue}
        </span>
      </div>
    </div>
  );
};

export default StatsBar;
