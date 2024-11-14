let audio = null
let isPlaying = false

function playRequestedTrack(trackId) {
    fetch(`https://api.clippsly.com/endpoints/data/track?id=${trackId}`)
        .then((response) => response.json())
        .then((trackData) => {
            const audioSrc = trackData.additionalData.audioFile
            const coverSrc = trackData.additionalData.releaseCoverArt
            const trackTitle = trackData.releaseName
            const trackArtist = trackData.releaseAuthor.authorDisplay
            const trackDuration = trackData.additionalData.audioDuration
            const volume = document.querySelector("#volume-slider").value / 100

            const artCover = document.querySelector("#art-cover")
            const trackTitleEl = document.querySelector("#track-title")
            const artistNameEl = document.querySelector("#artist-name")
            const totalTimeEl = document.querySelector("#total-time")
            const currentTimeEl = document.querySelector("#current-time")
            const progressSlider = document.querySelector("#progress-slider")
            const playPauseBtn = document.querySelector("#play-pause-btn img")
            const volumeSlider = document.querySelector("#volume-slider")

            if (
                !artCover ||
                !trackTitleEl ||
                !artistNameEl ||
                !totalTimeEl ||
                !currentTimeEl ||
                !progressSlider ||
                !playPauseBtn ||
                !volumeSlider
            ) {
                console.error("Error: One or more elements not found.")
                return
            }

            artCover.src = coverSrc
            trackTitleEl.textContent = trackTitle
            artistNameEl.textContent = trackArtist
            totalTimeEl.textContent = trackDuration
            currentTimeEl.textContent = "0:00"
            progressSlider.value = 0
            progressSlider.disabled = false
            document.querySelector("#play-tab").classList.add("visible")

            if (audio) {
                audio.pause()
                audio = null
            }

            audio = new Audio(audioSrc)
            audio.volume = volume
            audio.play()
            isPlaying = true
            playPauseBtn.src = "https://cdn.clippsly.com/brand_assets/controls/pause.png"

            if ("mediaSession" in navigator) {
                navigator.mediaSession.metadata = new MediaMetadata({
                    title: trackTitle,
                    artist: trackArtist,
                    artwork: [{ src: coverSrc }],
                })
            }

            audio.ontimeupdate = function () {
                const currentTime = audio.currentTime
                const duration = audio.duration
                const progress = (currentTime / duration) * 100
                progressSlider.value = progress
                currentTimeEl.textContent = formatTime(currentTime)
            }

            progressSlider.addEventListener("input", function () {
                const seekTime = (audio.duration / 100) * this.value
                audio.currentTime = seekTime
            })

            volumeSlider.addEventListener("input", function () {
                audio.volume = this.value / 100
            })

            document.querySelector("#play-pause-btn").addEventListener("click", function () {
                if (isPlaying) {
                    audio.pause()
                    playPauseBtn.src = "https://cdn.clippsly.com/brand_assets/controls/play.png"
                } else {
                    audio.play()
                    playPauseBtn.src = "https://cdn.clippsly.com/brand_assets/controls/pause.png"
                }
                isPlaying = !isPlaying
            })
        })
        .catch((error) => console.error("Error fetching track:", error))
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
}
