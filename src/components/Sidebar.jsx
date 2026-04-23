import { usePathname } from 'next/navigation';
import Link from 'next/link';
import React from 'react';

const navItems = [
  { id: 1, label: 'Login', path: '/login' },
  { id: 2, label: 'Dashboard', path: '/dashboard' },
  { id: 3, label: 'Test Intro', path: '/test-intro' },
  { id: 4, label: 'Questions', path: '/questions' },
  { id: 5, label: 'Submit', path: '/submit' },
  { id: 6, label: 'My Result', path: '/my-result' },
  { id: 7, label: 'Career Guide', path: '/career-guide' },
  { id: 8, label: 'Share & Save', path: '/share-save' },
];

export default function Sidebar({ user }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-app-sidebar flex flex-col h-full border-r border-[#1C1F26] flex-shrink-0">
      <div className="p-8">
        <h1 className="text-2xl font-serif tracking-tight">
          <span className="text-app-primary font-bold">OPEN</span>
          <span className="text-white font-bold">MCQ</span>
        </h1>
        <p className="text-app-muted text-sm mt-1">Career & Personality Platform</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 mt-4">
        <h3 className="text-[#404653] text-[11px] font-semibold tracking-widest mb-4 px-4">USER FLOW</h3>
        <nav className="space-y-1 relative">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.id} href={item.path}
                className={`flex items-center px-4 py-3 rounded-xl transition-colors ${isActive
                    ? 'bg-[#1C1F2E] text-white'
                    : 'text-app-muted hover:bg-[#1C1F2E]/30 hover:text-white'
                  }`}
              >
                <span
                  className={`w-2 h-2 rounded-full mr-3 ${isActive ? 'bg-app-green shadow-[0_0_8px_rgba(0,183,127,0.8)]' : 'bg-[#404653]'
                    }`}
                ></span>
                <span className="text-sm font-medium">{item.id} · {item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {user ? (
        <div className="p-4">
          <div className="bg-[#1C1F2E] rounded-2xl p-3 flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF9D7E] to-[#FFA877] flex items-center justify-center text-white font-bold mr-3 shadow-md">
              {user.initials || 'AJ'}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{user.name || 'Arjun Menon'}</p>
              <p className="text-[11px] text-app-muted">{user.grade || 'Grade 11'} · {user.location || 'Kerala'}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4">
           {/* Placeholder for non-logged in state if needed */}
        </div>
      )}
    </aside>
  );
}
