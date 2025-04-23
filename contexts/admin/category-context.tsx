"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

// Types
export type Category = {
    id: number
    name: string
    slug: string
    description?: string
    parentId?: number
    image?: string
    productsCount: number
}

// Context type
type CategoryContextType = {
    categories: Category[]
    getCategory: (id: number) => Category | undefined
    createCategory: (category: Omit<Category, "id" | "productsCount">) => Category
    updateCategory: (id: number, categoryData: Partial<Category>) => boolean
    deleteCategory: (id: number) => boolean
}

// Create context
const CategoryContext = createContext<CategoryContextType | undefined>(undefined)

// Sample data
const sampleCategories: Category[] = [
    {
        id: 1,
        name: "Móc khóa",
        slug: "moc-khoa",
        description: "Các loại móc khóa handmade đáng yêu",
        image: "/images/product-1.jpg",
        productsCount: 4,
    },
    {
        id: 2,
        name: "Thú bông",
        slug: "thu-bong",
        description: "Thú bông handmade từ len và cotton",
        image: "/images/product-3.jpg",
        productsCount: 3,
    },
    {
        id: 3,
        name: "Hoa",
        slug: "hoa",
        description: "Các loại hoa handmade từ len",
        image: "/images/product-8.jpg",
        productsCount: 1,
    },
    {
        id: 4,
        name: "Quà tặng",
        slug: "qua-tang",
        description: "Quà tặng handmade đặc biệt",
        image: "/images/product-6.jpg",
        productsCount: 1,
    },
    {
        id: 5,
        name: "Phụ kiện",
        slug: "phu-kien",
        description: "Các loại phụ kiện handmade",
        productsCount: 0,
    },
]

// Provider component
export function CategoryProvider({ children }: { children: ReactNode }) {
    const [categories, setCategories] = useState<Category[]>(sampleCategories)

    // Category Management
    const getCategory = (id: number): Category | undefined => {
        return categories.find((category) => category.id === id)
    }

    const createCategory = (categoryData: Omit<Category, "id" | "productsCount">): Category => {
        const newId = Math.max(...categories.map((c) => c.id), 0) + 1
        const newCategory: Category = {
            id: newId,
            productsCount: 0,
            ...categoryData,
        }

        setCategories((prevCategories) => [...prevCategories, newCategory])
        return newCategory
    }

    const updateCategory = (id: number, categoryData: Partial<Category>): boolean => {
        const categoryIndex = categories.findIndex((category) => category.id === id)

        if (categoryIndex === -1) {
            return false
        }

        const updatedCategories = [...categories]
        updatedCategories[categoryIndex] = { ...updatedCategories[categoryIndex], ...categoryData }

        setCategories(updatedCategories)
        return true
    }

    const deleteCategory = (id: number): boolean => {
        const categoryIndex = categories.findIndex((category) => category.id === id)

        if (categoryIndex === -1) {
            return false
        }

        const updatedCategories = categories.filter((category) => category.id !== id)
        setCategories(updatedCategories)
        return true
    }

    return (
        <CategoryContext.Provider
            value={{
                categories,
                getCategory,
                createCategory,
                updateCategory,
                deleteCategory,
            }}
        >
            {children}
        </CategoryContext.Provider>
    )
}

// Custom hook to use the category context
export function useCategoryAdmin() {
    const context = useContext(CategoryContext)
    if (context === undefined) {
        throw new Error("useCategoryAdmin must be used within a CategoryProvider")
    }
    return context
}
