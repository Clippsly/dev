function loadHomePage() {
    document.title = `Home | Clippsly`
    window.history.pushState({}, "", `/`)

    const container = document.querySelector(".container")

    container.innerHTML = ""

    container.innerHTML = `
        <h2>Latest Tracks</h2>
        <div id="latest-tracks" class="track-list"></div>
        
        <h2>Recommended Tracks</h2>
        <div id="recommended-tracks" class="track-list"></div>
        
        <div id="error-message" class="alert alert-danger" style="display: none;">
            <p>Failed to load tracks. Please try again.</p>
            <button id="retry-button" class="btn-secondary">Retry</button>
        </div>
    `

    const retryButton = document.getElementById("retry-button")
    retryButton.addEventListener("click", function () {
        fetchTracks()
    })

    fetchTracks()
}

function fetchTracks() {
    const latestTracksContainer = document.getElementById("latest-tracks")
    const recommendedTracksContainer = document.getElementById("recommended-tracks")
    const errorMessage = document.getElementById("error-message")

    latestTracksContainer.innerHTML = ""
    recommendedTracksContainer.innerHTML = ""
    errorMessage.style.display = "none"

    fetch("https://api.clippsly.com/endpoints/functions/home-page")
        .then((response) => response.json())
        .then((data) => {
            const latestTracks = data.latestTracks
            const recommendedTracks = data.randomTracks

            latestTracksContainer.innerHTML = generateTrackHTML(latestTracks)
            recommendedTracksContainer.innerHTML = generateTrackHTML(recommendedTracks)
        })
        .catch((error) => {
            console.error("Error fetching tracks:", error)
            errorMessage.style.display = "block"
        })
}

function generateTrackHTML(tracks) {
    return tracks
        .map((track) => {
            const verifiedBadge = track.releaseAuthor.is_verified
                ? `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" title="Verified Badge">
                <circle cx="12" cy="12" r="10" stroke-width="2" fill="#1E90FF"/>
                <path d="M8.5 12.5l2.5 2.5 5-5" stroke="white" stroke-width="2" fill="none"/>
            </svg>`
                : ""

            const truncatedTitle = track.Title.length > 10 ? track.Title.substring(0, 10) + "..." : track.Title
            const truncatedArtist =
                track.releaseAuthor.authorDisplay.length > 10
                    ? track.releaseAuthor.authorDisplay.substring(0, 10) + "..."
                    : track.releaseAuthor.authorDisplay

            return `
            <div class="track">
                <div class="cover">
                    <a href="/track/${track.ID}" onclick="visitTrackPage(${track.ID})">
                        <img src="${
                            track.ArtCover
                                ? track.ArtCover
                                : "https://cdn.clippsly.com/brand_assets/icons/default-artist.png"
                        }" 
                            alt="Track Cover" 
                            onerror="this.onerror=null; this.src='https://cdn.clippsly.com/brand_assets/icons/default-artist.png';">
                    </a>
                    <div class="play-button" onclick="playRequestedTrack(${track.ID})">
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#FFFFFF">
                                <path d="M320-222 Q300-240, 300-260 V-700 Q300-720, 320-738 Q340-750, 360-738 L760-518 Q780-500, 780-480 Q780-460, 760-442 L360-222 Q340-210, 320-222 Z" fill="#FFFFFF"/>
                            </svg>
                        </span>
                    </div>
                </div>
                <div class="details">
                    <a href="/users/${track.releaseAuthor.authorUsername}" onclick="visitUserProfile('${
                track.releaseAuthor.authorUsername
            }')">
                        <img src="${
                            track.releaseAuthor.authorAvatar
                                ? track.releaseAuthor.authorAvatar
                                : "https://cdn.clippsly.com/brand_assets/icons/default-artist.png"
                        }" 
                            alt="Profile Picture" 
                            class="profile-pic" 
                            onerror="this.onerror=null; this.src='https://cdn.clippsly.com/brand_assets/icons/default-artist.png';">
                    </a>
                    <div class="text">
                        <a href="/track/${track.ID}" onclick="visitTrackPage(${
                track.ID
            })"><p class="track-title">${truncatedTitle}</p></a>
                        <a href="/users/${track.releaseAuthor.authorUsername}" onclick="visitUserProfile('${
                track.releaseAuthor.authorUsername
            }')"><p class="track-artist">${truncatedArtist} ${verifiedBadge}</p></a>
                    </div>
                </div>
            </div>
        `
        })
        .join("")
}
