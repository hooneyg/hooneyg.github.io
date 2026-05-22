import React from 'react';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hooney | Enterprise Architect Portfolio',
  description: '금융, 물류, 인프라 도메인의 대규모 복잡성을 설계하고 해결하는 엔터프라이즈 아키텍트 Hooney의 포트폴리오입니다.',
  keywords: ['Software Architect', 'Java', 'Spring Boot', 'Next.js', 'Infrastructure', 'DB Master', 'Finance', 'Logistics'],
  authors: [{ name: 'Kwak Kyong Hun', url: 'https://github.com/hooneyg' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&family=Outfit:wght@400;500;700;900&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
