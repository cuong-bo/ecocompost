import { useState } from "react"
import { Lock } from "lucide-react"

const ADMIN_USER = "thptThanhNua"
const ADMIN_PASS = "thanhnua"

export default function AdminLogin({ onLogin }) {
  const [user, setUser] = useState("")
  const [pass, setPass] = useState("")
  const [error, setError] = useState("")

  function handleSubmit(e) {
    e.preventDefault()
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      sessionStorage.setItem("eco_admin", "1")
      onLogin()
    } else {
      setError("Sai tên đăng nhập hoặc mật khẩu")
    }
  }

  return (
    <div className="p-6 max-w-sm mx-auto">
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-[#E8F5E9] rounded-full flex items-center justify-center mx-auto mb-3">
          <Lock size={24} className="text-[#0A7A52]" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Đăng nhập Quản trị</h2>
        <p className="text-sm text-gray-500 mt-1">Dành cho giáo viên và quản lý</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
          <input
            type="text"
            value={user}
            onChange={e => setUser(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#56AB2F]/40 focus:border-[#56AB2F]"
            placeholder="Nhập tên đăng nhập"
            autoComplete="username"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
          <input
            type="password"
            value={pass}
            onChange={e => setPass(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#56AB2F]/40 focus:border-[#56AB2F]"
            placeholder="Nhập mật khẩu"
            autoComplete="current-password"
          />
        </div>
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>
        )}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-[#56AB2F] to-[#0A7A52] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
        >
          Đăng nhập
        </button>
      </form>
    </div>
  )
}
