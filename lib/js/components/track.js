import { Controller } from 'stimulus'

// Track data loder
Stimulus.register(
    'track',
    class extends Controller {
        static values = {
            link: String,
        }

        connect() {
            this.element.addEventListener('click', (e) => {
                e.preventDefault()
                loadPage(this.linkValue)
                return false
            })
        }
    }
)
