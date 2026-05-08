async function renderTodaysSession() {
    const todayDate = new Date().toLocaleDateString();
    const completedSessions = await chrome.storage.local.get('completedSessions');
    const allCompletedSessions = completedSessions.completedSessions || {}
    const todaysSessions = allCompletedSessions[todayDate] || []
    const sessionList = document.querySelector('.session-list')

    sessionList.innerHTML = ''

    if(todaysSessions.length === 0){
        sessionList.innerHTML = '<li class="empty-state">No finished sessions for today yet.</li>'
        return
    }

    todaysSessions.forEach(session => {
        const li = document.createElement('li')
        const durationInMinutes = Math.round(session.taskDuration / (1000 * 60))

        li.innerHTML = `
            <span class="session-name">${session.taskName}</span>
            <span class="session-duration">${durationInMinutes} min</span>
        `

        sessionList.appendChild(li)
    })
}

renderTodaysSession()