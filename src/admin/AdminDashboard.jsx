import { useState, useEffect } from "react"
import { LogOut, BarChart2, History, Download, RefreshCw, Loader2 } from "lucide-react"
import AdminHistory from "./AdminHistory"
import AdminCharts from "./AdminCharts"
import AdminExport from "./AdminExport"
import { loadAllCalculations } from "../lib/firestore"
import { loadHistory } from "../lib/storage"

const TABS = [
  { id: "history", label: "Lịch sử", icon: History },
  { id: "charts",  label: "Thống kê", icon: BarChart2 },
  { id: "export",  label: "Xuất báo cáo", icon: Download },
]

export default function AdminDashboard({ onLogout }) {
  const [tab, setTab] = useState("history")
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)

  async function loadData() {
    setLoading(true)
    // Load từ cloud trước, fallback local
    let cloud = []
    try { cloud = await loadAllCalculations() } catch { }
    const local = loadHistory()

    // Merge: cloud + local (khử trùng theo timestamp)
    const merged = [...cloud]
    const cloudIds = new Set(cloud.map(r => r.timestamp))
    for (const r of local) {
      if (!cloudIds.has(r.timestamp)) merged.push(r)
    }
    merged.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    setRecords(merged)
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  function handleLogout() {
    sessionStorage.removeItem("eco_admin")
    onLogout()
  }

  return (
    <div className="flex flex-col h-full max-h-[90vh]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div>
          <h2 className="font-bold text-gray-800">Bảng điều khiển</h2>
          <p className="text-xs text-gray-400">EcoCompost AI Admin</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadData} disabled={loading} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition">
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 border border-red-200 rounded-lg px-3 py-1.5 transition">
            <LogOut size={14} />
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="px-4 py-3 border-b border-gray-100 grid grid-cols-3 gap-2 text-center">
        <div className="bg-green-50 rounded-xl p-2">
          <p className="text-lg font-bold text-[#0A7A52]">{records.length}</p>
          <p className="text-xs text-gray-500">Tổng lượt tính</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-2">
          <p className="text-lg font-bold text-blue-600">
            {records.reduce((s, r) => s + Number(r.result?.damLuong || 0), 0).toFixed(0)}
          </p>
          <p className="text-xs text-gray-500">Tổng đạm (lít)</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-2">
          <p className="text-lg font-bold text-amber-600">
            {[...new Set(records.map(r => r.form?.cropType))].filter(Boolean).length}
          </p>
          <p className="text-xs text-gray-500">Loại cây</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        {TABS.map(t => {
          const Icon = t.icon
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-all ${
                tab === t.id
                  ? "text-[#0A7A52] border-b-2 border-[#0A7A52]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Icon size={16} />
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2 text-gray-400">
            <Loader2 size={24} className="animate-spin" />
            <span className="text-sm">Đang tải dữ liệu...</span>
          </div>
        ) : (
          <>
            {tab === "history" && <AdminHistory records={records} />}
            {tab === "charts"  && <AdminCharts  records={records} />}
            {tab === "export"  && <AdminExport  records={records} />}
          </>
        )}
      </div>
    </div>
  )
}
