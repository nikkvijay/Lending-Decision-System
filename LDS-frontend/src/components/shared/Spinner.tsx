interface Props {
  size?: 'sm' | 'md' | 'lg'
}

const Spinner = ({ size = 'md' }: Props) => {
  const sizeClass = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }[size]
  return (
    <div
      className={`${sizeClass} border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin`}
    />
  )
}

export default Spinner
