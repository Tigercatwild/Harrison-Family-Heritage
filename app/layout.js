import './globals.css'

export const metadata = {
  title: 'Harrison Family Heritage - Family Tree & Genealogy',
  description: 'Discover the rich history of the Harrison family, from John Rufus Harrison Sr. who came from Cuba to Florida in the 1800s, to the many generations that followed.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
