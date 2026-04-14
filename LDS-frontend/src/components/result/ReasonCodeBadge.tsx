import { REASON_CODE_LABELS } from '@/utils/formatters'

interface Props { code: string }

const ReasonCodeBadge = ({ code }: Props) => {
  const label = REASON_CODE_LABELS[code]
  return (
    <div className="group relative">
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-neutral-100 text-neutral-700 border border-neutral-200 cursor-default">
        <span className="w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />
        {label?.title || code}
      </span>
      {label?.description && (
        <div className="absolute bottom-full left-0 mb-2 w-56 bg-neutral-900 text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none leading-relaxed">
          {label.description}
        </div>
      )}
    </div>
  )
}

export default ReasonCodeBadge
