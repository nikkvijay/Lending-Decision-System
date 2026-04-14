import { useEffect, useState } from 'react'
import { getAdminApplications, getAdminStats, getAdminAuditLogs } from '@/api'
import Navbar from '@/components/shared/Navbar'

interface Application {
  decisionId: string
  status: string
  decision: string | null
  creditScore: number | null
  reasonCodes: string[]
  processingMs: number | null
  amount: number
  tenureMonths: number
  purpose: string
  appliedAt: string
  ownerName: string
  businessName: string
  businessType: string
  monthlyRevenue: number
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

interface AuditLog {
  id: string
  eventType: string
  entityType: string
  entityId: string
  metadata: Record<string, unknown>
  timestamp: string
}

type Tab = 'overview' | 'applications' | 'audit'

const formatINR = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

const EVENT_STYLES: Record<string, { dot: string; text: string; bg: string }> = {
  PROFILE_CREATED:    { dot: 'bg-blue-500',    text: 'text-blue-700',    bg: 'bg-blue-50 border-blue-200' },
  LOAN_SUBMITTED:     { dot: 'bg-indigo-500',  text: 'text-indigo-700',  bg: 'bg-indigo-50 border-indigo-200' },
  DECISION_STARTED:   { dot: 'bg-amber-500',   text: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200' },
  DECISION_COMPLETED: { dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  DECISION_FAILED:    { dot: 'bg-red-500',     text: 'text-red-700',     bg: 'bg-red-50 border-red-200' },
}

const DecisionBadge = ({ decision, status }: { decision: string | null; status: string }) => {
  if (status === 'PENDING' || status === 'PROCESSING')
    return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">Processing</span>
  if (decision === 'APPROVED')
    return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">Approved</span>
  if (decision === 'REJECTED')
    return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-200">Rejected</span>
  return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-400">—</span>
}

const MetricCard = ({
  label, value, sub, accent = false,
}: { label: string; value: string | number; sub?: string; accent?: boolean }) => (
  <div className={`rounded-xl border p-5 ${accent ? 'bg-blue-600 border-blue-600' : 'bg-white border-neutral-200'}`}>
    <p className={`text-xs font-medium uppercase tracking-wider ${accent ? 'text-blue-200' : 'text-neutral-400'}`}>{label}</p>
    <p className={`text-3xl font-bold mt-1 ${accent ? 'text-white' : 'text-neutral-900'}`}>{value}</p>
    {sub && <p className={`text-xs mt-0.5 ${accent ? 'text-blue-200' : 'text-neutral-400'}`}>{sub}</p>}
  </div>
)

const SuperAdminPanel = () => {
  const [tab, setTab] = useState<Tab>('overview')
  const [apps, setApps] = useState<Application[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getAdminApplications('ALL'),
      getAdminStats(),
      getAdminAuditLogs(100),
    ])
      .then(([appsRes, statsRes, logsRes]) => {
        setApps(appsRes.data.data)
        setStats(statsRes.data.data)
        setAuditLogs(logsRes.data.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const TABS: { key: Tab; label: string }[] = [
    { key: 'overview',      label: 'Overview' },
    { key: 'applications',  label: `Applications (${apps.length})` },
    { key: 'audit',         label: `Audit Logs (${auditLogs.length})` },
  ]

  const approvedApps  = apps.filter((a) => a.decision === 'APPROVED')
  const rejectedApps  = apps.filter((a) => a.decision === 'REJECTED')
  const scores        = apps.filter((a) => a.creditScore).map((a) => a.creditScore as number)
  const maxScore      = scores.length ? Math.max(...scores) : null
  const minScore      = scores.length ? Math.min(...scores) : null

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-1">System</p>
            <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">Super Admin</h1>
            <p className="text-sm text-neutral-400 mt-1">Full system visibility — applications, scoring, audit trail</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white">SUPERADMIN</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-white border border-neutral-200 rounded-lg p-1 w-fit">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${
                tab === key ? 'bg-blue-600 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* OVERVIEW TAB */}
            {tab === 'overview' && stats && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <MetricCard label="Total Applications" value={stats.total} sub={`${stats.today} in last 24h`} accent />
                  <MetricCard label="Approval Rate" value={stats.approval_rate != null ? `${stats.approval_rate}%` : '—'} sub={`${stats.approved} approved`} />
                  <MetricCard label="Avg Credit Score" value={stats.avg_score ?? '—'} sub="completed decisions" />
                  <MetricCard label="Pending / Processing" value={stats.pending} sub="awaiting decision" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white border border-neutral-200 rounded-xl p-5">
                    <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-4">Score Distribution</p>
                    <div className="space-y-2.5">
                      {[
                        { label: 'Excellent  (750–850)', count: scores.filter(s => s >= 750).length, color: 'bg-emerald-500' },
                        { label: 'Good  (650–749)',      count: scores.filter(s => s >= 650 && s < 750).length, color: 'bg-blue-500' },
                        { label: 'Fair  (500–649)',      count: scores.filter(s => s >= 500 && s < 650).length, color: 'bg-amber-500' },
                        { label: 'Poor  (300–499)',      count: scores.filter(s => s < 500).length, color: 'bg-red-400' },
                      ].map(({ label, count, color }) => (
                        <div key={label}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-neutral-500">{label}</span>
                            <span className="font-medium text-neutral-900">{count}</span>
                          </div>
                          <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${color} rounded-full transition-all`}
                              style={{ width: scores.length ? `${(count / scores.length) * 100}%` : '0%' }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border border-neutral-200 rounded-xl p-5">
                    <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-4">Decision Breakdown</p>
                    <div className="flex items-end gap-3 h-24">
                      {[
                        { label: 'Approved', count: stats.approved, color: 'bg-emerald-500' },
                        { label: 'Rejected', count: stats.rejected, color: 'bg-red-400' },
                        { label: 'Pending',  count: stats.pending,  color: 'bg-amber-400' },
                      ].map(({ label, count, color }) => (
                        <div key={label} className="flex-1 flex flex-col items-center gap-1">
                          <span className="text-sm font-semibold text-neutral-900">{count}</span>
                          <div
                            className={`w-full ${color} rounded-t transition-all`}
                            style={{ height: stats.total ? `${Math.max((count / stats.total) * 80, 4)}px` : '4px' }}
                          />
                          <span className="text-xs text-neutral-400">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border border-neutral-200 rounded-xl p-5">
                    <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-4">Score Range</p>
                    <div className="space-y-3 mt-2">
                      <div>
                        <p className="text-xs text-neutral-400">Highest score</p>
                        <p className="text-2xl font-bold text-emerald-600 mt-0.5">{maxScore ?? '—'}</p>
                      </div>
                      <div className="border-t border-neutral-100 pt-3">
                        <p className="text-xs text-neutral-400">Lowest score</p>
                        <p className="text-2xl font-bold text-red-500 mt-0.5">{minScore ?? '—'}</p>
                      </div>
                      <div className="border-t border-neutral-100 pt-3">
                        <p className="text-xs text-neutral-400">Approval threshold</p>
                        <p className="text-2xl font-bold text-blue-600 mt-0.5">650</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent 5 */}
                <div>
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">Recent Applications</p>
                  <div className="bg-white border border-neutral-200 rounded-xl divide-y divide-neutral-50">
                    {apps.slice(0, 5).map((app) => (
                      <div key={app.decisionId} className="flex items-center justify-between px-5 py-3.5">
                        <div>
                          <p className="text-sm font-medium text-neutral-900">{app.businessName}</p>
                          <p className="text-xs text-neutral-400 mt-0.5">{app.ownerName} · {formatINR(app.amount)} · {app.tenureMonths}m</p>
                        </div>
                        <div className="flex items-center gap-3">
                          {app.creditScore && (
                            <span className="text-sm font-semibold tabular-nums" style={{
                              color: app.creditScore >= 650 ? '#10b981' : app.creditScore >= 500 ? '#f59e0b' : '#ef4444'
                            }}>
                              {app.creditScore}
                            </span>
                          )}
                          <DecisionBadge decision={app.decision} status={app.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* APPLICATIONS TAB */}
            {tab === 'applications' && (
              <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-100 bg-neutral-50">
                      <th className="text-left px-5 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Business</th>
                      <th className="text-right px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Revenue</th>
                      <th className="text-right px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Loan</th>
                      <th className="text-right px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Score</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Decision</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Reason Codes</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50">
                    {apps.map((app) => (
                      <tr key={app.decisionId} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-5 py-3.5">
                          <p className="font-medium text-neutral-900">{app.businessName}</p>
                          <p className="text-xs text-neutral-400">{app.ownerName}</p>
                        </td>
                        <td className="px-4 py-3.5 text-right text-neutral-600 tabular-nums text-xs">{formatINR(app.monthlyRevenue)}</td>
                        <td className="px-4 py-3.5 text-right text-neutral-900 font-medium tabular-nums">{formatINR(app.amount)}</td>
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
                        <td className="px-4 py-3.5">
                          <div className="flex flex-wrap gap-1">
                            {app.reasonCodes.length > 0
                              ? app.reasonCodes.map((rc) => (
                                  <span key={rc} className="px-1.5 py-0.5 rounded text-xs bg-red-50 text-red-600 border border-red-100">{rc}</span>
                                ))
                              : <span className="text-xs text-neutral-300">—</span>
                            }
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-neutral-400 whitespace-nowrap">
                          {new Date(app.appliedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* AUDIT LOGS TAB */}
            {tab === 'audit' && (
              <div className="space-y-2">
                {auditLogs.length === 0 ? (
                  <div className="text-center py-16 bg-white border border-neutral-200 rounded-xl">
                    <p className="text-sm text-neutral-400">No audit logs found</p>
                  </div>
                ) : (
                  auditLogs.map((log) => {
                    const style = EVENT_STYLES[log.eventType] ?? { dot: 'bg-neutral-400', text: 'text-neutral-600', bg: 'bg-neutral-50 border-neutral-200' }
                    return (
                      <div key={String(log.id)} className={`flex items-start gap-4 px-5 py-3.5 rounded-xl border ${style.bg}`}>
                        <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${style.dot}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs font-semibold ${style.text}`}>{log.eventType}</span>
                            <span className="text-xs text-neutral-400">{log.entityType} · <span className="font-mono">{log.entityId.slice(0, 8)}…</span></span>
                          </div>
                          {log.metadata && Object.keys(log.metadata).length > 0 && (
                            <p className="text-xs text-neutral-500 mt-0.5 truncate">
                              {Object.entries(log.metadata).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                            </p>
                          )}
                        </div>
                        <span className="text-xs text-neutral-400 whitespace-nowrap flex-shrink-0">
                          {new Date(log.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          <span className="block text-right">
                            {new Date(log.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                          </span>
                        </span>
                      </div>
                    )
                  })
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default SuperAdminPanel
