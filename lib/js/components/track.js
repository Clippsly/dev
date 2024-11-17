import { Controller } from 'stimulus'

// Track data loder
Stimulus.register(
    'trackDataLoader',
    class extends Controller {
        static targets = []

        initialize() {
            this.trackData = this
        }

        connect() {}
    }
)
