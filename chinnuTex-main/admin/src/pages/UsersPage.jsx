import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';

export default function UsersPage() {
  const location = useLocation();
  const { highlightId } = location.state || {};
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', company: '', role: 'user' });
  const [highlightedUserId, setHighlightedUserId] = useState(highlightId || null);

  const load = async (query = '') => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/users', { params: { q: query } });
      setUsers(res.data);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (highlightId && users.length > 0) {
      const element = document.getElementById(`user-${highlightId}`);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
        setHighlightedUserId(highlightId);
      }
    }
  }, [highlightId, users]);

  useEffect(() => {
    if (location.state?.highlightId !== highlightedUserId) {
      setHighlightedUserId(location.state?.highlightId || null);
    }
  }, [location.state]);

  const onSearch = (e) => {
    e.preventDefault();
    load(q);
  };

  const startEdit = (u) => {
    setEditing(u._id || u.id);
    setForm({ name: u.name, email: u.email, company: u.company || '', role: u.role || 'user' });
  };

  const saveEdit = async () => {
    try {
      await api.patch(`/admin/users/${editing}`, form);
      setEditing(null);
      load(q);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to save user');
    }
  };

  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      load(q);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold gradient-text">Users</h1>
          <p className="text-white/30">Manage registered customers</p>
        </div>
      </header>

      <section className="glass-card p-4">
        <form onSubmit={onSearch} className="flex items-center gap-3">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, email, company"
            className="glass-input flex-1 px-4 py-2"
          />
          <button className="btn-glow px-4 py-2">Search</button>
        </form>
      </section>

      {error && (
        <div className="glass-card border-neon-rose/30 bg-neon-rose/10 text-neon-rose px-4 py-3">{error}</div>
      )}

      <section className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b border-white/[0.06]">
              <tr>
                <th className="text-left px-6 py-3 text-xs uppercase tracking-wider text-white/25 font-semibold">Name</th>
                <th className="text-left px-6 py-3 text-xs uppercase tracking-wider text-white/25 font-semibold">Email</th>
                <th className="text-left px-6 py-3 text-xs uppercase tracking-wider text-white/25 font-semibold">Company</th>
                <th className="text-left px-6 py-3 text-xs uppercase tracking-wider text-white/25 font-semibold">Role</th>
                <th className="text-left px-6 py-3 text-xs uppercase tracking-wider text-white/25 font-semibold">Joined</th>
                <th className="text-left px-6 py-3 text-xs uppercase tracking-wider text-white/25 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-6 text-center text-white/30">Loading users…</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-6 text-center text-white/30">No users found</td></tr>
              ) : (
                users.map(u => (
                  <tr 
                    key={u._id || u.id} 
                    id={`user-${u._id || u.id}`}
                    className={`border-t transition-all ${
                      highlightedUserId === (u._id || u.id)
                        ? 'bg-neon-amber/5 border-neon-amber/20'
                        : 'border-white/[0.04] hover:bg-white/[0.03]'
                    }`}
                  >
                    <td className="px-6 py-3 font-semibold text-white/80">
                      {editing === (u._id || u.id) ? (
                        <input value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} className="glass-input px-2 py-1 text-sm" />
                      ) : (
                        u.name
                      )}
                    </td>
                    <td className="px-6 py-3 text-white/50">
                      {editing === (u._id || u.id) ? (
                        <input value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} className="glass-input px-2 py-1 text-sm" />
                      ) : (
                        u.email
                      )}
                    </td>
                    <td className="px-6 py-3 text-white/50">
                      {editing === (u._id || u.id) ? (
                        <input value={form.company} onChange={(e)=>setForm({...form,company:e.target.value})} className="glass-input px-2 py-1 text-sm" />
                      ) : (
                        u.company
                      )}
                    </td>
                    <td className="px-6 py-3">
                      {editing === (u._id || u.id) ? (
                        <select value={form.role} onChange={(e)=>setForm({...form,role:e.target.value})} className="glass-input px-2 py-1 text-sm">
                          <option value="user">user</option>
                          <option value="admin">admin</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 rounded text-xs font-bold border ${u.role === 'admin' ? 'bg-neon-amber/10 text-neon-amber border-neon-amber/20' : 'bg-neon-blue/10 text-neon-blue border-neon-blue/20'}`}>{u.role}</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-white/40">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-3 flex gap-2">
                      {editing === (u._id || u.id) ? (
                        <>
                          <button onClick={saveEdit} className="px-3 py-1 rounded bg-neon-emerald/15 text-neon-emerald border border-neon-emerald/20 text-sm font-semibold hover:bg-neon-emerald/25 transition-colors">Save</button>
                          <button onClick={()=>setEditing(null)} className="px-3 py-1 rounded border border-white/[0.1] text-white/60 text-sm hover:bg-white/[0.05] transition-colors">Cancel</button>
                        </>
                      ) : (
                        <>
                          <button onClick={()=>startEdit(u)} className="px-3 py-1 rounded bg-neon-violet/15 text-neon-violet border border-neon-violet/20 text-sm font-semibold hover:bg-neon-violet/25 transition-colors">Edit</button>
                          <button onClick={()=>deleteUser(u._id || u.id)} className="px-3 py-1 rounded bg-neon-rose/15 text-neon-rose border border-neon-rose/20 text-sm font-semibold hover:bg-neon-rose/25 transition-colors">Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
