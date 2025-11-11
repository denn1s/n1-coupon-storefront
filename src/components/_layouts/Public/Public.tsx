import { ReactNode } from 'react'
import Navbar from '@components/molecules/Navbar'

interface PublicLayoutProps {
  children: ReactNode
}

const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      {children}
    </div>
  )
}

export default PublicLayout
