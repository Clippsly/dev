async function fetchUserData() {
    const sessionToken = getCookie("CLIPSESSIONTOKEN")
    if (!sessionToken) {
        handleInvalidSession()
        return
    }

    const apiUrl = "https://api.clippsly.com/endpoints/data/current-session"
    const headers = {
        Authorization: `Bearer ${sessionToken}`,
    }

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: headers,
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const userData = await response.json()

        const isModerated = userData?.status?.isModerated
        const displayName = userData?.displayName
        const isVerified = userData?.status?.isVerified

        if (isModerated === undefined || displayName === undefined || isVerified === undefined) {
            handleInvalidSession()
            return
        }

        document.getElementById("profile-pic").src =
            userData?.avatar || "https://cdn.clippsly.com/brand_assets/icons/default-artist.png"
        document.getElementById("display-name").textContent = displayName.substring(0, 10)

        if (isVerified) {
            document.getElementById("display-name").innerHTML +=
                ' <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" title="Verified Badge"><circle cx="12" cy="12" r="10" stroke-width="2" fill="#1E90FF"></circle><path d="M8.5 12.5l2.5 2.5 5-5" stroke="white" stroke-width="2" fill="none"></path></svg>'
        }

        const profileLink = document.getElementById("profile-link")
        profileLink.href = `/users/${userData.name}`
        profileLink.onclick = function () {
            visitUserProfile(userData.name)
        }

        const balanceShow = document.getElementById("balance")
        balanceShow.innerText = `Clipcoins: ${userData.balance}`
        balanceShow.onclick = function () {
            visitBalancePage()
        }

        document.getElementById("logout-button").dataset.sessionId = sessionToken

        document.getElementById("logout-button").addEventListener("click", async function () {
            await logout(sessionToken)
        })

        document.getElementById("user-dropdown-menu").classList.remove("d-none")

        if (isModerated) {
            const currentUrl = window.location.href
            const notApprovedUrl = "https://pre.clippsly.com/not-approved"

            if (!currentUrl.includes(notApprovedUrl)) {
                window.location.href = notApprovedUrl
            }
        }

        pingServer(sessionToken)

        setInterval(() => {
            pingServer(sessionToken)
        }, 4 * 60 * 1000)
    } catch (error) {
        console.error("Error fetching user data:", error)
        handleInvalidSession()
    }
}

async function pingServer(sessionToken) {
    const apiUrl = "https://api.clippsly.com/endpoints/data/pulse"
    const headers = {
        Authorization: `Bearer ${sessionToken}`,
    }

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: headers,
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
    } catch (error) {
        console.error("Error pinging the server:", error)
    }
}

async function logout(sessionToken) {
    const apiUrl = "https://api.clippsly.com/endpoints/data/logout"
    const headers = {
        Authorization: `Bearer ${sessionToken}`,
    }

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: headers,
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        window.location.reload(true)
    } catch (error) {
        console.error("Error during logout:", error)
    }
}

function handleInvalidSession() {
    document.getElementById("profile-pic").src = "https://cdn.clippsly.com/brand_assets/icons/default-artist.png"
    document.getElementById("display-name").textContent = "Log In"

    document.getElementById("user-dropdown-menu").classList.add("d-none")

    document.getElementById("profile-pic").addEventListener("click", visitLoginPage)
    document.getElementById("display-name").addEventListener("click", visitLoginPage)
}

document.addEventListener("DOMContentLoaded", fetchUserData)
