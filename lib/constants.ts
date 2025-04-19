// Product Types
export interface Product {
    id: number
    name: string
    price: number
    image: string
    images?: string[]
    category: string
    description?: string
    longDescription?: string
    rating?: number
    reviews?: number
    colors?: Color[]
    sizes?: string[]
    specifications?: Record<string, string>
    dimensions?: Record<string, string>
}

export interface Pattern {
    id: number
    name: string
    price: number
    image: string
    likes: number
    liked?: boolean
    author: string
}

export interface Category {
    id: number
    name: string
}

export interface Color {
    id?: number
    name: string
    value?: string
    hex: string
}

export interface Review {
    id: number
    name: string
    rating: number
    date: string
    comment: string
    verified: boolean
}

// Products Data
export const products: Product[] = [
    {
        id: 1,
        name: "Móc khóa hình gấu nhỏ xinh",
        price: 250000,
        image: "/images/product-1.jpg",
        images: [
            "/images/product-1.jpg",
            "/images/product-detail-1.jpg",
            "/images/product-detail-2.jpg",
            "/images/product-detail-3.jpg",
        ],
        description: "Móc khóa hình gấu nhỏ xinh được làm thủ công từ sợi cotton cao cấp, màu sắc tươi sáng và bền đẹp.",
        longDescription:
            "Móc khóa hình gấu nhỏ xinh được làm thủ công từ sợi cotton cao cấp, màu sắc tươi sáng và bền đẹp. Sản phẩm có kích thước nhỏ gọn, dễ dàng gắn vào túi xách, ba lô hoặc chìa khóa. Đây là món quà đáng yêu dành cho bạn bè, người thân hoặc để sưu tầm.",
        category: "Móc khóa",
        rating: 4,
        reviews: 12,
        colors: [
            { name: "Hồng", value: "pink", hex: "#ec4899" },
            { name: "Xanh dương", value: "blue", hex: "#3b82f6" },
            { name: "Vàng", value: "yellow", hex: "#eab308" },
            { name: "Trắng", value: "white", hex: "#ffffff" },
        ],
        sizes: ["xs", "s", "m", "l"],
        specifications: {
            "Chất liệu": "Sợi cotton",
            "Xuất xứ": "Việt Nam",
            "Thương hiệu": "Tiểu Phương Crochet",
            "Kích thước": "5cm x 5cm",
            "Trọng lượng": "20g",
        },
        dimensions: {
            "Chiều cao": "5cm",
            "Chiều rộng": "5cm",
            "Chiều dài": "5cm",
            "Đường kính": "N/A",
        },
    },
    {
        id: 2,
        name: "Móc khóa hình thỏ",
        price: 250000,
        image: "/images/product-2.jpg",
        images: ["/images/product-2.jpg"],
        description: "Móc khóa hình thỏ dễ thương được làm thủ công từ sợi cotton cao cấp.",
        category: "Móc khóa",
        rating: 5,
        reviews: 8,
        colors: [
            { name: "Hồng", value: "pink", hex: "#ec4899" },
            { name: "Xanh dương", value: "blue", hex: "#3b82f6" },
            { name: "Vàng", value: "yellow", hex: "#eab308" },
        ],
        sizes: ["s", "m", "l"],
    },
    {
        id: 3,
        name: "Thú bông chuột nhỏ",
        price: 350000,
        image: "/images/product-3.jpg",
        category: "Thú bông",
    },
    {
        id: 4,
        name: "Móc khóa hình mèo",
        price: 250000,
        image: "/images/product-4.jpg",
        category: "Móc khóa",
    },
    {
        id: 5,
        name: "Thú bông vịt vàng",
        price: 350000,
        image: "/images/product-5.jpg",
        category: "Thú bông",
    },
    {
        id: 6,
        name: "Hộp quà nhỏ xinh",
        price: 200000,
        image: "/images/product-6.jpg",
        category: "Quà tặng",
    },
    {
        id: 7,
        name: "Thú bông cá xanh",
        price: 350000,
        image: "/images/product-7.jpg",
        category: "Thú bông",
    },
    {
        id: 8,
        name: "Hoa hồng len đỏ",
        price: 150000,
        image: "/images/product-8.jpg",
        category: "Hoa",
    },
    {
        id: 9,
        name: "Móc khóa hình gấu trúc",
        price: 250000,
        image: "/images/product-1.jpg",
        category: "Móc khóa",
    },
]

export const relatedProducts: Product[] = [
    {
        id: 2,
        name: "Móc khóa hình thỏ",
        price: 250000,
        image: "/images/product-2.jpg",
        category: "Móc khóa",
    },
    {
        id: 3,
        name: "Thú bông chuột nhỏ",
        price: 350000,
        image: "/images/product-3.jpg",
        category: "Thú bông",
    },
    {
        id: 4,
        name: "Móc khóa hình mèo",
        price: 250000,
        image: "/images/product-4.jpg",
        category: "Móc khóa",
    },
    {
        id: 5,
        name: "Thú bông vịt vàng",
        price: 350000,
        image: "/images/product-5.jpg",
        category: "Thú bông",
    },
]

// Patterns Data
export const patterns: Pattern[] = [
    {
        id: 1,
        name: "Chart móc trái tim nhỏ xinh",
        price: 50000,
        image: "/images/chart-1.jpg",
        likes: 15,
        liked: true,
        author: "Tiểu Phương",
    },
    {
        id: 2,
        name: "Chart móc hoa đào nhỏ xinh",
        price: 30000,
        image: "/images/chart-2.jpg",
        likes: 23,
        liked: false,
        author: "Tiểu Phương",
    },
    {
        id: 3,
        name: "Chart móc túi đựng điện thoại",
        price: 40000,
        image: "/images/chart-3.jpg",
        likes: 18,
        liked: true,
        author: "Tiểu Phương",
    },
    {
        id: 4,
        name: "Chart móc trái tim nhỏ",
        price: 25000,
        image: "/images/chart-4.jpg",
        likes: 32,
        liked: false,
        author: "Tiểu Phương",
    },
    {
        id: 5,
        name: "Chart móc thú bông vịt",
        price: 50000,
        image: "/images/chart-5.jpg",
        likes: 27,
        liked: true,
        author: "Tiểu Phương",
    },
    {
        id: 6,
        name: "Chart móc thú bông thỏ",
        price: 50000,
        image: "/images/chart-6.jpg",
        likes: 19,
        liked: false,
        author: "Tiểu Phương",
    },
    {
        id: 7,
        name: "Chart móc thú bông mèo",
        price: 50000,
        image: "/images/chart-7.jpg",
        likes: 24,
        liked: true,
        author: "Tiểu Phương",
    },
    {
        id: 8,
        name: "Chart móc thú bông cừu",
        price: 50000,
        image: "/images/chart-8.jpg",
        likes: 31,
        liked: false,
        author: "Tiểu Phương",
    },
    {
        id: 9,
        name: "Chart móc hoa hồng xinh xắn",
        price: 35000,
        image: "/images/chart-9.jpg",
        likes: 42,
        liked: true,
        author: "Tiểu Phương",
    },
    {
        id: 10,
        name: "Chart móc gấu trúc nhỏ",
        price: 45000,
        image: "/images/chart-10.jpg",
        likes: 38,
        liked: false,
        author: "Tiểu Phương",
    },
    {
        id: 11,
        name: "Chart móc túi xách mini",
        price: 60000,
        image: "/images/chart-11.jpg",
        likes: 29,
        liked: true,
        author: "Tiểu Phương",
    },
    {
        id: 12,
        name: "Chart móc hoa tulip",
        price: 40000,
        image: "/images/chart-12.jpg",
        likes: 33,
        liked: false,
        author: "Tiểu Phương",
    },
]

export const homePagePatterns: Pattern[] = [
    {
        id: 1,
        name: "Chart móc thú bông gấu",
        price: 50000,
        image: "/images/pattern-1.jpg",
        likes: 15,
        author: "Tiểu Phương",
    },
    {
        id: 2,
        name: "Chart móc hoa đào nhỏ xinh",
        price: 30000,
        image: "/images/pattern-2.jpg",
        likes: 23,
        author: "Tiểu Phương",
    },
    {
        id: 3,
        name: "Chart móc túi đựng điện thoại",
        price: 40000,
        image: "/images/pattern-3.jpg",
        likes: 18,
        author: "Tiểu Phương",
    },
    {
        id: 4,
        name: "Chart móc trái tim nhỏ",
        price: 25000,
        image: "/images/pattern-4.jpg",
        likes: 32,
        author: "Tiểu Phương",
    },
    {
        id: 5,
        name: "Chart móc thú bông vịt",
        price: 50000,
        image: "/images/pattern-5.jpg",
        likes: 27,
        author: "Tiểu Phương",
    },
    {
        id: 6,
        name: "Chart móc thú bông thỏ",
        price: 50000,
        image: "/images/pattern-6.jpg",
        likes: 19,
        author: "Tiểu Phương",
    },
    {
        id: 7,
        name: "Chart móc thú bông mèo",
        price: 50000,
        image: "/images/pattern-7.jpg",
        likes: 24,
        author: "Tiểu Phương",
    },
    {
        id: 8,
        name: "Chart móc thú bông cừu",
        price: 50000,
        image: "/images/pattern-8.jpg",
        likes: 31,
        author: "Tiểu Phương",
    },
]

// Categories
export const productCategories: Category[] = [
    { id: 1, name: "Móc khóa" },
    { id: 2, name: "Thú bông" },
    { id: 3, name: "Hoa" },
    { id: 4, name: "Quà tặng" },
    { id: 5, name: "Phụ kiện" },
]

export const patternCategories: Category[] = [
    { id: 1, name: "Tất cả" },
    { id: 2, name: "Động vật" },
    { id: 3, name: "Hoa và cây" },
    { id: 4, name: "Thú nhồi bông" },
    { id: 5, name: "Móc khóa" },
    { id: 6, name: "Phụ kiện" },
    { id: 7, name: "Quần áo" },
    { id: 8, name: "Túi xách" },
    { id: 9, name: "Đồ trang trí" },
    { id: 10, name: "Khác" },
]

// Colors
export const colors: Color[] = [
    { id: 1, name: "Đỏ", hex: "#ef4444" },
    { id: 2, name: "Cam", hex: "#f97316" },
    { id: 3, name: "Vàng", hex: "#eab308" },
    { id: 4, name: "Xanh lá", hex: "#22c55e" },
    { id: 5, name: "Xanh dương", hex: "#3b82f6" },
    { id: 6, name: "Tím", hex: "#a855f7" },
    { id: 7, name: "Hồng", hex: "#ec4899" },
    { id: 8, name: "Trắng", hex: "#ffffff" },
    { id: 9, name: "Đen", hex: "#000000" },
]

// Reviews
export const reviews: Review[] = [
    {
        id: 1,
        name: "Nguyễn Thị Hương",
        rating: 5,
        date: "12/04/2025",
        comment: "Sản phẩm rất đáng yêu, chất lượng tốt và đúng như mô tả. Tôi rất hài lòng với sản phẩm này!",
        verified: true,
    },
    {
        id: 2,
        name: "Trần Văn Nam",
        rating: 4,
        date: "05/04/2025",
        comment: "Móc khóa xinh xắn, màu sắc tươi sáng. Tuy nhiên hơi nhỏ so với mong đợi của tôi.",
        verified: true,
    },
    {
        id: 3,
        name: "Lê Thị Minh",
        rating: 5,
        date: "28/03/2025",
        comment: "Tôi mua làm quà tặng cho bạn và bạn rất thích. Sẽ ủng hộ shop nhiều hơn nữa!",
        verified: false,
    },
]

// Hero Slider
export const heroSlides = [
    {
        id: 1,
        title: "VÌ SAO CÓ NHÂN LOẠI",
        image: "/images/hero-1.jpg",
        buttonText: "Xem thêm",
    },
    {
        id: 2,
        title: "HANDMADE WITH LOVE",
        image: "/images/hero-2.jpg",
        buttonText: "Mua ngay",
    },
    {
        id: 3,
        title: "QUÀ TẶNG ĐẶC BIỆT",
        image: "/images/hero-3.jpg",
        buttonText: "Khám phá",
    },
]
