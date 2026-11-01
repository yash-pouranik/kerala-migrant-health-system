import { createContext, useContext, useState, type ReactNode, useEffect } from 'react';

export type UserRole = 'SUPER_ADMIN' | 'DISTRICT_ADMIN' | 'PHC_STAFF' | 'FIELD_WORKER' | 'ANALYST';

interface User {
    id: string;
    username: string;
    name: string;
    role: UserRole;
    district?: string;
    profilePicture?: string;
    loginMethod?: 'password' | 'google' | 'facebook';
}

interface AuthContextType {
    user: User | null;
    login: (credentials: any) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Use relative paths for API calls - works in both dev and production
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initial Auth Check
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ token })
                    });
                    const data = await response.json();

                    if (data.success) {
                        setUser(data.user);
                    } else {
                        localStorage.removeItem('authToken');
                        setUser(null);
                    }
                } catch (error) {
                    console.error("Auth verification failed", error);
                    localStorage.removeItem('authToken');
                    setUser(null);
                }
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (credentials: any) => {
        try {
            console.log('Attempting login with API_BASE_URL:', API_BASE_URL);
            const loginUrl = `${API_BASE_URL}/auth/login`;
            console.log('Login URL:', loginUrl);

            const response = await fetch(loginUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(credentials)
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            if (!response.ok) {
                console.error('Response not OK:', response.status, response.statusText);
                const errorText = await response.text();
                console.error('Error response:', errorText);
                return false;
            }

            const data = await response.json();
            console.log('Login response:', data);

            if (data.success) {
                localStorage.setItem('authToken', data.token);
                setUser(data.user);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Login failed with error:", error);
            if (error instanceof TypeError && error.message.includes('fetch')) {
                console.error('Network error - API endpoint may not be reachable');
            }
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setUser(null);
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
