import { Application, Controller } from "stimulus"
function visitLoginPage(queryParams) {
    event.preventDefault()
    document.title = `Login | Clippsly`
    window.history.pushState({}, "", "/login")

    if (!(queryParams instanceof URLSearchParams)) {
        queryParams = new URLSearchParams()
    }

    const code = queryParams.get("code")
    const state = queryParams.get("state")

    if (code && state) {
        document.querySelector(".container").innerHTML = `
            <div id="auth-finalizing" class="row">
                <div class="col-md-6 offset-md-3">
                    <h2 class="text-center">Finalizing Authentication...</h2>
                    <p class="text-center">Please wait while we complete the sign in process.</p>
                </div>
            </div>
        `
        finalizeOAuthLogin(code, state)
    } else {
        document.querySelector(".container").innerHTML = `
            <div class="middle-float">
                <h2>Log in to Clippsly</h2>
                <button id="login-email" class="login-btn email">Continue with email</button>
                <button id="login-roblox" class="login-btn roblox">Continue with Roblox</button>
                <button id="login-youtube" class="login-btn youtube">Continue with YouTube</button>
                <button id="login-twitch" class="login-btn twitch">Continue with Twitch</button>
                <button id="login-discord" class="login-btn discord">Continue with Discord</button>

                <h4>Don't have an account?</h4>
                <button onclick="visitRegisterPage()" class="login-btn default">Sign Up</button>
            </div>
            <div id="2fa-section" class="row mt-5" hidden>
                <h2 class="text-center">2FA Authentication</h2>
                <form id="2fa-form">
                    <div class="form-group">
                        <label for="2fa-code">Authentication Code</label>
                        <input type="text" class="form-control" id="2fa-code" required>
                    </div>
                    <button type="submit" class="login-btn default">Authorize</button>
                    <div id="2fa-error" class="mt-2 text-danger"></div>
                </form>
            </div>
        `
        setupLoginEventHandlers(queryParams)
    }
}

function finalizeOAuthLogin(code, state) {
    $.ajax({
        url: "https://api.clippsly.com/endpoints/authentication/account-social-login",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            type: "callback",
            version: "preview",
            state: state,
            code: code,
        }),
        success: function (response) {
            console.log("OAuth Finalization Response (raw):", response)

            let parsedResponse
            if (typeof response === "string") {
                try {
                    parsedResponse = JSON.parse(response)
                } catch (e) {
                    console.error("Error parsing the response as JSON:", e)
                    showLoginFailedMessage("An unexpected error occurred while parsing the response.")
                    return
                }
            } else {
                parsedResponse = response
            }

            if (parsedResponse.session_token) {
                setCookie("CLIPSESSIONTOKEN", parsedResponse.session_token, 7, ".clippsly.com")
                window.close()
            } else {
                console.error("Unexpected response without session token:", parsedResponse)
                showLoginFailedMessage("Login failed. No session token was provided.")
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX Error:", status, error)
            console.error("Response Text:", xhr.responseText)
            showLoginFailedMessage(xhr.responseText || "An unexpected error occurred.")
        },
    })
}

function showLoginFailedMessage(errorMessage = "An error occurred during the login process. Please try again.") {
    document.querySelector(".container").innerHTML = `
        <div class="container mt-5">
            <div id="auth-error" class="row">
                <div class="col-md-6 offset-md-3">
                    <h2 class="text-center text-danger">Login Failed</h2>
                    <p class="text-center">${errorMessage}</p>
                </div>
            </div>
        </div>
    `
}

function setCookie(name, value, days, domain) {
    var expires = ""
    if (days) {
        var date = new Date()
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
        expires = "; expires=" + date.toUTCString()
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/; domain=" + domain
    localStorage.setItem("sessionToken", value)
}

function setupLoginEventHandlers(queryParams) {
    $(document).ready(function () {
        window.addEventListener("storage", function (event) {
            if (event.key === "sessionToken") {
                window.location.reload()
            }
        })

        $("#login-form").on("submit", function (e) {
            e.preventDefault()

            let username = $("#username").val()
            let password = $("#password").val()

            $.ajax({
                url: "https://api.clippsly.com/endpoints/authentication/account-sign-in",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                    type: "login",
                    username: username,
                    password: password,
                }),
                success: function (response) {
                    $("#login-section").hide()
                    $("#2fa-section").show()
                },
                error: function (xhr) {
                    let errorMessage = "An error occurred."
                    try {
                        if (xhr.responseJSON && xhr.responseJSON.error) {
                            errorMessage = xhr.responseJSON.error
                        } else if (xhr.responseText) {
                            errorMessage = xhr.responseText
                        }
                    } catch (e) {}
                    $("#login-error").text(errorMessage)
                },
            })
        })

        $("#2fa-form").on("submit", function (e) {
            e.preventDefault()

            let authCode = $("#2fa-code").val()

            $.ajax({
                url: "https://api.clippsly.com/endpoints/authentication/account-sign-in",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                    type: "2fa",
                    code: authCode,
                }),
                success: function (response) {
                    setCookie("CLIPSESSIONTOKEN", response.session_token, 7, ".clippsly.com")
                    window.location.href = "/"
                },
                error: function (xhr) {
                    let errorMessage = "An error occurred."
                    try {
                        if (xhr.responseJSON && xhr.responseJSON.error) {
                            errorMessage = xhr.responseJSON.error
                        } else if (xhr.responseText) {
                            errorMessage = xhr.responseText
                        }
                    } catch (e) {}
                    $("#2fa-error").text(errorMessage)
                },
            })
        })

        function initiateOAuth(platform) {
            $.ajax({
                url: "https://api.clippsly.com/endpoints/authentication/account-social-login",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                    type: "login",
                    version: "preview",
                    platform: platform,
                }),
                success: function (response) {
                    console.log("OAuth API Response (raw):", response)

                    let parsedResponse
                    if (typeof response === "string") {
                        try {
                            parsedResponse = JSON.parse(response)
                        } catch (e) {
                            console.error("Error parsing the response as JSON:", e)
                            return
                        }
                    } else {
                        parsedResponse = response
                    }

                    if (parsedResponse.oauth_url) {
                        let oauthUrl = decodeURIComponent(parsedResponse.oauth_url)
                        console.log("Decoded OAuth URL:", oauthUrl)

                        const oauthWindow = window.open(oauthUrl, "OAuthWindow", "width=500,height=600")

                        if (!oauthWindow || oauthWindow.closed || typeof oauthWindow.closed == "undefined") {
                            window.location.href = oauthUrl
                        } else {
                            function handleOAuthMessage(event) {
                                if (event.origin === "https://clippsly.com") {
                                    if (event.data.type === "oauthSuccess" && event.data.session_token) {
                                        setCookie("CLIPSESSIONTOKEN", event.data.session_token, 7, ".clippsly.com")
                                        oauthWindow.close()
                                        window.location.reload()
                                    } else if (event.data.type === "oauthFailure") {
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
                            window.addEventListener("message", handleOAuthMessage)

                            oauthWindow.addEventListener("beforeunload", function () {
                                window.removeEventListener("message", handleOAuthMessage)
                            })
                        }
                    } else {
                        console.error("OAuth URL not found in the response.")
                    }
                },
                error: function (xhr, status, error) {
                    console.error("OAuth initiation error:", status, error)
                    alert("Error initiating OAuth flow. Please try again later.")
                },
            })
        }

        $("#login-youtube").on("click", function () {
            initiateOAuth("youtube")
        })

        $("#login-twitch").on("click", function () {
            initiateOAuth("twitch")
        })

        $("#login-roblox").on("click", function () {
            initiateOAuth("roblox")
        })

        $("#login-discord").on("click", function () {
            initiateOAuth("discord")
        })
    })
}
