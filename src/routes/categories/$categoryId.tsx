import { createFileRoute } from '@tanstack/react-router'
import { useGetCategories, useGetProducts } from '@services/holding.graphql'
import ProductCard from '@components/molecules/ProductCard'
import { HoldingProduct } from '@lib/api/types'

export const Route = createFileRoute('/categories/$categoryId')({
  component: CategoryPage
})

function CategoryPage() {
  const { categoryId } = Route.useParams()
  const catIdInt = parseInt(categoryId)

  // Fetch category details
  const { data: categoriesData, isLoading: isLoadingCat } = useGetCategories({ first: 50 })
  const category = categoriesData?.holdingBusinessCategories?.nodes?.find((c) => c.id === catIdInt)

  // Fetch products (placeholder: fetching all products)
  const { data: productsData, isLoading: isLoadingProd } = useGetProducts({ first: 20 })
  const products = productsData?.holdingProducts?.nodes ?? []

  if (isLoadingCat || isLoadingProd) {
    return <div className="p-8 text-center">Cargando...</div>
  }

  if (!category) {
    return <div className="p-8 text-center">Categoría no encontrada</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
        {category.description && <p className="mt-2 text-gray-600">{category.description}</p>}
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
        <p className="text-blue-700">
          Mostrando todos los productos disponibles. El filtrado por categoría estará disponible próximamente.
        </p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product: HoldingProduct) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No hay productos disponibles en este momento.</p>
        </div>
      )}
    </div>
  )
}
