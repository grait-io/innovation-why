import React from 'react';

interface PublicLayoutProps {
    children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Simple header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center">
                        <img 
                            src="/kb-print-logo.png" 
                            alt="Kiezbett" 
                            className="h-8 w-auto"
                        />
                        <h1 className="ml-3 text-xl font-semibold text-gray-900">
                            Order Details
                        </h1>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="max-w-4xl mx-auto px-4 py-6">
                {children}
            </main>

            {/* Simple footer */}
            <footer className="bg-white border-t mt-12">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <p className="text-sm text-gray-500 text-center">
                        This is a secure order view. Please do not share this link with unauthorized parties.
                    </p>
                </div>
            </footer>
        </div>
    );
};