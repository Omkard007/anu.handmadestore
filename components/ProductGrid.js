
import { useState, useMemo } from 'react';
import { productsData, Category } from '@/lib/productsData'
;
import { CategoryFilter } from './CategoryFilter';
import { ProductCard } from './ProductCard';

export function ProductGrid() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'All') {
      return productsData;
    }
    return productsData.filter((product) => product.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <section id="collections" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Our <span className="text-gradient-gold">Collections</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse through our handpicked collection of traditional jewelry and embroidery pieces
          </p>
        </div>

        <div className="mb-10">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
}
