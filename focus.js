

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
        const li = document.createElement('li')
        li.innerHTML = `
        <span>${tab.hostname}</span>
        `
        document.getElementsByClassName('availabe-domains')[0].appendChild(li)
    });
}



async function runFunction() {
    await formatTabs()
    renderTabs(allTabs)
}

runFunction()