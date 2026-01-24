import './globals.css'

export const metadata = {
  title: 'Anu.handmadestore',
  description: 'Handmade Jewelry Store',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}