import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PublicLayout } from '@/components/public-layout.component';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { getOrderByToken, type PublicOrderResponse } from '@/api/order-links.api';
import { Order } from '@/types/shopware.types';
import { formatDate } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile.hook';
import { Package, MapPin, Calendar, User, Phone, Mail, MessageSquare, Clock, Settings } from 'lucide-react';
import { isDemoToken, extractOrderIdFromDemoToken, extractStatusFromDemoToken, getMockOrderDataWithStatus, type MockOrderItem } from '@/services/mock-order.service';

const PublicOrderPage: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const [orderData, setOrderData] = useState<PublicOrderResponse | null>(null);
    const [currentStatus, setCurrentStatus] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const isMobile = useIsMobile();

    // Available statuses for producer (production stages only)
    const producerStatuses = [
        'In Produktion',
        'Versandbereit',
        'Im Versand'
    ];

    // Function to get next status and button text
    const getNextStatusInfo = (currentStatus: string) => {
        switch (currentStatus) {
            case 'Bezahlt':
                return { nextStatus: 'In Produktion', buttonText: 'Starte Produktion' };
            case 'In Produktion':
                return { nextStatus: 'Versandbereit', buttonText: 'Produktion abgeschlossen' };
            case 'Versandbereit':
                return { nextStatus: 'Im Versand', buttonText: 'Versendet' };
            default:
                return null;
        }
    };

    // Function to handle status progression
    const handleStatusProgression = () => {
        if (!orderData || !isDemoToken(token!)) return;
        
        const nextInfo = getNextStatusInfo(currentStatus);
        if (!nextInfo) return;
        
        setCurrentStatus(nextInfo.nextStatus);
        
        // Update the order data with new status
        const updatedOrderData = {
            ...orderData,
            order: {
                ...orderData.order,
                stateMachineState: { name: nextInfo.nextStatus }
            }
        };
        setOrderData(updatedOrderData);
    };

    useEffect(() => {
        const fetchOrder = async () => {
            if (!token) {
                setError('Invalid token');
                setLoading(false);
                return;
            }

            // Check if this is a demo token and show mock data
            if (isDemoToken(token)) {
                // Simulate loading delay
                setTimeout(() => {
                    const orderId = extractOrderIdFromDemoToken(token) || 'DEMO-12345';
                    const status = extractStatusFromDemoToken(token);
                    const mockOrder = getMockOrderDataWithStatus(orderId, status);
                    
                    // Set initial status from token
                    setCurrentStatus(status);
                    
                    const mockData: PublicOrderResponse = {
                        success: true,
                        order: {
                            id: mockOrder.id,
                            orderNumber: mockOrder.orderNumber,
                            createdAt: mockOrder.orderDate,
                            stateMachineState: { name: mockOrder.status },
                            deliveries: [{
                                stateMachineState: { name: 'Versandbereit' },
                                shippingOrderAddress: {
                                    firstName: mockOrder.shippingAddress.firstName,
                                    lastName: mockOrder.shippingAddress.lastName,
                                    city: mockOrder.shippingAddress.city,
                                    street: mockOrder.shippingAddress.street,
                                    zipcode: mockOrder.shippingAddress.zipCode,
                                    country: mockOrder.shippingAddress.country,
                                    phoneNumber: '+49 30 12345678'
                                },
                                shippingMethod: {
                                    name: 'Kiezbett Express Lieferung'
                                }
                            }],
                            transactions: [{
                                stateMachineState: { name: 'Bezahlt' }
                            }],
                            lineItems: mockOrder.items.map((item: MockOrderItem) => ({
                                id: item.id,
                                quantity: item.quantity,
                                label: item.name,
                                name: item.name,
                                payload: {
                                    options: [
                                        { group: 'Preis', option: `${item.unitPrice.toFixed(2)} €` },
                                        { group: 'Gesamt', option: `${item.totalPrice.toFixed(2)} €` }
                                    ]
                                }
                            })),
                            orderCustomer: { email: mockOrder.customerEmail },
                            customerComment: 'Demo-Bestellung für Kundenpräsentation. Lieferung zwischen 9-17 Uhr bevorzugt.'
                        } as any,
                        token_info: {
                            created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
                            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
                            used_count: Math.floor(Math.random() * 10) + 1
                        }
                    };
                    setOrderData(mockData);
                    setLoading(false);
                }, 1000);
                return;
            }

            try {
                const data = await getOrderByToken(token);
                setOrderData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load order');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [token]);

    if (loading) {
        return (
            <PublicLayout>
                <div className="flex items-center justify-center min-h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading order details...</p>
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

    if (!orderData?.order) {
        return (
            <PublicLayout>
                <Card className="max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle>Order Not Found</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600">The requested order could not be found.</p>
                    </CardContent>
                </Card>
            </PublicLayout>
        );
    }

    const order: Order = orderData.order;
    const delivery = order.deliveries?.[0];
    const transaction = order.transactions?.[0];

    return (
        <PublicLayout>
            <div className="space-y-6">
                {/* Order Header */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <CardTitle className="text-2xl">Order #{order.orderNumber}</CardTitle>
                                <CardDescription className="flex items-center gap-2 mt-2">
                                    <Calendar className="h-4 w-4" />
                                    {formatDate(order.createdAt)}
                                </CardDescription>
                            </div>
                            <div className="flex flex-col sm:items-end gap-2">
                                <Badge variant="outline" className="w-fit">
                                    {order.stateMachineState.name}
                                </Badge>
                                {orderData.token_info && (
                                    <div className="text-xs text-gray-500 flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        Viewed {orderData.token_info.used_count} times
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Production Status Updater for Demo Tokens */}
                {isDemoToken(token!) && (
                    <Card className="bg-green-50 border-green-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-green-800">
                                <Settings className="h-5 w-5" />
                                Produktionsstatus
                            </CardTitle>
                            <CardDescription className="text-green-600">
                                Aktueller Status: <strong>{currentStatus}</strong>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {getNextStatusInfo(currentStatus) ? (
                                <Button
                                    onClick={handleStatusProgression}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                                    size="lg"
                                >
                                    {getNextStatusInfo(currentStatus)?.buttonText}
                                </Button>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-green-800 font-medium">✅ Bestellung vollständig abgearbeitet</p>
                                    <p className="text-green-600 text-sm mt-1">Status: {currentStatus}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
                    {/* Delivery Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Delivery Address
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {delivery?.shippingOrderAddress ? (
                                <>
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-gray-500" />
                                        <span className="font-medium">
                                            {delivery.shippingOrderAddress.firstName} {delivery.shippingOrderAddress.lastName}
                                        </span>
                                    </div>
                                    <div className="pl-6 space-y-1 text-gray-700">
                                        <p>{delivery.shippingOrderAddress.street}</p>
                                        <p className="font-medium">
                                            {delivery.shippingOrderAddress.zipcode} {delivery.shippingOrderAddress.city}
                                        </p>
                                        <p>{delivery.shippingOrderAddress.country}</p>
                                    </div>
                                    <Separator />
                                    <div className="space-y-2">
                                        {order.orderCustomer?.email && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Mail className="h-4 w-4 text-gray-500" />
                                                <span>{order.orderCustomer.email}</span>
                                            </div>
                                        )}
                                        {delivery.shippingOrderAddress.phoneNumber && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Phone className="h-4 w-4 text-gray-500" />
                                                <span>{delivery.shippingOrderAddress.phoneNumber}</span>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <p className="text-gray-500">No delivery address available</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Order Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Order Status:</span>
                                    <Badge variant="outline">{order.stateMachineState.name}</Badge>
                                </div>
                                {delivery && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">Delivery Status:</span>
                                        <Badge variant="outline">{delivery.stateMachineState.name}</Badge>
                                    </div>
                                )}
                                {transaction && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">Payment Status:</span>
                                        <Badge variant="outline">{transaction.stateMachineState?.name || 'Unknown'}</Badge>
                                    </div>
                                )}
                            </div>
                            {delivery?.shippingMethod && (
                                <>
                                    <Separator />
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">Shipping Method:</span>
                                        <span className="text-sm">{delivery.shippingMethod.name}</span>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Order Items */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Order Items ({order.lineItems?.length || 0})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {order.lineItems && order.lineItems.length > 0 ? (
                            <div className="space-y-4">
                                {order.lineItems.map((item, index) => (
                                    <div key={item.id || index} className="flex justify-between items-start p-4 border rounded-lg">
                                        <div className="flex-1">
                                            <h4 className="font-medium">{item.label || item.name}</h4>
                                            {item.payload?.options && item.payload.options.length > 0 && (
                                                <div className="mt-2 space-y-1">
                                                    {item.payload.options.map((option, optIndex) => (
                                                        <div key={optIndex} className="text-sm text-gray-600">
                                                            <span className="font-medium">{option.group}:</span> {option.option}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-right ml-4">
                                            <div className="font-medium">Qty: {item.quantity}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No items found for this order.</p>
                        )}
                    </CardContent>
                </Card>

                {/* Customer Comments */}
                {order.customerComment && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="h-5 w-5" />
                                Special Instructions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-700">{order.customerComment}</p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </PublicLayout>
    );
};

export default PublicOrderPage;