// app/layout.tsx
// import './globals.css'

export const metadata = {
  title: '我的个人记账本',
  description: '简单的记账应用',
}

// 确保这里包含了 html 和 body 标签
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  )
}