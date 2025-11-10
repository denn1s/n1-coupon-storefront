import React, { useState } from 'react'

interface CopyableIdProps {
  id: string
}

function truncateId(id: string) {
  if (id.length <= 12) return id
  return `${id.slice(0, 6)}...${id.slice(-4)}`
}

const CopyableId: React.FC<CopyableIdProps> = ({ id }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await navigator.clipboard.writeText(id)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <span
      onClick={handleCopy}
      style={{ cursor: 'pointer', userSelect: 'all', color: copied ? '#16a34a' : undefined }}
      title={copied ? 'Copiado!' : 'Click para copiar'}
    >
      {truncateId(id)}
      {copied && <span style={{ marginLeft: 4, fontSize: 12 }}>✔</span>}
    </span>
  )
}

export default CopyableId 