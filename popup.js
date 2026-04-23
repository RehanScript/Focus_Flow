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