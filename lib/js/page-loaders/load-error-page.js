const errorNames = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    500: 'Internal Server',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout',
}

const errorDescriptions = {
    400: 'The server could not understand the request due to invalid syntax.',
    401: 'The client must authenticate itself to get the requested response.',
    403: 'The client does not have access rights to the content.',
    404: 'The server can not find the requested resource.',
    500: "The server has encountered a situation it doesn't know how to handle.",
    502: 'The server was acting as a gateway or proxy and received an invalid response from the upstream server.',
    503: 'The server is not ready to handle the request.',
    504: 'The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.',
}

function visitErrorPage(queryParams) {
    event.preventDefault()
    if (!(queryParams instanceof URLSearchParams)) {
        queryParams = new URLSearchParams()
    }
    const code = queryParams.get('code') || ''
    document.title = `${code} Error | Clippsly`

    window.history.pushState({}, '', `/error?code=${code}`)

    const errorName = errorNames[code] || 'Unknown Error'
    const errorDescription =
        errorDescriptions[code] || 'Unknown Error'

    container.innerHTML = ''
    container.innerHTML = `
        <div class="middle-float">
            <h1>Error ${code}: ${errorName}</h1>
            <p>${errorDescription}</p>
        </div>
    `
}
