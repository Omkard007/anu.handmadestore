"use client";

import { ShoppingBag, Sparkles, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header({ onCartClick }) {
  const { totalItems } = useCart();



  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <Sparkles className="h-6 w-6 text-accent transition-transform group-hover:rotate-12" />
          <span className="font-display text-2xl font-semibold tracking-tight">
            Anu's  <span className="text-gradient-gold">Handmade Store</span>
          </span>
        </Link>

        {/* Desktop Navigation */}


        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="relative" onClick={onCartClick}>
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                {totalItems}
              </span>
            )}
          </Button>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col gap-6 mt-8">
                  <a href="#collections" className="text-lg font-medium hover:text-primary transition-colors">
                    Collections
                  </a>
                  <a href="#featured" className="text-lg font-medium hover:text-primary transition-colors">
                    Featured
                  </a>
                  <a href="#about" className="text-lg font-medium hover:text-primary transition-colors">
                    About
                  </a>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
