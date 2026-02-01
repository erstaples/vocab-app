import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';
import { useUIStore } from '../../stores/uiStore';
import './PageShell.css';

export default function PageShell() {
  const { isSidebarOpen } = useUIStore();

  return (
    <div className={`page-shell ${isSidebarOpen ? '' : 'page-shell--collapsed'}`}>
      <Navigation />
      <main className="page-shell__main">
        <div className="page-shell__content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
