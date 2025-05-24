// Modal.jsx
import { Order } from '@/types/shopware.types';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Downloads } from './order/downloads';
import { formatDate } from '@/lib/utils';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order;
    text: string;
}
interface OrderDetailsProps {
    order: Order;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
    return (
        <div className="container mx-auto my-8 bg-white rounded-md text-sm">
            {/* Order Details */}
            <h3 className="text-base font-bold mb-4">Order Details</h3>
            <table className="table-auto w-full text-left border-collapse text-sm">
                <thead className="bg-gray-800 text-white font-light">
                    <tr>
                        <th className="px-4 py-2">Field</th>
                        <th className="px-4 py-2">Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border px-4 py-2 font-semibold">Order Number</td>
                        <td className="border px-4 py-2">{order.orderNumber}</td>
                    </tr>
                    <tr>
                        <td className="border px-4 py-2 font-semibold">Order Date</td>
                        <td className="border px-4 py-2">{formatDate(order.orderDate)}</td>
                    </tr>
                    <tr>
                        <td className="border px-4 py-2 font-semibold">Status</td>
                        <td className="border px-4 py-2">{order.stateMachineState.translated.name}</td>
                    </tr>
                    <tr>
                        <td className="border px-4 py-2 font-semibold">Total Amount</td>
                        <td className="border px-4 py-2">
                            {order.amountTotal}€ ({order.taxStatus})
                        </td>
                    </tr>
                    <tr>
                        <td className="border px-4 py-2 font-semibold">Shipping Total</td>
                        <td className="border px-4 py-2">{order.shippingTotal}€</td>
                    </tr>
                </tbody>
            </table>

            {/* Customer Details */}
            <h3 className="text-base font-bold mt-8 mb-4">Customer Details</h3>
            <table className="table-auto w-full text-left border-collapse">
                <thead className="bg-gray-800 text-white font-light">
                    <tr>
                        <th className="px-4 py-2">Field</th>
                        <th className="px-4 py-2">Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border px-4 py-2 font-semibold">Name</td>
                        <td className="border px-4 py-2">
                            {order.orderCustomer.firstName} {order.orderCustomer.lastName}
                        </td>
                    </tr>
                    <tr>
                        <td className="border px-4 py-2 font-semibold">Email</td>
                        <td className="border px-4 py-2">{order.orderCustomer.email}</td>
                    </tr>
                    <tr>
                        <td className="border px-4 py-2 font-semibold">Customer Number</td>
                        <td className="border px-4 py-2">{order.orderCustomer.customerNumber}</td>
                    </tr>
                    <tr>
                        <td className="border px-4 py-2 font-semibold">Phone</td>
                        <td className="border px-4 py-2">{order.deliveries[0].shippingOrderAddress.phoneNumber}</td>
                    </tr>
                </tbody>
            </table>

            {/* Line Items */}
            <h3 className="text-base font-bold mt-8 mb-4">Line Items</h3>
            <table className="table-auto w-full text-left border-collapse text-sm">
                <thead className="bg-gray-800 text-white font-light">
                    <tr>
                        <th className="px-4 py-2">Item</th>
                        <th className="px-4 py-2">Quantity</th>
                        <th className="px-4 py-2 whitespace-nowrap">Unit Price</th>
                        <th className="px-4 py-2 whitespace-nowrap">Total Price</th>
                    </tr>
                </thead>
                <tbody>
                    {order.lineItems.map((item, index) => (
                        <tr key={index}>
                            <td className="border px-4 py-2">{item.label}</td>
                            <td className="border px-4 py-2">{item.quantity}</td>
                            <td className="border px-4 py-2">{item.unitPrice}€</td>
                            <td className="border px-4 py-2">{item.totalPrice}€</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Delivery Details */}
            <h3 className="text-base font-bold mt-8 mb-4">Delivery Details</h3>
            <table className="table-auto w-full text-left border-collapse">
                <thead className="bg-gray-800 text-white font-light">
                    <tr>
                        <th className="px-4 py-2">Field</th>
                        <th className="px-4 py-2">Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border px-4 py-2 font-semibold">Shipping Address</td>
                        <td className="border px-4 py-2">
                            {order.deliveries[0].shippingOrderAddress.street}, {order.deliveries[0].shippingOrderAddress.zipcode}{' '}
                            {order.deliveries[0].shippingOrderAddress.city}
                        </td>
                    </tr>
                    <tr>
                        <td className="border px-4 py-2 font-semibold">Shipping Method</td>
                        <td className="border px-4 py-2">{order.deliveries[0].shippingMethod.translated.name}</td>
                    </tr>
                    <tr>
                        <td className="border px-4 py-2 font-semibold">Delivery Time</td>
                        <td className="border px-4 py-2">{order.deliveries[0].shippingMethod.deliveryTime.translated.name}</td>
                    </tr>
                </tbody>
            </table>

            <Downloads orderId="123" />
        </div>
    );
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, order, text }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            {/* <DialogTrigger asChild>
                <Button variant="outline">Show Comment</Button>
            </DialogTrigger> */}
            <DialogContent className="fixed left-[50%] top-[50%] z-50 w-full max-w-[800px] max-h-[90%] translate-x-[-50%] translate-y-[-50%] overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
                <DialogHeader>
                    <DialogTitle>{order ? <h2>Order: {order.orderNumber}</h2> : <h2>-</h2>}</DialogTitle>
                    {/* <DialogDescription>
                        Here is the comment left by the customer.
                    </DialogDescription> */}
                </DialogHeader>
                {order ? (
                    <OrderDetails order={order} />
                ) : (
                    <div className="py-4">
                        <p>{text}</p>
                    </div>
                )}
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default Modal;
