import { Star, ShoppingBag, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/productsData'
;
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function ProductCard({ product }) {
  const { addToCart, items } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [imageUrl, setImageUrl] = useState(product.imagePath || null);
  const [isImageLoading, setIsImageLoading] = useState(!product.imagePath);

  useEffect(() => {
    if (!product.imagePath && product.id) {
      const fetchImage = async () => {
        try {
          const response = await fetch(`/api/products/${product.id}/image`);
          if (response.ok) {
            const data = await response.json();
            setImageUrl(data.imagePath);
          } else {
            setImageError(true);
          }
        } catch (error) {
          console.error('Error fetching image:', error);
          setImageError(true);
        } finally {
          setIsImageLoading(false);
        }
      };
      fetchImage();
    }
  }, [product.id, product.imagePath]);

  const isInCart = items.some(item => item.product.id === product.id);

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add items to your cart');
      router.push('/auth');
      return;
    }
    setIsAdding(true);
    addToCart(product);
    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <div className="group relative bg-card rounded-xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-500 animate-fade-in">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {isImageLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="animate-spin text-muted-foreground" size={24} />
          </div>
        ) : imageError || !imageUrl ? (
          <div className="absolute inset-0 flex items-center justify-center bg-secondary">
            <span className="text-4xl">💍</span>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        )}
        
        {/* Featured Badge */}
        {product.isFeatured && (
          <div className="absolute left-3 top-3 px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full">
            Featured
          </div>
        )}

        {/* Quick Add Overlay */}
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />
      </div>

      {/* Content */}
      <div className="p-4 md:p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
              {product.category}
            </p>
            <h3 className="font-display text-lg font-semibold leading-tight truncate">
              {product.name}
            </h3>
          </div>
          
          {/* Rating */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
            <span className="text-sm font-medium">{product.rating}</span>
          </div>
        </div>

        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="font-display text-xl font-bold text-gradient-gold">
            ₹{product.price}
          </span>
          
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={cn(
              'transition-all duration-300',
              isAdding && 'scale-95'
            )}
          >
            {isAdding ? (
              <Check className="h-4 w-4 mr-1" />
            ) : (
              <ShoppingBag className="h-4 w-4 mr-1" />
            )}
            {isInCart ? 'Add More' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </div>
  );
}
