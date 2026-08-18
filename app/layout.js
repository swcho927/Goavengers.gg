import "./globals.css";

export const metadata = {
  title: "GOAVENGERS.GG",
  description: "Goavengers 팀 전용 LoL 전적/분석 플랫폼",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <header className="site-header">
          <a href="/" className="logo">GOAVENGERS</a>
          <nav>
            <a href="/">홈</a>
            <a href="/players">선수</a>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
