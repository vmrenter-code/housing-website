import { useEffect, useState } from 'react';
import { isOnline } from '../utils';

export default function useOnlineStatus() {
    const [online, setOnline] = useState(isOnline());

    useEffect(() => {
        const updateOnlineStatus = () => setOnline(isOnline());

        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);

        return () => {
            window.removeEventListener('online', updateOnlineStatus);
            window.removeEventListener('offline', updateOnlineStatus);
        };
    }, []);

    return online;
}
