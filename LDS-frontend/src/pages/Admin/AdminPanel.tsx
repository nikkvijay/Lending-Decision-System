import { useEffect, useState } from 'react'
import { getAdminApplications, getAdminStats } from '@/api'
import Navbar from '@/components/shared/Navbar'

interface Application {
  decisionId: string
  jobId: string
  status: string
  decision: string | null
  creditScore: number | null
  reasonCodes: string[]
  processingMs: number | null
  decidedAt: string | null
  amount: number
  tenureMonths: number
  purpose: string
  appliedAt: string
  ownerName: string
  businessName: string
  businessType: string
  monthlyRevenue: number
  pan: string
}

interface Stats {
  total: number
  approved: number
  rejected: number
  pending: number
  avg_score: number | null
  approval_rate: number | null
  today: number
}

const FILTERS = ['ALL', 'APPROVED', 'REJECTED', 'PENDING'] as const
type Filter = typeof FILTERS[number]

const PURPOSE_LABELS: Record<string, string> = {
  WORKING_CAPITAL: 'Working Capital',
  EQUIPMENT: 'Equipment',
  EXPANSION: 'Expansion',
  INVENTORY: 'Inventory',
  OTHER: 'Other',
}

const BIZ_LABELS: Record<string, string> = {
  SOLE_PROPRIETORSHIP: 'Sole Prop.',
  PARTNERSHIP: 'Partnership',
  PRIVATE_LIMITED: 'Pvt. Ltd.',
  LLP: 'LLP',
}

const formatINR = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

const DecisionBadge = ({ decision, status }: { decision: string | null; status: string }) => {
  if (status === 'PENDING' || status === 'PROCESSING') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        {status === 'PROCESSING' ? 'Processing' : 'Pending'}
      </span>
    )
  }
  if (decision === 'APPROVED') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Approved
      </span>
    )
  }
  if (decision === 'REJECTED') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-200">
        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
        Rejected
      </span>
    )
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-500">
      —
    </span>
  )
}

const StatCard = ({ label, value, sub }: { label: string; value: string | number; sub?: string }) => (
  <div className="bg-white border border-neutral-200 rounded-xl p-5">
    <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{label}</p>
    <p className="text-2xl font-semibold text-neutral-900 mt-1">{value}</p>
    {sub && <p className="text-xs text-neutral-400 mt-0.5">{sub}</p>}
  </div>
)

const AdminPanel = () => {
  const [apps, setApps] = useState<Application[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [filter, setFilter] = useState<Filter>('ALL')
  const [loading, setLoading] = useState(true)
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    Promise.all([getAdminApplications(filter), getAdminStats()])
      .then(([appsRes, statsRes]) => {
        setApps(appsRes.data.data)
        setStats(statsRes.data.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [filter])

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-1">Dashboard</p>
          <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">Admin Panel</h1>
          <p className="text-sm text-neutral-400 mt-1">All loan applications and decisions</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Applications" value={stats.total} sub={`${stats.today} today`} />
            <StatCard
              label="Approved"
              value={stats.approved}
              sub={stats.approval_rate != null ? `${stats.approval_rate}% rate` : undefined}
            />
            <StatCard label="Rejected" value={stats.rejected} />
            <StatCard
              label="Avg Credit Score"
              value={stats.avg_score ?? '—'}
              sub="across completed"
            />
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-1 mb-4 bg-white border border-neutral-200 rounded-lg p-1 w-fit">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === f
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          ) : apps.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-sm text-neutral-400">No applications found</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50">
                  <th className="text-left px-5 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Business</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Type</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Revenue</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Loan</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Purpose</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Score</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Decision</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Applied</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {apps.map((app) => (
                  <>
                    <tr
                      key={app.decisionId}
                      className="hover:bg-neutral-50 cursor-pointer transition-colors"
                      onClick={() => setExpandedRow(expandedRow === app.decisionId ? null : app.decisionId)}
                    >
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-neutral-900 truncate max-w-[160px]">{app.businessName}</p>
                        <p className="text-xs text-neutral-400 mt-0.5">{app.ownerName}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs text-neutral-500">{BIZ_LABELS[app.businessType] ?? app.businessType}</span>
                      </td>
                      <td className="px-4 py-3.5 text-right text-neutral-700 font-medium tabular-nums">
                        {formatINR(app.monthlyRevenue)}
                      </td>
                      <td className="px-4 py-3.5 text-right text-neutral-900 font-medium tabular-nums">
                        {formatINR(app.amount)}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-neutral-500">
                        {PURPOSE_LABELS[app.purpose] ?? app.purpose}
                        <span className="text-neutral-300 ml-1">· {app.tenureMonths}m</span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        {app.creditScore != null ? (
                          <span className="font-semibold tabular-nums" style={{
                            color: app.creditScore >= 650 ? '#10b981' : app.creditScore >= 500 ? '#f59e0b' : '#ef4444'
                          }}>
                            {app.creditScore}
                          </span>
                        ) : <span className="text-neutral-300">—</span>}
                      </td>
                      <td className="px-4 py-3.5">
                        <DecisionBadge decision={app.decision} status={app.status} />
                      </td>
                      <td className="px-4 py-3.5 text-xs text-neutral-400 whitespace-nowrap">
                        {new Date(app.appliedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                    {expandedRow === app.decisionId && (
                      <tr key={`${app.decisionId}-expanded`} className="bg-blue-50 border-b border-blue-100">
                        <td colSpan={8} className="px-5 py-3">
                          <div className="flex flex-wrap items-center gap-4 text-xs">
                            <span className="text-neutral-500">PAN: <span className="font-mono text-neutral-700">{app.pan}</span></span>
                            {app.processingMs && (
                              <span className="text-neutral-500">Processing: <span className="text-neutral-700">{app.processingMs}ms</span></span>
                            )}
                            {app.decidedAt && (
                              <span className="text-neutral-500">Decided: <span className="text-neutral-700">{new Date(app.decidedAt).toLocaleTimeString()}</span></span>
                            )}
                            {app.reasonCodes.length > 0 && (
                              <span className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-neutral-500">Reason codes:</span>
                                {app.reasonCodes.map((code) => (
                                  <span key={code} className="px-2 py-0.5 rounded bg-red-100 text-red-700 font-medium">{code}</span>
                                ))}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <p className="text-xs text-neutral-400 mt-3 text-right">
          {apps.length} record{apps.length !== 1 ? 's' : ''} · click a row to expand
        </p>
      </div>
    </div>
  )
}

export default AdminPanel
