import { Controller } from 'stimulus'

const config = {
    subtree: true,
    attributeOldValue: true,
}

// Global/loaddriver

function hyperlinkAdded(a) {
    console.log(a.getAttribute('href'))
    a.addEventListener('click', (e) => {
        e.preventDefault()
        loadPage(a.getAttribute('href'))
    })
}

class Global extends Controller {
    static targets = ['skelimg']

    connect() {
        const observer = new MutationObserver(this.domMutate)
        observer.observe(document.body, config)

        loadPage(location.pathname)

        document.querySelectorAll('a').forEach((hyperlink) => {
            hyperlinkAdded(hyperlink)
        })

        window.onpopstate = function (event) {
            loadPage(location.pathname)
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
            target.classList.add('error')
            target.classList.add('loaded')
            target.href =
                'https://cdn.clippsly.com/brand_assets/icons/default-artist.png'
            target.parentElement.classList.remove('skeleton-load-bg')
        })
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
        const queryParams = new URLSearchParams(
            window.location.search
        )
        const query = queryParams.get('query')
        requestSearchQuery(query)
    } else if (pathname.startsWith('/error')) {
        const errorParams = new URLSearchParams(
            window.location.search
        )
        const code = errorParams.get('code')
        visitErrorPage(code)
    } else if (pathname.startsWith('/upload')) {
        visitUploadPage()
    } else if (pathname.startsWith('/balance')) {
        visitBalancePage()
    } else if (pathname.startsWith('/cliptivity')) {
        const queryParams = new URLSearchParams(
            window.location.search
        )
        const page = queryParams.get('page')
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

async function openExternalWebsite(site) {
    window.open(site)
}
