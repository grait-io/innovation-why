import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GlobalTokenGenerator } from '@/components/global-token-generator';
import { SingleOrderTokenGenerator } from '@/components/single-order-token-generator';
import { Settings as SettingsIcon, Shield, Globe } from 'lucide-react';

const Settings: React.FC = () => {
    return (
        <div className="settings-page space-y-6">
            <div className="flex items-center gap-3">
                <SettingsIcon className="h-6 w-6" />
                <h1 className="text-2xl font-bold">Settings</h1>
            </div>

            {/* Development Tools Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        Development Tools
                    </CardTitle>
                    <CardDescription>
                        Tools for development and testing purposes
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                            <h3 className="font-medium">Global Development Tokens</h3>
                            <p className="text-sm text-gray-600">
                                Create tokens that provide access to view all orders without authentication.
                                Useful for development and testing.
                            </p>
                        </div>
                        <GlobalTokenGenerator />
                    </div>
                    
                    <SingleOrderTokenGenerator />
                </CardContent>
            </Card>

            {/* Security Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Security
                    </CardTitle>
                    <CardDescription>
                        Security settings and access management
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 border rounded-lg">
                        <h3 className="font-medium mb-2">Token Security</h3>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Global tokens provide access to ALL orders</li>
                            <li>• Single order tokens are limited to specific orders</li>
                            <li>• All tokens have configurable expiration dates</li>
                            <li>• Token usage is tracked and logged</li>
                            <li>• Tokens can be revoked at any time</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Settings;