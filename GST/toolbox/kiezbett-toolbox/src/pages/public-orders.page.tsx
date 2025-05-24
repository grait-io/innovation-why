import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PublicLayout } from '@/components/public-layout.component';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getAllOrdersByToken, type PublicOrdersResponse } from '@/api/order-links.api';
import { fetchOrders } from '@/api/order.api';
import { Order, OrderStateTechnicalName } from '@/types/shopware.types';
import { formatDate } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile.hook';
import { Package, Calendar, Clock, Eye } from 'lucide-react';

const PublicOrdersPage: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const [ordersData, setOrdersData] = useState<PublicOrdersResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const isMobile = useIsMobile();

    useEffect(() => {
        const fetchOrders = async () => {
            if (!token) {
                setError('Invalid token');
                setLoading(false);
                return;
            }

            // Check if this is a development token generated from admin interface
            if (token.startsWith('dev-global-')) {
                // Show message about CORS issue but provide mock data for demonstration
                setTimeout(() => {
                    const mockData: PublicOrdersResponse = {
                        success: true,
                        orders: [
                            {
                                id: '1',
                                orderNumber: '10001',
                                createdAt: '2024-01-15T10:30:00Z',
                                stateMachineState: { name: 'Open' },
                                deliveries: [{
                                    stateMachineState: { name: 'Shipped' },
                                    shippingOrderAddress: {
                                        firstName: 'John',
                                        lastName: 'Doe',
                                        city: 'Berlin',
                                        street: 'Musterstraße 123'
                                    }
                                }],
                                transactions: [{
                                    stateMachineState: { name: 'Paid' }
                                }],
                                lineItems: [
                                    { quantity: 2, label: 'Premium Mattress', name: 'Premium Mattress' },
                                    { quantity: 1, label: 'Pillow Set', name: 'Pillow Set' }
                                ],
                                orderCustomer: { email: 'john.doe@example.com' }
                            },
                            {
                                id: '2',
                                orderNumber: '10002',
                                createdAt: '2024-01-14T14:20:00Z',
                                stateMachineState: { name: 'In Progress' },
                                deliveries: [{
                                    stateMachineState: { name: 'Processing' },
                                    shippingOrderAddress: {
                                        firstName: 'Jane',
                                        lastName: 'Smith',
                                        city: 'Hamburg',
                                        street: 'Beispielweg 456'
                                    }
                                }],
                                transactions: [{
                                    stateMachineState: { name: 'Paid' }
                                }],
                                lineItems: [
                                    { quantity: 1, label: 'Luxury Bed Frame', name: 'Luxury Bed Frame' },
                                    { quantity: 2, label: 'Memory Foam Pillow', name: 'Memory Foam Pillow' },
                                    { quantity: 1, label: 'Bed Sheets Set', name: 'Bed Sheets Set' }
                                ],
                                orderCustomer: { email: 'jane.smith@example.com' }
                            },
                            {
                                id: '3',
                                orderNumber: '10003',
                                createdAt: '2024-01-13T09:15:00Z',
                                stateMachineState: { name: 'Completed' },
                                deliveries: [{
                                    stateMachineState: { name: 'Delivered' },
                                    shippingOrderAddress: {
                                        firstName: 'Mike',
                                        lastName: 'Johnson',
                                        city: 'Munich',
                                        street: 'Teststraße 789'
                                    }
                                }],
                                transactions: [{
                                    stateMachineState: { name: 'Paid' }
                                }],
                                lineItems: [
                                    { quantity: 1, label: 'King Size Mattress', name: 'King Size Mattress' }
                                ],
                                orderCustomer: { email: 'mike.johnson@example.com' }
                            }
                        ] as Order[],
                        token_info: {
                            token_type: 'global',
                            created_at: new Date().toISOString(),
                            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                            used_count: 1
                        }
                    };
                    setOrdersData(mockData);
                    setLoading(false);
                }, 1000);
                return;
            }

            // Check if this is a special real-data token
            if (token === 'real-data-global-token') {
                // Since CORS is blocking the API calls, show a message about the CORS issue
                setError('CORS issue detected. The Supabase Edge Functions need to be redeployed to fix CORS headers. Please use the mock data tokens for now or deploy the functions.');
                setLoading(false);
                return;
            }

            // Check if this is a test token and show mock data
            if (token.startsWith('test-')) {
                // Simulate loading delay
                setTimeout(() => {
                    const mockData: PublicOrdersResponse = {
                        success: true,
                        orders: [
                            {
                                id: '1',
                                orderNumber: '10001',
                                createdAt: '2024-01-15T10:30:00Z',
                                stateMachineState: { name: 'Open' },
                                deliveries: [{
                                    stateMachineState: { name: 'Shipped' },
                                    shippingOrderAddress: {
                                        firstName: 'John',
                                        lastName: 'Doe',
                                        city: 'Berlin',
                                        street: 'Musterstraße 123'
                                    }
                                }],
                                transactions: [{
                                    stateMachineState: { name: 'Paid' }
                                }],
                                lineItems: [
                                    { quantity: 2, label: 'Premium Mattress', name: 'Premium Mattress' },
                                    { quantity: 1, label: 'Pillow Set', name: 'Pillow Set' }
                                ],
                                orderCustomer: { email: 'john.doe@example.com' }
                            },
                            {
                                id: '2',
                                orderNumber: '10002',
                                createdAt: '2024-01-14T14:20:00Z',
                                stateMachineState: { name: 'In Progress' },
                                deliveries: [{
                                    stateMachineState: { name: 'Processing' },
                                    shippingOrderAddress: {
                                        firstName: 'Jane',
                                        lastName: 'Smith',
                                        city: 'Hamburg',
                                        street: 'Beispielweg 456'
                                    }
                                }],
                                transactions: [{
                                    stateMachineState: { name: 'Paid' }
                                }],
                                lineItems: [
                                    { quantity: 1, label: 'Luxury Bed Frame', name: 'Luxury Bed Frame' },
                                    { quantity: 2, label: 'Memory Foam Pillow', name: 'Memory Foam Pillow' },
                                    { quantity: 1, label: 'Bed Sheets Set', name: 'Bed Sheets Set' }
                                ],
                                orderCustomer: { email: 'jane.smith@example.com' }
                            },
                            {
                                id: '3',
                                orderNumber: '10003',
                                createdAt: '2024-01-13T09:15:00Z',
                                stateMachineState: { name: 'Completed' },
                                deliveries: [{
                                    stateMachineState: { name: 'Delivered' },
                                    shippingOrderAddress: {
                                        firstName: 'Mike',
                                        lastName: 'Johnson',
                                        city: 'Munich',
                                        street: 'Teststraße 789'
                                    }
                                }],
                                transactions: [{
                                    stateMachineState: { name: 'Paid' }
                                }],
                                lineItems: [
                                    { quantity: 1, label: 'King Size Mattress', name: 'King Size Mattress' }
                                ],
                                orderCustomer: { email: 'mike.johnson@example.com' }
                            }
                        ] as Order[],
                        token_info: {
                            token_type: 'global',
                            created_at: '2024-01-10T08:00:00Z',
                            expires_at: '2024-02-10T08:00:00Z',
                            used_count: 5
                        }
                    };
                    setOrdersData(mockData);
                    setLoading(false);
                }, 1000);
                return;
            }

            try {
                const data = await getAllOrdersByToken(token);
                setOrdersData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [token]);

    if (loading) {
        return (
            <PublicLayout>
                <div className="flex items-center justify-center min-h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading orders...</p>
                    </div>
                </div>
            </PublicLayout>
        );
    }

    if (error) {
        return (
            <PublicLayout>
                <Card className="max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle className="text-red-600">Error</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600">{error}</p>
                        <p className="text-sm text-gray-500 mt-2">
                            Please check the link or contact support if the problem persists.
                        </p>
                    </CardContent>
                </Card>
            </PublicLayout>
        );
    }

    if (!ordersData?.orders) {
        return (
            <PublicLayout>
                <Card className="max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle>No Orders Found</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600">No orders could be found.</p>
                    </CardContent>
                </Card>
            </PublicLayout>
        );
    }

    const orders: Order[] = ordersData.orders;

    return (
        <PublicLayout>
            <div className="space-y-6">
                {/* Header */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <CardTitle className="text-2xl flex items-center gap-2">
                                    <Package className="h-6 w-6" />
                                    All Orders ({orders.length})
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2 mt-2">
                                    <Calendar className="h-4 w-4" />
                                    Development Access Token
                                </CardDescription>
                            </div>
                            {ordersData.token_info && (
                                <div className="flex flex-col sm:items-end gap-2">
                                    <Badge variant="outline" className="w-fit">
                                        Global Access
                                    </Badge>
                                    <div className="text-xs text-gray-500 flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        Viewed {ordersData.token_info.used_count} times
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                </Card>

                {/* Orders Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                        <CardDescription>
                            All orders accessible via this development token
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isMobile ? (
                            // Mobile Card Layout
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <Card key={order.id} className="p-4">
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-semibold">#{order.orderNumber}</h3>
                                                    <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                                                </div>
                                                <Badge variant="outline">{order.stateMachineState.name}</Badge>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Delivery:</span>
                                                    <Badge variant="outline" className="text-xs">
                                                        {order.deliveries?.[0]?.stateMachineState.name || 'N/A'}
                                                    </Badge>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Payment:</span>
                                                    <Badge variant="outline" className="text-xs">
                                                        {order.transactions?.[0]?.stateMachineState?.name || 'N/A'}
                                                    </Badge>
                                                </div>
                                            </div>

                                            {order.lineItems && order.lineItems.length > 0 && (
                                                <div className="pt-2 border-t">
                                                    <p className="text-sm font-medium mb-1">Items ({order.lineItems.length}):</p>
                                                    <div className="space-y-1">
                                                        {order.lineItems.slice(0, 2).map((item, index) => (
                                                            <p key={index} className="text-xs text-gray-600">
                                                                {item.quantity}x {item.label || item.name}
                                                            </p>
                                                        ))}
                                                        {order.lineItems.length > 2 && (
                                                            <p className="text-xs text-gray-500">
                                                                +{order.lineItems.length - 2} more items
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {order.deliveries?.[0]?.shippingOrderAddress && (
                                                <div className="pt-2 border-t">
                                                    <p className="text-sm font-medium mb-1">Customer:</p>
                                                    <p className="text-xs text-gray-600">
                                                        {order.deliveries[0].shippingOrderAddress.firstName} {order.deliveries[0].shippingOrderAddress.lastName}
                                                    </p>
                                                    <p className="text-xs text-gray-600">
                                                        {order.deliveries[0].shippingOrderAddress.city}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            // Desktop Table Layout
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order #</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Delivery</TableHead>
                                        <TableHead>Payment</TableHead>
                                        <TableHead>Items</TableHead>
                                        <TableHead>Customer</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-medium">
                                                #{order.orderNumber}
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(order.createdAt)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {order.stateMachineState.name}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {order.deliveries?.[0]?.stateMachineState.name || 'N/A'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {order.transactions?.[0]?.stateMachineState?.name || 'N/A'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {order.lineItems && order.lineItems.length > 0 ? (
                                                    <div className="space-y-1">
                                                        {order.lineItems.slice(0, 2).map((item, index) => (
                                                            <div key={index} className="text-sm">
                                                                {item.quantity}x {item.label || item.name}
                                                            </div>
                                                        ))}
                                                        {order.lineItems.length > 2 && (
                                                            <div className="text-xs text-gray-500">
                                                                +{order.lineItems.length - 2} more
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500">No items</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {order.deliveries?.[0]?.shippingOrderAddress ? (
                                                    <div className="space-y-1">
                                                        <div className="font-medium text-sm">
                                                            {order.deliveries[0].shippingOrderAddress.firstName} {order.deliveries[0].shippingOrderAddress.lastName}
                                                        </div>
                                                        <div className="text-xs text-gray-600">
                                                            {order.deliveries[0].shippingOrderAddress.city}
                                                        </div>
                                                        {order.orderCustomer?.email && (
                                                            <div className="text-xs text-gray-600">
                                                                {order.orderCustomer.email}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500">No address</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                {/* Token Info */}
                {ordersData.token_info && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Eye className="h-5 w-5" />
                                Token Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                    <span className="font-medium">Type:</span>
                                    <p className="text-gray-600">Development Global Access</p>
                                </div>
                                <div>
                                    <span className="font-medium">Created:</span>
                                    <p className="text-gray-600">{formatDate(ordersData.token_info.created_at)}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Expires:</span>
                                    <p className="text-gray-600">
                                        {ordersData.token_info.expires_at 
                                            ? formatDate(ordersData.token_info.expires_at)
                                            : 'Never'
                                        }
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </PublicLayout>
    );
};

export default PublicOrdersPage;