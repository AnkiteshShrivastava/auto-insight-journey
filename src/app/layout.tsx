import { PerformanceProvider } from "@/context/PerformanceContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <PerformanceProvider>
          {children}
        </PerformanceProvider>
      </body>
    </html>
  );
}