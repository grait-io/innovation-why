// Mock order data service for demo purposes
export interface MockOrder {
    id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    orderDate: string;
    status: string;
    totalAmount: number;
    currency: string;
    items: MockOrderItem[];
    shippingAddress: MockAddress;
    billingAddress: MockAddress;
}

export interface MockOrderItem {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    imageUrl?: string;
}

export interface MockAddress {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    zipCode: string;
    country: string;
}

export const getMockOrderData = (orderId: string): MockOrder => {
    // Generate consistent mock data based on order ID
    const orderNumber = orderId.includes('ORD-') ? orderId : `ORD-${orderId}`;
    
    return {
        id: orderId,
        orderNumber: orderNumber,
        customerName: "Max Mustermann",
        customerEmail: "max.mustermann@example.com",
        orderDate: "2024-05-20T10:30:00Z",
        status: "In Produktion",
        totalAmount: 299.99,
        currency: "EUR",
        items: [
            {
                id: "item-1",
                name: "Premium Kiezbett Matratze",
                quantity: 1,
                unitPrice: 199.99,
                totalPrice: 199.99,
                imageUrl: "/kb-print-logo.png"
            },
            {
                id: "item-2",
                name: "Kiezbett Kopfkissen Set",
                quantity: 2,
                unitPrice: 50.00,
                totalPrice: 100.00,
                imageUrl: "/kb-print-logo.png"
            }
        ],
        shippingAddress: {
            firstName: "Max",
            lastName: "Mustermann",
            street: "Musterstraße 123",
            city: "Berlin",
            zipCode: "10115",
            country: "Deutschland"
        },
        billingAddress: {
            firstName: "Max",
            lastName: "Mustermann",
            street: "Musterstraße 123",
            city: "Berlin",
            zipCode: "10115",
            country: "Deutschland"
        }
    };
};

export const getMockOrdersData = (): MockOrder[] => {
    return [
        getMockOrderData("ORD-12345"),
        {
            ...getMockOrderData("ORD-12346"),
            orderNumber: "ORD-12346",
            customerName: "Anna Schmidt",
            customerEmail: "anna.schmidt@example.com",
            status: "Versandbereit",
            totalAmount: 149.99,
            items: [
                {
                    id: "item-3",
                    name: "Kiezbett Bettlaken Set",
                    quantity: 1,
                    unitPrice: 149.99,
                    totalPrice: 149.99,
                    imageUrl: "/kb-print-logo.png"
                }
            ]
        },
        {
            ...getMockOrderData("ORD-12347"),
            orderNumber: "ORD-12347",
            customerName: "Thomas Weber",
            customerEmail: "thomas.weber@example.com",
            status: "Abgeschlossen",
            totalAmount: 399.99,
            items: [
                {
                    id: "item-4",
                    name: "Kiezbett Premium Set",
                    quantity: 1,
                    unitPrice: 399.99,
                    totalPrice: 399.99,
                    imageUrl: "/kb-print-logo.png"
                }
            ]
        }
    ];
};

// Check if a token is a demo token
export const isDemoToken = (token: string): boolean => {
    return token.startsWith('demo-order-') || token.startsWith('dev-global-') || token.startsWith('dev-single-');
};

// Extract order ID from demo token
export const extractOrderIdFromDemoToken = (token: string): string | null => {
    if (token.startsWith('demo-order-')) {
        const parts = token.split('-');
        if (parts.length >= 5) {
            // Format: demo-order-{orderId}-{status}-{timestamp}-{random}
            return parts[2]; // Extract order ID
        }
    }
    return null;
};

// Extract status from demo token - always start with "Bezahlt" for producer workflow
export const extractStatusFromDemoToken = (token: string): string => {
    // For producer workflow, all new tokens should start with "Bezahlt"
    // The status in the token is just for admin reference, producers always start at "Bezahlt"
    return 'Bezahlt';
};

// Get mock order data with custom status
export const getMockOrderDataWithStatus = (orderId: string, status: string): MockOrder => {
    const baseOrder = getMockOrderData(orderId);
    return {
        ...baseOrder,
        status: status
    };
};