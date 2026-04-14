import { REASON_CODE_LABELS } from '@/utils/formatters'

interface Props {
  code: string
}

const ReasonCodeBadge = ({ code }: Props) => {
  const label = REASON_CODE_LABELS[code]

  return (
    <div className="group relative inline-block">
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200 cursor-help">
        {label?.title || code}
      </span>
      {label?.description && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none text-left">
          {label.description}
        </div>
      )}
    </div>
  )
}

export default ReasonCodeBadge
