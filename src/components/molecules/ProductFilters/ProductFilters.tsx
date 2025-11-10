import { HoldingBusinessCategory, HoldingStore } from '@lib/api/types'
import styles from './ProductFilters.module.css'

export interface ProductFiltersProps {
  categories: HoldingBusinessCategory[]
  stores: HoldingStore[]
  selectedCategory: number | null
  selectedStore: number | null
  onCategoryChange: (categoryId: number | null) => void
  onStoreChange: (storeId: number | null) => void
  onReset: () => void
  isLoading?: boolean
}

/**
 * ProductFilters Component
 *
 * Provides filtering options for products by category and store.
 * Used in product listing pages to help users narrow down their search.
 *
 * @example
 * <ProductFilters
 *   categories={categories}
 *   stores={stores}
 *   selectedCategory={selectedCategory}
 *   selectedStore={selectedStore}
 *   onCategoryChange={setSelectedCategory}
 *   onStoreChange={setSelectedStore}
 *   onReset={resetFilters}
 * />
 */
const ProductFilters = ({
  categories,
  stores,
  selectedCategory,
  selectedStore,
  onCategoryChange,
  onStoreChange,
  onReset,
  isLoading = false,
}: ProductFiltersProps) => {
  const hasActiveFilters = selectedCategory !== null || selectedStore !== null

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Filters</h3>
        {hasActiveFilters && (
          <button onClick={onReset} className={styles.resetButton}>
            Clear All
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className={styles.filterSection}>
        <label className={styles.filterLabel}>Category</label>
        <select
          value={selectedCategory ?? ''}
          onChange={(e) =>
            onCategoryChange(e.target.value ? Number(e.target.value) : null)
          }
          className={styles.select}
          disabled={isLoading}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name} {category.storeCount > 0 && `(${category.storeCount})`}
            </option>
          ))}
        </select>
      </div>

      {/* Store Filter */}
      <div className={styles.filterSection}>
        <label className={styles.filterLabel}>Store</label>
        <select
          value={selectedStore ?? ''}
          onChange={(e) =>
            onStoreChange(e.target.value ? Number(e.target.value) : null)
          }
          className={styles.select}
          disabled={isLoading}
        >
          <option value="">All Stores</option>
          {stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </select>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className={styles.activeFilters}>
          <div className={styles.activeFiltersLabel}>Active Filters:</div>
          <div className={styles.filterTags}>
            {selectedCategory && (
              <span className={styles.filterTag}>
                {categories.find((c) => c.id === selectedCategory)?.name}
                <button
                  onClick={() => onCategoryChange(null)}
                  className={styles.filterTagRemove}
                  aria-label="Remove category filter"
                >
                  ×
                </button>
              </span>
            )}
            {selectedStore && (
              <span className={styles.filterTag}>
                {stores.find((s) => s.id === selectedStore)?.name}
                <button
                  onClick={() => onStoreChange(null)}
                  className={styles.filterTagRemove}
                  aria-label="Remove store filter"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductFilters
