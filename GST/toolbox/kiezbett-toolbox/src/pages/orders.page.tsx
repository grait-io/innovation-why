import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { useEffect } from 'react';
import {
    DeliveryStateTransition,
    Order,
    OrderStateTechnicalName,
    OrderStateTransition,
    OrderStateType,
    TransactionStateTransition,
} from '@/types/shopware.types';
import { useOrdersQuery, useSetOrderState, useSetPaymentState, useSetShippingState } from '@/hooks/use-order.hook';
import { isOrderInCategory } from '@/lib/utils';
import useAppStore from '@/store/app.store';
import { useQueryClient } from '@tanstack/react-query';
import { fetchTransitions } from '@/api/order.api';
import { OrderRow } from '@/components/order/order-row';

// Define the props type
type OrdersProps = {
    filter?: string;
};

const Orders = ({ filter }: OrdersProps) => {
    const queryClient = useQueryClient();
    const {
        data: ordersQuery,
        isLoading: isOrdersQueryLoading,
        isSuccess: isOrdersQueryReady,
    } = useOrdersQuery(OrderStateTechnicalName.Open);
    const { data: completedOrdersQuery } = useOrdersQuery(OrderStateTechnicalName.Completed);
    const { data: canceledOrdersQuery } = useOrdersQuery(OrderStateTechnicalName.Cancelled);

    const { mutate: updateOrderState } = useSetOrderState();
    const { mutate: updatePaymentState } = useSetPaymentState();
    const { mutate: updateShippingState } = useSetShippingState();

    const { setLoading, setModalText, setModalOpen, setModalOrder } = useAppStore();

    const path = location.pathname;

    // TODO: refactor paths
    let orders = ordersQuery;
    if (path.includes('completed')) {
        orders = completedOrdersQuery;
    }
    if (path.includes('canceled')) {
        orders = canceledOrdersQuery;
    }

    const getTransitions = async (id: string, type: OrderStateType) => {
        const data = await queryClient.fetchQuery({
            queryKey: ['transitions', id, type], // Provide the queryKey explicitly
            queryFn: () => fetchTransitions(id, type), // Explicit fetch logic
            staleTime: 0,
        });

        const transitions = data.order.transitions;

        // Print transitions as a table
        console.log('From State | To State            | Action');
        console.log('-----------|---------------------|-------------------');
        transitions.forEach(({ fromStateName, toStateName, actionName }: any) => {
            console.log(`${fromStateName.padEnd(10)} | ${toStateName.padEnd(20)} | ${actionName}`);
        });
    };

    const handleStateChange = (
        orderId: string,
        newState: OrderStateTransition | TransactionStateTransition | DeliveryStateTransition,
        orderType: OrderStateType
    ) => {
        if (orderType === OrderStateType.order) {
            updateOrderState(
                { id: orderId, newOrderState: newState as OrderStateTransition },
                {
                    onSuccess: () => console.log(`Order state updated to ${newState}`),
                    onError: (error) => console.error('Failed to update order state:', error),
                }
            );
        }

        if (orderType === OrderStateType.delivery) {
            updateShippingState(
                { id: orderId, newShippingState: newState as DeliveryStateTransition },
                {
                    onSuccess: () => console.log(`Order state updated to ${newState}`),
                    onError: (error) => console.error('Failed to update order state:', error),
                }
            );
        }

        if (orderType === OrderStateType.payment) {
            updatePaymentState(
                { id: orderId, newPaymentState: newState as TransactionStateTransition },
                {
                    onSuccess: () => console.log(`Order state updated to ${newState}`),
                    onError: (error) => console.error('Failed to update order state:', error),
                }
            );
        }
    };

    const filteredOrders = orders?.length
        ? orders.filter((order: Order) => {
              if (path.includes('open')) {
                  return isOrderInCategory(order, path);
              }

              if (path.includes('paid')) {
                  return isOrderInCategory(order, path);
              }

              if (path.includes('in-progress')) {
                  return isOrderInCategory(order, path);
              }

              if (path.includes('shipping')) {
                  return isOrderInCategory(order, path);
              }

              if (path.includes('completed')) {
                  return order.stateMachineState.technicalName === OrderStateTechnicalName.Completed;
              }

              return true; // No filter applied, show all orders
          })
        : [];

    const handleOpenModalComment = (comment: string) => {
        setModalOrder(undefined);
        setModalText(comment);
        setModalOpen(true);
    };

    const handleOpenModal = (order: Order) => {
        setModalOrder(order);
        setModalOpen(true);
    };
    useEffect(() => {
        if (isOrdersQueryLoading) {
            setLoading(true);
        }

        if (isOrdersQueryReady) {
            setLoading(false);
        }
    }, [isOrdersQueryLoading, isOrdersQueryReady]);

    return (
        <div className="orders-page">
            {/* Comment dialog */}
            <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                    <CardTitle>{filter}</CardTitle>
                    <CardDescription>Manage your orders.</CardDescription>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {['ID', 'Datum', 'Lieferung', 'Status', 'Lieferstatus', 'Bezahlstatus', 'Produkte', 'Versand', 'Aktionen'].map(
                                    (header) => (
                                        <TableHead key={header}>{header}</TableHead>
                                    )
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredOrders?.map((order) => (
                                <OrderRow
                                    key={order.id}
                                    order={order}
                                    handleStateChange={handleStateChange}
                                    getTransitions={getTransitions}
                                    handleOpenModal={handleOpenModalComment}
                                    onClick={() => handleOpenModal(order)}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
                <CardFooter>
                    <div className="text-xs text-muted-foreground">
                        Showing <strong>1-10</strong> of <strong>32</strong> products
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};
export default Orders;
