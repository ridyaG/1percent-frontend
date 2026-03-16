import { Outlet } from 'react-router-dom';
import Sidebar from './SideBar';
import Topbar from './Topbar';
import BottomNav from './BottomNav';
import ComposeModal from '../post/ComposeModal';
import { useSocket } from '../../hooks/useSocket';
import { Toaster } from 'react-hot-toast';
import ThemeFloating from '../settings/ThemeFloating';
import { useIsMobile } from '../../hooks/useMediaQuery';
import FireCanvas from '../FireCanvas';

export default function AppShell() {
  const isMobile = useIsMobile();
  useSocket();

  return (
    <div
      className="app-shell flex min-h-screen relative overflow-hidden"
      style={{ background: 'transparent', color: 'var(--color-text)' }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background: `
            radial-gradient(circle at 16% 10%, rgba(93, 214, 192, 0.1), transparent 24%),
            radial-gradient(circle at 84% 0%, rgba(255, 122, 24, 0.14), transparent 26%),
            radial-gradient(circle at 50% 100%, rgba(255, 191, 71, 0.08), transparent 24%)
          `,
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0, opacity: 0.14 }}
        aria-hidden="true"
      >
        <FireCanvas sparkFreq={1} floorFrac={0.04} />
      </div>

      <div className="relative z-10 flex w-full min-h-screen">
        <Sidebar />

        <main
          className="flex-1 md:ml-[220px] min-w-0"
          style={{ background: 'transparent' }}
        >
          <Topbar />
          <div
            style={{
              paddingTop: 'var(--topbar-height)',
              paddingBottom: isMobile ? 'calc(var(--bottom-nav-height) + env(safe-area-inset-bottom))' : '24px',
            }}
          >
            <Outlet />
          </div>
        </main>

        {isMobile && <BottomNav />}

        <ComposeModal />

        {!isMobile && <ThemeFloating />}

        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: 'var(--color-surface)',
              color: 'var(--color-text)',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              fontSize: '14px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            },
            success: {
              iconTheme: {
                primary: 'var(--color-accent)',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </div>
  );
}
