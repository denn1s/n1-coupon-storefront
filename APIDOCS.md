````markdown
# N1 Coupons API Documentation

This documentation covers the GraphQL endpoints for the N1 Coupons system, organized by functionality.

**Base URL:** `{{SHOP_API_HOST}}/graphql`

**Authentication:** Bearer token authentication using `{{APP_API_ACCESS_TOKEN}}`

**Common Headers:**

- `X-App-Id`: Application identifier (required)
- `X-Territory`: Territory code (optional)
- `X-Geo-Longitude`: Longitude coordinate (optional)
- `X-Geo-Latitude`: Latitude coordinate (optional)

---

## Queries

### Holding

#### 1. GetHoldingBusinessCategories

Retrieves business categories for the holding with pagination support.

**Access:** Public

**GraphQL Query:**

```graphql
query holdingBusinessCategories($first: Int, $after: String) {
  holdingBusinessCategories(first: $first, after: $after) {
    edges {
      node {
        id
        name
        slug
        imageUrl
      }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```
````

**Fetch Example:**

```javascript
fetch('https://your-shop-api-host.com/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer YOUR_ACCESS_TOKEN',
    'X-App-Id': 'YOUR_APP_ID'
  },
  body: JSON.stringify({
    query: `
      query holdingBusinessCategories($first: Int, $after: String) {
        holdingBusinessCategories(first: $first, after: $after) {
          edges {
            node {
              id
              name
              slug
              imageUrl
            }
            cursor
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `,
    variables: {
      first: 10,
      after: null
    }
  })
})
  .then((response) => response.json())
  .then((data) => console.log(data))
```

**Example Response:**

```json
{
  "data": {
    "holdingBusinessCategories": {
      "edges": [
        {
          "node": {
            "id": "cat_123",
            "name": "Electronics",
            "slug": "electronics",
            "imageUrl": "https://example.com/electronics.jpg"
          },
          "cursor": "cursor_abc"
        }
      ],
      "pageInfo": {
        "hasNextPage": true,
        "endCursor": "cursor_xyz"
      }
    }
  }
}
```

---

#### 2. GetHoldingStores

Retrieves stores for the holding with pagination support.

**Access:** Public

**GraphQL Query:**

```graphql
query holdingStores($first: Int, $after: String) {
  holdingStores(first: $first, after: $after) {
    edges {
      node {
        id
        name
        slug
        description
        logoUrl
        bannerUrl
      }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

**Fetch Example:**

```javascript
fetch('https://your-shop-api-host.com/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer YOUR_ACCESS_TOKEN',
    'X-App-Id': 'YOUR_APP_ID'
  },
  body: JSON.stringify({
    query: `
      query holdingStores($first: Int, $after: String) {
        holdingStores(first: $first, after: $after) {
          edges {
            node {
              id
              name
              slug
              description
              logoUrl
              bannerUrl
            }
            cursor
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `,
    variables: {
      first: 10,
      after: null
    }
  })
})
  .then((response) => response.json())
  .then((data) => console.log(data))
```

**Example Response:**

```json
{
  "data": {
    "holdingStores": {
      "edges": [
        {
          "node": {
            "id": "store_456",
            "name": "Tech Store",
            "slug": "tech-store",
            "description": "Your one-stop tech shop",
            "logoUrl": "https://example.com/logo.jpg",
            "bannerUrl": "https://example.com/banner.jpg"
          },
          "cursor": "cursor_def"
        }
      ],
      "pageInfo": {
        "hasNextPage": false,
        "endCursor": "cursor_def"
      }
    }
  }
}
```

---

#### 3. GetHoldingCollections

Retrieves product collections for the holding with pagination support.

**Access:** Public

**GraphQL Query:**

```graphql
query holdingCollections($first: Int, $after: String) {
  holdingCollections(first: $first, after: $after) {
    edges {
      node {
        id
        name
        slug
        description
        imageUrl
      }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

**Fetch Example:**

```javascript
fetch('https://your-shop-api-host.com/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer YOUR_ACCESS_TOKEN',
    'X-App-Id': 'YOUR_APP_ID'
  },
  body: JSON.stringify({
    query: `
      query holdingCollections($first: Int, $after: String) {
        holdingCollections(first: $first, after: $after) {
          edges {
            node {
              id
              name
              slug
              description
              imageUrl
            }
            cursor
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `,
    variables: {
      first: 10,
      after: null
    }
  })
})
  .then((response) => response.json())
  .then((data) => console.log(data))
```

**Example Response:**

```json
{
  "data": {
    "holdingCollections": {
      "edges": [
        {
          "node": {
            "id": "col_789",
            "name": "Summer Sale",
            "slug": "summer-sale",
            "description": "Hot deals for summer",
            "imageUrl": "https://example.com/summer.jpg"
          },
          "cursor": "cursor_ghi"
        }
      ],
      "pageInfo": {
        "hasNextPage": true,
        "endCursor": "cursor_ghi"
      }
    }
  }
}
```

---

#### 4. GetHoldingProducts

Retrieves products for the holding with detailed information and pagination support.

**Access:** Public

**GraphQL Query:**

```graphql
query holdingProducts($first: Int, $after: String) {
  holdingProducts(first: $first, after: $after) {
    edges {
      node {
        id
        name
        slug
        description
        price
        compareAtPrice
        imageUrl
        images {
          url
          altText
        }
        variants {
          id
          name
          price
          sku
        }
      }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

**Fetch Example:**

```javascript
fetch('https://your-shop-api-host.com/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer YOUR_ACCESS_TOKEN',
    'X-App-Id': 'YOUR_APP_ID'
  },
  body: JSON.stringify({
    query: `
      query holdingProducts($first: Int, $after: String) {
        holdingProducts(first: $first, after: $after) {
          edges {
            node {
              id
              name
              slug
              description
              price
              compareAtPrice
              imageUrl
              images {
                url
                altText
              }
              variants {
                id
                name
                price
                sku
              }
            }
            cursor
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `,
    variables: {
      first: 20,
      after: null
    }
  })
})
  .then((response) => response.json())
  .then((data) => console.log(data))
```

**Example Response:**

```json
{
  "data": {
    "holdingProducts": {
      "edges": [
        {
          "node": {
            "id": "prod_101",
            "name": "Wireless Headphones",
            "slug": "wireless-headphones",
            "description": "Premium sound quality",
            "price": 99.99,
            "compareAtPrice": 149.99,
            "imageUrl": "https://example.com/headphones.jpg",
            "images": [
              {
                "url": "https://example.com/headphones-1.jpg",
                "altText": "Front view"
              }
            ],
            "variants": [
              {
                "id": "var_201",
                "name": "Black",
                "price": 99.99,
                "sku": "WH-BLK-001"
              }
            ]
          },
          "cursor": "cursor_jkl"
        }
      ],
      "pageInfo": {
        "hasNextPage": true,
        "endCursor": "cursor_jkl"
      }
    }
  }
}
```

---

### Checkout

#### 5. GetCheckoutSession

Retrieves the current checkout session with comprehensive cart, buyer, payment, and shipment details.

**Access:** Public/Private (returns buyer data when authenticated)

**GraphQL Query:**

```graphql
query checkoutSession {
  checkoutSession {
    id
    status
    cart {
      id
      items {
        id
        productId
        variantId
        quantity
        price
        subtotal
      }
      subtotal
      tax
      shipping
      total
    }
    buyer {
      id
      email
      firstName
      lastName
      phone
    }
    shippingAddress {
      street
      city
      state
      postalCode
      country
    }
    billingAddress {
      street
      city
      state
      postalCode
      country
    }
    paymentMethod {
      type
      last4
    }
    shipmentOptions {
      id
      name
      price
      estimatedDays
    }
  }
}
```

**Fetch Example:**

```javascript
fetch('https://your-shop-api-host.com/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer YOUR_ACCESS_TOKEN',
    'X-App-Id': 'YOUR_APP_ID'
  },
  body: JSON.stringify({
    query: `
      query checkoutSession {
        checkoutSession {
          id
          status
          cart {
            id
            items {
              id
              productId
              variantId
              quantity
              price
              subtotal
            }
            subtotal
            tax
            shipping
            total
          }
          buyer {
            id
            email
            firstName
            lastName
            phone
          }
          shippingAddress {
            street
            city
            state
            postalCode
            country
          }
          billingAddress {
            street
            city
            state
            postalCode
            country
          }
          paymentMethod {
            type
            last4
          }
          shipmentOptions {
            id
            name
            price
            estimatedDays
          }
        }
      }
    `
  })
})
  .then((response) => response.json())
  .then((data) => console.log(data))
```

**Example Response (Authenticated):**

```json
{
  "data": {
    "checkoutSession": {
      "id": "checkout_abc123",
      "status": "pending",
      "cart": {
        "id": "cart_xyz789",
        "items": [
          {
            "id": "item_001",
            "productId": "prod_101",
            "variantId": "var_201",
            "quantity": 2,
            "price": 99.99,
            "subtotal": 199.98
          }
        ],
        "subtotal": 199.98,
        "tax": 20.0,
        "shipping": 10.0,
        "total": 229.98
      },
      "buyer": {
        "id": "buyer_456",
        "email": "customer@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "phone": "+1234567890"
      },
      "shippingAddress": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "postalCode": "10001",
        "country": "US"
      },
      "billingAddress": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "postalCode": "10001",
        "country": "US"
      },
      "paymentMethod": {
        "type": "credit_card",
        "last4": "4242"
      },
      "shipmentOptions": [
        {
          "id": "ship_standard",
          "name": "Standard Shipping",
          "price": 10.0,
          "estimatedDays": 5
        },
        {
          "id": "ship_express",
          "name": "Express Shipping",
          "price": 25.0,
          "estimatedDays": 2
        }
      ]
    }
  }
}
```

---

## Mutations

### Checkout

#### 6. ProcessCheckout

Processes the checkout and creates an order.

**Access:** Private (requires authentication)

**GraphQL Mutation:**

```graphql
mutation checkout($input: CheckoutInput!) {
  checkout(input: $input) {
    order {
      id
      orderNumber
      status
      total
      createdAt
    }
    errors {
      field
      message
    }
  }
}
```

**Fetch Example:**

```javascript
fetch('https://your-shop-api-host.com/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer YOUR_ACCESS_TOKEN',
    'X-App-Id': 'YOUR_APP_ID'
  },
  body: JSON.stringify({
    query: `
      mutation checkout($input: CheckoutInput!) {
        checkout(input: $input) {
          order {
            id
            orderNumber
            status
            total
            createdAt
          }
          errors {
            field
            message
          }
        }
      }
    `,
    variables: {
      input: {
        checkoutSessionId: 'checkout_abc123',
        paymentMethodId: 'pm_card_visa',
        shippingAddressId: 'addr_123',
        billingAddressId: 'addr_123',
        shipmentOptionId: 'ship_standard'
      }
    }
  })
})
  .then((response) => response.json())
  .then((data) => console.log(data))
```

**Example Response (Success):**

```json
{
  "data": {
    "checkout": {
      "order": {
        "id": "order_xyz789",
        "orderNumber": "ORD-2024-001",
        "status": "confirmed",
        "total": 229.98,
        "createdAt": "2024-01-15T10:30:00Z"
      },
      "errors": []
    }
  }
}
```

**Example Response (Error):**

```json
{
  "data": {
    "checkout": {
      "order": null,
      "errors": [
        {
          "field": "paymentMethodId",
          "message": "Payment method is invalid or expired"
        }
      ]
    }
  }
}
```

---

## Error Handling

All endpoints may return GraphQL errors in the following format:

```json
{
  "errors": [
    {
      "message": "Error description",
      "locations": [{ "line": 2, "column": 3 }],
      "path": ["fieldName"],
      "extensions": {
        "code": "ERROR_CODE"
      }
    }
  ]
}
```

Common error codes:

- `UNAUTHENTICATED`: Missing or invalid authentication token
- `FORBIDDEN`: Insufficient permissions
- `BAD_USER_INPUT`: Invalid input parameters
- `NOT_FOUND`: Requested resource not found
- `INTERNAL_SERVER_ERROR`: Server-side error
