import { SpeedInsights } from '@vercel/speed-insights/next'

export const metadata = {
  title: 'Oriz Travel',
  description: 'Book flights, hotels and cars — solo or as a group.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
