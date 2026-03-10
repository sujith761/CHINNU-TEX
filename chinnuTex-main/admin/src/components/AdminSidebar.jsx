import { Link, useLocation } from 'react-router-dom';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: DashboardIcon },
  { to: '/admin/products', label: 'Products', icon: BoxIcon },
  { to: '/admin/inventory', label: 'Inventory', icon: InventoryIcon },
  { to: '/admin/bookings', label: 'Bookings', icon: CalendarIcon },
  { to: '/admin/payments', label: 'Transactions', icon: WalletIcon },
  { to: '/admin/messages', label: 'Messages', icon: MessageIcon },
  { to: '/admin/users', label: 'Users', icon: UsersIcon },
];

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="bg-surface-50/80 backdrop-blur-xl w-64 h-screen p-6 flex flex-col border-r border-white/[0.06]">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-neon-violet to-neon-blue flex items-center justify-center text-[10px] font-extrabold text-white shadow-glow-sm">
          CS TEX
        </div>
        <div>
          <p className="text-[10px] uppercase text-white/30 tracking-[0.3em] font-semibold">Admin</p>
          <p className="text-lg font-bold text-white">Control</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {links.map(({ to, label, icon: Icon }) => {
          const active = location.pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${active
                ? 'bg-gradient-to-r from-neon-violet/15 to-neon-blue/10 border border-neon-violet/20 shadow-glow-sm'
                : 'border border-transparent hover:bg-white/[0.04] hover:border-white/[0.06]'
                }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-neon-violet' : 'text-white/30'} group-hover:text-neon-violet/80 transition-colors`} />
              <span className={`text-sm font-medium ${active ? 'text-white' : 'text-white/50'} group-hover:text-white/80 transition-colors`}>
                {label}
              </span>
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-neon-violet shadow-glow-sm" />}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/[0.06] text-xs text-white/30">
        <p className="font-semibold text-white/50">System Status</p>
        <div className="mt-2 flex items-center gap-2 text-neon-emerald">
          <span className="w-2 h-2 rounded-full bg-neon-emerald animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
          <span className="text-white/40">All services operational</span>
        </div>
      </div>
    </aside>
  );
}

function DashboardIcon(props) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h7v7H3V3zm11 0h7v4h-7V3zM3 14h7v7H3v-7zm11-5h7v12h-7V9z" />
    </svg>
  );
}

function BoxIcon(props) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 16V8a2 2 0 00-1.106-1.79l-7-3.5a2 2 0 00-1.788 0l-7 3.5A2 2 0 003 8v8a2 2 0 001.106 1.79l7 3.5a2 2 0 001.788 0l7-3.5A2 2 0 0021 16z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.27 6.96L12 12l8.73-5.04M12 22V12" />
    </svg>
  );
}

function CalendarIcon(props) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10m-11 8h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function WalletIcon(props) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18v10H3z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12h2" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-4 9 4" />
    </svg>
  );
}

function MessageIcon(props) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h6m-9 8l4-4h10a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function UsersIcon(props) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8a4 4 0 110-8 4 4 0 010 8zm10 8v-2a4 4 0 00-3-3.87" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 11a4 4 0 100-8 4 4 0 000 8z" />
    </svg>
  );
}

function InventoryIcon(props) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  );
}
