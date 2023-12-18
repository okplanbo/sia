import { Task } from "./types";
import { total_percent, vibrate_duration } from "./constants";

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

export function calcProgress (tasks: Task[]) {
    let completedCount = 0;
    tasks.forEach(item => {
        if (item.checked) {
            completedCount++;
        }
    });
    return total_percent / tasks.length * completedCount;
}

export function vibrate() {
    if (window.navigator.vibrate) {
        window.navigator.vibrate(vibrate_duration);
    }
}

export function reorder(list: Task[], startIndex: number, endIndex: number) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
  
    return result;
}