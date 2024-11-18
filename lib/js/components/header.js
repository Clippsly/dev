import { Controller } from 'stimulus'

const sessionToken = getCookie('CLIPSESSIONTOKEN')
// if (!sessionToken) {
//     return
// }

const apiUrl =
    'https://api.clippsly.com/endpoints/data/current-session'
const headers = {
    Authorization: `Bearer ${sessionToken}`,
}

// Search bar
Stimulus.register(
    'header',
    class extends Controller {
        static targets = ['pfp', 'pfpImg', 'pfpDropdown', 'results']

        connect() {
            this.pfpTarget.style.cursor = 'pointer'
            // Session stuffs
            if (!sessionToken) {
                handleInvalidSession()
                return
            }
            try {
                const userData = fetch(apiUrl, {
                    method: 'GET',
                    headers: headers,
                })
                    .then(() => {
                        if (!response.ok)
                            throw new Error(
                                `HTTP error! status: ${response.status}`
                            )
                    })
                    .then(() => response.json())

                window.validSession = true

                // TODO: FAKE DATA FOR TESTING ON DEV BRANCH

                // window.userData = {
                //     name: 'skibidimiku_',
                //     userID: 1234,
                //     displayName: 'Skibidimiku_',
                //     avatar: 'https://cdn.clippsly.com/submissions/user_avatars/eb2117238feaa972d9b84f91e3c720cf859e14c2.jpg',
                //     banner: 'https://cdn.clippsly.com/brand_assets/icons/default-artist.png',
                //     balance: 87,
                //     status: {
                //         isAdmin: true,
                //         isFeedback: false,
                //         isArtist: false,
                //         isVerified: true,
                //         isModerated: false,
                //     },
                //     connections: {
                //         roblox: null,
                //         youtube: null,
                //         soundcloud: null,
                //         twitch: null,
                //         discord: null,
                //     },
                //     lastOnline: '1731682489',
                //     joinDate: '1723583811',
                // }

                this.pfpImgTarget.src =
                    userData.avatar ||
                    'https://cdn.clippsly.com/brand_assets/icons/default-artist.png'

                pingServer(sessionToken)

                setInterval(() => {
                    pingServer(sessionToken)
                }, 4 * 60 * 1000)
            } catch (error) {
                console.error('Error fetching user data:', error)
                handleInvalidSession()
            }
        }

        pfpClick() {
            this.pfpDropdownTarget.togglePopover()
        }

        pfpToggled(event) {
            if (event.newState === 'open') {
                this.pfpTarget.ariaExpanded = true
            } else {
                this.pfpTarget.ariaExpanded = false
            }
        }

        // get results() {
        //     return this.resultsTarget
        // }
    }
)

async function pingServer(sessionToken) {
    const apiUrl = 'https://api.clippsly.com/endpoints/data/pulse'
    const headers = {
        Authorization: `Bearer ${sessionToken}`,
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: headers,
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
    } catch (error) {
        console.error('Error pinging the server:', error)
    }
}

async function logout(sessionToken) {
    const apiUrl = 'https://api.clippsly.com/endpoints/data/logout'
    const headers = {
        Authorization: `Bearer ${sessionToken}`,
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: headers,
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        window.location.reload(true)
    } catch (error) {
        console.error('Error during logout:', error)
    }
}
