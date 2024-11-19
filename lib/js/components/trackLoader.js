import { Controller } from 'stimulus'

const apiUrl =
    'https://api.clippsly.com/endpoints/functions/home-page'

// Tracks
Stimulus.register(
    'trackLayout',
    class extends Controller {
        static targets = ['latest', 'recommended']

        async connect() {
            try {
                const data = await fetch(apiUrl).then((response) =>
                    response.json()
                )
                if (this.latestTarget) {
                    this.latestTarget.innerHTML = ''
                    let i = 0
                    data.latestTracks.forEach((trackData) => {
                        i++
                        if (i > 6) {
                            this.latestTarget.append(
                                utils.createTrack(trackData, false)
                            )
                        } else {
                            this.latestTarget.append(
                                utils.createTrack(trackData, true)
                            )
                        }
                    })
                }
                if (this.recommendedTarget) {
                    this.recommendedTarget.innerHTML = ''
                    let i = 0
                    data.randomTracks.forEach((trackData) => {
                        i++
                        if (i > 6) {
                            this.recommendedTarget.append(
                                utils.createTrack(trackData, false)
                            )
                        } else {
                            this.recommendedTarget.append(
                                utils.createTrack(trackData, true)
                            )
                        }
                    })
                }
            } catch (error) {
                console.error(error)
            }
        }
    }
)
