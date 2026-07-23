import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "山顶传记 · 子女协助采访原型",
  description:
    "从初步了解、动态提纲到录音采访和文章生成的高保真交互原型。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
