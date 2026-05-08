async function renderTodaysSession() {
    const todayDate = new Date().toLocaleDateString();
    const completedSessions = await chrome.storage.local.get('completedSessions');
    const allCompletedSessions = completedSessions.completedSessions || {}
    const todaysSessions = allCompletedSessions[todayDate] || []
    const sessionList = document.getElementsByClassName('session-list')
    if(todaysSessions.length > 0){
        todaysSessions.forEach(session => {
            const li = document.createElement('li')
            li.innerHTML = `<span>${session.taskName}</span> : <span>${session.taskDuration /(1000 * 60)}mins</span>`

            sessionList[0].appendChild(li);
        });
    }
}

renderTodaysSession()