function visitUserProfile(username) {
    event.preventDefault()
    if (username) {
        
        document.querySelector('.container').innerHTML = `
            <div class="users" id="user-profile"></div>
            <div class="track-list" id="track-list"></div>
        `;

        $.ajax({
            url: `https://api.clippsly.com/endpoints/data/user?username=${username}`,
            method: 'GET',
            success: function(response) {
                const user = response;
        
                document.title = `${user.displayName} | Clippsly`;
                window.history.pushState({}, '', `/users/${username}`);
        
                const badges = [];
                if (user.status.isAdmin) badges.push('<a data-tooltip="Administrator" href="/team" target="_blank"><img src="https://cdn.clippsly.com/brand_assets/badges/version_5/Moderators.png" class="badge-icon"></a>');
                if (user.status.isFeedback) badges.push('<a data-tooltip="Community Feedback" href="/contributor" target="_blank"><img src="https://cdn.clippsly.com/brand_assets/badges/version_5/Contributor.png" class="badge-icon"></a>');
                if (user.status.isPlus) badges.push('<a data-tooltip="Plus" target="_blank"><img src="https://cdn.clippsly.com/brand_assets/badges/version_5/Plus.png" class="badge-icon"></a>');

                const connections = [];
                if (user.connections.roblox) connections.push(`<a href="https://roblox.com/users/${user.connections.roblox}/profile" target="_blank"><img src="https://cdn.clippsly.com/brand_assets/connection_icons/roblox-connection.png" class="connection-icon"></a>`);
                if (user.connections.youtube) connections.push(`<a href="https://youtube.com/${user.connections.youtube}" target="_blank"><img src="https://cdn.clippsly.com/brand_assets/connection_icons/youtube-connection.png" class="connection-icon"></a>`);
                if (user.connections.soundcloud) connections.push(`<a href="https://soundcloud.com/${user.connections.soundcloud}" target="_blank"><img src="https://cdn.clippsly.com/brand_assets/connection_icons/soundcloud-connection.png" class="connection-icon"></a>`);
                if (user.connections.twitch) connections.push(`<a href="https://twitch.tv/${user.connections.twitch}" target="_blank"><img src="https://cdn.clippsly.com/brand_assets/connection_icons/twitch-connection.png" class="connection-icon"></a>`);
        
                const verifiedBadge = user.status.isVerified ? `
                    <svg data-tooltip="Verified" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" title="Verified Badge">
                        <circle cx="12" cy="12" r="10" stroke-width="2" fill="#1E90FF"/>
                        <path d="M8.5 12.5l2.5 2.5 5-5" stroke="white" stroke-width="2" fill="none"/>
                    </svg>` : '';
        
                const moderatedBadge = user.status.isModerated ? `<h5><span class="badge badge-danger">Banned</span></h5>` : '';
        
                const profileHTML = `
                    <div class="profile-banner" style="background-image: url('${user.banner}');">
                        <div class="badges">${badges.join('')}</div>
                        <div class="connections">${connections.join('')}</div>
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
                        <h2>${user.displayName} ${verifiedBadge}</h2>
                        ${moderatedBadge}
                    </div>
                `;
        
                $('#user-profile').html(profileHTML);
        
                const onlineIndicator = document.getElementById('online-indicator');
        
                if (user.status.isOnline) {
                    onlineIndicator.style.backgroundColor = '#00ff00';
                    onlineIndicator.title = 'Online';
                } else {
                    onlineIndicator.style.backgroundColor = '#8c8c8c';
                    const lastOnlineDate = new Date(user.lastOnline * 1000).toLocaleString();
                    onlineIndicator.title = `Last online: ${lastOnlineDate}`;
                }
            },
            error: function() {
                visitErrorPage(404);
            }
        });        

        $.ajax({
            url: `https://api.clippsly.com/endpoints/data/track?username=${username}`,
            method: 'GET',
            success: function(tracks) {
                const trackListHTML = tracks.reverse().map(track => {
                    const verifiedBadge = track.releaseAuthor.authorVerified ? `
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" title="Verified Badge">
                        <circle cx="12" cy="12" r="10" stroke-width="2" fill="#1E90FF"/>
                        <path d="M8.5 12.5l2.5 2.5 5-5" stroke="white" stroke-width="2" fill="none"/>
                    </svg>` : '';

                    const truncatedTitle = track.releaseName.length > 10 ? track.releaseName.substring(0, 10) + '...' : track.releaseName;
                    const truncatedArtist = track.releaseAuthor.authorDisplay.length > 10 ? track.releaseAuthor.authorDisplay.substring(0, 10) + '...' : track.releaseAuthor.authorDisplay;
                    return `
                        <div class="track">
                            <div class="cover">
                                <a href="/track/${track.releaseID}" onclick="visitTrackPage(${track.releaseID})">
                                    <img src="${track.additionalData.releaseCoverArt || 'https://cdn.clippsly.com/brand_assets/icons/default-artist.png'}" 
                                        alt="Track Cover" 
                                        onerror="this.onerror=null; this.src='https://cdn.clippsly.com/brand_assets/icons/default-artist.png';">
                                </a>
                                <div class="play-button" onclick="playRequestedTrack(${track.releaseID})">
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#FFFFFF">
                                            <path d="M320-222 Q300-240, 300-260 V-700 Q300-720, 320-738 Q340-750, 360-738 L760-518 Q780-500, 780-480 Q780-460, 760-442 L360-222 Q340-210, 320-222 Z" fill="#FFFFFF"/>
                                        </svg>
                                    </span>
                                </div>
                            </div>
                            <div class="details">
                                <a href="/users/${track.releaseAuthor.authorUsername}" onclick="visitUserProfile('${track.releaseAuthor.authorUsername}')">
                                    <img src="${track.releaseAuthor.authorAvatar}" 
                                        alt="${truncatedArtist}" 
                                        class="profile-pic" 
                                        onerror="this.onerror=null; this.src='https://cdn.clippsly.com/brand_assets/icons/default-artist.png';">
                                </a>

                                <div class="text">
                                    <a href="/track/${track.releaseID}" onclick="visitTrackPage(${track.releaseID})"><p class="track-title">${truncatedTitle}</p></a>
                                    <a href="/users/${track.releaseAuthor.authorUsername}" onclick="visitUserProfile('${track.releaseAuthor.authorUsername}')"><p >${truncatedArtist} ${verifiedBadge}</p></a>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');

                $('#track-list').html(trackListHTML);
            },
            error: function() {
                $('#track-list').html('');
            }
        });
    } else {
        visitErrorPage(404);
    }
}