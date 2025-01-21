export const getUrlParams = (url: string) => {
    const params: any = {};
    if (!url) {
        url = window.location.href;
    }
    const paramString = url.split('?')[1];
    if (paramString) {
        const pairs = paramString.split('&');
        pairs?.forEach((pair: string) => {
            const [key, value] = pair.split('=');
            params[decodeURIComponent(key)] = decodeURIComponent(value);
        });
    }
    return params;
}

export function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).replace(/\/|,/g, '-');
}