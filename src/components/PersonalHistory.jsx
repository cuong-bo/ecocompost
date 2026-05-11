import { useState } from "react"
import Card from "./Card"
import { Clock, ChevronDown, ChevronUp, Trash2 } from "lucide-react"

function formatDate(iso) {
  try { return new Date(iso).toLocaleString("vi-VN") } catch { return iso }
}

export default function PersonalHistory({ records, onDelete, onClear }) {
  const [open, setOpen] = useState(false)

  if (!records.length) return null

  return (
    <Card title="Lịch sử tính toán của bạn" emoji="📋">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between text-sm text-[#0A7A52] font-medium"
      >
        <span>{records.length} lần tính gần đây</span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {open && (
        <div className="mt-3 space-y-2 max-h-64 overflow-y-auto pr-1">
          {records.slice(0, 20).map(r => (
            <div key={r.id} className="border border-gray-100 rounded-xl p-2.5 bg-gray-50 text-xs group">
              <div className="flex items-start justify-between gap-1">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#2F3542] truncate">
                    {r.form?.wasteType} · {r.form?.wasteKg}kg → {r.result?.damLuong}L đạm
                  </p>
                  <p className="text-gray-400 mt-0.5 flex items-center gap-1">
                    <Clock size={10} />
                    {formatDate(r.timestamp)}
                  </p>
                </div>
                {onDelete && (
                  <button
                    onClick={() => onDelete(r.id)}
                    className="p-1 text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition shrink-0"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            </div>
          ))}
          {onClear && (
            <button
              onClick={onClear}
              className="w-full text-xs text-red-400 hover:text-red-600 pt-1 transition"
            >
              Xóa toàn bộ lịch sử
            </button>
          )}
        </div>
      )}
    </Card>
  )
}
