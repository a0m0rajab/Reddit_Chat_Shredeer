const target = "https://matrix.redditspace.com/";
const originalFetch = window.fetch;

window.fetch = async (...args) => {
    const url = args[0].toString();
    const options = args[1] || {};

    if (url.startsWith(target)) {
        let authHeader;

        if (options.headers) {
            // Headers can be a Headers object, plain object, or array
            if (options.headers instanceof Headers) {
                authHeader = options.headers.get("authorization");
            } else if (Array.isArray(options.headers)) {
                const found = options.headers.find(
                    ([key]) => key.toLowerCase() === "authorization"
                );
                authHeader = found ? found[1] : undefined;
            } else if (typeof options.headers === "object") {
                authHeader = options.headers["authorization"] || options.headers["Authorization"];
            }
        }

        console.log("Fetch to Redditspace:", url);
        console.log("Authorization header:", authHeader || "N/A");

        // Send auth header via window.postMessage
        if (authHeader) {
            window.postMessage({
                type: "reddit-auth-intercepted",
                url: url,
                authorization: authHeader,
                timestamp: new Date().toISOString()
            }, "*");
        }
    }

    return originalFetch(...args);
};
