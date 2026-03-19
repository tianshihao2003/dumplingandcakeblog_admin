'use client';

import "./globals.css";
import { SessionProvider, useSession } from "next-auth/react";

import { useState } from 'react';

// 用户信息组件
function UserInfo() {
  const { data: session } = useSession();
  
  return (
    <div className="flex items-center space-x-4">
      {session?.user ? (
        <div className="flex items-center space-x-2">
          {session.user.image && (
            <img 
              src={session.user.image} 
              alt={session.user.name || 'User'} 
              className="w-8 h-8 rounded-full"
            />
          )}
          <span className="text-sm font-medium">
            {session.user.name || session.user.email}
          </span>
          <a href="/api/auth/signout" className="text-sm text-gray-600 hover:text-gray-900">
            退出
          </a>
        </div>
      ) : (
        <a href="/api/auth/signin" className="text-sm text-gray-600 hover:text-gray-900">
          登录
        </a>
      )}
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  return (
    <html lang="zh-CN">
      <body className="bg-gray-100 font-sans">
        <SessionProvider>
          <div className="flex h-screen overflow-hidden">
            {/* 左侧导航栏 */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 text-white flex flex-col transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
              <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h1 className="text-xl font-bold">Firefly 后台</h1>
                <button 
                  className="md:hidden text-white hover:text-gray-300"
                  onClick={() => setSidebarOpen(false)}
                >
                  ×
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-2">
                <a href="/" className="block px-4 py-2 rounded hover:bg-gray-700">
                  仪表盘
                </a>
                <a href="/posts" className="block px-4 py-2 rounded hover:bg-gray-700">
                  文章
                </a>
                <a href="/moments" className="block px-4 py-2 rounded hover:bg-gray-700">
                  动态
                </a>
              </nav>
            </aside>
            
            {/* 主内容区 */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* 顶部状态栏 */}
              <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <button 
                    className="md:hidden text-gray-600 hover:text-gray-900"
                    onClick={() => setSidebarOpen(true)}
                  >
                    ☰
                  </button>
                  <h2 className="text-lg font-medium">
                    {children.props?.pageTitle || "仪表盘"}
                  </h2>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="wp-button wp-button-primary">
                    保存
                  </button>
                  <UserInfo />
                </div>
              </header>
              
              {/* 内容区域 */}
              <main className="flex-1 overflow-y-auto p-6">
                {children}
              </main>
            </div>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
