import { useState } from 'react'
import { useProductsPagination, useGetCategories, useGetStores } from '@services/holding.graphql'
import { HoldingProduct } from '@lib/api/types'
import SearchBox from '@components/atoms/SearchBox'
import ProductCard from '@components/molecules/ProductCard'
import ProductCardSkeleton from '@components/molecules/ProductCardSkeleton'
import ProductFilters from '@components/molecules/ProductFilters'
import CheckoutModal from '@components/organisms/CheckoutModal'
import { Route } from '@routes/index'
import styles from './ProductsPage.module.css'

/**
 * Products List Page (Groupon-like Coupons/Deals)
 *
 * Features:
 * - Search functionality
 * - Category and store filters
 * - Cursor-based pagination
 * - Product cards with buy functionality
 * - Checkout modal with QR code coupon
 * - Responsive grid layout
 */
export default function ProductsPage() {
  // Get loader data to avoid duplicate requests
  const loaderData = Route.useLoaderData()

  const [selectedProduct, setSelectedProduct] = useState<HoldingProduct | null>(null)
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)

  const {
    data: products,
    totalCount,
    isLoading: productsLoading,
    error: productsError,
    hasNextPage,
    hasPreviousPage,
    goToNextPage,
    goToPreviousPage,
    prefetchNextPage,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedStore,
    setSelectedStore,
    resetFilters
  } = useProductsPagination(20, {
    initialData: loaderData?.products,
    staleTime: 5 * 60 * 1000
  })

  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategories(
    { first: 50 },
    {
      initialData: loaderData?.categories,
      staleTime: 5 * 60 * 1000
    }
  )

  const { data: storesData, isLoading: storesLoading } = useGetStores(
    { first: 50 },
    {
      initialData: loaderData?.stores,
      staleTime: 5 * 60 * 1000
    }
  )

  const categories = categoriesData?.nodes ?? []
  const stores = storesData?.nodes ?? []

  // Differentiate between initial load and pagination load
  const isInitialLoad = productsLoading && !products.length
  const isPaginationLoad = productsLoading && products.length > 0

  // Handle buy button click
  const handleBuyClick = (product: HoldingProduct) => {
    setSelectedProduct(product)
    setIsCheckoutModalOpen(true)
  }

  const handleCloseCheckout = () => {
    setIsCheckoutModalOpen(false)
    setSelectedProduct(null)
  }

  // Initial loading state (first page load)
  if (isInitialLoad) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <span className="loading loading-spinner loading-lg"></span>
          <p>Loading deals...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (productsError) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Error loading deals</h2>
          <p>{productsError.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Today's Deals</h1>
        <p className={styles.subtitle}>
          {totalCount} amazing {totalCount === 1 ? 'deal' : 'deals'} available
        </p>
      </div>

      {/* Search and Filters */}
      <div className={styles.controlsContainer}>
        {/* Search Box */}
        <div className={styles.searchContainer}>
          <SearchBox
            value={searchTerm}
            onChange={setSearchTerm}
            onClear={() => setSearchTerm('')}
            placeholder="Search deals..."
          />
        </div>

        {/* Filters */}
        <div className={styles.filtersContainer}>
          <ProductFilters
            categories={categories}
            stores={stores}
            selectedCategory={selectedCategory}
            selectedStore={selectedStore}
            onCategoryChange={setSelectedCategory}
            onStoreChange={setSelectedStore}
            onReset={resetFilters}
            isLoading={categoriesLoading || storesLoading}
          />
        </div>
      </div>

      {/* Empty state */}
      {products.length === 0 ? (
        <div className={styles.empty}>
          <h2>No deals found</h2>
          <p>Try adjusting your search or filters</p>
          {(searchTerm || selectedCategory || selectedStore) && (
            <button onClick={resetFilters} className="btn btn-primary mt-4">
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Products Grid */}
          <div className={styles.grid}>
            {isPaginationLoad ? (
              // Show skeleton cards during pagination
              <>
                {Array.from({ length: 20 }).map((_, index) => (
                  <ProductCardSkeleton key={`skeleton-${index}`} />
                ))}
              </>
            ) : (
              // Show actual products
              products.map((product) => <ProductCard key={product.id} product={product} onBuyClick={handleBuyClick} />)
            )}
          </div>

          {/* Pagination Controls */}
          <div className={styles.pagination}>
            <button onClick={goToPreviousPage} disabled={!hasPreviousPage} className={styles.paginationButton}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className={styles.icon}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Previous
            </button>

            <span className={styles.paginationInfo}>
              Showing {products.length} of {totalCount} deals
            </span>

            <button
              onClick={goToNextPage}
              onMouseEnter={prefetchNextPage}
              disabled={!hasNextPage}
              className={styles.paginationButton}
            >
              Next
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className={styles.icon}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </>
      )}

      {/* Checkout Modal */}
      {selectedProduct && (
        <CheckoutModal product={selectedProduct} isOpen={isCheckoutModalOpen} onClose={handleCloseCheckout} />
      )}
    </div>
  )
}
