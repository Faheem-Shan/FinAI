import { useState, useEffect } from "react";
import api from "../api/axios";
import { UserPlus, Mail, Shield, User, Send } from "lucide-react";
import { toast } from "react-hot-toast";

const Organization = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("accountant");
  const [inviting, setInviting] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await api.get("tenants/users/");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch company users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!email) return;
    setInviting(true);
    try {
      await api.post("tenants/invite/", { email, role });
      toast.success("Invitation sent!");
      setEmail("");
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.error || "Invitation failed");
    } finally {
      setInviting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-main">Organization Management</h1>
        <p className="text-secondary text-sm">Manage your team and company roles.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* INVITE FORM */}
        <div className="lg:col-span-1">
          <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <UserPlus size={20} className="text-primary" />
              Invite Team Member
            </h2>
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-secondary mb-1.5 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/50" size={16} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="teammate@company.com"
                    className="w-full bg-[rgba(0,0,0,0.02)] dark:bg-[rgba(255,255,255,0.02)] border border-[var(--border)] rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-secondary mb-1.5 block">Role</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/50" size={16} />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-[rgba(0,0,0,0.02)] dark:bg-[rgba(255,255,255,0.02)] border border-[var(--border)] rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none transition-all"
                  >
                    <option value="accountant">Accountant</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={inviting}
                className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-all shadow-md active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {inviting ? (
                   <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Send size={16} />
                    Send Invitation
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* USERS LIST */}
        <div className="lg:col-span-2">
          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm">
            <div className="p-6 border-b border-[var(--border)] flex items-center justify-between bg-[rgba(0,0,0,0.01)]">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <User size={20} className="text-primary" />
                Team Members
              </h2>
              <span className="text-xs px-2.5 py-1 bg-primary/10 text-primary font-medium rounded-full">
                {users.length} Active
              </span>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[rgba(0,0,0,0.02)] text-secondary uppercase text-[10px] tracking-wider font-bold">
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-[rgba(0,0,0,0.01)] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                              {u.email[0].toUpperCase()}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-main">{u.name || 'Invited User'}</p>
                                <p className="text-xs text-secondary">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                            <span className={`text-[10px] px-2 py-1 rounded-lg font-bold uppercase ${
                                u.role === 'admin' ? 'bg-purple-100 text-purple-600' :
                                u.role === 'manager' ? 'bg-blue-100 text-blue-600' :
                                'bg-gray-100 text-gray-500'
                            }`}>
                                {u.role}
                            </span>
                        </td>
                        <td className="px-6 py-4">
                             <div className="flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${u.name ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></span>
                                <span className="text-xs text-secondary">{u.name ? 'Active' : 'Pending'}</span>
                             </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Organization;
