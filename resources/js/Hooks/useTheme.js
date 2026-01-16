import { useEffect } from 'react';

export function useTheme(initialTheme) {
    useEffect(() => {
        const htmlElement = document.documentElement;

        if (initialTheme === 'dark') {
            htmlElement.classList.add('dark');
        } else {
            htmlElement.classList.remove('dark');
        }
    }, [initialTheme]);

    const applyTheme = (newTheme) => {
        const htmlElement = document.documentElement;

        if (newTheme === 'dark') {
            htmlElement.classList.add('dark');
        } else {
            htmlElement.classList.remove('dark');
        }
    };

    return { applyTheme };
}
