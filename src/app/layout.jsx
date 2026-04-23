import { Suspense } from 'react';
import '@/index.css';
import '@/App.css';
import AuthProvider from '@/components/AuthProvider';
import Layout from '@/components/Layout';

export const metadata = {
  title: 'Personality Test UI',
  description: '16 Personalities Test',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Outfit:wght@400;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AuthProvider>
          <Layout>
            <Suspense fallback={null}>
              {children}
            </Suspense>
          </Layout>
        </AuthProvider>
      </body>
    </html>
  );
}
