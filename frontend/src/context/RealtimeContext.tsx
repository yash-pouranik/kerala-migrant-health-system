import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config';

interface RealtimeContextType {
    socket: Socket | null;
    alerts: any[];
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export const RealtimeProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [alerts, setAlerts] = useState<any[]>([]);

    useEffect(() => {
        const newSocket = io(API_BASE_URL);
        setSocket(newSocket);

        newSocket.on('new_alert', (alert) => {
            setAlerts((prev) => [alert, ...prev]);
            toast.success(alert.message, { duration: 5000 });
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    return (
        <RealtimeContext.Provider value={{ socket, alerts }}>
            {children}
        </RealtimeContext.Provider>
    );
};

export const useRealtime = () => {
    const context = useContext(RealtimeContext);
    if (!context) throw new Error('useRealtime must be used within RealtimeProvider');
    return context;
};
