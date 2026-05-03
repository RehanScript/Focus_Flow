//time formating
function timeFormating(timeInSec){
    timeInSec = parseInt(timeInSec)
    let hour=0, min=0;
    if(timeInSec >= 3600){
        hour = parseInt(timeInSec/3600)
        timeInSec = timeInSec - (3600*hour)
    }
    if(timeInSec >= 60){
        min = parseInt(timeInSec/60)
        timeInSec = timeInSec - (60*min)
    }
    return `${hour}h ${min}m ${timeInSec}sec`
}

//get today's entries
async function getTodaysEntries() {
    const todaysDate = new Date().toLocaleDateString()
    const allDomainObj = (await chrome.storage.local.get('allDomains')) || {}
    const todaysEntriesObj = allDomainObj.allDomains || {}
    const todaysEntries = todaysEntriesObj[todaysDate] || {}
    return todaysEntries
}


// arranging the data and rendering it on screen
async function renderer(){
    //grab the html elements
    const domainList = document.getElementById('domain-list')
    domainList.innerHTML = ""

    //grab the todays enteries
    const todaysEntries =  await getTodaysEntries() || {}
    if(Object.keys(todaysEntries).length === 0){
        domainList.innerHTML = '<li class="no-domain">No Data For Today, Go Back To Work</li>'
        document.getElementById('total-active-time').innerHTML = `00h 00m 00sec`
    }
    else{//we will render the entries to the list
        let totalTime = 0
        const todaysDomainList = Object.entries(todaysEntries)//this unpacks the object into array of arrays
        todaysDomainList.sort((a, b) => b[1] - a[1])
        // now render the entries to the list
        todaysDomainList.forEach(entry => {
            const li = document.createElement('li')
            li.classList.add('todayslist')

            totalTime += entry[1]
            const duration = timeFormating(entry[1])

            li.innerHTML = `<span class="domain">${entry[0]}</span><span class="duration">${duration}</span>`

            domainList.appendChild(li)
        });
        const totalTimeDuration = timeFormating(totalTime)
        document.getElementById('total-active-time').innerHTML = `${totalTimeDuration}`
    }
}

const resetButton = document.getElementById('reset-btn')

resetButton.addEventListener('click', async () => {
    console.log('button pressed')
    const todaysDate = new Date().toLocaleDateString()
    const allDomainObj = (await chrome.storage.local.get('allDomains')) || {}
    const todaysEntriesObj = allDomainObj.allDomains || {}
    todaysEntriesObj[todaysDate] = {}
    await chrome.storage.local.set({'allDomains' : todaysEntriesObj})
    renderer()
})

renderer()


//focus mode redirect
document.getElementById('deep-focus-btn').addEventListener('click', () => {
    window.location.href = 'focus.html'
})



//grab the current active session if any
async function getActiveSession() {
    const result = await chrome.storage.local.get('activeSession')
    let activeSession = result.activeSession

    const panel = document.getElementById('active-session-panel')
    const timer = document.getElementById('active-session-timer')
    const stopBtn = document.getElementById('stop-session-btn')
    const focusBtn = document.getElementById('deep-focus-btn')
    const resetBtn = document.getElementById('reset-btn')

    if(!activeSession){
        
        panel.classList.add('hidden')
        stopBtn.classList.add('hidden')
        return
    }

    focusBtn.classList.add('hidden')
    resetBtn.classList.add('hidden')
    panel.classList.remove('hidden')
    stopBtn.classList.remove('hidden')

    let sessionId;
    async function updateTimer(){
        let remainingTimeInMs = activeSession.endTime - Date.now()

        if(remainingTimeInMs<=0){
            focusBtn.classList.remove('hidden')
            resetBtn.classList.remove('hidden')
            timer.innerHTML = `00h 00m 00sec`
            clearInterval(sessionId)
            panel.classList.add('hidden')
            stopBtn.classList.add('hidden')
            activeSession.completed = true
            await chrome.storage.local.remove('activeSession')
            await updateCompletedSessions(activeSession);
            return
        }
        let remaingTimeSec = parseInt(remainingTimeInMs/1000)
        timer.innerHTML = timeFormating(remaingTimeSec)      
    }
    updateTimer()
    sessionId = setInterval(updateTimer, 1000)

    stopBtn.addEventListener('click', async () => {
        focusBtn.classList.remove('hidden')
        resetBtn.classList.remove('hidden')
        panel.classList.add('hidden')
        stopBtn.classList.add('hidden')
        await chrome.storage.local.remove('activeSession')
        clearInterval(sessionId)
    })
}

getActiveSession()

//update all completedSession
async function updateCompletedSessions(completedSession) {
    const todayDate = new Date().toLocaleDateString()
    const result = await chrome.storage.local.get('completedSessions')
    const allCompletedSessions = result.completedSessions || {}

    if(!allCompletedSessions[todayDate]){
        allCompletedSessions[todayDate] = []
    }

    completedSession.completed = true
    allCompletedSessions[todayDate].push(completedSession)
    await chrome.storage.local.set({'completedSessions' : allCompletedSessions})
}
