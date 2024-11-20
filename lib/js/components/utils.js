this.createTrack = (trackData, likelyLCPElement) => {
    const container = document.createElement('a')
    container.classList.add('track')
    container.href = `/track/${trackData.ID}`
    container.setAttribute('data-controller', 'track')
    container.setAttribute(
        'data-track-link-value',
        `/users/${trackData.releaseAuthor.authorUsername}`
    )
    container.setAttribute(
        'data-track-pfpimg-value',
        trackData.releaseAuthor.authorAvatar ??
            'https://cdn.clippsly.com/brand_assets/icons/default-artist.png'
    )
    container.setAttribute(
        'data-track-coverimg-value',
        trackData.ArtCover ??
            'https://cdn.clippsly.com/brand_assets/icons/default-artist.png'
    )

    const trackCover = document.createElement('div')

    trackCover.classList.add('track-cover')
    trackCover.classList.add('skeleton-load-bg')

    const trackCoverImg = document.createElement('img')
    trackCoverImg.role = 'presentation'
    trackCoverImg.alt = ''
    trackCoverImg.src = trackData.ArtCover
    trackCoverImg.loading = likelyLCPElement ? 'eager' : 'lazy'
    trackCoverImg.fetchPriority = 'high'
    trackCoverImg.classList.add('skeleton-load-fg')
    trackCoverImg.setAttribute('data-global-target', 'skelimg')

    trackCover.append(trackCoverImg)

    const metadata = document.createElement('div')
    metadata.classList.add('track-metadata')

    const artistPfp = document.createElement('a')
    artistPfp.classList.add('avatar')
    artistPfp.classList.add('skeleton-load-bg')
    artistPfp.tabIndex = -1
    artistPfp.href = `/users/${trackData.releaseAuthor.authorUsername}`

    const artistPfpImg = document.createElement('img')
    artistPfpImg.role = 'presentation'
    artistPfpImg.alt = ''
    artistPfpImg.src =
        trackData.releaseAuthor.authorAvatar ??
        'https://cdn.clippsly.com/brand_assets/icons/default-artist.png'
    artistPfpImg.loading = 'eager'
    artistPfpImg.fetchPriority = 'low'
    artistPfpImg.setAttribute('data-global-target', 'skelimg')
    artistPfpImg.classList.add('skeleton-load-fg')
    artistPfp.append(artistPfpImg)

    const trackInfo = document.createElement('div')
    trackInfo.classList.add('track-info')

    const trackName = document.createElement('span')
    trackName.classList.add('track-name')
    trackName.textContent = trackData.Title

    const artistNameContainer = document.createElement('a')
    artistNameContainer.href = `/users/${trackData.releaseAuthor.authorUsername}`
    artistNameContainer.classList.add('artist-name')

    const artistName = document.createElement('span')
    artistName.textContent = trackData.releaseAuthor.authorDisplay

    artistNameContainer.append(artistName)

    if (trackData.releaseAuthor.is_verified) {
        const verifiedBadge = document.createElement('div')
        verifiedBadge.classList.add('icon')
        verifiedBadge.innerHTML =
            '<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 5C0 2.23858 2.23858 0 5 0C7.76142 0 10 2.23858 10 5C10 7.76142 7.76142 10 5 10C2.23858 10 0 7.76142 0 5ZM7.35355 4.10355C7.54882 3.90829 7.54882 3.59171 7.35355 3.39645C7.15829 3.20118 6.84171 3.20118 6.64645 3.39645L4.5 5.54289L3.35355 4.39645C3.15829 4.20118 2.84171 4.20118 2.64645 4.39645C2.45118 4.59171 2.45118 4.90829 2.64645 5.10355L4.14645 6.60355C4.34171 6.79882 4.65829 6.79882 4.85355 6.60355L7.35355 4.10355Z" fill="#2886DE"/></svg>'
        artistNameContainer.append(verifiedBadge)
    }

    trackInfo.append(trackName, artistNameContainer)

    metadata.append(artistPfp, trackInfo)
    container.append(trackCover, metadata)

    return container
}

this.createSkeletonTrack = () => {
    const container = document.createElement('div')
    container.classList.add('track')
    container.classList.add('skeleton')

    const trackCover = document.createElement('div')
    trackCover.classList.add('track-cover')
    trackCover.classList.add('skeleton-load-bg')

    const metadata = document.createElement('div')
    metadata.classList.add('track-metadata')

    const artistPfp = document.createElement('div')
    artistPfp.classList.add('avatar')
    artistPfp.classList.add('skeleton-load-bg')

    const trackInfo = document.createElement('div')
    trackInfo.classList.add('track-info')

    const trackName = document.createElement('span')
    trackName.classList.add('skeleton-load-bg')
    trackName.textContent = 'wwwwwwwwwww'

    const artistName = document.createElement('span')
    artistName.classList.add('skeleton-load-bg')
    artistName.textContent = 'wwwwwww'

    trackInfo.append(trackName, artistName)

    metadata.append(artistPfp, trackInfo)
    container.append(trackCover, metadata)
    return container
}

window.utils = this
