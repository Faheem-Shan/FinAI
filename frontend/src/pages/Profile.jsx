import { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import { User, Mail, Lock, Camera, Save, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("accounts/profile/");
      setUser(response.data);
      setPreview(response.data.profile_picture); 
    } catch (error) {
      console.error("Error fetching profile", error);
    }
  };

   const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);

    if (file) {
      setPreview(URL.createObjectURL(file)); // instant preview
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();

      formData.append("first_name", user.first_name);
      formData.append("last_name", user.last_name);
      formData.append("email", user.email);

      if (password) {
        formData.append("password", password);
      }

      if (profilePicture) {
        formData.append("profile_picture", profilePicture); 
      }

      const response = await api.put("accounts/profile/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      setUser(response.data);
      setPreview(response.data.profile_picture); 
      setProfilePicture(null); // Clear the file state
      setMessage("Profile updated successfully");
      setIsError(false);
      setPassword("");
    } catch (error) {
      setMessage("Synchronization failed. Resolve conflicts and retry.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-white text-text-secondary hover:text-primary hover:bg-primary/5 rounded-xl border border-gray-100 shadow-sm transition-all active:scale-[0.95]"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="font-outfit text-2xl font-bold text-text-main tracking-tight italic">Account Profile</h1>
          <p className="text-[10px] text-text-secondary font-black uppercase tracking-widest mt-0.5 opacity-50">Identity & Security Control</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-md overflow-hidden">
        {/* Banner */}
        <div className="h-28 bg-gradient-to-r from-primary/10 via-emerald-50/30 to-primary/5 relative">
          <div className="absolute -bottom-10 left-8">
            <div className="relative group">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
              />
              <div className="w-20 h-20 bg-white rounded-2xl p-1 shadow-lg ring-4 ring-white overflow-hidden">
                <div className="w-full h-full bg-gray-50 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                  {preview ? (
                    <img 
                      src={preview.startsWith('blob:') || preview.startsWith('http') ? preview : `http://127.0.0.1:8000${preview}`} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={32} className="stroke-[2.5]" />
                  )}
                </div>
              </div>
              <button 
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="absolute -bottom-1 -right-1 p-2 bg-primary text-white rounded-lg border-2 border-white shadow-md hover:scale-110 transition-all cursor-pointer"
              >
                <Camera size={12} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-8 pt-14">
          <div className="mb-8">
            <h2 className="font-outfit text-xl font-bold text-text-main">
              {user.first_name || user.username} {user.last_name || ""}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
               <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest opacity-40">Pro Identity Verified</span>
               <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(21,204,129,0.5)]"></div>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5 text-left">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-text-secondary uppercase tracking-widest ml-1">First Name</label>
                <input
                  type="text"
                  placeholder="First name"
                  className="w-full px-4 py-2.5 bg-gray-50/50 rounded-xl border border-gray-100 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold text-text-main outline-none"
                  value={user.first_name}
                  onChange={(e) => setUser({ ...user, first_name: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-text-secondary uppercase tracking-widest ml-1">Last Name</label>
                <input
                  type="text"
                  placeholder="Last name"
                  className="w-full px-4 py-2.5 bg-gray-50/50 rounded-xl border border-gray-100 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold text-text-main outline-none"
                  value={user.last_name}
                  onChange={(e) => setUser({ ...user, last_name: e.target.value })}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5 text-left">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-text-secondary uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary opacity-40" />
                  <input
                    type="email"
                    className="w-full px-4 py-2.5 pl-10 bg-gray-50/50 rounded-xl border border-gray-100 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold text-text-main outline-none"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-text-secondary uppercase tracking-widest ml-1 opacity-50">Username (Fixed)</label>
                <input
                  type="text"
                  disabled
                  className="w-full px-4 py-2.5 bg-gray-100/50 text-text-secondary/50 rounded-xl border border-gray-100 text-sm font-bold cursor-not-allowed italic"
                  value={user.username}
                />
              </div>
            </div>

            <div className="h-px bg-gray-50"></div>

            <div className="space-y-4">
              <h3 className="text-[11px] font-black text-text-secondary uppercase tracking-[0.2em] ml-1 opacity-50">Access Keys</h3>
              <div className="max-w-md space-y-1.5 text-left">
                <label className="text-[11px] font-black text-text-secondary uppercase tracking-widest ml-1">New System Password</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary opacity-40" />
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    className="w-full px-4 py-2.5 pl-10 bg-gray-50/50 rounded-xl border border-gray-100 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold text-text-main outline-none placeholder:text-gray-200"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <p className="text-[9px] text-text-secondary font-medium ml-1">Leave blank to maintain current encryption.</p>
              </div>
            </div>

            {message && (
              <div
                className={`flex items-center gap-2 p-4 rounded-xl border text-[12px] font-black uppercase tracking-wide transition-all ${
                  isError 
                    ? 'bg-red-50 text-red-500 border-red-100' 
                    : 'bg-emerald-50 text-emerald-500 border-emerald-100'
                }`}
              >
                {isError ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
                {message}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-6">
              <button 
                type="button" 
                className="px-6 py-2.5 bg-white text-text-secondary text-[11px] font-black uppercase tracking-widest border border-gray-100 rounded-xl hover:bg-gray-50 transition-all"
                onClick={() => navigate(-1)}
              >
                Discard
              </button>
              <button 
                type="submit" 
                disabled={loading} 
                className="px-8 py-2.5 bg-primary text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-hover hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {loading ? "Syncing..." : "Update Vault"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
