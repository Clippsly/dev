function requestSearchQuery(query) {
    event.preventDefault()

    document.querySelector('.container').innerHTML = `
        <div class="search-results" id="search-results">
            <div class="user-list" id="users-results"></div>
            <div class="track-list" id="tracks-results"></div>
        </div>
    `

    window.history.pushState({}, '', `/search?query=${query}`)
    document.title = `${query} | Clippsly`

    fetch(
        `https://api.clippsly.com/endpoints/functions/search-results?query=${query}`
    )
        .then((response) => response.json())
        .then((data) => {
            displayUsers(data.users)
            displayTracks(data.tracks)
        })
        .catch((error) => console.error('Error:', error))
}

function displayUsers(users) {
    const usersResults = document.getElementById('users-results')
    usersResults.innerHTML = ''

    users.forEach((user) => {
        const verifiedBadge = user.is_verified
            ? `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" title="Verified Badge">
            <circle cx="12" cy="12" r="10" stroke-width="2" fill="#1E90FF"/>
            <path d="M8.5 12.5l2.5 2.5 5-5" stroke="white" stroke-width="2" fill="none"/>
        </svg>`
            : ''

        const userHTML = `
        <a href="/users/${user.username}" onclick="visitUserProfile('${user.username}')">
            <div class="user">
                <div class="avatar">
                    <img src="${user.avatar}"
                        alt="${user.displayname}"
                        onerror="this.onerror=null; this.src='https://cdn.clippsly.com/brand_assets/icons/default-artist.png';">
                </div>
                <div class="user-details">
                    <span class="displayname">${user.displayname} ${verifiedBadge}</span>
                    <span class="username">@${user.username}</span>
                </div>
            </div>
            </a>
        `
        usersResults.innerHTML += userHTML
    })
}

function displayTracks(tracks) {
    const tracksResults = document.getElementById('tracks-results')
    tracksResults.innerHTML = ''

    tracks.forEach((track) => {
        console.log(track)
        tracksResults.append(
            createTrack({
                ID: track.releaseID,
                Title: track.releaseName,
                Artist: '1274',
                // Genre: 'Unknown',
                ArtCover: track.additionalData.releaseCoverArt,
                Audio: 'https://cdn.clippsly.com/submissions/audio/bc44279d62fac0a8e56a956c91dc94d8f0e86d17.mp3',
                // Description: '',
                // commentsOff: 1,
                // isModerated: 0,
                // isExplicit: 0,
                // isProtected: 0,
                // isUnderReview: 0,
                // isArtificiallyGenerated: 0,
                audio_duration: track.additionalData.audioDuration,
                releaseDate: track.additionalData.premiereDate,
                releaseAuthor: {
                    authorUsername:
                        track.releaseAuthor.authorUsername || 'FIXME',
                    authorDisplay: track.releaseAuthor.authorDisplay,
                    authorAvatar: track.releaseAuthor.authorAvatar,
                    is_verified: track.releaseAuthor.authorVerified,
                },
            })
        )
    })
}

// const searchInput = document.getElementById("search-input")
// const searchButton = document.getElementById("search-button")

// searchInput.addEventListener("keydown", function (event) {
//     if (event.key === "Enter") {
//         event.preventDefault()
//         requestSearchQuery(searchInput.value)
//     }
// })
