import { Controller } from 'stimulus'

const sessionToken = utils.getCookie('CLIPSESSIONTOKEN')

// Login
class Login extends Controller {
    static targets = [
        'loginusername',
        'loginpassword',
        'loginSection',
        'twofactorFinalize',
        'twofactorSection',
        'twofactorCode',
    ]

    static values = {
        code: String,
        state: String,
    }

    connect() {
        window.addEventListener('storage', function (event) {
            if (event.key === 'sessionToken') {
                window.location.reload()
            }
        })
    }

    email() {
        console.log('IMPLEMENT ME!')
    }

    roblox() {
        this.initiateOAuth('roblox')
    }

    youtube() {
        this.initiateOAuth('youtube')
    }

    twitch() {
        this.initiateOAuth('twitch')
    }

    discord() {
        this.initiateOAuth('discord')
    }

    twofactorFinalizeConnect(target) {
        this.finalizeOAuth(this.codeValue, this.stateValue)
    }

    loginSubmit(e) {
        e.preventDefault()
        const username = this.loginusernameTarget
        const password = this.loginusernameTarget

        const apiUrl =
            'https://api.clippsly.com/endpoints/authentication/account-sign-in'

        try {
            fetch(apiUrl, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${sessionToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'login',
                    username: username,
                    password: password,
                }),
            })
                .then(() => {
                    if (!response.ok)
                        throw new Error(
                            `HTTP error! status: ${response.status}`
                        )
                })
                .then(() => {
                    this.loginSectionTarget.hidden = true
                    this.twofactorSectionTarget.hidden = false
                })
        } catch (error) {
            alert('Error logging in. Please try again later.')
        }
    }

    twofactorSubmit(e) {
        e.preventDefault()

        const authCode = this.twofactorCodeTarget.value

        const apiUrl =
            'https://api.clippsly.com/endpoints/authentication/account-sign-in'

        try {
            fetch(apiUrl, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${sessionToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: '2fa',
                    code: authCode,
                }),
            })
                .then(() => {
                    if (!response.ok)
                        throw new Error(
                            `HTTP error! status: ${response.status}`
                        )
                })
                .then(() => {
                    utils.setCookie(
                        'CLIPSESSIONTOKEN',
                        response.session_token,
                        7,
                        '.clippsly.com'
                    )
                    window.location.href = '/'
                })
        } catch (error) {
            alert(
                'Error authentication with 2FA. Please try again later.'
            )
        }
    }

    initiateOAuth(platform) {
        const apiUrl =
            'https://api.clippsly.com/endpoints/authentication/account-social-login'

        const data = fetch(apiUrl, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${sessionToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'login',
                version: 'preview',
                platform: platform,
            }),
        })
            .then(() => {
                if (!response.ok)
                    throw new Error(
                        `HTTP error! status: ${response.status}`
                    )
            })
            .then(() => response.json())
            .catch(() => {
                alert(
                    'Error initiating OAuth flow. Please try again later.'
                )
            })

        // console.log('OAuth API Response (raw):', response)

        if (data.oauth_url) {
            const oauthUrl = decodeURIComponent(data.oauth_url)
            // console.log('Decoded OAuth URL:', oauthUrl)

            const oauthWindow = window.open(
                oauthUrl,
                'OAuthWindow',
                'width=500,height=600'
            )

            if (
                !oauthWindow ||
                oauthWindow.closed ||
                typeof oauthWindow.closed == 'undefined'
            ) {
                window.location.href = oauthUrl
            } else {
                function handleOAuthMessage(event) {
                    if (event.origin === 'https://clippsly.com') {
                        if (
                            event.data.type === 'oauthSuccess' &&
                            event.data.session_token
                        ) {
                            utils.setCookie(
                                'CLIPSESSIONTOKEN',
                                event.data.session_token,
                                7,
                                '.clippsly.com'
                            )
                            oauthWindow.close()
                            window.location.reload()
                        } else if (
                            event.data.type === 'oauthFailure'
                        ) {
                            oauthWindow.document.body.innerHTML = `
                                            <div class="container mt-5">
                                                <div id="auth-error" class="row">
                                                    <div class="col-md-6 offset-md-3">
                                                        <h2 class="text-center text-danger">Login Failed</h2>
                                                        <p class="text-center">${event.data.message}</p>
                                                        <p class="text-center">You can close this window.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        `
                        }
                    }
                }
                window.addEventListener('message', handleOAuthMessage)

                oauthWindow.addEventListener(
                    'beforeunload',
                    function () {
                        window.removeEventListener(
                            'message',
                            handleOAuthMessage
                        )
                    }
                )
            }
        } else {
            console.error('OAuth URL not found in the response.')
        }
    }

    finalizeOAuth(code, state) {
        const apiUrl =
            'https://api.clippsly.com/endpoints/authentication/account-social-login'
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${sessionToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'callback',
                version: 'preview',
                state: state,
                code: code,
            }),
        })
            .then(() => {
                if (!response.ok)
                    throw new Error(
                        `HTTP error! status: ${response.status}`
                    )
            })
            .then(() => {
                let parsedResponse
                if (typeof response === 'string') {
                    try {
                        parsedResponse = JSON.parse(response)
                    } catch (e) {
                        console.error(
                            'Error parsing the response as JSON:',
                            e
                        )
                        showLoginFailedMessage(
                            'An unexpected error occurred while parsing the response.'
                        )
                        return
                    }
                } else {
                    parsedResponse = response
                }

                if (parsedResponse.session_token) {
                    utils.setCookie(
                        'CLIPSESSIONTOKEN',
                        parsedResponse.session_token,
                        7,
                        '.clippsly.com'
                    )
                    window.close()
                } else {
                    console.error(
                        'Unexpected response without session token:',
                        parsedResponse
                    )
                    showLoginFailedMessage(
                        'Login failed. No session token was provided.'
                    )
                }
            })
            .catch(() => {
                console.error(
                    "something bad happened and we don't know what"
                )
            })
    }

    // get results() {
    //     return this.resultsTarget
    // }
}

Stimulus.register('login', Login)
