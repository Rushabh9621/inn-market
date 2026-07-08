export default function CategorySelector({
  categories,
  activeCategory,
  onSelect,
}) {
  return (
    <div className="guest-categories">
      {categories.map((category) => (
        <button
          key={category}
          className={activeCategory === category ? "active" : ""}
          onClick={() => onSelect(category)}
        >
          {category === "Drinks" && "🥤 Drinks"}
          {category === "Snacks" && "🍫 Snacks"}
          {category === "Toiletries" && "🪥 Toiletries"}
        </button>
      ))}
    </div>
  );
}