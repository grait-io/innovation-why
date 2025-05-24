import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, ExternalLink, Package, Settings } from 'lucide-react';
import { toast } from 'sonner';

// Available order statuses for demo
const ORDER_STATUSES = [
    'Offen',
    'Bezahlt',
    'In Produktion',
    'Versandbereit',
    'Im Versand',
    'Abgeschlossen',
    'Storniert'
] as const;

type OrderStatus = typeof ORDER_STATUSES[number];

export const SingleOrderTokenGenerator: React.FC = () => {
    const [orderId, setOrderId] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('Bezahlt');
    const [generatedToken, setGeneratedToken] = useState<string | null>(null);
    const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const generateMockToken = async () => {
        if (!orderId.trim()) {
            toast.error('Please enter an Order ID');
            return;
        }

        setIsGenerating(true);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Generate mock token with status
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(2, 10);
        const statusCode = selectedStatus.toLowerCase().replace(/\s+/g, '-');
        const mockToken = `demo-order-${orderId}-${statusCode}-${timestamp}-${randomSuffix}`;
        const mockUrl = `https://kiezbett.aicd.me/public/order/${mockToken}`;

        setGeneratedToken(mockToken);
        setGeneratedUrl(mockUrl);
        setIsGenerating(false);

        toast.success('Demo token generated successfully!');
    };

    const copyToClipboard = async (text: string, type: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success(`${type} copied to clipboard!`);
        } catch (err) {
            toast.error('Failed to copy to clipboard');
        }
    };

    const openInNewTab = () => {
        if (generatedUrl) {
            window.open(generatedUrl, '_blank');
        }
    };

    const resetGenerator = () => {
        setOrderId('');
        setSelectedStatus('Bezahlt');
        setGeneratedToken(null);
        setGeneratedUrl(null);
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Producer Order Link Generator
                </CardTitle>
                <CardDescription>
                    Generate a deep link for producers to track and update order production status.
                    Orders start with "Bezahlt" status and producers can update through production stages.
                    This creates a demo token for testing purposes.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="orderId" className="text-sm font-medium">
                            Order ID
                        </label>
                        <Input
                            id="orderId"
                            type="text"
                            placeholder="Enter order ID (e.g., ORD-12345)"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            disabled={isGenerating}
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label htmlFor="orderStatus" className="text-sm font-medium">
                            Order Status
                        </label>
                        <select
                            id="orderStatus"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                            disabled={isGenerating}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {ORDER_STATUSES.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <Button
                    onClick={generateMockToken}
                    disabled={isGenerating || !orderId.trim()}
                    className="w-full"
                >
                    {isGenerating ? 'Generating Producer Link...' : 'Generate Producer Link'}
                </Button>

                {generatedToken && generatedUrl && (
                    <div className="space-y-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center justify-between">
                            <h4 className="font-medium text-green-800">Producer Link Generated!</h4>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={resetGenerator}
                            >
                                Generate New
                            </Button>
                        </div>
                        
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-medium text-green-700 uppercase tracking-wide">
                                    Token
                                </label>
                                <div className="flex items-center gap-2 mt-1">
                                    <code className="flex-1 p-2 bg-white border rounded text-xs font-mono break-all">
                                        {generatedToken}
                                    </code>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => copyToClipboard(generatedToken, 'Token')}
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-medium text-green-700 uppercase tracking-wide">
                                    Deep Link URL
                                </label>
                                <div className="flex items-center gap-2 mt-1">
                                    <code className="flex-1 p-2 bg-white border rounded text-xs font-mono break-all">
                                        {generatedUrl}
                                    </code>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => copyToClipboard(generatedUrl, 'URL')}
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={openInNewTab}
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="text-xs text-green-600 bg-green-100 p-2 rounded">
                            <strong>Note:</strong> This is a producer link for order tracking.
                            Producers can update status through: In Produktion → Versandbereit → Im Versand.
                        </div>
                    </div>
                )}

                <div className="text-xs text-gray-500 space-y-1">
                    <p><strong>Demo Features:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Mobile-friendly order overview</li>
                        <li>Customer information display</li>
                        <li>Order items and status</li>
                        <li>Professional presentation</li>
                        <li>No login required for customers</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
};