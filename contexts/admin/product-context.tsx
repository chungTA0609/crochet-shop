"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { products as initialProducts, Product } from "@/lib/constants"

// Types

// Context type
type ProductContextType = {
    products: Product[]
    getProduct: (id: number) => Product | undefined
    createProduct: (product: Omit<Product, "id">) => Product
    updateProduct: (id: number, productData: Partial<Product>) => boolean
    deleteProduct: (id: number) => boolean
}

// Create context
const ProductContext = createContext<ProductContextType | undefined>(undefined)

// Provider component
export function ProductProvider({ children }: { children: ReactNode }) {
    const [products, setProducts] = useState<Product[]>(initialProducts)

    // Product Management
    const getProduct = (id: number): Product | undefined => {
        return products.find((product) => product.id === id)
    }

    const createProduct = (productData: Omit<Product, "id">): Product => {
        const newId = Math.max(...products.map((p) => p.id), 0) + 1
        const newProduct: Product = {
            id: newId,
            ...productData,
        }

        setProducts((prevProducts) => [...prevProducts, newProduct])
        return newProduct
    }

    const updateProduct = (id: number, productData: Partial<Product>): boolean => {
        const productIndex = products.findIndex((product) => product.id === id)

        if (productIndex === -1) {
            return false
        }

        const updatedProducts = [...products]
        updatedProducts[productIndex] = { ...updatedProducts[productIndex], ...productData }

        setProducts(updatedProducts)
        return true
    }

    const deleteProduct = (id: number): boolean => {
        const productIndex = products.findIndex((product) => product.id === id)

        if (productIndex === -1) {
            return false
        }

        const updatedProducts = products.filter((product) => product.id !== id)
        setProducts(updatedProducts)
        return true
    }

    return (
        <ProductContext.Provider
            value={{
                products,
                getProduct,
                createProduct,
                updateProduct,
                deleteProduct,
            }}
        >
            {children}
        </ProductContext.Provider>
    )
}

// Custom hook to use the product context
export function useProductAdmin() {
    const context = useContext(ProductContext)
    if (context === undefined) {
        throw new Error("useProductAdmin must be used within a ProductProvider")
    }
    return context
}
