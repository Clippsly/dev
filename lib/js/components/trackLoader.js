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
                    data.latestTracks.forEach((trackData) => {
                        this.latestTarget.append(
                            utils.createTrack(trackData)
                        )
                    })
                }
                if (this.recommendedTarget) {
                    this.recommendedTarget.innerHTML = ''
                    data.randomTracks.forEach((trackData) => {
                        this.recommendedTarget.append(
                            utils.createTrack(trackData)
                        )
                    })
                }
            } catch (error) {
                console.error(error)
            }
        }
    }
)
