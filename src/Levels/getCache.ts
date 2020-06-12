export function getCache(key: string, defa?: string) {
    let item = localStorage.getItem(key);
    if (item) {
        return item;
    }
    return defa;
}
