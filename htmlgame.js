(() => {
    // Extract referrer information
    const ancestorOrigin = location.ancestorOrigins?.[0];
    const referrerSource = ancestorOrigin ?? document.referrer;

    // Extract domain from referrer URL
    const domainMatch = referrerSource?.match(/\/\/([^\/]+)/);
    const referrerDomain = domainMatch?.[1];

    // Extract upload ID from current URL
    const currentUrl = window.location.href;
    const uploadIdMatch = currentUrl?.match(/\/html\/(\d+)/);
    const uploadId = uploadIdMatch?.[1];

    // Check if referrer is unauthorized
    const isUnauthorized = referrerDomain && !(
        referrerDomain === "itch.io" ||
        referrerDomain.match(/\.itch\.io$/) ||
        referrerDomain.match(/\.itch\.zone$/)
    );

    // Send analytics beacon if available
    if (navigator.sendBeacon) {
        const formData = new FormData();
        formData.append("domain", referrerDomain || "unknown-domain");

        if (uploadId) {
            formData.append("upload_id", uploadId);
        }

        if (isUnauthorized) {
            formData.append("hotlink", "1");
        }

        navigator.sendBeacon("https://itch.io/html-callback", formData);
    }

    // Redirect if unauthorized
    if (isUnauthorized) {
    }
})();