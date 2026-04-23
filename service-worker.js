let currentTime = Date.now()
let currentDomain = ""

//Initialization
async function getDomain() {
    const tabs = await chrome.tabs.query({active: true, currentWindow: true}) //since we are asking the chrome to send us data we use await here
    if(tabs.length > 0 && tabs[0].url){
        currentDomain = (new URL(tabs[0].url)).hostname

        if((tabs[0].url).startsWith('chrome://') ){
        currentDomain = 'Browser Settings'
        }
        else if(currentDomain.startsWith('www.')){
            currentDomain = currentDomain.slice(4)
        }
    }
    currentTime = Date.now()
}
getDomain()




async function handleDataTransfer() {
    
    if(currentDomain){
        const todayDate = new Date().toLocaleDateString() //grab today's date
        const outerObj = await chrome.storage.local.get('allDomains')//grab the outer object
        const allDayDomainsObj = outerObj.allDomains || {} //grab all domains
        
        if(!allDayDomainsObj[todayDate]){
            allDayDomainsObj[todayDate] = {}
        }

        const currentDuration = ((Date.now() - currentTime)/1000) // maths
        const previousDuration = allDayDomainsObj[todayDate][currentDomain] || 0 // grab the previous duration of current domain
        allDayDomainsObj[todayDate][currentDomain] = previousDuration + currentDuration // maths
        await chrome.storage.local.set({'allDomains' : allDayDomainsObj})
        
    }
currentTime = Date.now()                           
}


chrome.tabs.onActivated.addListener(async(activeinfo) => {// the activeinfo contains only tabId, windowId and previousTabId
    await handleDataTransfer()// we use await here cause when we save the data to storage its asynchronous
    const tab = await chrome.tabs.get(activeinfo.tabId)//this is why we again call chrome for the info on the tab by using the tabId, this calling takes time that's why we use await
    if(tab.url){
        const urlObj = new URL(tab.url)
        let hostName = urlObj.hostname
        if(hostName.startsWith('www.')){
            hostName = hostName.slice(4)
            currentDomain = hostName
        }
        else if(tab.url.startsWith('chrome://') ){//we use tab.url instead of hostname cause hostname doesn't contain protocols and chrome:// is a protocol just like http and https
        currentDomain = 'Browser Settings'
        }
        else{
            currentDomain = hostName
        }
        // console.log(currentDomain)
    }
})

chrome.tabs.onUpdated.addListener(async(tabId, changeInfo, tabInfo) => {//here the tabInfo already contains all the necessary data so there is no need to again call the chrome
    if(tabInfo.status === 'complete' && tabInfo.url){//this is why we simply grab the url which is instanteneous that's why we didn't use await here.
        await handleDataTransfer()// same reason here
        let domain = (new URL(tabInfo.url)).hostname

        if(domain.startsWith('www.')){
            domain = domain.slice(4)
            currentDomain = domain
        }
        else if(tabInfo.url.startsWith('chrome://') ){// same reason as in the onActivated part
        currentDomain = 'Browser Settings'
        }
        else{
            currentDomain = domain
        }
        // console.log(currentDomain)
    }
})