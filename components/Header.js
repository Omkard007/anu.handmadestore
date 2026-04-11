"use client";

import { ShoppingBag, Sparkles, Menu, User, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header({ onCartClick }) {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();



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
          {user ? (
            <div className="hidden md:flex items-center gap-4">
              {user.role === 'ADMIN' && (
                <Link href="/admin">
                  <Button variant="outline" size="sm" className="flex items-center gap-2 border-accent/50 hover:bg-accent/10">
                    <LayoutDashboard className="h-4 w-4 text-accent" />
                    Dashboard
                  </Button>
                </Link>
              )}
              <span className="text-sm text-muted-foreground truncate max-w-[150px]">
                {user.email}
              </span>
              <Button variant="ghost" size="sm" onClick={logout} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <Link href="/auth">
              <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-2">
                <User className="h-4 w-4" />
                Login
              </Button>
            </Link>
          )}

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
                  {user ? (
                    <>
                      <div className="border-b pb-4">
                        <p className="text-sm font-medium">{user.email}</p>
                        {user.role === 'ADMIN' && (
                          <Link href="/admin" className="flex items-center gap-2 mt-4 text-accent font-medium hover:text-accent/80 transition-colors">
                            <LayoutDashboard className="h-5 w-5" />
                            Admin Dashboard
                          </Link>
                        )}
                        <Button variant="ghost" size="sm" onClick={logout} className="w-full justify-start px-0 mt-2 text-red-500">
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      </div>
                    </>
                  ) : (
                    <Link href="/auth" className="text-lg font-medium hover:text-primary transition-colors">
                      Login
                    </Link>
                  )}
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
