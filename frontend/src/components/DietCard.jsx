const DietCard = ({ image, title }) => {
  return (
    <div className="bg-white/30  dark:bg-gray-800/40 backdrop-blur-md rounded-2xl shadow-xl hover:scale-[1.02] transition-transform p-4">
      <img src={image} alt={title} className="rounded-xl w-full h-full overflow-contain shadow-md" />
      <h3 className="mt-4 text-lg font-semibold text-gray-800 dark:text-white text-center">{title}</h3>
    </div>
  );
};

export default DietCard;
