import "./globals.css"
import Navigation from "components/Navigation"

export const metadata = {
  title: "Jundo",
  description: "順位で整理するTodo",
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gray-950 text-gray-100 font-sans">
        <header className="bg-gray-900 border-b border-gray-800 px-4 py-3">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <h1 className="text-base font-bold tracking-widest">Jundo</h1>
            <p className="text-xs text-gray-500">順位で整理するTodo</p>
          </div>
        </header>
        <Navigation />
        <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  )
}

export default RootLayout
