function visitRegisterPage(queryParams) {
    event.preventDefault()
    document.title = "Register | Clippsly"
    window.history.pushState({}, "", "/register")

    if (!(queryParams instanceof URLSearchParams)) {
        queryParams = new URLSearchParams()
    }

    const code = queryParams.get("code")
    const state = queryParams.get("state")

    if (code && state) {
        document.querySelector(".container").innerHTML = `
            <div class="container mt-5">
                <div id="auth-finalizing" class="row">
                    <div class="col-md-6 offset-md-3">
                        <h2 class="text-center">Finalizing Authentication...</h2>
                        <p class="text-center">Please wait while we complete the sign up process.</p>
                    </div>
                </div>
            </div>
        `
        finalizeOAuthRegister(code, state)
    } else {
        document.querySelector(".container").innerHTML = `
            <div class="container mt-5">
                <div id="login-section" class="row">
                    <div class="col-md-6 offset-md-3">
                        <h2 class="text-center">Sign Up</h2>
                        <form id="register-form">
                            <div class="form-group">
                                <label for="username">Username</label>
                                <input type="text" class="form-control" id="username" required>
                            </div>
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="email" class="form-control" id="email" required>
                            </div>
                            <div class="form-group">
                                <label for="password">Password</label>
                                <input type="password" class="form-control" id="password" required>
                            </div>
                            <div class="acknowledge-checkbox">
                                <label>By creating an account you're agreeing to our <strong><a onclick="openExternalWebsite('https://clippsly.com/terms-of-use')" href="https://clippsly.com/terms-of-use">Terms of Use</a></strong>.</label>
                            </div>

                            <button type="submit" class="login-btn default">Sign Up</button>
                            <div id="register-error" class="mt-2 text-danger"></div>
                        </form>
                        <div class="oauth-section mt-4 text-center">
                            <h4>Or register with</h4>                            
                            <button id="register-roblox" class="login-btn roblox">Continue with Roblox</button>
                            <button id="register-youtube" class="login-btn youtube">Continue with YouTube</button>
                            <button id="register-twitch" class="login-btn twitch">Continue with Twitch</button>
                            <button id="register-discord" class="login-btn discord">Continue with Discord</button>
                        </div>
                        <div class="register-section mt-4 text-center">
                            <h4>Already have an account?</h4>
                            <button onclick="visitLoginPage()" class="login-btn default">Sign In</button>
                        </div>
                    </div>
                </div>
            </div>
        `
        setupRegisterEventHandlers(queryParams)
    }
}

function finalizeOAuthRegister(code, state) {
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
            console.log("OAuth Registration Finalization Response (raw):", response)

            let parsedResponse
            if (typeof response === "string") {
                try {
                    parsedResponse = JSON.parse(response)
                } catch (e) {
                    console.error("Error parsing the response as JSON:", e)
                    showRegisterFailedMessage("An unexpected error occurred while parsing the response.")
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
                showRegisterFailedMessage("Registration failed. No session token was provided.")
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX Error:", status, error)
            console.error("Response Text:", xhr.responseText)
            showRegisterFailedMessage(xhr.responseText || "An unexpected error occurred.")
        },
    })
}

function showRegisterFailedMessage(
    errorMessage = "An error occurred during the registration process. Please try again."
) {
    document.querySelector(".container").innerHTML = `
        <div class="container mt-5">
            <div id="auth-error" class="row">
                <div class="col-md-6 offset-md-3">
                    <h2 class="text-center text-danger">Registration Failed</h2>
                    <p class="text-center">${errorMessage}</p>
                </div>
            </div>
        </div>
    `
}

function setupRegisterEventHandlers(queryParams) {
    $(document).ready(function () {
        $("#register-form").on("submit", function (e) {
            e.preventDefault()

            let username = $("#username").val()
            let email = $("#email").val()
            let password = $("#password").val()

            $.ajax({
                url: "https://api.clippsly.com/endpoints/authentication/account-sign-up",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                    username: username,
                    email: email,
                    password: password,
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
                    $("#register-error").text(errorMessage)
                },
            })
        })

        $("#register-youtube").on("click", function () {
            initiateOAuthRegister("youtube")
        })

        $("#register-twitch").on("click", function () {
            initiateOAuthRegister("twitch")
        })

        $("#register-roblox").on("click", function () {
            initiateOAuthRegister("roblox")
        })

        $("#register-discord").on("click", function () {
            initiateOAuthRegister("discord")
        })
    })
}

function initiateOAuthRegister(platform) {
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
            console.log("OAuth Register API Response (raw):", response)

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
                                            <h2 class="text-center text-danger">Registration Failed</h2>
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
