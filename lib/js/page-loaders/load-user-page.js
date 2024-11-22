function visitUserProfile(username) {
    if (username) {
        document.querySelector('.container').innerHTML = `
            <div class="users" id="user-profile"></div>
            <div class="track-list" id="track-list"></div>
        `

        $.ajax({
            url: `https://api.clippsly.com/endpoints/data/user?username=${username}`,
            method: 'GET',
            success: function (response) {
                const user = response

                document.title = `${user.displayName} | Clippsly`
                window.history.pushState({}, '', `/users/${username}`)

                const badges = []
                if (user.status.isAdmin)
                    badges.push(
                        '<a name="Administrator" data-global-target="openExternal" href="/team"><img src="https://cdn.clippsly.com/brand_assets/badges/version_5/Moderators.png" class="badge-icon"></a>'
                    )
                if (user.status.isFeedback)
                    badges.push(
                        '<a name="Community Feedback" data-global-target="openExternal" href="/contributor"><img src="https://cdn.clippsly.com/brand_assets/badges/version_5/Contributor.png" class="badge-icon"></a>'
                    )
                if (user.status.isPlus)
                    badges.push(
                        '<a name="Plus" data-global-target="openExternal"><img src="https://cdn.clippsly.com/brand_assets/badges/version_5/Plus.png" class="badge-icon"></a>'
                    )

                const connections = []
                if (user.connections.roblox)
                    connections.push(
                        `<a href="https://roblox.com/users/${user.connections.roblox}/profile" target="_blank"><img src="https://cdn.clippsly.com/brand_assets/connection_icons/roblox-connection.png" class="connection-icon"></a>`
                    )
                if (user.connections.youtube)
                    connections.push(
                        `<a href="https://youtube.com/${user.connections.youtube}" target="_blank"><img src="https://cdn.clippsly.com/brand_assets/connection_icons/youtube-connection.png" class="connection-icon"></a>`
                    )
                if (user.connections.soundcloud)
                    connections.push(
                        `<a href="https://soundcloud.com/${user.connections.soundcloud}" target="_blank"><img src="https://cdn.clippsly.com/brand_assets/connection_icons/soundcloud-connection.png" class="connection-icon"></a>`
                    )
                if (user.connections.twitch)
                    connections.push(
                        `<a href="https://twitch.tv/${user.connections.twitch}" target="_blank"><img src="https://cdn.clippsly.com/brand_assets/connection_icons/twitch-connection.png" class="connection-icon"></a>`
                    )

                const verifiedBadge = user.status.isVerified
                    ? `
                    <div class="icon" title="Verified">
                        <svg
                            width="10"
                            height="10"
                            viewBox="0 0 10 10"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M0 5C0 2.23858 2.23858 0 5 0C7.76142 0 10 2.23858 10 5C10 7.76142 7.76142 10 5 10C2.23858 10 0 7.76142 0 5ZM7.35355 4.10355C7.54882 3.90829 7.54882 3.59171 7.35355 3.39645C7.15829 3.20118 6.84171 3.20118 6.64645 3.39645L4.5 5.54289L3.35355 4.39645C3.15829 4.20118 2.84171 4.20118 2.64645 4.39645C2.45118 4.59171 2.45118 4.90829 2.64645 5.10355L4.14645 6.60355C4.34171 6.79882 4.65829 6.79882 4.85355 6.60355L7.35355 4.10355Z"
                                fill="#2886DE"
                            ></path>
                        </svg>
                    </div>`
                    : ''

                const moderatedBadge = user.status.isModerated
                    ? `<h5><span class="badge badge-danger">Banned</span></h5>`
                    : ''

                const profileHTML = `
                    <div class="profile-banner" style="background-image: url('${
                        user.banner
                    }');">
                        <div class="badges">${badges.join('')}</div>
                        <div class="connections">${connections.join(
                            ''
                        )}</div>
                    </div>
                    <div class="profile-details">
                        <div class="avatar-container" bis_skin_checked="1">
                            <img class="profile-avatar" 
                            src="${user.avatar}" 
                            alt="${user.displayName}" 
                            onerror="this.onerror=null; this.src='https://cdn.clippsly.com/brand_assets/icons/default-artist.png';" 
                            class="profile-avatar">

                            <span class="online-indicator" id="online-indicator"></span>
                        </div>
                        <h2 class="artist-name">${
                            user.displayName
                        } ${verifiedBadge}</h2>
                        ${moderatedBadge}
                    </div>
                `

                $('#user-profile').html(profileHTML)

                const onlineIndicator = document.getElementById(
                    'online-indicator'
                )

                if (user.status.isOnline) {
                    onlineIndicator.style.backgroundColor = '#00ff00'
                    onlineIndicator.title = 'Online'
                } else {
                    onlineIndicator.style.backgroundColor = '#8c8c8c'
                    const lastOnlineDate = new Date(
                        user.lastOnline * 1000
                    ).toLocaleString()
                    onlineIndicator.title = `Last online: ${lastOnlineDate}`
                }
            },
            error: function () {
                visitErrorPage(404)
            },
        })

        $.ajax({
            url: `https://api.clippsly.com/endpoints/data/track?username=${username}`,
            method: 'GET',
            success: function (tracks) {
                tracks.forEach((track) => {
                    console.log(track)
                    // TODO: FIXME
                    document.getElementById('track-list').append(
                        createTrack({
                            ID: track.releaseID,
                            Title: track.releaseName,
                            Artist: '1274',
                            // Genre: 'Unknown',
                            ArtCover:
                                track.additionalData.releaseCoverArt,
                            Audio: 'https://cdn.clippsly.com/submissions/audio/bc44279d62fac0a8e56a956c91dc94d8f0e86d17.mp3',
                            // Description: '',
                            // commentsOff: 1,
                            // isModerated: 0,
                            // isExplicit: 0,
                            // isProtected: 0,
                            // isUnderReview: 0,
                            // isArtificiallyGenerated: 0,
                            audio_duration:
                                track.additionalData.audioDuration,
                            releaseDate:
                                track.additionalData.premiereDate,
                            releaseAuthor: {
                                authorUsername:
                                    track.releaseAuthor
                                        .authorUsername || 'FIXME',
                                authorDisplay:
                                    track.releaseAuthor.authorDisplay,
                                authorAvatar:
                                    track.releaseAuthor.authorAvatar,
                                is_verified:
                                    track.releaseAuthor
                                        .authorVerified,
                            },
                        })
                    )
                })
            },
            error: function () {
                $('#track-list').html('')
            },
        })
    } else {
        visitErrorPage(404)
    }
}
