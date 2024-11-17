import { Controller } from 'stimulus'

// Search bar
Stimulus.register(
    'search',
    class extends Controller {
        static targets = ['query', 'results']

        search() {
            requestSearchQuery(this.query)
        }

        showAutocomplete() {
            this.results.showPopover()
        }

        hideAutocomplete() {
            this.results.hidePopover()
        }

        async autocomplete() {
            const query = this.query
            if (query.length > 0) {
                const url = 'https://api.clippsly.com/endpoints/functions/search-suggestions?query=' + query
                try {
                    const response = await fetch(url, {
                        method: 'GET',
                    })

                    if (!response.ok) {
                        throw new Error(`Response status: ${response.status}`)
                    }

                    const json = await response.json()
                    console.log(json)

                    this.showAutocomplete()
                    this.results.innerHTML = ''

                    const suggestions = json
                    let i = 0
                    suggestions.forEach((suggestion) => {
                        i++
                        const element = document.createElement('li')
                        element.tabIndex = i
                        element.classList.add('menu-item')
                        element.setAttribute('data-action', 'click->search#searchAutocompleteQuery')

                        const link = document.createElement('a')
                        link.href = '/search?query=' + suggestion
                        link.textContent = suggestion

                        element.append(link)

                        this.results.append(element)
                    })
                } catch (error) {
                    console.error(error.message)
                }
            } else {
                this.results.innerHTML = ''
            }
        }

        async searchAutocompleteQuery(event) {
            const query = event.target.textContent
            this.queryTarget.value = query
            requestSearchQuery(query)
            await this.autocomplete()
            this.hideAutocomplete()
        }

        get query() {
            return this.queryTarget.value
        }

        get results() {
            return this.resultsTarget
        }
    }
)
