export function debounce<T extends (...args: string[]) => void>(fn: T, time: number) {
    let timeoutId: NodeJS.Timeout | null;
    return wrapper
    function wrapper (...args: string[]) {
        if (timeoutId) {
            clearTimeout(timeoutId)
        }
        timeoutId = setTimeout(() => {
            timeoutId = null
            fn(...args)
        }, time)
    }
}