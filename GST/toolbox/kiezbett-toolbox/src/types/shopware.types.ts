export enum OrderStateType {
    order = 'order',
    delivery = 'delivery',
    payment = 'payment',
}

// Order State Technical Names
export enum OrderStateTechnicalName {
    Open = 'open',
    InProgress = 'in_progress',
    Cancelled = 'cancelled',
    Completed = 'completed',
}
export enum OrderStateTransition {
    cancel = 'cancel',
    process = 'process',
    complete = 'complete',
    reopen = 'reopen',
}

// Transaction (Payment) State Technical Names
export enum TransactionStateTechnicalName {
    Open = 'open',
    Failed = 'failed',
    Authorized = 'authorized',
    RefundedPartially = 'refunded_partially',
    Refunded = 'refunded',
    InProgress = 'in_progress',
    Paid = 'paid',
    PaidPartially = 'paid_partially',
    Reminded = 'reminded',
    Cancelled = 'cancelled',
}

export enum TransactionStateTransition {
    cancel = 'cancel',
    process = 'process',
    paid = 'paid',
    refund = 'refund',
    reopen = 'reopen',
}

// Shipping State Technical Names
export enum OrderDeliveryStateTechnicalName {
    Open = 'open',
    Shipped = 'shipped',
    ShippedPartially = 'shipped_partially',
    Cancelled = 'cancelled',
    Returned = 'returned',
    ReturnedPartially = 'returned_partially',
    ShipmentReady = 'shipment_ready',
}

export enum DeliveryStateTransition {
    cancel = 'cancel',
    shipment_ready = 'nbtoolboxtransto',
    shipped = 'nbtoolboxtransfrom',
    reopen = 'reopen',
}

export type Order = {
    id: string;
    orderNumber: string;
    customerComment: string;
    createdAt: string;
    deliveries: Delivery[];
    lineItems: OrderItem[];
    stateMachineState: StateMachineState;
    orderCustomer: {
        email: string;
    };
    transactions: [{ id: string; stateMachineState: StateMachineState }];
};

type StateMachineState = {
    technicalName: string;
    name: string;
};

type Delivery = {
    id: string;
    shippingOrderAddress: {
        firstName: string;
        lastName: string;
        city: string;
        country: string;
        street: string;
        zipcode: string;
        phoneNumber: string;
    };
    shippingMethod: ShippingMethod;
    shippingDateLatest: string;
    stateMachineState: StateMachineState;
};

type ShippingMethod = {
    name: string;
};

type OrderItem = {
    id: string;
    name: string;
    quantity: number;
    label: string;
    payload: {
        options: [
            {
                group: string;
                option: string;
            }
        ];
    };
};
