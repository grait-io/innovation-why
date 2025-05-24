import { formatDate, mapShipping } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { TableCell, TableRow } from '../ui/table';
import { DeliveryStateTransition, Order, OrderStateTransition, OrderStateType, TransactionStateTransition } from '@/types/shopware.types';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { MessageCircleIcon, MessageCircleMore, MoreHorizontal, MoreHorizontalIcon, RocketIcon, Settings } from 'lucide-react';
import StateDropdown from './state-dropdown.component';
import { useAuth } from '@/context/auth.context';
import { LinkGenerator } from './link-generator';

type OrderActionsProps = {
    order: Order;
    handleStateChange: (
        id: string,
        state: OrderStateTransition | TransactionStateTransition | DeliveryStateTransition,
        type: OrderStateType
    ) => void;
    getTransitions: (id: string, type: OrderStateType) => Promise<void>;
};
const OrderActions: React.FC<OrderActionsProps> = ({ order, handleStateChange, getTransitions }) => {
    const auth = useAuth(); // Assuming useAuth is available globally or passed as context.

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="cursor-pointer hover:bg-gray-300" aria-haspopup="true" size="icon" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>State Transitions</DropdownMenuLabel>
                {[OrderStateType.order, OrderStateType.delivery, OrderStateType.payment].map((type) => (
                    <StateDropdown key={type} order={order} stateType={type} onStateChange={handleStateChange} />
                ))}
                <DropdownMenuSeparator />
                {auth?.canAccessFeature('dev') &&
                    [
                        { id: order.id, type: OrderStateType.order, label: 'Order Transitions' },
                        { id: order.transactions[0]?.id, type: OrderStateType.payment, label: ' Payment Transitions' },
                        { id: order.deliveries[0]?.id, type: OrderStateType.delivery, label: ' Delivery Transitions' },
                    ].map(({ id, type, label }) => (
                        <DropdownMenuItem key={type} onClick={() => getTransitions(id, type)}>
                            <RocketIcon className="h-4 w-4" /> &nbsp; {label}
                        </DropdownMenuItem>
                    ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

type OrderRowProps = {
    order: Order;
    handleStateChange: (
        id: string,
        state: OrderStateTransition | TransactionStateTransition | DeliveryStateTransition,
        type: OrderStateType
    ) => void;
    getTransitions: (id: string, type: OrderStateType) => Promise<void>;
    handleOpenModal: (comment: string) => void;
    onClick?: () => void;
};
export const OrderRow: React.FC<OrderRowProps> = ({ order, handleStateChange, getTransitions, handleOpenModal, onClick }) => (
    <TableRow key={order.orderNumber} onClick={onClick} className="cursor-pointer hover:bg-gray-100">
        <TableCell className="font-medium">{order.orderNumber}</TableCell>
        <TableCell className="font-medium">{formatDate(order.createdAt)}</TableCell>
        <TableCell className="font-medium min-w-[150px]">
            <Badge variant="outline">{mapShipping(order)}</Badge>
        </TableCell>
        <TableCell>
            <Badge className="whitespace-nowrap" variant="outline">
                {order.stateMachineState.name}
            </Badge>
        </TableCell>
        <TableCell>
            <Badge className="whitespace-nowrap" variant="outline">
                {order.deliveries[0]?.stateMachineState.name}
            </Badge>
        </TableCell>
        <TableCell>
            <Badge variant="outline">{order.transactions[0]?.stateMachineState?.name || 'Unknown'}</Badge>
        </TableCell>
        <TableCell className="max-w-xs">
            {order.lineItems.length > 0 ? (
                <ul className="list-inside space-y-2 ">
                    {order.lineItems.map((item) => (
                        <li key={item.id}>
                            <div className="">
                                {item.quantity} x {item.label}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">No line items available.</p>
            )}
        </TableCell>
        <TableCell className="hidden md:table-cell">
            <span>
                {order.deliveries[0]?.shippingOrderAddress.firstName} {order.deliveries[0]?.shippingOrderAddress.lastName}
            </span>
            <br />
            <span>{order.deliveries[0]?.shippingOrderAddress.street}</span>
            <br />
            <b>
                <span>
                    {order.deliveries[0]?.shippingOrderAddress.zipcode} {order.deliveries[0]?.shippingOrderAddress.city}
                </span>
            </b>
            <br />
            <span>{order.orderCustomer.email}</span>
            <br />
            <span>{order.deliveries[0]?.shippingOrderAddress.phoneNumber}</span>
            <br />
            <br />
        </TableCell>
        <TableCell>
            {order.customerComment && (
                <Button
                    size="icon"
                    className="cursor-pointer hover:bg-gray-300"
                    variant="ghost"
                    onClick={(event) => {
                        event.stopPropagation(); // Verhindert Bubbling
                        handleOpenModal(order.customerComment);
                    }}
                >
                    <MessageCircleMore />
                </Button>
            )}
        </TableCell>
        <TableCell>
            <div className="flex items-center gap-2">
                <LinkGenerator
                    orderId={order.id}
                    orderNumber={order.orderNumber}
                />
                <OrderActions
                    order={order}
                    handleStateChange={handleStateChange}
                    getTransitions={getTransitions}
                />
            </div>
        </TableCell>
    </TableRow>
);
