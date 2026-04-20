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
    //grab the todays enteries
    const todaysEntries =  await getTodaysEntries() || {}
    if(Object.keys(todaysEntries).length === 0){
        // get to work
    }
    else{//we will render the entries to the list
        const todaysDomainList = Object.entries(todaysEntries)
        todaysDomainList.sort((a, b) => b[1] - a[1])
        // now render the entries to the list
        
    }
}