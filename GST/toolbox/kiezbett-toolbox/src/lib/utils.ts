import { Order, OrderDeliveryStateTechnicalName, OrderStateTechnicalName, TransactionStateTechnicalName } from '@/types/shopware.types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const formatDate = (dateString: string) =>
    new Intl.DateTimeFormat('de-DE', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
    }).format(new Date(dateString));

// Function to check if an order matches the category based on path
export const isOrderInCategory = (order: Order, path: string): boolean => {
    if (path.includes('open')) {
        return (
            order.stateMachineState.technicalName === OrderStateTechnicalName.Open &&
            order.transactions[0]?.stateMachineState.technicalName !== TransactionStateTechnicalName.Paid
        );
    }

    if (path.includes('paid')) {
        return (
            order.stateMachineState.technicalName === OrderStateTechnicalName.Open &&
            order.transactions[0]?.stateMachineState.technicalName === TransactionStateTechnicalName.Paid
        );
    }

    if (path.includes('in-progress')) {
        return (
            order.stateMachineState.technicalName === OrderStateTechnicalName.InProgress &&
            order.deliveries[0]?.stateMachineState.technicalName === OrderDeliveryStateTechnicalName.Open
        );
    }

    if (path.includes('shipping')) {
        return (
            order.stateMachineState.technicalName === OrderStateTechnicalName.InProgress &&
            (order.deliveries[0]?.stateMachineState.technicalName === OrderDeliveryStateTechnicalName.ShippedPartially ||
                order.deliveries[0]?.stateMachineState.technicalName === OrderDeliveryStateTechnicalName.Shipped ||
                order.deliveries[0]?.stateMachineState.technicalName === OrderDeliveryStateTechnicalName.ShipmentReady)
        );
    }

    if (path.includes('completed')) {
        return order.stateMachineState.technicalName === OrderStateTechnicalName.Completed;
    }

    return false;
};

// Function to check if an order matches the category based on path
export const mapShipping = (order: Order): string => {
    if (order.deliveries[0]?.shippingMethod.name.includes('Spedition')) {
        return 'Spedition';
    }

    if (order.deliveries[0]?.shippingMethod.name.includes('Postversand')) {
        return 'Postversand EU';
    }

    if (order.deliveries[0]?.shippingMethod.name.includes('Standardversand')) {
        return 'Postversand DE';
    }

    if (order.deliveries[0]?.shippingMethod.name.includes('Lastenrad')) {
        return 'Lastenrad';
    }

    if (order.deliveries[0]?.shippingMethod.name.includes('Selbstabholung')) {
        return 'Selbstabholung';
    }

    if (order.deliveries[0]?.shippingMethod.name.includes('BASIS')) {
        return 'Basis (Was ist das?)';
    }

    if (order.deliveries[0]?.shippingMethod.name.includes('Sperrgut')) {
        return 'Sperrgut DE';
    }

    console.log('???', order.deliveries[0]?.shippingMethod.name);
    return '???';
};
