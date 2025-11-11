import { FaSpinner } from 'react-icons/fa'

export default function FullScreenLoader() {
  return (
    <div
      className="inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900"
      style={{ height: '100dvh', width: '100dvw' }}
    >
      <FaSpinner className="animate-spin text-6xl text-blue-600 dark:text-blue-400 mb-4" />
    </div>
  )
}
