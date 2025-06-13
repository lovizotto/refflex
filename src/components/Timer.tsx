import { useEffect } from 'react';

export function Timer({ delay, do: action, once = true, interval = false }: {
    delay: number;
    do: () => void;
    once?: boolean;
    interval?: boolean;
}) {
    useEffect(() => {
        const id = interval
            ? setInterval(action, delay)
            : setTimeout(action, delay);

        return () => {
            interval ? clearInterval(id) : clearTimeout(id);
        };
    }, [delay, action, interval]);

    return null;
}
