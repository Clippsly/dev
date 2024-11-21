async function visitSettingsPage(queryParams) {
    const sessionToken = utils.getCookie('CLIPSESSIONTOKEN')
    document.title = `Settings | Clippsly`
    window.history.pushState({}, '', '/settings')

    if (!(queryParams instanceof URLSearchParams)) {
        queryParams = new URLSearchParams()
    }

    const code = queryParams.get('code')
    const state = queryParams.get('state')

    const apiUrl =
        'https://api.clippsly.com/endpoints/data/current-session'
    const headers = {
        Authorization: `Bearer ${sessionToken}`,
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: headers,
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const userData = await response.json()

        const robloxConnected = userData?.connections?.roblox
            ? true
            : false
        const youtubeConnected = userData?.connections?.youtube
            ? true
            : false
        const twitchConnected = userData?.connections?.twitch
            ? true
            : false
        const soundcloudConnected = userData?.connections?.soundcloud
            ? true
            : false
        const discordConnected = userData?.connections?.discord
            ? true
            : false

        if (code && state) {
            document.querySelector('.container').innerHTML = `
                <div class="container mt-5">
                    <div id="auth-finalizing" class="row">
                        <div class="col-md-6 offset-md-3">
                            <h2 class="text-center">Finalizing Authentication...</h2>
                            <p class="text-center">Please wait while we complete the sign in process.</p>
                        </div>
                    </div>
                </div>
            `
            finalizeOAuthConnection(code, state)
        } else {
            document.querySelector('.container').innerHTML = `
                <h1>Settings</h1>
                <div class="container mt-5">
                    <div id="login-section" class="row">
                        <div class="col-md-6 offset-md-3">
                            <h2 class="text-center">Change Username</h2>
                            <form id="username-settings-form">
                                <div class="form-group">
                                    <label for="new_username">New username</label>
                                    <input type="text" class="form-control" id="new_username" required>
                                </div>
                                <button type="submit" id="submitUsername" class="login-btn default">Change (500 Clipcoins)</button>
                            </form>
                        </div>

                        <div class="col-md-6 offset-md-3">
                            <h2 class="text-center">Change Display Name</h2>
                            <form id="displayname-settings-form">
                                <div class="form-group">
                                    <label for="new_displayname">New display name</label>
                                    <input type="text" class="form-control" id="new_displayname" required>
                                </div>
                                <button type="submit" id="submitDisplayname" class="login-btn default">Change</button>
                            </form>
                        </div>

                        <div class="col-md-6 offset-md-3">
                            <h2 class="text-center">Change Description</h2>
                            <form id="description-settings-form">
                                <div class="form-group">
                                    <label for="new_displayname">New description</label>
                                    <textarea class="form-control" id="new_description" required></textarea>
                                </div>
                                <button type="submit" id="submitDescription" class="login-btn default">Change</button>
                            </form>
                        </div>

                        <div class="col-md-6 offset-md-3">
                            <h2 class="text-center">Change Avatar</h2>
                            <form id="avatar-settings-form">
                                <div class="form-group">
                                    <label for="new_avatar">New avatar</label>
                                    <input type="file" class="form-control" id="new_avatar" accept=".png,.jpg,.jpeg" required>
                                </div>
                                <button type="submit" id="submitAvatar" class="login-btn default">Change</button>
                            </form>
                        </div>

                        <div class="col-md-6 offset-md-3">
                            <h2 class="text-center">Change Banner</h2>
                            <form id="banner-settings-form">
                                <div class="form-group">
                                    <label for="new_banner">New banner</label>
                                    <input type="file" class="form-control" id="new_banner" required>
                                </div>
                                <button type="submit" id="submitBanner" class="login-btn default">Change</button>
                            </form>
                        </div>

                        <div class="col-md-6 offset-md-3">
                            <h2 class="text-center">Connections</h2>
                            <button id="${
                                youtubeConnected
                                    ? 'disconnect-youtube'
                                    : 'connect-youtube'
                            }" class="login-btn youtube">
                                ${
                                    youtubeConnected
                                        ? 'Disconnect YouTube'
                                        : 'Connect YouTube'
                                }
                            </button>
                            <button id="${
                                twitchConnected
                                    ? 'disconnect-twitch'
                                    : 'connect-twitch'
                            }" class="login-btn twitch">
                                ${
                                    twitchConnected
                                        ? 'Disconnect Twitch'
                                        : 'Connect Twitch'
                                }
                            </button>
                            <button id="${
                                robloxConnected
                                    ? 'disconnect-roblox'
                                    : 'connect-roblox'
                            }" class="login-btn roblox">
                                ${
                                    robloxConnected
                                        ? 'Disconnect Roblox'
                                        : 'Connect Roblox'
                                }
                            </button>
                            <button id="${
                                soundcloudConnected
                                    ? 'disconnect-soundcloud'
                                    : 'connect-soundcloud'
                            }" class="login-btn soundcloud">
                                ${
                                    soundcloudConnected
                                        ? 'Disconnect SoundCloud'
                                        : 'Connect SoundCloud'
                                }
                            </button>
                            <button id="${
                                discordConnected
                                    ? 'disconnect-discord'
                                    : 'connect-discord'
                            }" class="login-btn discord">
                                ${
                                    discordConnected
                                        ? 'Disconnect Discord'
                                        : 'Connect Discord'
                                }
                            </button>
                        </div>
                    </div>
                </div>
            `
            setupConnectionEventHandlers(queryParams)
        }
    } catch (error) {
        console.error('Error fetching user data:', error)
    }

    // Add submit event listener once
    if (!document.submitListenerAdded) {
        document.addEventListener('submit', handleFormSubmit)
        document.submitListenerAdded = true
    }

    function finalizeOAuthConnection(code, state) {
        $.ajax({
            url: 'https://api.clippsly.com/endpoints/authentication/account-social-connect',
            method: 'POST',
            contentType: 'application/json',
            headers: {
                Authorization: `Bearer ${sessionToken}`,
            },
            data: JSON.stringify({
                type: 'callback',
                version: 'preview',
                state: state,
                code: code,
            }),
            success: function (response) {
                console.log(
                    'OAuth Finalization Response (raw):',
                    response
                )

                let parsedResponse
                if (typeof response === 'string') {
                    try {
                        parsedResponse = JSON.parse(response)
                    } catch (e) {
                        console.error(
                            'Error parsing the response as JSON:',
                            e
                        )
                        showConnectionFailedMessage(
                            'An unexpected error occurred while parsing the response.'
                        )
                        return
                    }
                } else {
                    parsedResponse = response
                }

                if (parsedResponse.code === 200) {
                    console.log('Success:', parsedResponse)
                    window.close()
                } else {
                    console.error(
                        'Unexpected response:',
                        parsedResponse
                    )
                    showConnectionFailedMessage(
                        parsedResponse.error ||
                            'An unexpected error occurred.'
                    )
                }
            },
            error: function (xhr, status, error) {
                console.error('AJAX Error:', status, error)
                console.error('Response Text:', xhr.responseText)
                showConnectionFailedMessage(
                    xhr.responseText ||
                        'An unexpected error occurred.'
                )
            },
        })
    }

    function showConnectionFailedMessage(
        errorMessage = 'An error occurred during the connecting process. Please try again.'
    ) {
        document.querySelector('.container').innerHTML = `
            <div class="container mt-5">
                <div id="auth-error" class="row">
                    <div class="col-md-6 offset-md-3">
                        <h2 class="text-center text-danger">Connection Failed</h2>
                        <p class="text-center">${errorMessage}</p>
                    </div>
                </div>
            </div>
        `
    }

    function setupConnectionEventHandlers(queryParams) {
        $(document).ready(function () {
            window.addEventListener('storage', function (event) {
                if (event.key === 'sessionToken') {
                    window.location.reload()
                }
            })

            function removeOAuth(platform) {
                $.ajax({
                    url: 'https://api.clippsly.com/endpoints/authentication/account-social-connect',
                    method: 'POST',
                    contentType: 'application/json',
                    headers: {
                        Authorization: `Bearer ${sessionToken}`,
                    },
                    data: JSON.stringify({
                        type: 'disconnect',
                        version: 'preview',
                        platform: platform,
                    }),
                    success: function (response) {
                        console.log(
                            'OAuth API Response (raw):',
                            response
                        )

                        let parsedResponse
                        if (typeof response === 'string') {
                            try {
                                parsedResponse = JSON.parse(response)
                            } catch (e) {
                                console.error(
                                    'Error parsing the response as JSON:',
                                    e
                                )
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: 'Error parsing the response.',
                                })
                                return
                            }
                        } else {
                            parsedResponse = response
                        }

                        if (parsedResponse.code) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Success!',
                                text: `${parsedResponse.response}`,
                                confirmButtonText: 'Okay',
                            }).then(() => {
                                window.location.reload()
                            })
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Unexpected response from the server.',
                            })
                        }
                    },
                    error: function (xhr, status, error) {
                        console.error('API Error:', error)
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Error initiating OAuth flow. Please try again later.',
                        })
                    },
                })
            }

            function initiateOAuth(platform) {
                $.ajax({
                    url: 'https://api.clippsly.com/endpoints/authentication/account-social-connect',
                    method: 'POST',
                    contentType: 'application/json',
                    headers: {
                        Authorization: `Bearer ${sessionToken}`,
                    },
                    data: JSON.stringify({
                        type: 'connection',
                        version: 'preview',
                        platform: platform,
                    }),
                    success: function (response) {
                        console.log(
                            'OAuth API Response (raw):',
                            response
                        )

                        let parsedResponse
                        if (typeof response === 'string') {
                            try {
                                parsedResponse = JSON.parse(response)
                            } catch (e) {
                                console.error(
                                    'Error parsing the response as JSON:',
                                    e
                                )
                                return
                            }
                        } else {
                            parsedResponse = response
                        }

                        if (parsedResponse.oauth_url) {
                            let oauthUrl = decodeURIComponent(
                                parsedResponse.oauth_url
                            )
                            console.log(
                                'Decoded OAuth URL:',
                                oauthUrl
                            )

                            const oauthWindow = window.open(
                                oauthUrl,
                                'OAuthWindow',
                                'width=500,height=600'
                            )

                            if (
                                !oauthWindow ||
                                oauthWindow.closed ||
                                typeof oauthWindow.closed ==
                                    'undefined'
                            ) {
                                window.location.href = oauthUrl
                            } else {
                                function handleOAuthMessage(event) {
                                    if (
                                        event.origin ===
                                        'https://clippsly.com'
                                    ) {
                                        if (
                                            event.data.type ===
                                                'oauthSuccess' &&
                                            event.data.session_token
                                        ) {
                                            Swal.fire({
                                                icon: 'success',
                                                title: 'Success!',
                                                text: `Your ${platform} account has been connected!`,
                                                confirmButtonText:
                                                    'Yippee!',
                                            }).then(() => {
                                                oauthWindow.close()
                                                window.location.reload()
                                            })
                                        } else if (
                                            event.data.type ===
                                            'oauthFailure'
                                        ) {
                                            oauthWindow.document.body.innerHTML = `
                                                <div class="container mt-5">
                                                    <div id="auth-error" class="row">
                                                        <div class="col-md-6 offset-md-3">
                                                            <h2 class="text-center text-danger">Connection Failed</h2>
                                                            <p class="text-center">${event.data.message}</p>
                                                            <p class="text-center">You can close this window.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            `
                                        }
                                    }
                                }
                                window.addEventListener(
                                    'message',
                                    handleOAuthMessage
                                )

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
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'OAuth URL not found in the response.',
                            })
                        }
                    },
                    error: function (xhr, status, error) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Error initiating OAuth flow. Please try again later.',
                        })
                    },
                })
            }

            $('#connect-youtube').on('click', function () {
                initiateOAuth('youtube')
            })

            $('#connect-twitch').on('click', function () {
                initiateOAuth('twitch')
            })

            $('#connect-roblox').on('click', function () {
                initiateOAuth('roblox')
            })

            $('#connect-soundcloud').on('click', function () {
                initiateOAuth('soundcloud')
            })

            $('#connect-discord').on('click', function () {
                initiateOAuth('discord')
            })

            $('#disconnect-youtube').on('click', function () {
                removeOAuth('youtube')
            })

            $('#disconnect-twitch').on('click', function () {
                removeOAuth('twitch')
            })

            $('#disconnect-roblox').on('click', function () {
                removeOAuth('roblox')
            })

            $('#disconnect-soundcloud').on('click', function () {
                removeOAuth('soundcloud')
            })

            $('#disconnect-discord').on('click', function () {
                removeOAuth('discord')
            })
        })
    }
}

function handleFormSubmit(e) {
    e.preventDefault()
    if (e.target && e.target.id === 'username-settings-form') {
        submitUsernameForm(e)
    } else if (
        e.target &&
        e.target.id === 'displayname-settings-form'
    ) {
        submitDisplaynameForm(e)
    } else if (
        e.target &&
        e.target.id === 'description-settings-form'
    ) {
        submitDescriptionForm(e)
    } else if (e.target && e.target.id === 'avatar-settings-form') {
        submitAvatarForm(e)
    } else if (e.target && e.target.id === 'banner-settings-form') {
        submitBannerForm(e)
    }
}

function submitUsernameForm(event) {
    const sessionToken = utils.getCookie('CLIPSESSIONTOKEN')
    event.preventDefault()

    var newUserName = document
        .getElementById('new_username')
        .value.trim()
    document.getElementById('submitUsername').style.display = 'none'

    if (newUserName === '') {
        Swal.fire({
            icon: 'error',
            title: 'Oopsie!',
            text: 'Please enter a username.',
            confirmButtonText: 'Awww!',
        }).then(() => {
            document.getElementById('submitUsername').style.display =
                'block'
        })
        return
    }

    Swal.fire({
        icon: 'warning',
        title: 'Are you sure?',
        text: "Are you sure you want to change your username? You won't be able to change it back for the next 7 days.",
        showCancelButton: true,
        confirmButtonText: 'Yes, change it!',
        cancelButtonText: 'No, keep it as is',
    }).then((result) => {
        if (result.isConfirmed) {
            var formData = {
                new_username: newUserName,
            }

            fetch(
                'https://api.clippsly.com/endpoints/settings/update-user',
                {
                    method: 'POST',
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${sessionToken}`,
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                }
            )
                .then((response) => response.data)
                .then((data) => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Your username has been changed!',
                        confirmButtonText: 'Yippee!',
                    }).then(() => {
                        document.getElementById(
                            'submitUsername'
                        ).style.display = 'block'
                    })
                })
                .catch((error) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oopsie!',
                        text: error.message,
                        confirmButtonText: 'Awww!',
                    }).then(() => {
                        document.getElementById(
                            'submitUsername'
                        ).style.display = 'block'
                    })
                })
        } else {
            document.getElementById('submitUsername').style.display =
                'block'
        }
    })
}

function submitDisplaynameForm(event) {
    const sessionToken = utils.getCookie('CLIPSESSIONTOKEN')
    event.preventDefault()

    var newDisplayName = document
        .getElementById('new_displayname')
        .value.trim()
    document.getElementById('submitDisplayname').style.display =
        'none'

    if (newDisplayName === '') {
        Swal.fire({
            icon: 'error',
            title: 'Oopsie!',
            text: 'Please enter a display name.',
            confirmButtonText: 'Awww!',
        }).then(() => {
            document.getElementById(
                'submitDisplayname'
            ).style.display = 'block'
        })
        return
    }

    Swal.fire({
        icon: 'warning',
        title: 'Are you sure?',
        text: "Are you sure you want to change your display name? You won't be able to change it back for the next 3 days.",
        showCancelButton: true,
        confirmButtonText: 'Yes, change it!',
        cancelButtonText: 'No, keep it as is',
    }).then((result) => {
        if (result.isConfirmed) {
            var formData = {
                new_displayname: newDisplayName,
            }

            fetch(
                'https://api.clippsly.com/endpoints/settings/update-display',
                {
                    method: 'POST',
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${sessionToken}`,
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                }
            )
                .then((response) => response.data)
                .then((data) => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Your display name has been changed!',
                        confirmButtonText: 'Yippee!',
                    }).then(() => {
                        document.getElementById(
                            'submitDisplayname'
                        ).style.display = 'block'
                    })
                })
                .catch((error) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oopsie!',
                        text: error.message,
                        confirmButtonText: 'Awww!',
                    }).then(() => {
                        document.getElementById(
                            'submitDisplayname'
                        ).style.display = 'block'
                    })
                })
        } else {
            document.getElementById(
                'submitDisplayname'
            ).style.display = 'block'
        }
    })
}

function submitDescriptionForm(event) {
    const sessionToken = utils.getCookie('CLIPSESSIONTOKEN')
    event.preventDefault()

    var newDescription = document
        .getElementById('new_description')
        .value.trim()
    document.getElementById('submitDescription').style.display =
        'none'

    if (newDescription === '') {
        Swal.fire({
            icon: 'error',
            title: 'Oopsie!',
            text: 'Please enter a description.',
            confirmButtonText: 'Awww!',
        }).then(() => {
            document.getElementById(
                'submitDescription'
            ).style.display = 'block'
        })
        return
    }

    var formData = {
        new_description: newDescription,
    }

    fetch(
        'https://api.clippsly.com/endpoints/settings/update-description',
        {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: `Bearer ${sessionToken}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }
    )
        .then((response) => response.data)
        .then((data) => {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Your description has been changed!',
                confirmButtonText: 'Yippee!',
            }).then(() => {
                document.getElementById(
                    'submitDescription'
                ).style.display = 'block'
            })
        })
        .catch((error) => {
            Swal.fire({
                icon: 'error',
                title: 'Oopsie!',
                text: error.message,
                confirmButtonText: 'Awww!',
            }).then(() => {
                document.getElementById(
                    'submitDescription'
                ).style.display = 'block'
            })
        })
}

function submitAvatarForm(event) {
    const sessionToken = utils.getCookie('CLIPSESSIONTOKEN')
    event.preventDefault()

    var newAvatar = document.getElementById('new_avatar').files[0]
    document.getElementById('submitAvatar').style.display = 'none'

    if (!newAvatar) {
        Swal.fire({
            icon: 'error',
            title: 'Oopsie!',
            text: 'Please choose a file before submitting.',
            confirmButtonText: 'Awww!',
        }).then(() => {
            document.getElementById('submitAvatar').style.display =
                'block'
        })
        return
    }

    var formData = new FormData()
    formData.append('new_avatar', newAvatar)

    fetch(
        'https://api.clippsly.com/endpoints/settings/update-avatar',
        {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: `Bearer ${sessionToken}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }
    )
        .then((response) => response.data)
        .then((data) => {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Your avatar has been changed!',
                confirmButtonText: 'Yippee!',
            }).then(() => {
                document.getElementById(
                    'submitAvatar'
                ).style.display = 'block'
            })
        })
        .catch((error) => {
            Swal.fire({
                icon: 'error',
                title: 'Oopsie!',
                text: error.message,
                confirmButtonText: 'Awww!',
            }).then(() => {
                document.getElementById(
                    'submitAvatar'
                ).style.display = 'block'
            })
        })
}

function submitBannerForm(event) {
    const sessionToken = utils.getCookie('CLIPSESSIONTOKEN')
    event.preventDefault()

    var newBanner = document.getElementById('new_banner').files[0]
    document.getElementById('submitBanner').style.display = 'none'

    if (!newBanner) {
        Swal.fire({
            icon: 'error',
            title: 'Oopsie!',
            text: 'Please choose a file before submitting.',
            confirmButtonText: 'Awww!',
        }).then(() => {
            document.getElementById('submitBanner').style.display =
                'block'
        })
        return
    }

    var formData = new FormData()
    formData.append('new_banner', newBanner)

    fetch(
        'https://api.clippsly.com/endpoints/settings/update-banner',
        {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: `Bearer ${sessionToken}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }
    )
        .then((response) => response.data)
        .then((data) => {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Your banner has been changed!',
                confirmButtonText: 'Yippee!',
            }).then(() => {
                document.getElementById(
                    'submitBanner'
                ).style.display = 'block'
            })
        })
        .catch((error) => {
            Swal.fire({
                icon: 'error',
                title: 'Oopsie!',
                text: error.message,
                confirmButtonText: 'Awww!',
            }).then(() => {
                document.getElementById(
                    'submitBanner'
                ).style.display = 'block'
            })
        })
}
