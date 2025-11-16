import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Chatbot from './Chatbot';

interface LayoutProps {
  HeaderComponent: React.FC;
}

export default function Layout({ HeaderComponent }: LayoutProps) {
  return (
    <div className="grid grid-cols-[260px_1fr] grid-rows-[64px_1fr] h-screen">
      <div className="row-span-2">
        <Sidebar />
      </div>

      <HeaderComponent />

      <main className="overflow-y-auto p-8 bg-gray-100">
        <Outlet />
      </main>

      <Chatbot />
    </div>

  );
}