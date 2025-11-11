import { Store, useStore } from '@tanstack/react-store'

export interface BreadcrumbItem {
  displayName: string
  path?: string
}

interface BreadcrumbState {
  breadcrumbs: BreadcrumbItem[]
}

const breadcrumbStore = new Store<BreadcrumbState>({
  breadcrumbs: []
})

function useBreadcrumbStore() {
  const breadcrumbs = useStore(breadcrumbStore, (state) => state.breadcrumbs)

  const setBreadcrumbs = (items: BreadcrumbItem[]) => {
    breadcrumbStore.setState(() => ({
      breadcrumbs: items
    }))
  }

  return { breadcrumbs, setBreadcrumbs }
}

export { breadcrumbStore, useBreadcrumbStore }
