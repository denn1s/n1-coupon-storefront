import { Outlet } from '@tanstack/react-router'
import Breadcrumbs from '@components/atoms/Breadcrumbs'
import { SettingsSidebar } from './components'

export default function Settings() {
  const breadcrumbs = [{ displayName: 'Settings' }]

  return (
    <div className="flex flex-col h-screen">
      <Breadcrumbs breadcrumbs={breadcrumbs} />

      {/* Header de Settings */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center">
          <div className="p-3 bg-gray-100 rounded-lg mr-4">
            <svg className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Manage your account settings and configurations</p>
          </div>
        </div>
      </div>

      {/* Layout con Sidebar y Contenido */}
      <div className="flex flex-1 bg-gray-50 overflow-hidden min-h-0">
        {/* Sidebar Secundario */}
        <SettingsSidebar />

        {/* Contenido principal */}
        <div className="flex-1 bg-white m-4 rounded-lg shadow overflow-hidden flex flex-col min-w-0">
          <div className="flex-1 overflow-auto p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
