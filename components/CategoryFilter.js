import { cn } from '@/lib/utils';
import { categories, Category } from '@/lib/productsData';



export function CategoryFilter({ selectedCategory, onCategoryChange }) {
  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-3">
      {categories?.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={cn(
            'px-4 py-2 md:px-6 md:py-2.5 rounded-full text-sm font-medium transition-all duration-300',
            selectedCategory === category
              ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
