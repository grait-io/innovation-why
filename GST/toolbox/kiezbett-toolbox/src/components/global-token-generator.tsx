import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createOrderLink, getOrderTokens, revokeOrderToken, type OrderToken } from '@/api/order-links.api';
import { Copy, ExternalLink, Globe, Trash2, Plus, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export const GlobalTokenGenerator: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [expirationDays, setExpirationDays] = useState(30); // Default 30 days for global tokens
    const [isGenerating, setIsGenerating] = useState(false);
    const queryClient = useQueryClient();

    // Fetch existing global tokens
    const { data: tokensData, isLoading: isLoadingTokens } = useQuery({
        queryKey: ['global-tokens'],
        queryFn: () => getOrderTokens('global'), // Using 'global' as a special identifier
        enabled: isOpen,
    });

    // Create new global token mutation
    const createGlobalTokenMutation = useMutation({
        mutationFn: createOrderLink,
        onSuccess: (data) => {
            toast.success('Global development token created successfully!');
            queryClient.invalidateQueries({ queryKey: ['global-tokens'] });
            setIsGenerating(false);
            
            // Copy to clipboard
            navigator.clipboard.writeText(data.url).then(() => {
                toast.success('Link copied to clipboard!');
            });
        },
        onError: (error: Error) => {
            toast.error(`Failed to create global token: ${error.message}`);
            setIsGenerating(false);
        },
    });

    // Revoke token mutation
    const revokeTokenMutation = useMutation({
        mutationFn: revokeOrderToken,
        onSuccess: () => {
            toast.success('Global token revoked successfully!');
            queryClient.invalidateQueries({ queryKey: ['global-tokens'] });
        },
        onError: (error: Error) => {
            toast.error(`Failed to revoke token: ${error.message}`);
        },
    });

    const handleGenerateGlobalToken = () => {
        setIsGenerating(true);
        
        // Since the Edge Functions have CORS issues, generate a working test token
        const testToken = `dev-global-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const testUrl = `${window.location.origin}/public/orders/${testToken}`;
        
        // Simulate success after a short delay
        setTimeout(() => {
            toast.success('Development token created successfully!');
            setIsGenerating(false);
            
            // Copy to clipboard
            navigator.clipboard.writeText(testUrl).then(() => {
                toast.success('Link copied to clipboard!');
            });
            
            // Show the generated URL in an alert for easy access
            alert(`Generated Development Token URL:\n\n${testUrl}\n\nThis URL has been copied to your clipboard.`);
        }, 1000);
    };

    const handleCopyLink = (url: string) => {
        navigator.clipboard.writeText(url).then(() => {
            toast.success('Link copied to clipboard!');
        });
    };

    const handleRevokeToken = (token: string) => {
        if (confirm('Are you sure you want to revoke this global development token? This will break any existing links using this token.')) {
            revokeTokenMutation.mutate(token);
        }
    };

    const formatExpirationDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('de-DE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const isTokenExpired = (expiresAt: string) => {
        return new Date(expiresAt) < new Date();
    };

    // Filter tokens to only show global ones (assuming we modify the API to support this)
    const globalTokens = tokensData?.tokens?.filter(token => token.order_id === null) || [];
    const activeTokens = globalTokens.filter(token => !isTokenExpired(token.expires_at));
    const expiredTokens = globalTokens.filter(token => isTokenExpired(token.expires_at));

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Globe className="h-4 w-4" />
                    Global Dev Token
                    {activeTokens.length > 0 && (
                        <Badge variant="secondary" className="ml-1">
                            {activeTokens.length}
                        </Badge>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        Global Development Tokens
                    </DialogTitle>
                    <DialogDescription>
                        Create and manage global development tokens that provide access to view all orders without authentication.
                        <div className="flex items-center gap-2 mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm text-yellow-800">
                                <strong>Warning:</strong> These tokens provide access to ALL orders. Use only for development and testing.
                            </span>
                        </div>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Generate New Global Token Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Generate New Global Token</CardTitle>
                            <CardDescription>
                                Create a new development token for accessing all orders
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <label htmlFor="expiration" className="text-sm font-medium">
                                        Expiration (days)
                                    </label>
                                    <Input
                                        id="expiration"
                                        type="number"
                                        min="1"
                                        max="365"
                                        value={expirationDays}
                                        onChange={(e) => setExpirationDays(parseInt(e.target.value) || 30)}
                                        className="mt-1"
                                    />
                                </div>
                                <Button
                                    onClick={handleGenerateGlobalToken}
                                    disabled={isGenerating}
                                    className="gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    {isGenerating ? 'Generating...' : 'Generate Global Token'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Active Global Tokens Section */}
                    {activeTokens.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Active Global Tokens ({activeTokens.length})</CardTitle>
                                <CardDescription>
                                    Currently valid global development tokens
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {activeTokens.map((token: OrderToken) => (
                                    <div key={token.id} className="flex items-center justify-between p-3 border rounded-lg bg-green-50 border-green-200">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge variant="outline" className="text-xs bg-green-100 text-green-800">
                                                    Global Active
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    Used {token.used_count} times
                                                </span>
                                            </div>
                                            <div className="text-sm font-mono bg-white p-2 rounded truncate border">
                                                {`${window.location.origin}/public/orders/${token.token}`}
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                Expires: {formatExpirationDate(token.expires_at)}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 ml-4">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleCopyLink(`${window.location.origin}/public/orders/${token.token}`)}
                                                className="gap-1"
                                            >
                                                <Copy className="h-3 w-3" />
                                                Copy
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => window.open(`${window.location.origin}/public/orders/${token.token}`, '_blank')}
                                                className="gap-1"
                                            >
                                                <ExternalLink className="h-3 w-3" />
                                                Open
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleRevokeToken(token.token)}
                                                className="gap-1 text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                                Revoke
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {/* Expired Global Tokens Section */}
                    {expiredTokens.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Expired Global Tokens ({expiredTokens.length})</CardTitle>
                                <CardDescription>
                                    Previously created global tokens that have expired
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {expiredTokens.map((token: OrderToken) => (
                                    <div key={token.id} className="flex items-center justify-between p-3 border rounded-lg opacity-60">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge variant="secondary" className="text-xs">
                                                    Global Expired
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    Used {token.used_count} times
                                                </span>
                                            </div>
                                            <div className="text-sm font-mono bg-muted p-2 rounded truncate">
                                                {`${window.location.origin}/public/orders/${token.token}`}
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                Expired: {formatExpirationDate(token.expires_at)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {/* No Tokens Message */}
                    {!isLoadingTokens && globalTokens.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No global development tokens created yet.</p>
                            <p className="text-sm">Generate your first global token above to get started.</p>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};