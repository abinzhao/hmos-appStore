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