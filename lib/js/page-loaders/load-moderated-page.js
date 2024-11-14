function visitModeratedPage() {
    event.preventDefault()
    document.title = `Not Approved | Clippsly`
    window.history.pushState({}, "", `/not-approved`)

    document.querySelector(".container").innerHTML = `
        <h2 id="status-title"></h2>
        <p id="status-message"></p>
        <fieldset id="item-field" style="display: none;">
            <legend>Violation</legend>
            <p id="status-item"></p>
        </fieldset>
        <p id="status-quote"></p>
        <small id="contact-message" style="display:none;">If you believe this is in error, please contact us via <strong><a href="https://support.clippsly.com/index.php?a=add&custom2=Moderation+Appeal" target="_blank">Support Portal</a>.</strong></small><br>
        <form id="reactivate-form" method="post" style="display:none;">
            <input type="hidden" name="reactivate" value="1">
            <button class="btn btn-secondary" type="submit" name="reactivateBan">Dismiss</button>
        </form>
    `

    const sessionToken = getCookie("CLIPSESSIONTOKEN")

    function formatDate(timestamp) {
        return new Date(timestamp * 1000).toLocaleString("en-US", {
            timeZone: "Europe/Warsaw",
        })
    }

    function handleModeration(data) {
        const titleElement = document.getElementById("status-title")
        const messageElement = document.getElementById("status-message")
        const quoteElement = document.getElementById("status-quote")
        const itemElement = document.getElementById("status-item")
        const itemFieldElement = document.getElementById("item-field")
        const contactMessageElement = document.getElementById("contact-message")
        const reactivateForm = document.getElementById("reactivate-form")

        const {
            type: moderationType,
            reason: moderationReason,
            item: moderationItem,
            reactivable = false,
            duration: banDuration,
            ends: banEnds,
        } = data

        const banExpiration = banEnds ? formatDate(banEnds) : "N/A"

        if (moderationType === "ban") {
            titleElement.textContent = `Banned for ${banDuration}`
            messageElement.innerHTML = `Our service moderation has taken action on your account.<br>Expires on: ${banExpiration} (UTC+2)<br><br><strong>Reason:</strong> ${moderationReason}`
            quoteElement.innerHTML = `We want everyone to enjoy using Clippsly, please keep your content<br>within our <strong><a href="https://cliply.link/terms" target="_blank">Terms Of Use</a></strong> and our <strong><a href="https://clippsly.com/support/resources/guidelines" target="_blank">Community Guidelines</a></strong>.`
            itemElement.innerHTML = moderationItem || ""
            contactMessageElement.style.display = "block"

            if (moderationItem) {
                itemFieldElement.style.display = "block"
            }

            if (reactivable && Date.now() / 1000 > banEnds) {
                reactivateForm.style.display = "block"
            } else {
                reactivateForm.style.display = "none"
            }
        } else if (moderationType === "warning") {
            titleElement.textContent = "Warning"
            messageElement.innerHTML = `Our service moderation has taken action on your account.<br><br><strong>Reason:</strong> ${moderationReason}`
            quoteElement.innerHTML = `We want everyone to enjoy using Clippsly, please keep your content<br>within our <strong><a href="https://cliply.link/terms" target="_blank">Terms Of Use</a></strong> and our <strong><a href="https://clippsly.com/support/resources/guidelines" target="_blank">Community Guidelines</a></strong>.`
            itemElement.innerHTML = moderationItem || ""
            contactMessageElement.style.display = "block"
            reactivateForm.style.display = "block"

            if (moderationItem) {
                itemFieldElement.style.display = "block"
            }
        } else if (moderationType === "termination") {
            titleElement.textContent = "Account Closed"
            messageElement.innerHTML = `Our service moderation team has closed your account.<br><br><strong>Reason:</strong> ${moderationReason}`
            quoteElement.innerHTML = `Your account has been terminated.<br><strong><a href="https://cliply.link/terms" target="_blank">Terms Of Use</a></strong> and <strong><a href="https://clippsly.com/support/resources/guidelines" target="_blank">Community Guidelines</a></strong>.`
            itemElement.innerHTML = moderationItem || ""
            contactMessageElement.style.display = "block"

            if (moderationItem) {
                itemFieldElement.style.display = "block"
            }

            reactivateForm.style.display = "none"
        }
    }

    function handleError() {
        visitErrorPage(404)
    }

    fetch("https://api.clippsly.com/endpoints/moderation/account-status", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${sessionToken}`,
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            if (data && data.moderated) {
                handleModeration(data)
            } else {
                handleError()
            }
        })
        .catch(handleError)

    document.getElementById("reactivate-form")?.addEventListener("submit", function (event) {
        event.preventDefault()
        fetch("https://api.clippsly.com/endpoints/moderation/account-reactivation", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${sessionToken}`,
                "Content-Type": "application/json",
            },
        })
            .then(() => {
                location.reload()
            })
            .catch(() => {
                location.reload()
            })
    })
}
