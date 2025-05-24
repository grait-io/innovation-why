import { getAuthHeader } from './auth.api';

// Use environment variables for Supabase Edge Functions URL with fallback
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zdpboccjipkgnjjzojnc.supabase.co';
const supabaseEdgeUrl = `${supabaseUrl}/functions/v1`;

export interface OrderToken {
    id: string;
    order_id: string;
    token: string;
    expires_at: string;
    created_at: string;
    created_by?: string;
    used_count: number;
}

export interface CreateOrderLinkRequest {
    orderId?: string;
    expirationDays?: number;
    createdBy?: string;
    tokenType?: 'single' | 'global';
}

export interface CreateOrderLinkResponse {
    success: boolean;
    token: string;
    url: string;
    expires_at: string;
    order_id: string;
}

export interface PublicOrderResponse {
    success: boolean;
    order: any; // Order type from shopware.types.ts
    token_info: {
        created_at: string;
        expires_at: string;
        used_count: number;
    };
}

export interface PublicOrdersResponse {
    success: boolean;
    orders: any[]; // Array of Order types from shopware.types.ts
    token_info: {
        created_at: string;
        expires_at: string;
        used_count: number;
        token_type: string;
    };
}

// Create a new order link token
export const createOrderLink = async (request: CreateOrderLinkRequest): Promise<CreateOrderLinkResponse> => {
    const headers = await getAuthHeader();
    const response = await fetch(`${supabaseEdgeUrl}/order-links`, {
        method: 'POST',
        headers,
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error creating order link');
    }

    return response.json();
};

// Get all orders data via global token (no authentication required)
export const getAllOrdersByToken = async (token: string): Promise<PublicOrdersResponse> => {
    const response = await fetch(`${supabaseEdgeUrl}/order-links/public-orders/${token}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error fetching orders');
    }

    return response.json();
};

// Get order data via public token (no authentication required)
export const getOrderByToken = async (token: string): Promise<PublicOrderResponse> => {
    const response = await fetch(`${supabaseEdgeUrl}/order-links/public-order/${token}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error fetching order');
    }

    return response.json();
};

// Get all active tokens for an order
export const getOrderTokens = async (orderId: string): Promise<{ success: boolean; tokens: OrderToken[] }> => {
    const headers = await getAuthHeader();
    const response = await fetch(`${supabaseEdgeUrl}/order-links/order/${orderId}`, {
        method: 'GET',
        headers,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error fetching order tokens');
    }

    return response.json();
};

// Revoke a token
export const revokeOrderToken = async (token: string): Promise<{ success: boolean; message: string }> => {
    const headers = await getAuthHeader();
    const response = await fetch(`${supabaseEdgeUrl}/order-links/${token}`, {
        method: 'DELETE',
        headers,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error revoking token');
    }

    return response.json();
};