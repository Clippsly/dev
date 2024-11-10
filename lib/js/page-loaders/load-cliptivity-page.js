let currentPage = 1;

function loadCliptivityPage(page) {
    event.preventDefault();
    window.history.pushState({}, '', `/cliptivity?page=${page}`);
    document.title = `Cliptivity | Clippsly`;

    const container = document.querySelector('.container');

    fetch(`https://api.clippsly.com/endpoints/functions/cliptivity?page=${page}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            container.innerHTML = '';
            container.innerHTML += `<h1>Cliptivity</h1><br>`;

            console.log("API Response:", data);

            if (Array.isArray(data.actionList) && data.actionList.length > 0) {
                data.actionList.forEach(action => {
                    const cliptivityDiv = document.createElement('div');
                    cliptivityDiv.classList.add('cliptivity');

                    const actionDescription = parseActionDescription(action.actionDescription);

                    cliptivityDiv.innerHTML = `
                        <img src="${action.userInfo.userAvatar}" 
                            alt="${action.userInfo.userDisplayName || 'User Avatar'}" 
                            class="cliptivity-avatar" 
                            onerror="this.onerror=null; this.src='https://cdn.clippsly.com/brand_assets/icons/default-artist.png';">
                        <div class="cliptivity-content">
                            <p class="cliptivity-author">
                                <a href="/users/${action.userInfo.userUsername}" onclick="visitUserProfile('${action.userInfo.userUsername}')">
                                    ${action.userInfo.userDisplay} 
                                    ${action.userInfo.userVerified ? `
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" title="Verified Badge">
                                            <circle cx="12" cy="12" r="10" stroke-width="2" fill="#1E90FF"></circle>
                                            <path d="M8.5 12.5l2.5 2.5 5-5" stroke="white" stroke-width="2" fill="none"></path>
                                        </svg>` : ''}
                                </a>
                                <span class="cliptivity-action">${actionDescription}</span>
                            </p>
                            <p class="cliptivity-date">${formatTimestamp(action.actionTime)}</p>
                        </div>
                    `;
                    container.appendChild(cliptivityDiv);
                });

                const paginationDiv = document.createElement('div');
                paginationDiv.classList.add('pagination');
                
                const prevButton = document.createElement('button');
                prevButton.id = 'prevPage';
                prevButton.innerText = '< Prev';
                prevButton.className = 'btn-secondary';
                prevButton.style.display = data.pagination.hasPrevious ? 'inline' : 'none';
                prevButton.addEventListener('click', () => {
                    currentPage--;
                    loadCliptivityPage(currentPage);
                });
                
                const nextButton = document.createElement('button');
                nextButton.id = 'nextPage';
                nextButton.innerText = 'Next >';
                nextButton.className = 'btn-secondary';
                nextButton.style.display = data.pagination.hasNext ? 'inline' : 'none';
                nextButton.addEventListener('click', () => {
                    currentPage++;
                    loadCliptivityPage(currentPage);
                });

                paginationDiv.appendChild(prevButton);
                paginationDiv.appendChild(nextButton);
                container.appendChild(paginationDiv);
            } else {
                container.innerHTML += '<p>No actions found.</p>';
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            container.innerHTML = '<p>Error loading actions. Please try again.</p>';
        });
}

function formatTimestamp(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
}

function parseActionDescription(description) {
    const trackLinkRegex = /\[(.*?)\]\(\/track\/(\d+)\)/g;

    return description.replace(trackLinkRegex, (match, title, id) => {
        return `<a href="/track/${id}" onclick="visitTrackPage(${id}); return false;">${title}</a>`;
    });
}