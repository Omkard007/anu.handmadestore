import { Sparkles, Instagram, Facebook, Mail, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer id="about" className="bg-primary text-primary-foreground py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-6 w-6" />
              <span className="font-display text-2xl font-semibold">
                Anu's Handmade Store
              </span>
            </div>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Handcrafted jewelry and embroidery celebrating Indian heritage with contemporary elegance. 
              Each piece is made with love and attention to detail.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><a href="#collections" className="hover:text-primary-foreground transition-colors">Collections</a></li>
              <li><a href="#featured" className="hover:text-primary-foreground transition-colors">Featured</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">About Us</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Get in Touch</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>hello@shreecollection.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+91 98765 XXXXX</span>
              </li>
            </ul>
            <div className="flex gap-4 mt-4">
              <a href="#" className="hover:text-primary-foreground/60 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary-foreground/60 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} Anu's Handmade Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
