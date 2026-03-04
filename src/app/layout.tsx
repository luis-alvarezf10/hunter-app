import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Go Hunter",
  description: "Gestión inmobiliaria todas las estadísticas en la palma de tu mano",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent", // O "default"
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#060606" },
  ],
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme');
                const isDark = theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
        
                // Aplicar clase al HTML
                document.documentElement.classList.toggle('dark', isDark);
                
                // Aplicar color a la barra de estado inmediatamente
                const meta = document.createElement('meta');
                meta.name = "theme-color";
                meta.content = isDark ? "#060606" : "#ffffff";
                document.head.appendChild(meta);
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${poppins.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
