

//grab all the tabs in the current window
async function getTabs() {
    const tabs = await chrome.tabs.query({})
    return tabs
}

let allTabs = []//array to contain all the tabs and their required details

//format the tabs in the way it's easy for our task
async function formatTabs(){
    const tabs = await getTabs();
    tabs.forEach(tab => {
           
        const tabObj = {
            hostname : new URL(tab.url).hostname,
            url : tab.url,
            selected : false,
            id : tab.id
        }
        allTabs.push(tabObj)
        console.log(tabObj)
    });
}



//list out all the tabs for the user to select
function renderTabs(tabs){
    tabs.forEach(tab => {
        if (!tab.url.startsWith('http://') && !tab.url.startsWith('https://')) {
            return;
        }
        const li = document.createElement('li')
        li.innerHTML = `
        <span>${tab.hostname}</span>
        `

        li.dataset.id = tab.id
        document.getElementsByClassName('availabe-domains')[0].appendChild(li)

        console.log(tab.selected)
    });
}


async function runFunction() {
    await formatTabs()
    renderTabs(allTabs)
}

runFunction()

//to select and unselect the domains/tabs
const availabeDomains = document.getElementsByClassName('availabe-domains')
availabeDomains[0].addEventListener('click', (e) => {
    const li = e.target.closest('li')
    if(li){
        console.log(li.dataset.id);
        
        const domainId = li.dataset.id
        li.classList.toggle('selected')
        allTabs.forEach(domain => {
            if(domain.id == parseInt(domainId)){
                domain.selected = !domain.selected
                console.log(domain.selected);
            }
        });
    }
})


//start focus session
document.getElementsByClassName('focus-btn')[0].addEventListener('click', async () => {
    const allowedTabs = allTabs.filter(tab => tab.selected)
    const allowedDomains = [...new Set(allowedTabs.map(tab => tab.hostname))]
    const currentSessionObj = {
        taskName : document.getElementById('task-name').value,
        taskDuration : parseInt(document.getElementById('timer-display').value)*60*1000,// this is coming in as minutes
        startTime : Date.now(),
        endTime : Date.now() + parseInt(document.getElementById('timer-display').value)*60*1000,
        completed : false
    }

    //tabs to close
    let tabsToClose = []
    allTabs.forEach(tab => {
        if(!tab.selected){
            tabsToClose.push(tab.id)
        }
    });
    chrome.tabs.remove(tabsToClose)
    await chrome.storage.local.set({'activeSession' : currentSessionObj})
    await chrome.storage.local.set({
        focusLock: {
            isActive: true,
            allowedDomains,
            allowedTabIds: allowedTabs.map(tab => tab.id),
            sessionEndTime: currentSessionObj.endTime
        }
    })
    console.log(currentSessionObj)
    window.location.href = 'popup.html'
})


document.getElementsByClassName('analytics-btn')[0].addEventListener('click', () => {
    window.location.href = 'focusSessionAnalytics.html'
})

document.getElementsByClassName('back-link')[0].addEventListener('click', () => {
    window.location.href = 'popup.html'
})