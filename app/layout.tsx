import './globals.css'

export const metadata = {
  title: 'PixelCraft AI',
  description: 'AI Dot Art Generator',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
