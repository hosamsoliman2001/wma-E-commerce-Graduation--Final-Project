# Data Dictionary

## User
- username: String
- email: String
- password: String
- isAdmin: Boolean

## Product
- id: Number
- title: String
- price: Number
- image: String
- category: String

## CartItem
- id: Number
- title: String
- price: Number
- image: String
- qty: Number

## Order
- id: Number
- userEmail: String
- items: [CartItem]
- createdAt: Date
