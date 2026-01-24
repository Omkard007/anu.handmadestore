import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero-pattern py-20 md:py-32">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block mb-4 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-accent bg-accent/10 rounded-full animate-fade-in">
            Handcrafted with Love
          </span>
          
          <h1 className="font-display text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Timeless Elegance,{' '}
            <span className="text-gradient-gold">Traditional Craft</span>
          </h1>
          
          <p className="mt-6 text-lg text-muted-foreground md:text-xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Discover exquisite handcrafted jewelry and embroidery that celebrates 
            Indian heritage with contemporary elegance. Each piece tells a story.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Button size="lg" className="group" asChild>
              <a href="#collections">
                Explore Collection
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="#featured">View Featured</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
