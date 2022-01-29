chrome.alarms.onAlarm.addListener(function (a) {
  const nameWithLink = a.name.split('@')
  const [name, link] = nameWithLink

  const tabConfig = {
    url: link  
  }

  chrome.tabs.create(tabConfig)
})