function getCookie(name) {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(";").shift()
    return null
}

async function fetchSessionData() {
    const sessionToken = getCookie("CLIPSESSIONTOKEN")

    if (!sessionToken) {
        console.error("Session token not found!")
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
        handleUserData(userData)
    } catch (error) {
        console.error("Error fetching session data:", error)
    }
}

function handleUserData(userData) {
    const isModerated = userData?.status?.isModerated === true
    const notApprovedUrl = "https://pre.clippsly.com/not-approved"

    if (isModerated) {
        const redirectToModeratedPage = () => {
            const currentUrl = window.location.href
            if (!currentUrl.includes(notApprovedUrl)) {
                visitModeratedPage()
            }
        }

        redirectToModeratedPage()

        const checkModeratedInterval = setInterval(redirectToModeratedPage, 1000)

        window.addEventListener("popstate", redirectToModeratedPage)

        return () => {
            clearInterval(checkModeratedInterval)
            window.removeEventListener("popstate", redirectToModeratedPage)
        }
    }
}

fetchSessionData()
