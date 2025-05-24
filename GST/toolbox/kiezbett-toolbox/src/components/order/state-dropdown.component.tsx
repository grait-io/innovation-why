import {
    DeliveryStateTransition,
    Order,
    OrderDeliveryStateTechnicalName,
    OrderStateTechnicalName,
    OrderStateTransition,
    OrderStateType,
    TransactionStateTechnicalName,
    TransactionStateTransition,
} from '@/types/shopware.types';
import { DropdownMenuItem, DropdownMenuSeparator } from '../ui/dropdown-menu';

/**
 * Maps the current state to allowed transitions for a given state type.
 * https://developer.shopware.com/docs/concepts/commerce/checkout-concept/orders.html
 * @param stateType The type of state (orderState, transactionState, orderDeliveryState)
 * @param currentState The current state
 * @returns Array of valid target states
 */
export function getAllowedStateTransitions(
    stateType: OrderStateType,
    currentState: string
): (OrderStateTransition | TransactionStateTransition | DeliveryStateTransition)[] {
    // Define state transition mappings for each type
    const stateTransitions: Record<
        string,
        Record<string, (OrderStateTransition | TransactionStateTransition | DeliveryStateTransition)[]>
    > = {
        order: {
            [OrderStateTechnicalName.Open]: [OrderStateTransition.cancel, OrderStateTransition.process],
            [OrderStateTechnicalName.InProgress]: [OrderStateTransition.cancel, OrderStateTransition.complete],
            [OrderStateTechnicalName.Completed]: [OrderStateTransition.reopen],
            [OrderStateTechnicalName.Cancelled]: [OrderStateTransition.reopen],
        },
        payment: {
            [TransactionStateTechnicalName.Open]: [TransactionStateTransition.paid],
            [TransactionStateTechnicalName.Paid]: [
                TransactionStateTransition.cancel,
                TransactionStateTransition.refund,
                TransactionStateTransition.reopen,
            ],
        },
        delivery: {
            [OrderDeliveryStateTechnicalName.Open]: [DeliveryStateTransition.cancel, DeliveryStateTransition.shipment_ready],
            [OrderDeliveryStateTechnicalName.ShipmentReady]: [DeliveryStateTransition.shipped],
            [OrderDeliveryStateTechnicalName.Shipped]: [DeliveryStateTransition.reopen], // check if reopened is needed
        },
    };

    // console.log(`type: ${stateType} current ${currentState}`);

    // Return the allowed transitions for the given state type and current state
    return stateTransitions[stateType]?.[currentState] || [];
}

interface StateDropdownProps {
    order: Order; // Replace with your actual type for order
    stateType: OrderStateType; // Specifies which state type to handle
    onStateChange: (
        orderId: string,
        newState: OrderStateTransition | TransactionStateTransition | DeliveryStateTransition,
        stateType: OrderStateType
    ) => void; // Callback for state changes
}

const mapTargetState = (targetState: string): string => {
    const stringMapping: Record<string, string> = {
        nbtoolboxtransto: 'shipment_ready',
        nbtoolboxtransfrom: 'shipped',
    };

    return stringMapping[targetState] || targetState;
};

const StateDropdown: React.FC<StateDropdownProps> = ({ order, stateType, onStateChange }) => {
    let currentState = order.stateMachineState?.technicalName;
    let orderId = order.id;

    if (stateType === OrderStateType.delivery) {
        orderId = order.deliveries[0].id;
        currentState = order.deliveries[0].stateMachineState.technicalName;
    }
    if (stateType === OrderStateType.payment) {
        orderId = order.transactions[0].id;
        currentState = order.transactions[0].stateMachineState.technicalName;
    }

    const allowedTransitions = getAllowedStateTransitions(stateType, currentState);

    return (
        <div>
            <DropdownMenuSeparator />
            {allowedTransitions.length > 0 ? (
                allowedTransitions.map((targetState) => (
                    <DropdownMenuItem key={targetState} onClick={() => onStateChange(orderId, targetState, stateType)}>
                        {`${stateType}:${currentState} ➔ ${mapTargetState(targetState)}`}
                    </DropdownMenuItem>
                ))
            ) : (
                <DropdownMenuItem disabled>
                    <span>
                        {stateType}:{currentState}
                    </span>
                </DropdownMenuItem>
            )}
        </div>
    );
};

export default StateDropdown;
