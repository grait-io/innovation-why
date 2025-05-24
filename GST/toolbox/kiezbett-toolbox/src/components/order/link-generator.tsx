import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createOrderLink, getOrderTokens, revokeOrderToken, type OrderToken } from '@/api/order-links.api';
import { Copy, ExternalLink, Link, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface LinkGeneratorProps {
    orderId: string;
    orderNumber: string;
}

export const LinkGenerator: React.FC<LinkGeneratorProps> = ({ orderId, orderNumber }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [expirationDays, setExpirationDays] = useState(7);
    const [isGenerating, setIsGenerating] = useState(false);
    const queryClient = useQueryClient();

    // Fetch existing tokens for this order
    const { data: tokensData, isLoading: isLoadingTokens } = useQuery({
        queryKey: ['order-tokens', orderId],
        queryFn: () => getOrderTokens(orderId),
        enabled: isOpen,
    });

    // Create new token mutation
    const createLinkMutation = useMutation({
        mutationFn: createOrderLink,
        onSuccess: (data) => {
            toast.success('Deep link created successfully!');
            queryClient.invalidateQueries({ queryKey: ['order-tokens', orderId] });
            setIsGenerating(false);
            
            // Copy to clipboard
            navigator.clipboard.writeText(data.url).then(() => {
                toast.success('Link copied to clipboard!');
            });
        },
        onError: (error: Error) => {
            toast.error(`Failed to create link: ${error.message}`);
            setIsGenerating(false);
        },
    });

    // Revoke token mutation
    const revokeTokenMutation = useMutation({
        mutationFn: revokeOrderToken,
        onSuccess: () => {
            toast.success('Token revoked successfully!');
            queryClient.invalidateQueries({ queryKey: ['order-tokens', orderId] });
        },
        onError: (error: Error) => {
            toast.error(`Failed to revoke token: ${error.message}`);
        },
    });

    const handleGenerateLink = () => {
        setIsGenerating(true);
        createLinkMutation.mutate({
            orderId,
            expirationDays,
            createdBy: 'admin', // You might want to get this from auth context
        });
    };

    const handleCopyLink = (url: string) => {
        navigator.clipboard.writeText(url).then(() => {
            toast.success('Link copied to clipboard!');
        });
    };

    const handleRevokeToken = (token: string) => {
        if (confirm('Are you sure you want to revoke this token? This action cannot be undone.')) {
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

    const activeTokens = tokensData?.tokens?.filter(token => !isTokenExpired(token.expires_at)) || [];
    const expiredTokens = tokensData?.tokens?.filter(token => isTokenExpired(token.expires_at)) || [];

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Link className="h-4 w-4" />
                    Links
                    {activeTokens.length > 0 && (
                        <Badge variant="secondary" className="ml-1">
                            {activeTokens.length}
                        </Badge>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Deep Links for Order #{orderNumber}</DialogTitle>
                    <DialogDescription>
                        Create and manage shareable links for this order. These links allow external access without authentication.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Generate New Link Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Generate New Link</CardTitle>
                            <CardDescription>
                                Create a new shareable link for this order
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
                                        onChange={(e) => setExpirationDays(parseInt(e.target.value) || 7)}
                                        className="mt-1"
                                    />
                                </div>
                                <Button
                                    onClick={handleGenerateLink}
                                    disabled={isGenerating}
                                    className="gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    {isGenerating ? 'Generating...' : 'Generate Link'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Active Links Section */}
                    {activeTokens.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Active Links ({activeTokens.length})</CardTitle>
                                <CardDescription>
                                    Currently valid links for this order
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {activeTokens.map((token: OrderToken) => (
                                    <div key={token.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge variant="outline" className="text-xs">
                                                    Active
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    Used {token.used_count} times
                                                </span>
                                            </div>
                                            <div className="text-sm font-mono bg-muted p-2 rounded truncate">
                                                {`${window.location.origin}/public/order/${token.token}`}
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                Expires: {formatExpirationDate(token.expires_at)}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 ml-4">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleCopyLink(`${window.location.origin}/public/order/${token.token}`)}
                                                className="gap-1"
                                            >
                                                <Copy className="h-3 w-3" />
                                                Copy
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => window.open(`${window.location.origin}/public/order/${token.token}`, '_blank')}
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

                    {/* Expired Links Section */}
                    {expiredTokens.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Expired Links ({expiredTokens.length})</CardTitle>
                                <CardDescription>
                                    Previously created links that have expired
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {expiredTokens.map((token: OrderToken) => (
                                    <div key={token.id} className="flex items-center justify-between p-3 border rounded-lg opacity-60">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge variant="secondary" className="text-xs">
                                                    Expired
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    Used {token.used_count} times
                                                </span>
                                            </div>
                                            <div className="text-sm font-mono bg-muted p-2 rounded truncate">
                                                {`${window.location.origin}/public/order/${token.token}`}
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

                    {/* No Links Message */}
                    {!isLoadingTokens && (!tokensData?.tokens || tokensData.tokens.length === 0) && (
                        <div className="text-center py-8 text-muted-foreground">
                            <Link className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No links created for this order yet.</p>
                            <p className="text-sm">Generate your first link above to get started.</p>
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