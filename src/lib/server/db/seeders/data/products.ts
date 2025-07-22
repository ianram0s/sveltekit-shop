const AVAILABLE_COLORS = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Navy', hex: '#2C3E50' },
    { name: 'Gray', hex: '#708090' },
    { name: 'Red', hex: '#DC143C' },
    { name: 'Blue', hex: '#4169E1' },
    { name: 'Green', hex: '#228B22' },
    { name: 'Khaki', hex: '#C3B091' },
    { name: 'Burgundy', hex: '#800020' },
    { name: 'Light Blue', hex: '#6495ED' }
] as const;

export const products = [
    {
        id: '1',
        title: 'Loose Fit Bermuda',
        description: 'Comfortable and relaxed bermuda shorts perfect for summer days. Made with breathable cotton blend fabric for all-day comfort.',
        currentPrice: 34.99,
        originalPrice: 44.99,
        images: ['/product-images/loose-fit-bermuda.png'],
        availableColors: [
            AVAILABLE_COLORS[7],
            AVAILABLE_COLORS[2],
            AVAILABLE_COLORS[3],
            AVAILABLE_COLORS[6]
        ],
        availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
        categoryIds: ['3', '5'],
        slug: 'loose-fit-bermuda-shorts',
        inStock: true,
        rating: 4.4,
        reviewCount: 89
    },
    {
        id: '2',
        title: 'Skinny Fit Jeans',
        description: 'Modern skinny fit jeans crafted from premium denim. Features stretch technology for comfort and a flattering silhouette.',
        currentPrice: 79.99,
        originalPrice: 99.99,
        images: ['/product-images/skinny-fit-jeans.png'],
        availableColors: [
            AVAILABLE_COLORS[5],
            AVAILABLE_COLORS[0],
            AVAILABLE_COLORS[9],
            AVAILABLE_COLORS[2] 
        ],
        availableSizes: ['XS', 'S', 'M', 'L', 'XL'],
        categoryIds: ['3', '4', '5'],
        slug: 'skinny-fit-premium-jeans',
        inStock: true,
        rating: 4.7,
        reviewCount: 156
    },
    {
        id: '3',
        title: 'Black Striped Tee',
        description: 'Timeless black and white striped t-shirt with a modern fit. Perfect for casual wear and easy to style with any outfit.',
        currentPrice: 24.99,
        images: ['/product-images/black-striped-tshirt.png'],
        availableColors: [
            AVAILABLE_COLORS[0],
            AVAILABLE_COLORS[1],
            AVAILABLE_COLORS[3]
        ],
        availableSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        categoryIds: ['2', '5'],
        slug: 'classic-black-striped-tee',
        inStock: true,
        rating: 4.3,
        reviewCount: 134
    },
    {
        id: '4',
        title: 'Polo Tipping Shirt',
        description: 'Sophisticated polo shirt with elegant tipping details on collar and cuffs. Made from premium pique cotton for a refined look.',
        currentPrice: 49.99,
        images: ['/product-images/polo-tipping-details.png'],
        availableColors: [
            AVAILABLE_COLORS[1],
            AVAILABLE_COLORS[2],
            AVAILABLE_COLORS[8],
            AVAILABLE_COLORS[6]
        ],
        availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
        categoryIds: ['1', '4'],
        slug: 'polo-tipping-details-shirt',
        inStock: true,
        rating: 4.6,
        reviewCount: 78
    },
    {
        id: '5',
        title: 'Gradient Graphic Tee',
        description: 'Eye-catching gradient graphic t-shirt with modern artistic design. Soft cotton blend fabric with vibrant color transitions.',
        currentPrice: 29.99,
        originalPrice: 39.99,
        images: ['/product-images/gradient-graphic-tshirt.png'],
        availableColors: [
            AVAILABLE_COLORS[4],
            AVAILABLE_COLORS[5],
            AVAILABLE_COLORS[6],
            AVAILABLE_COLORS[0]
        ],
        availableSizes: ['S', 'M', 'L', 'XL'],
        categoryIds: ['2', '4'],
        slug: 'gradient-graphic-tee',
        inStock: true,
        rating: 4.5,
        reviewCount: 92
    },
    {
        id: '6',
        title: 'Vertical Striped Shirt',
        description: 'Classic vertical striped dress shirt perfect for professional settings. Wrinkle-resistant fabric with a tailored fit.',
        currentPrice: 54.99,
        originalPrice: 69.99,
        images: ['/product-images/vertical-striped-shirt.png'],
        availableColors: [
            AVAILABLE_COLORS[5],
            AVAILABLE_COLORS[0],
            AVAILABLE_COLORS[1],
            AVAILABLE_COLORS[9]
        ],
        availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
        categoryIds: ['1', '5'],
        slug: 'vertical-striped-dress-shirt',
        inStock: true,
        rating: 4.8,
        reviewCount: 203
    },
    {
        id: '7',
        title: 'Courage Graphic Tee',
        description: 'Bold inspirational graphic tee featuring motivational typography. High-quality print on premium cotton for lasting comfort.',
        currentPrice: 27.99,
        images: ['/product-images/courage-graphic-tshirt.png'],
        availableColors: [
            AVAILABLE_COLORS[0],
            AVAILABLE_COLORS[1],
            AVAILABLE_COLORS[3],
            AVAILABLE_COLORS[2]
        ],
        availableSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        categoryIds: ['2', '4'],
        slug: 'courage-graphic-statement-tee',
        inStock: true,
        rating: 4.2,
        reviewCount: 67
    },
    {
        id: '8',
        title: 'Checkered Shirt',
        description: 'Stylish checkered shirt with a relaxed fit. Perfect for casual outings and weekend wear. Made from soft cotton flannel.',
        currentPrice: 42.99,
        images: ['/product-images/checkered-shirt.png'],
        availableColors: [
            AVAILABLE_COLORS[5],
            AVAILABLE_COLORS[4],
            AVAILABLE_COLORS[6],
            AVAILABLE_COLORS[0]
        ],
        availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
        categoryIds: ['1'],
        slug: 'checkered-pattern-casual-shirt',
        inStock: true,
        rating: 4.4,
        reviewCount: 118
    },
    {
        id: '9',
        title: 'Tape Details Sport Tee',
        description: 'Athletic-inspired t-shirt with decorative tape details. Moisture-wicking fabric perfect for active lifestyles and gym wear.',
        currentPrice: 32.99,
        originalPrice: 42.99,
        images: ['/product-images/tape-details-tshirt.png'],
        availableColors: [
            AVAILABLE_COLORS[0],
            AVAILABLE_COLORS[1],
            AVAILABLE_COLORS[3],
            AVAILABLE_COLORS[4]
        ],
        availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
        categoryIds: ['2', '5'],
        slug: 'tape-details-sport-tee',
        inStock: true,
        rating: 4.6,
        reviewCount: 145
    },
    {
        id: '10',
        title: 'Sleeve Stripe Tee',
        description: 'Modern t-shirt with contrasting sleeve stripes for a contemporary look. Comfortable cotton blend with a relaxed fit.',
        currentPrice: 26.99,
        images: ['/product-images/sleeve-stripe-tshirt.png'],
        availableColors: [
            AVAILABLE_COLORS[1],
            AVAILABLE_COLORS[3],
            AVAILABLE_COLORS[0],
            AVAILABLE_COLORS[2]
        ],
        availableSizes: ['XS', 'S', 'M', 'L', 'XL'],
        categoryIds: ['2', '4'],
        slug: 'sleeve-stripe-contrast-tee',
        inStock: true,
        rating: 4.3,
        reviewCount: 89
    }
]; 