function visitBalancePage() {
    event.preventDefault();
    document.title = `Balance | Clippsly`;
    window.history.pushState({}, '', `/balance`);

    document.querySelector('.container').innerHTML = `
        <h2>Account Balance</h2>
        <p><strong>Current Clipcoins:</strong> <span id="current-balance"></span> coins</p>
        <p><strong>Daily Clipcoins Available In:</strong> <span id="next-balance-time"></span></p>
        <fieldset id="membership-status-field">
            <legend>Clippsly Plus Membership</legend>
            <p><strong>Status:</strong> <span id="membership-status"></span></p>
            <p id="membership-details" style="display: none;">
                <strong>Started:</strong> <span id="membership-started"></span><br>
                <strong>Ending In:</strong> <span id="membership-ending"></span>
            </p>
            <button id="membership-button" class="btn btn-primary"></button>
        </fieldset>

        <div class="container my-5">
            <h3 class="mb-4">FAQ</h3>

            <!-- Clipcoins Section -->
            <div class="accordion" id="faqAccordion">
                <div class="accordion-item">
                    <h4 class="accordion-header" id="headingClipcoins1" class="btn btn-link w-100 text-start" type="button" data-bs-toggle="collapse" data-bs-target="#collapseClipcoins1" aria-expanded="true" aria-controls="collapseClipcoins1">
                        What are Clipcoins?
                    </h4>
                    <div id="collapseClipcoins1" class="accordion-collapse collapse show" aria-labelledby="headingClipcoins1" data-bs-parent="#faqAccordion">
                        <div class="accordion-body">
                            Clipcoins are virtual currency used on Clippsly. They can be earned through daily logins or receiving comments on your tracks. These coins are essential for various features within the platform.
                        </div>
                    </div>
                </div>

                <hr>

                <div class="accordion-item">
                    <h4 class="accordion-header" id="headingClipcoins2" class="btn btn-link w-100 text-start" type="button" data-bs-toggle="collapse" data-bs-target="#collapseClipcoins2" aria-expanded="false" aria-controls="collapseClipcoins2">
                        How can I get Clipcoins?
                    </h4>
                    <div id="collapseClipcoins2" class="accordion-collapse collapse" aria-labelledby="headingClipcoins2" data-bs-parent="#faqAccordion">
                        <div class="accordion-body">
                            You can earn Clipcoins daily by logging in or by receiving comments on your tracks. They are awarded automatically, and you can collect them every day!
                        </div>
                    </div>
                </div>

                <hr>

                <div class="accordion-item">
                    <h4 class="accordion-header" id="headingClipcoins3" class="btn btn-link w-100 text-start" type="button" data-bs-toggle="collapse" data-bs-target="#collapseClipcoins3" aria-expanded="false" aria-controls="collapseClipcoins3">
                        What can I use Clipcoins for?
                    </h4>
                    <div id="collapseClipcoins3" class="accordion-collapse collapse" aria-labelledby="headingClipcoins3" data-bs-parent="#faqAccordion">
                        <div class="accordion-body">
                            Clipcoins can be used for uploading tracks, commenting on othersâ€™ tracks, changing your username, or activating Clippsly Plus membership to unlock additional benefits.
                        </div>
                    </div>
                </div>

                <hr>

                <!-- Clippsly Plus Section -->
                <div class="accordion-item">
                    <h4 class="accordion-header" id="headingClippsly1" class="btn btn-link w-100 text-start" type="button" data-bs-toggle="collapse" data-bs-target="#collapseClippsly1" aria-expanded="false" aria-controls="collapseClippsly1">
                        What is Clippsly Plus?
                    </h4>
                    <div id="collapseClippsly1" class="accordion-collapse collapse" aria-labelledby="headingClippsly1" data-bs-parent="#faqAccordion">
                        <div class="accordion-body">
                            Clippsly Plus is a premium membership program that you can unlock with your Clipcoins. It offers several benefits, such as increased daily Clipcoin rewards and reduced costs for uploading tracks.
                        </div>
                    </div>
                </div>

                <hr>

                <div class="accordion-item">
                    <h4 class="accordion-header" id="headingClippsly2" class="btn btn-link w-100 text-start" type="button" data-bs-toggle="collapse" data-bs-target="#collapseClippsly2" aria-expanded="false" aria-controls="collapseClippsly2">
                        How do I get Clippsly Plus membership?
                    </h4>
                    <div id="collapseClippsly2" class="accordion-collapse collapse" aria-labelledby="headingClippsly2" data-bs-parent="#faqAccordion">
                        <div class="accordion-body">
                            Clippsly Plus is available for redemption using your Clipcoins. To activate it, simply use your earned coins, and youâ€™ll enjoy the perks of the membership.
                        </div>
                    </div>
                </div>

                <hr>

                <div class="accordion-item">
                    <h4 class="accordion-header" id="headingClippsly3" class="btn btn-link w-100 text-start" type="button" data-bs-toggle="collapse" data-bs-target="#collapseClippsly3" aria-expanded="false" aria-controls="collapseClippsly3">
                        What are the perks of Clippsly Plus?
                    </h4>
                    <div id="collapseClippsly3" class="accordion-collapse collapse" aria-labelledby="headingClippsly3" data-bs-parent="#faqAccordion">
                        <div class="accordion-body">
                            With Clippsly Plus, you will receive a daily increase in Clipcoin rewards (from 20 to 25 coins). The cost for uploading tracks is reduced from 20 to 15 coins, and you can comment freely without using your Clipcoins. The Plus badge on your profile.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const sessionToken = getCookie('CLIPSESSIONTOKEN');

    function formatTimeRemaining(seconds) {
        if (seconds < 0) {
            const daysAgo = Math.abs(Math.floor(seconds / 86400));
            if (daysAgo === 1) {
                return "Yesterday";
            } else {
                return `${daysAgo} Day${daysAgo > 1 ? 's' : ''} Ago`;
            }
        }
        else if (seconds === 0) {
        } else if (seconds < 86400) {
            const hours = Math.floor((seconds % 86400) / 3600).toString().padStart(2, '0');
            const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
            const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
            return `${hours}:${minutes}:${secs}`;
        } else {
            const days = Math.floor(seconds / 86400);
            return `${days} Day${days > 1 ? 's' : ''}`;
        }
    }
    
    function unixToSeconds(targetUnix) {
        const currentUnix = Math.floor(Date.now() / 1000);
        const timeDifference = targetUnix - currentUnix;
        return timeDifference;
    }
    
    function handleEconomyData(data) {
        const currentBalanceElement = document.getElementById('current-balance');
        const nextBalanceTimeElement = document.getElementById('next-balance-time');
        const membershipStatusElement = document.getElementById('membership-status');
        const membershipDetailsElement = document.getElementById('membership-details');
        const membershipStartedElement = document.getElementById('membership-started');
        const membershipEndingElement = document.getElementById('membership-ending');
        const membershipButton = document.getElementById('membership-button');
    
        const { currentBalance, lastClaimedBalance, activeMembership, membershipStarted, membershipEnding } = data;
    
        currentBalanceElement.textContent = currentBalance;
    
        const nextBalanceSeconds = unixToSeconds(lastClaimedBalance);
        nextBalanceTimeElement.textContent = formatTimeRemaining(nextBalanceSeconds);
    
        const countdownInterval = setInterval(() => {
            const updatedSeconds = nextBalanceSeconds - 1;
            if (updatedSeconds <= 0) {
                nextBalanceTimeElement.textContent = "Available Now";
                clearInterval(countdownInterval);
            } else {
                nextBalanceTimeElement.textContent = formatTimeRemaining(updatedSeconds);
            }
        }, 1000);       
    
        if (activeMembership) {
            membershipStatusElement.textContent = 'Active';
            membershipDetailsElement.style.display = 'block';
        
            const membershipStartSeconds = unixToSeconds(membershipStarted); 
            const daysAgo = Math.abs(Math.floor(membershipStartSeconds / 86400));
            membershipStartedElement.textContent = daysAgo === 0 ? "Today" : `${daysAgo} Day${daysAgo > 1 ? 's' : ''} Ago`;
        
            const membershipTimeLeft = unixToSeconds(membershipEnding);
            membershipEndingElement.textContent = formatTimeRemaining(membershipTimeLeft);
        
            membershipButton.textContent = 'Extend Membership';
            membershipButton.onclick = () => handleMembershipAction('extend');
        } else {
            membershipStatusElement.textContent = 'Inactive';
            membershipDetailsElement.style.display = 'none';
            membershipButton.textContent = 'Activate Membership';
            membershipButton.onclick = () => handleMembershipAction('activate');
        }
    }    

    function handleMembershipAction(actionType) {
        const actionText = actionType === 'activate' ? 'start' : 'extend';
        const confirmationText = `Are you sure you want to ${actionText} Clippsly Plus membership for the next 3 days?`;
    
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            text: confirmationText,
            showCancelButton: true,
            confirmButtonText: 'Yes, 75 coins',
            cancelButtonText: 'No, thanks',
        }).then(result => {
            if (result.isConfirmed) {
                fetch('https://api.clippsly.com/endpoints/functions/membership', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${sessionToken}`,
                        'Content-Type': 'application/json',
                    }
                })
                .then(response => response.json())
                .then(data => {
                    if (data && data.message) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success!',
                            text: data.message,
                            confirmButtonText: 'Yippee!'
                        }).then(() => {
                            fetchEconomyData();
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oopsie!',
                            text: data.error,
                            confirmButtonText: 'Awww!'
                        });
                    }
                })
                .catch(error => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oopsie!',
                        text: 'An unexpected error occurred. Please try again later.',
                        confirmButtonText: 'Awww!'
                    });
                    console.error(error);
                });
            }
        });
    }    

    function fetchEconomyData() {
        fetch('https://api.clippsly.com/endpoints/data/economy', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionToken}`,
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => handleEconomyData(data))
        .catch(() => {
            document.querySelector('.container').innerHTML = '<p>Error loading balance data. Please try again later.</p>';
        });
    }

    fetchEconomyData();
}
