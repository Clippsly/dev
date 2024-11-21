import { Controller } from 'stimulus'

const config = {
    subtree: true,
    attributeOldValue: true,
}

// Global/loaddriver

function hyperlinkAdded(a) {
    if (
        !a.getAttribute('href') ||
        a.getAttribute('data-global-target') == 'open-external'
    ) {
        return
    }
    a.addEventListener('click', (e) => {
        e.preventDefault()
        loadPage(a.getAttribute('href'))
    })
}

class Global extends Controller {
    static targets = ['skelimg', 'removeonload', 'openExternal']

    connect() {
        if (location.search != '') {
            history.replaceState(
                null,
                '',
                location.search.substring(1)
            )
        }

        loadPage(location.pathname)

        document.addEventListener('click', this.documentClick)
        document.addEventListener('keydown', (e) => {
            if (e.defaultPrevented) {
                return // Do nothing if the event was already processed
            }
            if (e.key == 'Enter' || e.key == ' ') {
                document.activeElement.click()
            }
        })

        window.addEventListener('popstate', (event) => {
            loadPage(document.location)
        })
    }

    documentClick(event) {
        const hyperlink = event.target.closest('a')

        if (!hyperlink) {
            return false
        }

        const isHyperlink = hyperlink.nodeName == 'A'
        const openInExternal =
            hyperlink.getAttribute('data-global-target') ==
            'open-external'

        if (isHyperlink && !openInExternal) {
            // Prevent a new page from loading
            event.preventDefault()
            loadPage(hyperlink.getAttribute('href'))
        } else if (isHyperlink && openInExternal) {
            // Prevent a new page from loading
            event.preventDefault()
            window.open(hyperlink.getAttribute('href'))
        }
    }

    domMutate(mutationList) {
        for (const mutation of mutationList) {
            if (mutation.target.getAttribute('href')) {
                hyperlinkAdded(mutation.target)
            }
        }
    }

    skelimgTargetConnected(target) {
        target.addEventListener('load', () => {
            target.classList.add('loaded')
            target.parentElement.classList.remove('skeleton-load-bg')
        })
        target.addEventListener('error', () => {
            target.classList.add('loaded')
            target.parentElement.classList.add('error')
            target.parentElement.classList.remove('skeleton-load-bg')
        })
    }

    openExternalTargetConnected(target) {
        if (!target.getAttribute('href')) {
            return
        }
        target.addEventListener('click', (e) => {
            window.open(target.getAttribute('href'))
        })
    }

    removeonloadTargetConnected(target) {
        target.remove()
    }
}

Stimulus.register('global', Global)

function loadPage(pathname) {
    if (pathname === '/') {
        loadHomePage()
    } else if (pathname.startsWith('/users/')) {
        const username = pathname.split('/')[2]
        visitUserProfile(username)
    } else if (pathname.startsWith('/track/')) {
        const id = pathname.split('/')[2]
        visitTrackPage(id)
    } else if (pathname.startsWith('/search')) {
        const query = pathname.split('?query=')[1]
        requestSearchQuery(query)
    } else if (pathname.startsWith('/error')) {
        const code = new URLSearchParams(window.location.search)
        visitErrorPage(code)
    } else if (pathname.startsWith('/upload')) {
        visitUploadPage()
    } else if (pathname.startsWith('/balance')) {
        visitBalancePage()
    } else if (pathname.startsWith('/cliptivity')) {
        const page = pathname.split('?page=')[1]
        loadCliptivityPage(page)
    } else if (
        pathname === '/login' ||
        pathname.startsWith('/login')
    ) {
        const loginParams = new URLSearchParams(
            window.location.search
        )
        visitLoginPage(loginParams)
    } else if (pathname.startsWith('/settings')) {
        const loginParams = new URLSearchParams(
            window.location.search
        )
        visitSettingsPage(loginParams)
    } else if (
        pathname === '/register' ||
        pathname.startsWith('/register')
    ) {
        const registerParams = new URLSearchParams(
            window.location.search
        )
        visitRegisterPage(registerParams)
    } else if (pathname.startsWith('/not-approved')) {
        visitModeratedPage()
    }
}
