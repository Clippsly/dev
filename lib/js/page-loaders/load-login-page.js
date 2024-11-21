function visitLoginPage(queryParams) {
    event.preventDefault()
    document.title = `Login | Clippsly`
    window.history.pushState({}, '', '/login')

    if (!(queryParams instanceof URLSearchParams)) {
        queryParams = new URLSearchParams()
    }

    const code = queryParams.get('code')
    const state = queryParams.get('state')

    if (code && state) {
        container.innerHTML = `
            <div data-controller="login">
                <div data-login-target="twofactorFinalize" data-login-code-value=${code} data-login-state-value=${state} class="middle-float">
                    <h2>Finalizing Authentication...</h2>
                    <p>Please wait while we complete the sign in process.</p>
                </div>
            </div>
        `
    } else {
        container.innerHTML = `
            <div data-controller="login">
                <div data-login-target="loginSection" class="middle-float">
                    <h2>Log in to Clippsly</h2>
                    <button data-action="click->login#email" class="login-btn email">Continue with email</button>
                    <button data-action="click->login#roblox" class="login-btn roblox">Continue with Roblox</button>
                    <button data-action="click->login#youtube" class="login-btn youtube">Continue with YouTube</button>
                    <button data-action="click->login#twitch" class="login-btn twitch">Continue with Twitch</button>
                    <button data-action="click->login#discord" class="login-btn discord">Continue with Discord</button>

                    <h4>Don't have an account? <a inline class="hyperlink" href="/register">Sign Up</a></h4>
                </div>
                <div data-login-target="twofactorSection" class="middle-float" hidden>
                    <h2 class="text-center">2FA Authentication</h2>
                    <form>
                        <div class="form-group">
                            <label for="2fa-code" data-login-target="twofactorCode">Authentication Code</label>
                            <input type="text" class="form-control" id="2fa-code" required>
                        </div>
                        <button type="submit" class="primary">Authorize</button>
                    </form>
                </div>
            </div>
        `
        // setupLoginEventHandlers(queryParams)
    }
}
