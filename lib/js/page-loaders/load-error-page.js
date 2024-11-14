function visitErrorPage(code) {
    event.preventDefault()
    document.title = `${code} Error | Clippsly`
    window.history.pushState({}, "", `/error?code=${code}`)

    const errorCodes = {
        400: "Bad Request: The server could not understand the request due to invalid syntax.",
        401: "Unauthorized: The client must authenticate itself to get the requested response.",
        403: "Forbidden: The client does not have access rights to the content.",
        404: "Not Found: The server can not find the requested resource.",
        500: "Internal Server Error: The server has encountered a situation it doesn't know how to handle.",
        502: "Bad Gateway: The server was acting as a gateway or proxy and received an invalid response from the upstream server.",
        503: "Service Unavailable: The server is not ready to handle the request.",
        504: "Gateway Timeout: The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.",
    }

    document.querySelector(".container").innerHTML = `
        <h1 id="error-code">${code} Error</h1>
        <p id="error-description">${errorCodes[code] || "An unknown error occurred."}</p>
    `
}
