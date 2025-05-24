import { supabase } from '@/api/auth.api';
import { featuresByRole, featuresByUserId } from '@/lib/feature-access';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
    session: any;
    user: any | null; // Add user field to the context
    role: any | null;
    canAccessFeature: (feature: string) => boolean; // Function to check feature access
}



const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [session, setSession] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [role, setRole] = useState<string | null>(null);


    // Define feature access logic
    const canAccessFeature = (feature: string): boolean => {
        if (!user) return false;

        // Check access based on role
        if (role && featuresByRole[role]?.includes(feature)) {
            return true;
        }

        // Check access based on user ID
        const accessibleFeaturesByUser = featuresByUserId[user.id] || [];
        return accessibleFeaturesByUser.includes(feature);
    };

    useEffect(() => {
        const savedSession = localStorage.getItem('supabaseSession');
        if (savedSession) {
            // console.log('savedSession', savedSession);
            const session = JSON.parse(savedSession);
            setSession(session);
            setUser(session.user); // Explicitly set the user
            setRole(session.user?.role || null); // Assuming `role` is stored in user metadata
            supabase.auth.setSession(session); // Explicitly set the session
        }

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) {
                setUser(session.user);
                setRole(session.user?.role || null); // Fetch role when session updates
                localStorage.setItem('supabaseSession', JSON.stringify(session));
            } else {
                setUser(null);
                setRole(null);
                localStorage.removeItem('supabaseSession');
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    return <AuthContext.Provider value={{ session, user, role, canAccessFeature }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
