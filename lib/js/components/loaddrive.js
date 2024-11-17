import { Controller } from 'stimulus'

// loaddriver
Stimulus.register(
    'loaddrive',
    class extends Controller {
        static targets = ['img']

        imgTargetConnected(target) {
            target.addEventListener('load', () => {
                target.classList.add('loaded')
                target.parentElement.classList.remove(
                    'skeleton-load-bg'
                )
            })
        }
    }
)
