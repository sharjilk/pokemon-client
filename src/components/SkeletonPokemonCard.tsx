const SkeletonPokemonCard = () => {
  return (
    <div className="card bg-gray-700 rounded-lg shadow-lg p-4 animate-pulse">
      <div className="w-full h-4 bg-gray-600 rounded mb-4"></div>{" "}
      <div className="h-64 bg-gray-600 rounded w-3/4 mx-auto mb-4"></div>{" "}
      <div className="w-full h-4 bg-gray-600 rounded mb-4"></div>{" "}
      <div className="h-4 bg-gray-600 rounded w-1/2 mx-auto mb-2"></div>{" "}
    </div>
  );
};

export default SkeletonPokemonCard;
