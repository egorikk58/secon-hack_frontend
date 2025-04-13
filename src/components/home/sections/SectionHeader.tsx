import { CirclePlus } from 'lucide-react'

interface SectionHeaderProps {
  title: string
  description?: string
  onAction?: () => void
}

export default function SectionHeader({
  title,
  description,
  onAction,
}: SectionHeaderProps) {
  return (
    <section className='bg-white rounded-2xl p-4  flex flex-col items-center'>
      <h2 className="text-2xl font-bold mb-4 pb-4 font-arkhip w-lg border-b text-center">
        {title}
      </h2>

      {description && (
        <p className="text-gray-800 mb-4">
          {description}
        </p>
      )}

      <button
        onClick={onAction}
        className="cursor-pointer hover:bg-gray-100 rounded-full p-2 transition-colors"
        aria-label={description || "Добавить"}
      >
        <CirclePlus
          size={48}
          className="text-gray-600 hover:text-green-600/90 transition-colors"
        />
      </button>
    </section>
  )
}