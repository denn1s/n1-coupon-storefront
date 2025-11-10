import { format, isValid, parseISO } from 'date-fns'

type DateProps = {
  date?: string | null
}

const Date: React.FC<DateProps> = ({ date }) => {
  if (!date) return <span className="text-sm text-gray-300">--</span>

  const parsedDate = parseISO(date)
  const displayDate = isValid(parsedDate) ? format(parsedDate, 'MMM d, yyyy') : 'Invalid date'
  const displayTime = isValid(parsedDate) ? format(parsedDate, 'HH:mm') : 'Invalid time'

  return (
    <div className="flex flex-col items-start text-gray-500">
      <span>{displayDate}</span>
      <span>{displayTime}</span>
    </div>
  )
}

export default Date
