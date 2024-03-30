import './globals.css';
import DefaultLayout from '../layouts/default-layout';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import type { Metadata } from 'next';
import StyledComponentsRegistry from '@/core/lib/registry';

export const metadata: Metadata = {
  title: 'Hệ thống dữ liệu tài chính',
  description: 'Hệ thống dữ liệu tài chính',
  keywords: 'Hệ thống dữ liệu tài chính',
  icons: 'https://finpal.com.vn/public/imgs/favicon.png?v=2'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body suppressHydrationWarning>
        <AntdRegistry>
          <StyledComponentsRegistry>
            <DefaultLayout>{children}</DefaultLayout>
          </StyledComponentsRegistry>
        </AntdRegistry>
      </body>
    </html>
  );
}
