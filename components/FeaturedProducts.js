import { productsData } from '@/lib/productsData'
;
import { ProductCard } from './ProductCard';

export function FeaturedProducts() {
  const featuredProducts = productsData.filter((product) => product.isFeatured);

  return (
    <section id="featured" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <span className="inline-block mb-4 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-accent bg-accent/10 rounded-full">
            Bestsellers
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Featured <span className="text-gradient-gold">Pieces</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our most loved pieces, handpicked for their exceptional craftsmanship and timeless beauty
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product, index) => (
            <div
              key={product.id}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
