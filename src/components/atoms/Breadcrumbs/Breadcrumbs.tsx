import { useEffect } from 'react'
import { useBreadcrumbStore, type BreadcrumbItem } from '@stores/breadStore'

export interface BreadcrumbsSetterProps {
  breadcrumbs: BreadcrumbItem[]
}

const BreadcrumbsSetter = ({ breadcrumbs }: BreadcrumbsSetterProps) => {
  const { setBreadcrumbs } = useBreadcrumbStore()

  useEffect(() => {
    setBreadcrumbs(breadcrumbs)
  }, [breadcrumbs, setBreadcrumbs])

  return null
}

export default BreadcrumbsSetter
