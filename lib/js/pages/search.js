import { Controller } from 'stimulus'

// Search
class Search extends Controller {
    static targets = []

    connect() {
        window.addEventListener('storage', function (event) {
            if (event.key === 'sessionToken') {
                window.location.reload()
            }
        })
    }

    email() {
        console.log('IMPLEMENT ME!')
    }
}

Stimulus.register('search', Search)
