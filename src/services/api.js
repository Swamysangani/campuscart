const API_URL = 'http://localhost:5000/api';

// Helper for authenticated requests
const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${url}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        localStorage.removeItem('token');
    }

    return response;
};

// ======================= PRODUCTS =======================

export const fetchProducts = async (
    page = 1,
    limit = 8,
    search = '',
    category = ''
) => {
    try {
        let url = `/products?page=${page}&limit=${limit}`;

        if (search) url += `&search=${encodeURIComponent(search)}`;
        if (category && category !== 'All')
            url += `&category=${encodeURIComponent(category)}`;

        const response = await fetch(`${API_URL}${url}`);

        if (!response.ok) throw new Error('Failed to fetch products');

        const data = await response.json();

        // 🔥 ALWAYS return consistent structure
        return {
            products: data.products || [],
            total: data.total || 0,
            page: data.page || 1,
            pages: data.pages || 1
        };

    } catch (error) {
        console.error("Error fetching products:", error);

        return {
            products: [],
            total: 0,
            page: 1,
            pages: 1
        };
    }
};

export const fetchProductById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/products/${id}`);

        if (!response.ok) throw new Error('Product not found');

        return await response.json();

    } catch (error) {
        console.error(`Error fetching product ${id}:`, error);
        return null;
    }
};

export const fetchTopSellingProducts = async () => {
    try {
        const data = await fetchProducts(1, 20);
        const products = data.products;

        return [...products]
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 10);

    } catch (error) {
        console.error("Error fetching top products:", error);
        return [];
    }
};

// ======================= MARKETPLACE =======================

export const fetchMarketplaceListings = async () => {
    try {
        const response = await fetch(`${API_URL}/marketplace`);

        if (!response.ok) throw new Error('Failed to fetch listings');

        return await response.json();

    } catch (error) {
        console.error("Error fetching marketplace:", error);
        return [];
    }
};

export const addMarketplaceListing = async (listingData) => {
    try {
        const response = await authFetch('/marketplace', {
            method: 'POST',
            body: JSON.stringify(listingData),
        });

        if (!response.ok) throw new Error('Failed to add listing');

        return await response.json();

    } catch (error) {
        console.error("Error adding listing:", error);
        throw error;
    }
};

export const deleteMarketplaceListing = async (id) => {
    try {
        const response = await authFetch(`/marketplace/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete listing');

        return await response.json();

    } catch (error) {
        console.error("Error deleting listing:", error);
        throw error;
    }
};