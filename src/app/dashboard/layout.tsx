

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="container mx-auto py-10 px-4 space-y-6">
        {children}
    </div>
  )
}
