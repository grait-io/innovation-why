import { fetchOrder, fetchOrders, fetchTransitions, setDeliveryState, setOrderState, setPaymentState } from '@/api/order.api';
import { isOrderInCategory } from '@/lib/utils';
import useAppStore from '@/store/app.store';
import {
    DeliveryStateTransition,
    Order,
    OrderDeliveryStateTechnicalName,
    OrderStateTechnicalName,
    OrderStateTransition,
    TransactionStateTechnicalName,
    TransactionStateTransition,
} from '@/types/shopware.types';
import { useMutation, UseMutationResult, useQuery, useQueryClient } from '@tanstack/react-query';

const countOrdersByCategory = (orders: Order[]) => {
    return orders.reduce(
        (acc, order) => {
            if (isOrderInCategory(order, 'open')) acc.open += 1;
            if (isOrderInCategory(order, 'paid')) acc.paid += 1;
            if (isOrderInCategory(order, 'in-progress')) acc.inProgress += 1;
            if (isOrderInCategory(order, 'shipping')) acc.shipped += 1;

            return acc;
        },
        { open: 0, paid: 0, inProgress: 0, shipped: 0 }
    );
};

// Query Hooks
export const useOrderQuery = (id: string) => {
    return useQuery({
        queryKey: ['order', id],
        queryFn: () => fetchOrder(id),
    });
};

export const useOrdersQuery = (state: OrderStateTechnicalName = OrderStateTechnicalName.Open) => {
    return useQuery<Order[], Error>({
        queryKey: ['orders', state],
        queryFn: () => fetchOrders(state),
    });
};

export const useOrderCounts = () => {
    return useQuery({
        queryKey: ['orders'],
        queryFn: () => fetchOrders(),
        select: (data) => countOrdersByCategory(data),
    });
};

// mutations
interface OrderMutationParams {
    id: string;
    newOrderState: OrderStateTransition;
}

interface PaymentMutationParams {
    id: string;
    newPaymentState: TransactionStateTransition;
}

interface ShippingMutationParams {
    id: string;
    newShippingState: DeliveryStateTransition;
}

export const useSetOrderState = (): UseMutationResult<void, Error, OrderMutationParams> => {
    const queryClient = useQueryClient();
    const { setModalText, setModalOpen, setLoading } = useAppStore();

    return useMutation({
        mutationFn: async ({ id, newOrderState }: OrderMutationParams) => {
            setLoading(true);
            await setOrderState(id, newOrderState);
        },
        onSuccess: async (_, { newOrderState }) => {
            await queryClient.invalidateQueries({ queryKey: ['orders'] });

            // TODO
            // if (newOrderState === OrderStateTransition.cancel) {
            //     queryClient.invalidateQueries({ queryKey: ['orders', OrderStateTechnicalName.Cancelled] });
            // }
            // if (newOrderState === OrderStateTransition.complete) {
            //     queryClient.invalidateQueries({ queryKey: ['orders', OrderStateTechnicalName.Completed] });
            // }

            setLoading(false);
        },
        onError: (error) => {
            console.error('[useSetOrderStatus]', error);
            setModalText(error.message);
            setModalOpen(true);
            setLoading(false);
        },
    });
};

export const useSetPaymentState = (): UseMutationResult<any, Error, PaymentMutationParams> => {
    const queryClient = useQueryClient();
    const { setModalText, setModalOpen, setLoading } = useAppStore();

    return useMutation({
        mutationFn: async ({ id, newPaymentState }: PaymentMutationParams) => {
            setLoading(true);
            return setPaymentState(id, newPaymentState);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            setLoading(false);
        },
        onError: (error) => {
            setModalText(error.message);
            setModalOpen(true);
            setLoading(false);
            console.error('[useSetPaymentState]', error);
        },
    });
};

export const useSetShippingState = (): UseMutationResult<any, Error, ShippingMutationParams> => {
    const queryClient = useQueryClient();
    const { setModalOpen, setModalText, setLoading } = useAppStore();

    return useMutation({
        mutationFn: async ({ id, newShippingState }: ShippingMutationParams) => {
            setLoading(true);
            // TODO: naming? delivery vs shipping
            return setDeliveryState(id, newShippingState);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            setLoading(false);
        },
        onError: (error) => {
            setModalText(error.message);
            setModalOpen(true);
            setLoading(false);
            console.error('[useSetShippingState]', error);
        },
    });
};
