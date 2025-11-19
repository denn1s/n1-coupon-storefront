Request Details: [PUBLIC] GetHoldingBusinessCategories
Postman UID: 23626907-1e622b64-3f20-4580-bbee-58f187a8c02c
Method: POST
URL: {{SHOP_API_HOST}}/graphql

1. Complete Request Body (GraphQL Query)

GraphQL

query {
holdingBusinessCategories {
nodes {
id
name
description
bannerImageUrl
smallBannerImageUrl
storeCount
}
totalCount
pageInfo {
hasNextPage
hasPreviousPage
startCursor
endCursor
}
}
}

Variables: Empty string (no variables used in this query)

2. Request Headers
   HeaderValueEnabledDescriptionX-App-Id

{{X-APP-ID}}

✅ Yes

Application identifier for authentication

X-Territory

{{X-TERRITORY}}

❌ No

Geographic territory/region

X-Geo-Longitude

{{X-GEO-LONGITUDE}}

❌ No

User's longitude coordinate

X-Geo-Latitude

{{X-GEO-LATITUDE}}

❌ No

User's latitude coordinate

Note: Currently only X-App-Id is enabled. The geographic headers are disabled in the current configuration.

3. GraphQL Query Fields & Structure
   Query Parameters (Fields Requested):
   Root Query: holdingBusinessCategories
   Returns an object with:
   nodes (Array): List of business category objects
   totalCount (Integer): Total number of categories
   pageInfo (Object): Pagination information

Node Fields (Business Category Object):
id (Integer): Unique identifier for the category
name (String): Category name
description (String): Category description
bannerImageUrl (String): URL for the banner image
smallBannerImageUrl (String): URL for the small banner image
storeCount (Integer): Number of stores in this category

PageInfo Fields (Pagination Object):
hasNextPage (Boolean): Indicates if there are more pages
hasPreviousPage (Boolean): Indicates if there are previous pages
startCursor (String): Cursor for the first item (Base64 encoded)
endCursor (String): Cursor for the last item (Base64 encoded)

4. Saved Example: "200 OK"
   Example ID: 23626907-e9587916-6a28-4a9e-8cbf-0edc52a669d4
   Status Code: 200 OK
   Content-Type: application/graphql-response+json; charset=utf-8
   Example Request Configuration:
   Same GraphQL query as above
   Headers: Only X-App-Id enabled (others commented out)
   URL: {{APP_API_HOST}}/graphql (Note: Example uses APP_API_HOST instead of SHOP_API_HOST)

Complete Example Response:

JSON

{
"data": {
"holdingBusinessCategories": {
"nodes": [
{
"id": 28,
"name": "Comida",
"description": "Comida Description",
"bannerImageUrl": "https://cdn.h4b.dev/assets/yummy/business-category/delivery/comida.png",
"smallBannerImageUrl": "https://cdn.h4b.dev/assets/yummy/business-category/delivery/comida.png",
"storeCount": 0
},
{
"id": 29,
"name": "Pizza",
"description": "Pizza Description",
"bannerImageUrl": "https://cdn.h4b.dev/assets/yummy/business-category/comida/pizza.png",
"smallBannerImageUrl": "https://cdn.h4b.dev/assets/yummy/business-category/comida/pizza.png",
"storeCount": 0
},
{
"id": 30,
"name": "Hamburguesas",
"description": "Hamburguesas Description",
"bannerImageUrl": "https://cdn.h4b.dev/assets/yummy/business-category/comida/hamburguesa.png",
"smallBannerImageUrl": "https://cdn.h4b.dev/assets/yummy/business-category/comida/hamburguesa.png",
"storeCount": 0
},
{
"id": 31,
"name": "Café",
"description": "Café Description",
"bannerImageUrl": "https://cdn.h4b.dev/assets/yummy/business-category/comida/cafe.png",
"smallBannerImageUrl": "https://cdn.h4b.dev/assets/yummy/business-category/comida/cafe.png",
"storeCount": 0
},
{
"id": 32,
"name": "Desayunos",
"description": "Desayunos Description",
"bannerImageUrl": "https://cdn.h4b.dev/assets/yummy/business-category/comida/desayunos.png",
"smallBannerImageUrl": "https://cdn.h4b.dev/assets/yummy/business-category/comida/desayunos.png",
"storeCount": 2
},
{
"id": 33,
"name": "Mexicana",
"description": "Mexicana Description",
"bannerImageUrl": "https://cdn.h4b.dev/assets/yummy/business-category/comida/mexicana.png",
"smallBannerImageUrl": "https://cdn.h4b.dev/assets/yummy/business-category/comida/mexicana.png",
"storeCount": 1
},
{
"id": 34,
"name": "Gourmet",
"description": "Gourmet Description",
"bannerImageUrl": "https://cdn.h4b.dev/assets/plazamalta/gourmet.jpg",
"smallBannerImageUrl": "https://cdn.h4b.dev/assets/plazamalta/gourmet.jpg",
"storeCount": 5
}
],
"totalCount": 7,
"pageInfo": {
"hasNextPage": false,
"hasPreviousPage": false,
"startCursor": "MA==",
"endCursor": "Ng=="
}
}
}
}

5. Response Structure & Data Types

TypeScript

{
data: {
holdingBusinessCategories: {
nodes: Array<{
id: number, // Integer ID
name: string, // Category name
description: string, // Category description
bannerImageUrl: string, // Full URL to banner image
smallBannerImageUrl: string, // Full URL to small banner
storeCount: number // Integer count of stores
}>,
totalCount: number, // Total categories available
pageInfo: {
hasNextPage: boolean, // Pagination flag
hasPreviousPage: boolean, // Pagination flag
startCursor: string, // Base64 encoded cursor
endCursor: string // Base64 encoded cursor
}
}
}
}

6. Environment Variables Used
   {{SHOP_API_HOST}} - Shop API base URL
   {{X-APP-ID}} - Application identifier
   {{X-TERRITORY}} - Territory/region code
   {{X-GEO-LONGITUDE}} - Longitude coordinate
   {{X-GEO-LATITUDE}} - Latitude coordinate

Summary
This is a public GraphQL query that retrieves business categories from the N1CO marketplace. The query returns 7 categories in the example (Comida, Pizza, Hamburguesas, Café, Desayunos, Mexicana, Gourmet) with their associated metadata including images and store counts. The response includes pagination support through cursor-based navigation, though the example shows all results fit on a single page.

---

GetHoldingStores - GraphQL Query
Overview
This endpoint retrieves information about holding stores through the Shop API's GraphQL interface. It returns a paginated list of stores that are holding inventory or orders, including store details, images, and pagination metadata.
Authentication & Headers
Required Headers
X-App-Id: Application identifier for authentication and tracking purposes. Use the {{X-APP-ID}} environment variable.

Optional Headers
X-Territory: Specifies the territory or region for the query. Use the {{X-TERRITORY}} environment variable. May be used to filter stores by region.
X-Geo-Longitude: Longitude coordinate for geographical filtering. Use the {{X-GEO-LONGITUDE}} environment variable. Can be used to find stores near a specific location.
X-Geo-Latitude: Latitude coordinate for geographical filtering. Use the {{X-GEO-LATITUDE}} environment variable. Can be used to find stores near a specific location.

GraphQL Query Structure
This is a GraphQL POST endpoint. The request body should contain the following query:

GraphQL

query {
holdingStores {
nodes {
id
name
description
storeImageUrl
}
totalCount
pageInfo {
hasNextPage
hasPreviousPage
startCursor
endCursor
}
}
}

Query Fields
nodes
An array of store objects, each containing:
id: Unique identifier for the store
name: Display name of the store
description: Detailed description of the store
storeImageUrl: URL to the store's image/logo

totalCount
The total number of holding stores available across all pages.
pageInfo
Pagination metadata for navigating through results:
hasNextPage: Boolean indicating if more results are available after the current page
hasPreviousPage: Boolean indicating if results exist before the current page
startCursor: Cursor pointing to the first item in the current result set
endCursor: Cursor pointing to the last item in the current result set

Response Structure
The endpoint returns a 200 OK response with Content-Type: application/graphql-response+json.
Sample Response Format

JSON

{
"data": {
"holdingStores": {
"nodes": [
{
"id": "store-id",
"name": "Store Name",
"description": "Store description",
"storeImageUrl": "https://example.com/image.jpg"
}
],
"totalCount": 12,
"pageInfo": {
"hasNextPage": true,
"hasPreviousPage": false,
"startCursor": "cursor-start",
"endCursor": "cursor-end"
}
}
}
}

Pagination
The API returns paginated results. Use the pageInfo object to navigate through pages:
Check hasNextPage to determine if more results are available
Use endCursor with pagination arguments (first/after or last/before) to fetch subsequent pages
The totalCount field shows the total number of stores across all pages

To fetch the next page, modify your query to include pagination arguments:

GraphQL

query {
holdingStores(first: 10, after: "endCursor") { # ... same fields
}
}

Usage Notes
The X-App-Id header is required for all requests
Geographical headers (latitude/longitude) are optional and can be used to filter or sort stores by proximity
The default page size appears to be 10 stores per request
Store images are provided via the storeImageUrl field
This is a public endpoint as indicated by the [PUBLIC] prefix
Response format follows the GraphQL specification with application/graphql-response+json content type

Example Use Cases
List all holding stores: Use the basic query to retrieve the first page of stores
Find nearby stores: Include X-Geo-Latitude and X-Geo-Longitude headers to get location-based results
Browse all stores: Use pagination with cursors to iterate through all available stores
Get store count: Check the totalCount field to know how many stores are available

See the saved example for a complete response with actual data.

---

Request Details: [PUBLIC] GetHoldingCollections
Postman UID: 23626907-fc56fe7a-bfd9-4904-8b20-103b4b1b8d1b
Method: POST
URL: {{SHOP_API_HOST}}/graphql
Collection: App API
Folder Path: n1coupons → Queries → Holding

1. Complete Request Body (GraphQL Query)

GraphQL

query {
holdingCollections {
nodes {
id
name
description
bannerImageUrl
smallBannerImageUrl
productCount
}
totalCount
pageInfo {
hasNextPage
hasPreviousPage
startCursor
endCursor
}
}
}

Variables: Empty string (no variables used in this query)

2. Request Headers
   HeaderValueEnabledDescriptionX-App-Id

{{X-APP-ID}}

✅ Yes

Application identifier for authentication

X-Territory

{{X-TERRITORY}}

❌ No

Geographic territory/region

X-Geo-Longitude

{{X-GEO-LONGITUDE}}

❌ No

User's longitude coordinate

X-Geo-Latitude

{{X-GEO-LATITUDE}}

❌ No

User's latitude coordinate

Note: Currently only X-App-Id is enabled. The geographic headers are disabled in the current configuration.

3. GraphQL Query Fields & Structure
   Query Parameters (Fields Requested):
   Root Query: holdingCollections
   Returns an object with:
   nodes (Array): List of collection objects
   totalCount (Integer): Total number of collections available
   pageInfo (Object): Pagination information

Node Fields (Collection Object):
id (Integer): Unique identifier for the collection
name (String): Collection name
description (String): Collection description
bannerImageUrl (String | null): URL for the banner image (can be null)
smallBannerImageUrl (String | null): URL for the small banner image (can be null)
productCount (Integer): Number of products in this collection

PageInfo Fields (Pagination Object):
hasNextPage (Boolean): Indicates if there are more pages available
hasPreviousPage (Boolean): Indicates if there are previous pages
startCursor (String): Cursor for the first item (Base64 encoded)
endCursor (String): Cursor for the last item (Base64 encoded)

4. Saved Example: "200 OK"
   Example ID: 23626907-8c04abe0-ca51-4774-9b28-360371dbdf3d
   Status Code: 200 OK
   Content-Type: application/graphql-response+json; charset=utf-8
   Server: Kestrel
   Date: Mon, 10 Nov 2025 15:15:52 GMT
   Example Request Configuration:
   Same GraphQL query as above
   Headers: Only X-App-Id enabled (others commented out)
   URL: {{APP_API_HOST}}/graphql (Note: Example uses APP_API_HOST instead of SHOP_API_HOST)

Complete Example Response:

JSON

{
"data": {
"holdingCollections": {
"nodes": [
{
"id": 974,
"name": "Acompañamientos y Aperitivos",
"description": "Acompañamientos y Aperitivos",
"bannerImageUrl": null,
"smallBannerImageUrl": null,
"productCount": 4
},
{
"id": 990,
"name": "Alitas",
"description": "Alitas",
"bannerImageUrl": null,
"smallBannerImageUrl": null,
"productCount": 3
},
{
"id": 975,
"name": "Aperitivos y dulces",
"description": "Aperitivos y dulces",
"bannerImageUrl": null,
"smallBannerImageUrl": null,
"productCount": 1
},
{
"id": 978,
"name": "Bebidas",
"description": "Bebidas",
"bannerImageUrl": null,
"smallBannerImageUrl": null,
"productCount": 3
},
{
"id": 988,
"name": "Bebidas",
"description": "Bebidas",
"bannerImageUrl": null,
"smallBannerImageUrl": null,
"productCount": 1
},
{
"id": 1001,
"name": "Bowls",
"description": "Bowls",
"bannerImageUrl": null,
"smallBannerImageUrl": null,
"productCount": 3
},
{
"id": 994,
"name": "Burritos",
"description": "Burritos",
"bannerImageUrl": null,
"smallBannerImageUrl": null,
"productCount": 1
},
{
"id": 992,
"name": "Caldos",
"description": "Caldos",
"bannerImageUrl": null,
"smallBannerImageUrl": null,
"productCount": 1
},
{
"id": 1250,
"name": "Desayuno",
"description": "Desayuno",
"bannerImageUrl": null,
"smallBannerImageUrl": null,
"productCount": 1
},
{
"id": 984,
"name": "Ensaladas",
"description": "Ensaladas",
"bannerImageUrl": null,
"smallBannerImageUrl": null,
"productCount": 2
}
],
"totalCount": 31,
"pageInfo": {
"hasNextPage": true,
"hasPreviousPage": false,
"startCursor": "MA==",
"endCursor": "OQ=="
}
}
}
}

5. Response Structure & Data Types

TypeScript

{
data: {
holdingCollections: {
nodes: Array<{
id: number, // Integer ID
name: string, // Collection name
description: string, // Collection description
bannerImageUrl: string | null, // Full URL to banner image (nullable)
smallBannerImageUrl: string | null, // Full URL to small banner (nullable)
productCount: number // Integer count of products
}>,
totalCount: number, // Total collections available (31 in example)
pageInfo: {
hasNextPage: boolean, // true - more pages available
hasPreviousPage: boolean, // false - no previous pages
startCursor: string, // Base64 encoded cursor ("MA==")
endCursor: string // Base64 encoded cursor ("OQ==")
}
}
}
}

6. Environment Variables Used
   {{SHOP_API_HOST}} - Shop API base URL (current request)
   {{APP_API_HOST}} - App API base URL (used in saved example)
   {{X-APP-ID}} - Application identifier
   {{X-TERRITORY}} - Territory/region code (disabled)
   {{X-GEO-LONGITUDE}} - Longitude coordinate (disabled)
   {{X-GEO-LATITUDE}} - Latitude coordinate (disabled)

7. Key Observations
   Pagination Details:
   The example shows 10 collections out of 31 total
   hasNextPage: true indicates more data is available
   Cursor-based pagination is implemented using Base64 encoded cursors
   Start cursor: "MA==" (decodes to "0")
   End cursor: "OQ==" (decodes to "9")

Data Characteristics:
All collections in the example have null values for both banner image URLs
Product counts vary from 1 to 4 products per collection
Collection names are in Spanish (food categories like "Alitas", "Burritos", "Ensaladas", etc.)
Some collection names are duplicated (e.g., "Bebidas" appears twice with IDs 978 and 988)

Request Configuration Note:
The main request uses {{SHOP_API_HOST}}
The saved example uses {{APP_API_HOST}}
This suggests the endpoint may be available on multiple API hosts

Summary
This is a public GraphQL query that retrieves product collections from the N1CO marketplace holding. The query returns paginated results showing 10 collections per page out of 31 total. Collections represent groupings of products (like "Alitas", "Burritos", "Bowls", etc.) with metadata including product counts and optional banner images. The response uses cursor-based pagination for efficient data retrieval.

---

Request Details: [PUBLIC] GetHoldingProducts
Postman UID: 23626907-687458bb-7d88-47ea-b85e-1ebf8c57673c
Method: POST
URL: /graphql

1. Complete Request Body (GraphQL Query)

GraphQL

query {
holdingProducts {
nodes {
id
name
description
salePrice
productImageUrl
quantityAvailable
images {
sequence
url
}
}
totalCount
pageInfo {
hasNextPage
hasPreviousPage
startCursor
endCursor
}
}
}

Variables: Empty string (no variables used in this query)

2. Request Headers
   HeaderValueEnabledDescriptionX-App-Id

pizza-plaza

✅ Yes

Application identifier for authentication

X-Territory

5f8dc2db119e872cff1bdb31

❌ No

Geographic territory/region

X-Geo-Longitude

10.4847103

❌ No

User's longitude coordinate

X-Geo-Latitude

-66.8645147

❌ No

User's latitude coordinate

Note: Currently only X-App-Id is enabled. The geographic headers are disabled in the current configuration.

3. GraphQL Query Fields & Structure
   Query Parameters (Fields Requested):
   Root Query: holdingProducts
   Returns an object with:
   nodes (Array): List of product objects
   totalCount (Integer): Total number of products
   pageInfo (Object): Pagination information

Node Fields (Product Object):
id (Integer): Unique identifier for the product
name (String): Product name
description (String): Product description
salePrice (Float/Decimal): Current sale price of the product
productImageUrl (String): URL for the main product image
quantityAvailable (Integer): Available stock quantity
images (Array): Collection of product images with:
sequence (Integer): Display order of the image
url (String): Full URL to the image

PageInfo Fields (Pagination Object):
hasNextPage (Boolean): Indicates if there are more pages
hasPreviousPage (Boolean): Indicates if there are previous pages
startCursor (String): Cursor for the first item (Base64 encoded)
endCursor (String): Cursor for the last item (Base64 encoded)

4. Saved Example: "200 OK"
   Example ID: 23626907-c09cc079-025b-4c61-b235-da7b4e7a0085
   Status Code: 200 OK
   Content-Type: application/graphql-response+json; charset=utf-8
   Example Request Configuration:
   Same GraphQL query as above
   Headers: Only X-App-Id enabled (others commented out)
   URL: https://api-app.h4b.dev/graphql (Note: Example uses APP_API_HOST instead of SHOP_API_HOST)

Complete Example Response (First 10 Products):

JSON

{
"data": {
"holdingProducts": {
"nodes": [
{
"id": 19087,
"name": "Black and White Cookie",
"description": "Galleta con chocolate",
"salePrice": 3.5,
"productImageUrl": "https://cdn.h4b.dev/images/store85/products/product19087/Image1.jpg?20220401011344",
"quantityAvailable": 88,
"images": [
{
"sequence": 1,
"url": "https://cdn.h4b.dev/images/store85/products/product19087/Image1.jpg?20220401011344"
}
]
},
{
"id": 19088,
"name": "Creamy Cheesecake",
"description": "Cheesecake cremoso",
"salePrice": 5,
"productImageUrl": "https://cdn.h4b.dev/images/store85/products/product19088/Image1.jpg?20220401011419",
"quantityAvailable": 93,
"images": [
{
"sequence": 1,
"url": "https://cdn.h4b.dev/images/store85/products/product19088/Image1.jpg?20220401011419"
}
]
},
{
"id": 19089,
"name": "Mama's Classic Sandwich",
"description": "Queso americano en pan jalá.",
"salePrice": 10.5,
"productImageUrl": "https://cdn.h4b.dev/images/store85/products/product19089/Image1.jpg?20220401011523",
"quantityAvailable": 91,
"images": [
{
"sequence": 1,
"url": "https://cdn.h4b.dev/images/store85/products/product19089/Image1.jpg?20220401011523"
}
]
},
{
"id": 19090,
"name": "Avocado Melt Sandwich",
"description": "Aguacate, champiñones salteados, tomate grillado, queso suizo y brotes de alfalfa en pan integral.",
"salePrice": 14,
"productImageUrl": "https://cdn.h4b.dev/images/store85/products/product19090/Image1.jpg?20220401011608",
"quantityAvailable": 95,
"images": [
{
"sequence": 1,
"url": "https://cdn.h4b.dev/images/store85/products/product19090/Image1.jpg?20220401011608"
}
]
},
{
"id": 19091,
"name": "Heaven on Earth Sandwich",
"description": "Champiñones salteados, cebollas asadas, queso Jack y queso Cheddar en pan de masa fermentada.",
"salePrice": 11,
"productImageUrl": "https://cdn.h4b.dev/images/store85/products/product19091/Image1.jpg?20220401011654",
"quantityAvailable": 89,
"images": [
{
"sequence": 1,
"url": "https://cdn.h4b.dev/images/store85/products/product19091/Image1.jpg?20220401011654"
}
]
},
{
"id": 19092,
"name": "Black and Blue Burger",
"description": "Tocino Applewood, queso azul desmoronado, aguacate, tomate y cebolla roja con aderezo de queso azul en un pan de jalá.",
"salePrice": 15,
"productImageUrl": "https://cdn.h4b.dev/images/store85/products/product19092/Image1.jpg?20220401011804",
"quantityAvailable": 45,
"images": [
{
"sequence": 1,
"url": "https://cdn.h4b.dev/images/store85/products/product19092/Image1.jpg?20220401011804"
}
]
},
{
"id": 19093,
"name": "Cali Burger",
"description": "Champiñones a la parrilla, cebollas a la parrilla, aguacate, tomate y queso suizo en un pan de jalá.",
"salePrice": 15,
"productImageUrl": "https://cdn.h4b.dev/images/store85/products/product19093/Image1.jpg?20220401011848",
"quantityAvailable": 78,
"images": [
{
"sequence": 1,
"url": "https://cdn.h4b.dev/images/store85/products/product19093/Image1.jpg?20220401011848"
}
]
},
{
"id": 19094,
"name": "Veggie Burger",
"description": "Hamburguesa de la huerta, queso Jack, tomate, brotes de alfalfa y aderezo ruso en un pan integral.",
"salePrice": 13,
"productImageUrl": "https://cdn.h4b.dev/images/store85/products/product19094/Image1.jpg?20220401011936",
"quantityAvailable": 91,
"images": [
{
"sequence": 1,
"url": "https://cdn.h4b.dev/images/store85/products/product19094/Image1.jpg?20220401011936"
}
]
},
{
"id": 19095,
"name": "Patty Melt Burger",
"description": "Cebollas asadas y queso americano sobre pan de centeno.",
"salePrice": 13,
"productImageUrl": "https://cdn.h4b.dev/images/store85/products/product19095/Image1.jpg?20220401012034",
"quantityAvailable": 95,
"images": [
{
"sequence": 1,
"url": "https://cdn.h4b.dev/images/store85/products/product19095/Image1.jpg?20220401012034"
}
]
},
{
"id": 19096,
"name": "Strawberry Nutella Croissant",
"description": "Delicioso Croissant",
"salePrice": 4.95,
"productImageUrl": "https://cdn.h4b.dev/images/store88/products/product19096/Image1?20220401012829",
"quantityAvailable": 100,
"images": [
{
"sequence": 1,
"url": "https://cdn.h4b.dev/images/store88/products/product19096/Image1?20220401012829"
}
]
}
],
"totalCount": 70,
"pageInfo": {
"hasNextPage": true,
"hasPreviousPage": false,
"startCursor": "MA==",
"endCursor": "OQ=="
}
}
}
}

5. Response Structure & Data Types

TypeScript

{
data: {
holdingProducts: {
nodes: Array<{
id: number, // Integer ID
name: string, // Product name
description: string, // Product description
salePrice: number, // Decimal/Float price
productImageUrl: string, // Full URL to main image
quantityAvailable: number, // Integer stock count
images: Array<{
sequence: number, // Integer display order
url: string // Full URL to image
}>
}>,
totalCount: number, // Total products available
pageInfo: {
hasNextPage: boolean, // Pagination flag
hasPreviousPage: boolean, // Pagination flag
startCursor: string, // Base64 encoded cursor
endCursor: string // Base64 encoded cursor
}
}
}
}

6. Environment Variables Used
   `` - Shop API base URL
   pizza-plaza - Application identifier
   5f8dc2db119e872cff1bdb31 - Territory/region code
   10.4847103 - Longitude coordinate
   -66.8645147 - Latitude coordinate

7. Sample Product Categories from Response
   The example response shows 70 total products with the first 10 displayed, including:
   Desserts: Black and White Cookie, Creamy Cheesecake, Strawberry Nutella Croissant
   Sandwiches: Mama's Classic Sandwich, Avocado Melt Sandwich, Heaven on Earth Sandwich
   Burgers: Black and Blue Burger, Cali Burger, Veggie Burger, Patty Melt Burger

Price Range: $3.50 - $15.00
Stock Availability: 45 - 100 units per product

Summary
This is a public GraphQL query that retrieves product listings from the N1CO marketplace holding. The query returns detailed product information including pricing, descriptions, availability, and multiple image URLs. The response supports cursor-based pagination, with the example showing the first 10 of 70 total products available. Each product includes an images array that can contain multiple images with sequence ordering for display purposes.

---

Complete Request Details for [PUBLIC/PRIVATE] GetCheckoutSession
Request Configuration
Method: POST
URL: /graphql
Protocol: GraphQL
Request ID: 23626907-bc590016-8952-415b-98c8-fe52fea8ce88

Headers
X-App-Id: pizza-plaza (enabled)
X-Territory: 5f8dc2db119e872cff1bdb31 (disabled)
X-Geo-Longitude: 10.4847103 (disabled)
X-Geo-Latitude: -66.8645147 (disabled)

GraphQL Query Structure
Complete Query Body

GraphQL

query {
checkoutSession(
input: {
storeId: 57
cart: { productId: 18804, quantity: 1 }
}
) {
customerSessionId
cartDetail{
storeId
locationId
cart{
productId
name
productImageUrl
price
promoPrice
salePrice
quantity
requiresShipping
productMetadata{
key
value
}
}
savedTotal
total
}
store{
id
name
locations{
id
name
isDefault
}
}
paymentOptions{
id
name
paymentOptionType
}
shipmentOptions{
id
name
baseCost
shipmentOptionType
}
buyer{
id
name
email
phone
addresses{
id
name
address
addressLine2
location{
latitude
longitude
}
reference
phone
note
}
paymentMethods {
id
name
number
cardCustomName
cardCustomColor
type
isTokenized
}
}
sessionDetail{
subTotal
totalSurcharge
totalDiscount
deliveryCost
total
}
}
}

Input Parameters
storeId: Integer (example: 57)
cart: Object containing:
productId: Integer (example: 18804)
quantity: Integer (example: 1)

Variables
Currently set to empty string "" (no GraphQL variables used; parameters are hardcoded in the query)

Response Structure & Fields
Root Level
customerSessionId: Integer - Unique identifier for the customer session

cartDetail Object
storeId: Integer
locationId: Integer
cart: Array of cart items
productId: Integer
name: String
productImageUrl: String (URL)
price: Number
promoPrice: Number (nullable)
salePrice: Number
quantity: Integer
requiresShipping: Boolean
productMetadata: Array (nullable)
key: String
value: String

savedTotal: Number
total: Number

store Object
id: Integer
name: String
locations: Array of location objects
id: Integer
name: String
isDefault: Boolean

paymentOptions Array
id: Integer
name: String
paymentOptionType: String (enum: "CREDIT_CARD", etc.)

shipmentOptions Array
id: Integer
name: String
baseCost: Number
shipmentOptionType: String (enum: "PICKUP", "CUSTOM", "BOXFUL", etc.)

buyer Object (nullable - only present in private/authenticated scenarios)
id: String
name: String
email: String
phone: String
addresses: Array of address objects
id: Integer
name: String
address: String
addressLine2: String (nullable)
location: Object
latitude: Float
longitude: Float

reference: String (nullable)
phone: String (nullable)
note: String (nullable)

paymentMethods: Array of payment method objects
id: Integer
name: String
number: String (last 4 digits)
cardCustomName: String (nullable)
cardCustomColor: String (nullable)
type: String
isTokenized: Boolean

sessionDetail Object
subTotal: Number
totalSurcharge: Number
totalDiscount: Number
deliveryCost: Number
total: Number

Saved Examples
Example 1: "200 OK - Private (With buyer data)"
ID: 23626907-14966a38-c396-4415-ab0f-9a8c6adbf079
Status Code: 200 OK
Request Details: Same as main request (storeId: 57, productId: 18804, quantity: 1)
Response Headers:
Content-Type: application/json; charset=utf-8
x-request-id: 81297dec-e2ba-4ee8-8064-28552578e6f9
Server: cloudflare

Complete Response Body:

JSON

{
"data": {
"checkoutSession": {
"customerSessionId": 19217,
"cartDetail": {
"storeId": 57,
"locationId": 168,
"cart": [
{
"productId": 18804,
"name": "Paquete Fiesta",
"productImageUrl": "https://cdn.h4b.dev/images/store57/products/product18804/Image1.jpg?20211216073846",
"price": 1,
"promoPrice": null,
"salePrice": 1,
"quantity": 1,
"requiresShipping": true,
"productMetadata": null
}
],
"savedTotal": 0,
"total": 1
},
"store": {
"id": 57,
"name": "Little Caesars",
"locations": [
{
"id": 87,
"name": "Mall Caracas #1",
"isDefault": false
},
{
"id": 88,
"name": "Mall Caracas #2",
"isDefault": false
},
{
"id": 168,
"name": "Sucursal Principal",
"isDefault": true
},
{
"id": 374,
"name": "Synced Location",
"isDefault": false
},
{
"id": 444,
"name": "Synced Location",
"isDefault": false
},
{
"id": 463,
"name": "San Salvador",
"isDefault": false
}
]
},
"paymentOptions": [
{
"id": 95,
"name": "N1co Business",
"paymentOptionType": "CREDIT_CARD"
}
],
"shipmentOptions": [
{
"id": 214,
"name": "Pickup",
"baseCost": 0,
"shipmentOptionType": "PICKUP"
},
{
"id": 670,
"name": "pizzaDelivery",
"baseCost": 5,
"shipmentOptionType": "CUSTOM"
},
{
"id": 1252,
"name": "Boxful",
"baseCost": 0,
"shipmentOptionType": "BOXFUL"
},
{
"id": 1435,
"name": "sonic percentage",
"baseCost": 1,
"shipmentOptionType": "CUSTOM"
},
{
"id": 1436,
"name": "sonic operation zone",
"baseCost": 5,
"shipmentOptionType": "CUSTOM"
}
],
"buyer": {
"id": "6x1ekkKH1a",
"name": "Robert c:",
"email": "robertrafyt2007@gmail.com",
"phone": "+50495363424",
"addresses": [
{
"id": 1159,
"name": "Dirección n1co Shop",
"address": "some address",
"addressLine2": "some direction",
"location": {
"latitude": 13.689767638160774,
"longitude": -89.20638632029295
},
"reference": "some point",
"phone": "1234567890",
"note": null
}
// ... (19 more addresses in total)
],
"paymentMethods": [
{
"id": 1371,
"name": "ROBRTO RAMIREZ",
"number": "4242",
// ... (payment method details)
}
]
},
"sessionDetail": {
"subTotal": 1,
"totalSurcharge": 0,
"totalDiscount": 0,
"deliveryCost": 0,
"total": 1
}
}
}
}

Key Characteristics:
✅ buyer object is populated with full user data
Contains 20 saved addresses for the buyer
Contains payment methods array
Authenticated/private session scenario

Example 2: "200 OK - Public (No buyer data)"
ID: 23626907-42d2b4e4-cb5b-4862-923e-6642a68c4a5f
Status Code: 200 OK
Request Details: Same as main request (storeId: 57, productId: 18804, quantity: 1)
Response Headers: Similar to Example 1
Complete Response Body:

JSON

{
"data": {
"checkoutSession": {
"customerSessionId": 19218,
"cartDetail": {
"storeId": 57,
"locationId": 168,
"cart": [
{
"productId": 18804,
"name": "Paquete Fiesta",
"productImageUrl": "https://cdn.h4b.dev/images/store57/products/product18804/Image1.jpg?20211216073846",
"price": 1,
"promoPrice": null,
"salePrice": 1,
"quantity": 1,
"requiresShipping": true,
"productMetadata": null
}
],
"savedTotal": 0,
"total": 1
},
"store": {
"id": 57,
"name": "Little Caesars",
"locations": [
{
"id": 87,
"name": "Mall Caracas #1",
"isDefault": false
},
{
"id": 88,
"name": "Mall Caracas #2",
"isDefault": false
},
{
"id": 168,
"name": "Sucursal Principal",
"isDefault": true
},
{
"id": 374,
"name": "Synced Location",
"isDefault": false
},
{
"id": 444,
"name": "Synced Location",
"isDefault": false
},
{
"id": 463,
"name": "San Salvador",
"isDefault": false
}
]
},
"paymentOptions": [
{
"id": 95,
"name": "N1co Business",
"paymentOptionType": "CREDIT_CARD"
}
],
"shipmentOptions": [
{
"id": 214,
"name": "Pickup",
"baseCost": 0,
"shipmentOptionType": "PICKUP"
},
{
"id": 670,
"name": "pizzaDelivery",
"baseCost": 5,
"shipmentOptionType": "CUSTOM"
},
{
"id": 1252,
"name": "Boxful",
"baseCost": 0,
"shipmentOptionType": "BOXFUL"
},
{
"id": 1435,
"name": "sonic percentage",
"baseCost": 1,
"shipmentOptionType": "CUSTOM"
},
{
"id": 1436,
"name": "sonic operation zone",
"baseCost": 5,
"shipmentOptionType": "CUSTOM"
}
],
"buyer": null,
"sessionDetail": {
"subTotal": 1,
"totalSurcharge": 0,
"totalDiscount": 0,
"deliveryCost": 0,
"total": 1
}
}
}
}

Key Characteristics:
❌ buyer object is null (no user data)
Public/unauthenticated session scenario
All other data (cart, store, payment/shipment options, session details) remain the same

Key Differences Between Examples
AspectPrivate (Example 1)Public (Example 2)customerSessionId

19217

19218

buyer object

✅ Fully populated with user data

❌ null

buyer.addresses

20 saved addresses

N/A

buyer.paymentMethods

Array of saved payment methods

N/A

buyer.id

"6x1ekkKH1a"

N/A

buyer.name

"Robert c:"

N/A

buyer.email

"robertrafyt2007@gmail.com"

N/A

buyer.phone

"+50495363424"

N/A

All other fields

Identical

Identical

Summary
This GraphQL query retrieves a checkout session with comprehensive details about:
Cart information - products, pricing, quantities
Store details - locations and availability
Payment options - available payment methods for the store
Shipment options - delivery/pickup options with costs
Buyer information (conditional) - only returned for authenticated users
Session totals - pricing breakdown

The main distinction between the two examples is the authentication state: the private example includes full buyer profile data (addresses, payment methods, contact info), while the public example returns null for the buyer object, representing an unauthenticated/guest checkout scenario.

---

Complete Request Details: [PRIVATE] GetAll (Paginated)
Request Overview
Postman UID: 23626907-d2136577-e7bf-46d0-8ec5-6884c8d70831
Name: [PRIVATE] GetAll (Paginated)
Method: POST
URL: /graphql
Type: GraphQL Query
Collection: App API (23626907-9697b40a-1ccd-4889-84a3-d0648b19bab0)
Folder: Orders (23626907-f0553021-708a-488e-b225-b41013329b89)

1. Request Headers
   KeyValueEnabledDescriptionX-App-Id

pizza-plaza

✅ Yes

Application identifier

X-Territory

5f8dc2db119e872cff1bdb31

❌ No

Territory/region identifier

X-Geo-Longitude

10.4847103

❌ No

Geographic longitude

X-Geo-Latitude

-66.8645147

❌ No

Geographic latitude

2. Complete GraphQL Query Structure

GraphQL

query {
orders(
first: 10
last: null
before: null
after: null
) # where: { orderStatus: { eq: PAID } } Only Active Orders Filter
{
nodes {
orderId
name
orderDate
orderType
orderStatus
storeId
storeName
storeImageUrl
storeBannerUrl
storeBannerColor
timezone
locale
currencyCode
currencySymbol
totalFormatted
subTotal
totalDiscount
totalSurcharge
total
paymentDate
paymentOption
shipmentOption
shipmentType
shipmentStatus
requiresShipping
orderDetails {
itemId
name
description
price
promoPrice
productImageUrl
requiresShipping
productMetadata {
key
value
}
quantity
subTotal
}
couponStatus
}
totalCount
pageInfo {
hasNextPage
hasPreviousPage
startCursor
endCursor
}
}
}

Variables: (empty string - no variables currently used)

3. Query Parameters & Input Types
   Pagination Parameters (on orders query):
   first: Int - Number of records to fetch from the beginning (currently set to 10)
   last: Int - Number of records to fetch from the end (currently null)
   before: String - Cursor for backward pagination (currently null)
   after: String - Cursor for forward pagination (currently null)

Optional Filter (commented out):
where: Filter object with orderStatus field
Example: { orderStatus: { eq: PAID } } - Filter for only PAID orders

4. Complete Response Structure & Data Types
   Root Level:

Plain Text

data {
orders {
nodes: [Order]
totalCount: Int
pageInfo: PageInfo
}
}

Order Object Fields:
FieldTypeDescriptionorderId

Int

Unique order identifier

name

String

Order name/customer name

orderDate

DateTime (ISO 8601)

When the order was placed

orderType

String

Type of order (e.g., "MENU_APP")

orderStatus

String

Status (PAID, CANCELLED, FINALIZED, etc.)

storeId

Int

Store identifier

storeName

String

Name of the store

storeImageUrl

String (URL)

Store logo/image URL

storeBannerUrl

String (URL)

Store banner image URL

storeBannerColor

String (Hex color)

Banner background color

timezone

String

Store timezone (e.g., "America/El_Salvador")

locale

String

Locale code (e.g., "es-SV")

currencyCode

String

Currency code (e.g., "USD")

currencySymbol

String

Currency symbol (e.g., "$")

totalFormatted

String

Formatted total with currency

subTotal

Float/Decimal

Subtotal amount

totalDiscount

Float/Decimal

Total discount applied

totalSurcharge

Float/Decimal

Additional surcharges

total

Float/Decimal

Final total amount

paymentDate

DateTime (ISO 8601)

When payment was made

paymentOption

String

Payment method (e.g., "N1co Business")

shipmentOption

String

Shipment option name

shipmentType

String

Type (PICKUP, CUSTOM, etc.)

shipmentStatus

String

Status (PENDING, READY, DELIVERED)

requiresShipping

Boolean

Whether shipping is required

orderDetails

[OrderDetail]

Array of order items

couponStatus

String (nullable)

Coupon status if applicable

OrderDetail Object Fields:
FieldTypeDescriptionitemId

Int

Product/item identifier

name

String

Product name

description

String

Product description

price

Float/Decimal

Base price

promoPrice

Float/Decimal (nullable)

Promotional price if applicable

productImageUrl

String (URL)

Product image URL

requiresShipping

Boolean

Whether item requires shipping

productMetadata

[Metadata] (nullable)

Additional product metadata

quantity

Int

Quantity ordered

subTotal

Float/Decimal

Line item subtotal

ProductMetadata Object Fields:
key: String
value: String

PageInfo Object Fields:
FieldTypeDescriptionhasNextPage

Boolean

Whether more records exist after current page

hasPreviousPage

Boolean

Whether records exist before current page

startCursor

String

Cursor for the first item in current page

endCursor

String

Cursor for the last item in current page

5. Saved Example: "200 OK"
   Example ID: 23626907-a59cec50-a8a3-4aa8-a151-1c48daa29998
   Example Request Details:
   Method: POST
   URL: /graphql
   Headers: Same as parent request
   Body: Same GraphQL query as above

Example Response:
Status Code: 200 OK
Response Headers:
Content-Type: application/json; charset=utf-8
Date: Tue, 18 Nov 2025 23:31:34 GMT
x-request-id: 6e555acb-1eb7-43a7-b59f-9d018494de02
Content-Encoding: br
Server: cloudflare

Example Response Data (showing 10 orders with pagination):
The response contains 10 order records demonstrating various order statuses and scenarios:
Order 18456 - CANCELLED order from Little Caesars
Total: $9.00
Item: Super Cheese Ultimate Deluxe
Shipment: PICKUP, Status: PENDING

Order 16480 - PAID order
Total: $7.00
Item: Crazy Crunch Tocino Pack
Shipment: CUSTOM (pizzaDelivery), Status: READY

Order 16479 - PAID order
Total: $7.00
Item: Crazy Crunch Tocino Pack
Shipment: CUSTOM (pizzaDelivery), Status: PENDING

Order 10091 - PAID order
Total: $2.00
Item: Calzone
Shipment: PICKUP, Status: PENDING

Order 10061 - FINALIZED order
Total: $2.00
Item: Calzone
Shipment: PICKUP, Status: DELIVERED

Order 10060 - PAID order
Total: $2.00
Item: Calzone
Shipment: PICKUP, Status: PENDING

Order 10059 - PAID order
Total: $2.00
Item: Calzone
Shipment: PICKUP, Status: PENDING

Order 10058 - PAID order
Total: $2.00
Item: Calzone
Shipment: PICKUP, Status: PENDING

(Response was truncated but shows the pattern continues)

6. Key Use Cases Demonstrated
   Based on the saved example, this endpoint demonstrates:
   Pagination: Fetching first 10 orders with cursor-based pagination
   Multiple Order Statuses: PAID, CANCELLED, FINALIZED
   Multiple Shipment Types: PICKUP, CUSTOM (delivery)
   Multiple Shipment Statuses: PENDING, READY, DELIVERED
   Order Details: Complete line items with product information
   Pricing Information: Subtotals, discounts, surcharges, and formatted totals
   Store Information: Complete store branding and localization data
   Payment Information: Payment dates and methods
   Metadata Support: Product metadata key-value pairs (nullable)
   Coupon Support: Coupon status field (nullable)

7. Variables Used in Request
   The request references these environment/collection variables:
   `` - Base URL for the Shop API
   pizza-plaza - Application ID for authentication
   5f8dc2db119e872cff1bdb31 - Territory identifier (currently disabled)
   10.4847103 - Geographic longitude (currently disabled)
   -66.8645147 - Geographic latitude (currently disabled)

Summary
This is a comprehensive paginated orders query that retrieves order history with full details including:
Order metadata and status tracking
Store information and branding
Complete line item details with product information
Payment and shipment tracking
Localization support (timezone, locale, currency)
Cursor-based pagination with page info
Optional filtering capabilities (commented out in current implementation)

The query is designed to support building order history views in applications with proper pagination controls and detailed order information display.

---

Complete Request Details: [PRIVATE] Get
Basic Information
Request Name: [PRIVATE] Get
Method: POST
URL: {{SHOP_API_HOST}}/graphql
Collection: App API
Folder Path: App API → n1coupons → Queries → Orders
Request Type: GraphQL

1. Headers
   KeyValueEnabledX-App-Id

{{X-APP-ID}}

✅ Yes

X-Territory

{{X-TERRITORY}}

❌ No

X-Geo-Longitude

{{X-GEO-LONGITUDE}}

❌ No

X-Geo-Latitude

{{X-GEO-LATITUDE}}

❌ No

2. Complete GraphQL Query Structure

GraphQL

query order($orderId: Int!) {
orderView(input: {id: $orderId}) {
id
status
subTotal
discountEffects {
id
name
amount
}
surchargeEffects {
id
name
amount
}
deliveryCost
driverTip
totalDiscount
totalSurcharge
total
created
checkoutNote
store {
id
name
imageUrl
currencySymbol
currencyCode
locale
timezone
}
shipment {
shipmentOptionType
originAddress {
name
address
coordinates {
latitude
longitude
}
phone
}
destinationAddress {
name
address
coordinates {
latitude
longitude
}
phone
}
history {
shipmentStatus
entry
created
entryStatus
}
estimatedTimeOfArrival
trackingLinkUrl
driver {
id
name
phone
licensePlate
avatar
}
}
orderDetails {
itemId
modifiers {
modifierId
name
selectedOptionsTotal
selectedOptions {
selectedOptionId
name
amount
}
}
note
name
price
promoId
promoPrice
quantity
subTotal
modifiersTotal
sKU
productImageUrl
requiresShipping
productMetadata{
key
value
}
}
payment {
status
paymentOptionType
paymentMethod {
cardholderName
lastDigits
firstDigits
type
cardName
}
creditsChargeAmount
}
}
coupon: getCouponByOrderId(orderId: $orderId) {
code
qrCodeUrl
endDate
}
}

3. GraphQL Variables

JSON

{
"orderId": 18456
}

Input Parameter:
orderId (Int!, required): The unique identifier of the order to retrieve

4. Complete Response Structure & Data Types
   Main Query: orderView
   FieldTypeDescriptionid

Int

Order unique identifier

status

String

Order status (e.g., "CANCELLED", "PENDING", "DELIVERED")

subTotal

Float/Int

Subtotal amount before discounts/surcharges

deliveryCost

Float/Int

Delivery fee

driverTip

Float/Int

Tip amount for driver

totalDiscount

Float/Int

Total discount applied

totalSurcharge

Float/Int

Total surcharge applied

total

Float/Int

Final total amount

created

String (ISO DateTime)

Order creation timestamp

checkoutNote

String

Customer notes at checkout

Nested Objects:
discountEffects[] - Array of discount items
id (Int): Discount effect ID
name (String): Discount name
amount (Float/Int): Discount amount

surchargeEffects[] - Array of surcharge items
id (Int): Surcharge effect ID
name (String): Surcharge name
amount (Float/Int): Surcharge amount

store - Store information
id (Int): Store ID
name (String): Store name
imageUrl (String): Store image URL
currencySymbol (String): Currency symbol (e.g., "$")
currencyCode (String): Currency code (e.g., "USD")
locale (String): Locale (e.g., "es-SV")
timezone (String): Timezone (e.g., "America/El_Salvador")

shipment - Shipment details
shipmentOptionType (String): Type (e.g., "PICKUP", "DELIVERY")
estimatedTimeOfArrival (Int): ETA in minutes
trackingLinkUrl (String): Tracking URL

shipment.originAddress - Origin address
name (String): Location name
address (String): Full address
coordinates.latitude (Float): Latitude
coordinates.longitude (Float): Longitude
phone (String): Contact phone

shipment.destinationAddress - Destination address (same structure as originAddress)
shipment.history[] - Shipment status history
shipmentStatus (String): Status (e.g., "PENDING", "ACCEPTED", "READY", "DELIVERED")
entry (String): Status description
created (String/ISO DateTime): Timestamp
entryStatus (String): Entry status (e.g., "IN_PROGRESS", "PENDING")

shipment.driver - Driver information
id (Int): Driver ID
name (String): Driver name
phone (String): Driver phone
licensePlate (String): Vehicle license plate
avatar (String): Driver avatar URL

orderDetails[] - Array of order items
itemId (Int): Item ID
name (String): Product name
price (Float/Int): Base price
promoId (Int): Promotion ID (nullable)
promoPrice (Float/Int): Promotional price (nullable)
quantity (Int): Quantity ordered
subTotal (Float/Int): Item subtotal
modifiersTotal (Float/Int): Total cost of modifiers
sKU (String): SKU code
productImageUrl (String): Product image URL
requiresShipping (Boolean): Whether item requires shipping
note (String): Item-specific notes

orderDetails[].modifiers[] - Item modifiers
modifierId (Int): Modifier ID
name (String): Modifier name
selectedOptionsTotal (Int): Total selected options count

orderDetails[].modifiers[].selectedOptions[] - Selected modifier options
selectedOptionId (Int): Option ID
name (String): Option name
amount (Int): Quantity/amount

orderDetails[].productMetadata[] - Product metadata (nullable)
key (String): Metadata key
value (String): Metadata value

payment - Payment information
status (String): Payment status (e.g., "PAID")
paymentOptionType (String): Payment type (e.g., "CREDIT_CARD")
creditsChargeAmount (Float/Int): Credits used

payment.paymentMethod - Payment method details
cardholderName (String): Cardholder name
lastDigits (String): Last 4 digits of card
firstDigits (String): First 4 digits of card
type (String): Card type (e.g., "Visa")
cardName (String): Card nickname

Secondary Query: coupon (getCouponByOrderId)
FieldTypeDescriptioncode

String

Coupon code

qrCodeUrl

String

QR code image URL

endDate

String (ISO DateTime)

Coupon expiration date

5. Saved Example: "200 OK"
   Example ID: 23626907-a3831b3b-4581-4a27-a8f9-336e4a21cd02
   Request Details:
   Method: POST
   URL: {{SHOP_API_HOST}}/graphql
   Headers:
   X-App-Id: {{X-APP-ID}} (enabled)
   X-Territory: {{X-TERRITORY}} (disabled)
   X-Geo-Longitude: {{X-GEO-LONGITUDE}} (disabled)
   X-Geo-Latitude: {{X-GEO-LATITUDE}} (disabled)

Request Variables:

JSON

{
"orderId": 18456
}

Response Status: 200 OK
Response Headers:

Plain Text

Date: Tue, 18 Nov 2025 23:32:01 GMT
Content-Type: application/json; charset=utf-8
Transfer-Encoding: chunked
Connection: keep-alive
x-request-id: f76bb516-e51d-4a93-901d-2bd998eac41c
Strict-Transport-Security: max-age=2592000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Vary: accept-encoding
Content-Encoding: br
Server: cloudflare
CF-RAY: 9a0b43be7e292cdd-SAP

Complete Response Body:

JSON

{
"data": {
"coupon": null,
"orderView": {
"id": 18456,
"status": "CANCELLED",
"subTotal": 9,
"discountEffects": [],
"surchargeEffects": [],
"deliveryCost": 0,
"driverTip": 0,
"totalDiscount": 0,
"totalSurcharge": 0,
"total": 9,
"created": "2023-10-24T00:22:22.392Z",
"checkoutNote": "Para recoger en tienda",
"store": {
"id": 57,
"name": "Little Caesars",
"imageUrl": "https://cdn.h4b.dev/images/store57/Image.png?20220214065753",
"currencySymbol": "$",
"currencyCode": "USD",
"locale": "es-SV",
"timezone": "America/El_Salvador"
},
"shipment": {
"shipmentOptionType": "PICKUP",
"originAddress": {
"name": "Mall Caracas #1",
"address": "Caracas, Venezuela",
"coordinates": {
"latitude": 10.4847103,
"longitude": -66.8645147
},
"phone": "95363424"
},
"destinationAddress": {
"name": "Other",
"address": "Residencial Las Casitas , Residencial Roble Oeste , Tegucigalpa",
"coordinates": {
"latitude": 14.053172919233242,
"longitude": -87.26572595536709
},
"phone": null
},
"history": [
{
"shipmentStatus": "PENDING",
"entry": "Pendiente",
"created": "2023-10-24T00:22:29.799Z",
"entryStatus": "IN_PROGRESS"
},
{
"shipmentStatus": "ACCEPTED",
"entry": "Aceptado",
"created": null,
"entryStatus": "PENDING"
},
{
"shipmentStatus": "READY",
"entry": "Preparado",
"created": null,
"entryStatus": "PENDING"
},
{
"shipmentStatus": "DELIVERED",
"entry": "Entregado",
"created": null,
"entryStatus": "PENDING"
}
],
"estimatedTimeOfArrival": 0,
"trackingLinkUrl": null,
"driver": null
},
"orderDetails": [
{
"itemId": 18808,
"modifiers": [
{
"modifierId": 69,
"name": "Agrega tu complemento",
"selectedOptionsTotal": 3,
"selectedOptions": [
{
"selectedOptionId": 425,
"name": "Canelitas",
"amount": 1
},
{
"selectedOptionId": 426,
"name": "Super Cheese Crazy Bread",
"amount": 2
}
]
},
{
"modifierId": 70,
"name": "Agrega tu bebida familiar",
"selectedOptionsTotal": 1,
"selectedOptions": [
{
"selectedOptionId": 413,
"name": "Coca Cola 2L",
"amount": 1
}
]
},
{
"modifierId": 71,
"name": "Agrega tu ingrediente extra",
"selectedOptionsTotal": 3,
"selectedOptions": [
{
"selectedOptionId": 433,
"name": "Extra Pepperoni",
"amount": 3
}
]
}
],
"note": "",
"name": "Super Cheese Ultimate Deluxe",
"price": 2,
"promoId": null,
"promoPrice": null,
"quantity": 1,
"subTotal": 9,
"modifiersTotal": 7,
"sKU": "18808",
"productImageUrl": "https://cdn.h4b.dev/images/store57/products/product18808/Image1.jpg?20211216073758",
"requiresShipping": true,
"productMetadata": null
}
],
"payment": {
"status": "PAID",
"paymentOptionType": "CREDIT_CARD",
"paymentMethod": {
"cardholderName": "Robert",
"lastDigits": "2701",
"firstDigits": "4000",
"type": "Visa",
"cardName": "Without OTP"
},
"creditsChargeAmount": 0
}
}
}
}

6. Key Use Case Demonstrated in Example
   This example shows:
   Order Status: CANCELLED order
   Shipment Type: PICKUP order
   Payment: Paid via credit card (Visa)
   Order Items: 1 pizza with multiple modifiers (extras, drinks, toppings)
   Pricing: $9 total with $7 in modifiers
   Store: Little Caesars in El Salvador
   Coupon: No coupon applied (null)
   Shipment History: Shows progression through PENDING → ACCEPTED → READY → DELIVERED statuses

Summary
This GraphQL query retrieves comprehensive order information including:
✅ Order financial details (subtotal, discounts, surcharges, total)
✅ Store information
✅ Complete shipment tracking (addresses, driver, history)
✅ Detailed order items with modifiers and metadata
✅ Payment method and status
✅ Associated coupon information

Total Saved Examples: 1 (200 OK response with cancelled pickup order)

---

Request Details
Basic Information
Request Name: [PRIVATE] GetAll (Paginated)
Method: POST
URL: /graphql
Request Type: GraphQL
Postman UID: 23626907-d2136577-e7bf-46d0-8ec5-6884c8d70831

Headers
KeyValueEnabledX-App-Id

pizza-plaza

✅ Yes

X-Territory

5f8dc2db119e872cff1bdb31

❌ No

X-Geo-Longitude

10.4847103

❌ No

X-Geo-Latitude

-66.8645147

❌ No

GraphQL Query Structure
Complete Query

GraphQL

query {
orders(
first: 10
last: null
before: null
after: null
) # where: { orderStatus: { eq: PAID } } Only Active Orders Filter
{
nodes {
orderId
name
orderDate
orderType
orderStatus
storeId
storeName
storeImageUrl
storeBannerUrl
storeBannerColor
timezone
locale
currencyCode
currencySymbol
totalFormatted
subTotal
totalDiscount
totalSurcharge
total
paymentDate
paymentOption
shipmentOption
shipmentType
shipmentStatus
requiresShipping
orderDetails {
itemId
name
description
price
promoPrice
productImageUrl
requiresShipping
productMetadata {
key
value
}
quantity
subTotal
}
couponStatus
}
totalCount
pageInfo {
hasNextPage
hasPreviousPage
startCursor
endCursor
}
}
}

Variables
Currently set to empty string: ""

Query Parameters & Input Types
Pagination Parameters (on orders field)
ParameterTypeCurrent ValueDescriptionfirst

Int

10

Number of records to fetch from the start

last

Int

null

Number of records to fetch from the end

before

String

null

Cursor for backward pagination

after

String

null

Cursor for forward pagination

Optional Filter (commented out)
where: { orderStatus: { eq: PAID } } - Filter for only active/paid orders

Response Structure & Data Types
Root Level (**orders**)
FieldTypeDescriptionnodes

Array

List of order objects

totalCount

Int

Total number of orders

pageInfo

Object

Pagination metadata

Order Object Fields (**nodes[]**)
FieldTypeDescriptionorderId

Int

Unique order identifier

name

String

Order name/customer name

orderDate

DateTime (ISO 8601)

When order was created

orderType

String

Type of order (e.g., "MENU_APP")

orderStatus

String

Status (PAID, CANCELLED, FINALIZED, etc.)

storeId

Int

Store identifier

storeName

String

Name of the store

storeImageUrl

String (URL)

Store logo image

storeBannerUrl

String (URL)

Store banner image

storeBannerColor

String (Hex color)

Banner background color

timezone

String

Store timezone (e.g., "America/El_Salvador")

locale

String

Locale code (e.g., "es-SV")

currencyCode

String

Currency code (e.g., "USD")

currencySymbol

String

Currency symbol (e.g., "$")

totalFormatted

String

Formatted total with currency

subTotal

Decimal/Float

Subtotal amount

totalDiscount

Decimal/Float

Total discount applied

totalSurcharge

Decimal/Float

Additional surcharges

total

Decimal/Float

Final total amount

paymentDate

DateTime (ISO 8601)

When payment was made

paymentOption

String

Payment method (e.g., "N1co Business")

shipmentOption

String

Shipping option selected

shipmentType

String

Type (PICKUP, CUSTOM, etc.)

shipmentStatus

String

Status (PENDING, READY, DELIVERED)

requiresShipping

Boolean

Whether shipping is required

orderDetails

Array

List of order items

couponStatus

String (nullable)

Coupon status if applicable

Order Details Object (**orderDetails[]**)
FieldTypeDescriptionitemId

Int

Product item identifier

name

String

Product name

description

String

Product description

price

Decimal/Float

Base price

promoPrice

Decimal/Float (nullable)

Promotional price if applicable

productImageUrl

String (URL)

Product image

requiresShipping

Boolean

Whether item requires shipping

productMetadata

Array (nullable)

Additional metadata key-value pairs

quantity

Int

Quantity ordered

subTotal

Decimal/Float

Line item subtotal

Product Metadata Object (**productMetadata[]**)
FieldTypeDescriptionkey

String

Metadata key

value

String

Metadata value

Page Info Object (**pageInfo**)
FieldTypeDescriptionhasNextPage

Boolean

Whether more records exist after current page

hasPreviousPage

Boolean

Whether records exist before current page

startCursor

String

Cursor for the first item in current page

endCursor

String

Cursor for the last item in current page

Saved Example: "200 OK"
Example Details
Example Name: 200 OK
Example ID: 23626907-a59cec50-a8a3-4aa8-a151-1c48daa29998
Status Code: 200 OK
Response Format: JSON

Response Headers

Plain Text

Date: Tue, 18 Nov 2025 23:31:34 GMT
Content-Type: application/json; charset=utf-8
Transfer-Encoding: chunked
Connection: keep-alive
x-request-id: 6e555acb-1eb7-43a7-b59f-9d018494de02
Strict-Transport-Security: max-age=2592000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Vary: accept-encoding
Content-Encoding: br
Server: cloudflare
CF-RAY: 9a0b43171e832cdd-SAP

Example Response Data
The example shows 10 orders returned (matching the first: 10 parameter), demonstrating various order statuses and scenarios:
Sample Orders Included:
Order 18456 - CANCELLED status (Little Caesars)
Order 16480 - PAID status with CUSTOM shipment (pizzaDelivery)
Order 16479 - PAID status with PENDING shipment
Order 10091 - PAID status with PICKUP
Order 10061 - FINALIZED status with DELIVERED shipment
Orders 10060, 10059, 10058 - Multiple PAID orders with PICKUP

Key Data Points from Example:
Store: Little Caesars (Store ID: 57)
Currency: USD ($)
Locale: es-SV (Spanish - El Salvador)
Timezone: America/El_Salvador
Order Types: MENU_APP
Payment Method: N1co Business
Shipment Types: PICKUP, CUSTOM (pizzaDelivery)
Shipment Statuses: PENDING, READY, DELIVERED
Order Statuses: CANCELLED, PAID, FINALIZED

Sample Order Detail (Full Structure):

JSON

{
"orderId": 18456,
"name": "Orden de Robert",
"orderDate": "2023-10-24T00:22:22.392Z",
"orderType": "MENU_APP",
"orderStatus": "CANCELLED",
"storeId": 57,
"storeName": "Little Caesars",
"storeImageUrl": "https://cdn.h4b.dev/images/store57/Image.png?20220214065753",
"storeBannerUrl": "https://cdn.h4b.dev/images/store57/bannerImage.jpg?20220214065753",
"storeBannerColor": "#ff5900",
"timezone": "America/El_Salvador",
"locale": "es-SV",
"currencyCode": "USD",
"currencySymbol": "$",
"totalFormatted": "$9.00",
"subTotal": 9,
"totalDiscount": 0,
"totalSurcharge": 0,
"total": 9,
"paymentDate": "2023-10-24T00:22:29.799Z",
"paymentOption": "N1co Business",
"shipmentOption": "Pickup",
"shipmentType": "PICKUP",
"shipmentStatus": "PENDING",
"requiresShipping": true,
"orderDetails": [
{
"itemId": 18808,
"name": "Super Cheese Ultimate Deluxe",
"description": "Deliciosa pizza gigante con borde relleno de queso...",
"price": 2,
"promoPrice": null,
"productImageUrl": "https://cdn.h4b.dev/images/store57/products/product18808/Image1.jpg?20211216073758",
"requiresShipping": true,
"productMetadata": null,
"quantity": 1,
"subTotal": 2
}
],
"couponStatus": null
}

Use Cases Demonstrated

1. Basic Pagination
   Fetching first 10 orders
   Returns pageInfo with cursors for navigation

2. Order Status Variety
   CANCELLED orders
   PAID orders (active)
   FINALIZED orders (completed)

3. Shipment Types
   PICKUP orders
   CUSTOM delivery (pizzaDelivery)

4. Shipment Status Tracking
   PENDING (awaiting processing)
   READY (prepared for pickup/delivery)
   DELIVERED (completed)

5. Product Details
   Single and multiple items per order
   Price variations
   Product metadata (nullable)
   Promotional pricing (nullable)

Summary
✅ Request retrieved successfully with complete details including:
Full GraphQL query with all 30+ fields across nested objects
Pagination parameters (first, last, before, after)
Complete response structure with data types
1 saved example ("200 OK") with full response data showing 10 orders
Multiple order statuses, shipment types, and use cases demonstrated
Response headers and metadata

The request demonstrates a comprehensive paginated orders query with cursor-based pagination, supporting forward/backward navigation through the pageInfo object.
