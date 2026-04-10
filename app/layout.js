import './globals.css'
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/sonner';

export const metadata = {
  title: 'Anu.handmadestore',
  description: 'Handmade Jewelry Store',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            {children}
            <Toaster position="top-center" richColors />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
