import { NextResponse } from "next/server"
import { products } from "@/lib/constants"

// GET handler to fetch products
export async function GET() {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Return products from constants
    return NextResponse.json(products)
}

// POST handler to create a product
export async function POST(request: Request) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Parse request body
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.price || !body.category) {
        return NextResponse.json({ message: "Missing required fields: name, price, category" }, { status: 400 })
    }

    // Create new product (in a real app, this would save to a database)
    const newProduct = {
        id: Math.floor(Math.random() * 1000) + 100, // Generate random ID
        name: body.name,
        price: body.price,
        image: "/images/product-1.jpg", // Default image
        category: body.category,
        description: body.description || "",
    }

    // Return the new product
    return NextResponse.json(newProduct)
}
