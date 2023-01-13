chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.cmd === 'tasks') {
        chrome.storage.sync.get('tasks', (result) => {
            let tasks = result?.tasks || [];
            chrome.alarms.clearAll(() => {
                tasks.forEach(t => {
                    let matchRes = t.label.match(/\{t\((\d{2}):(\d{2})\)}/)
                    if (matchRes) {
                        let d = new Date();
                        d.setHours(parseInt(matchRes[1]))
                        d.setMinutes(parseInt(matchRes[2]))
                        d.setSeconds(0)
                        chrome.alarms.create(t.id, {
                            when: d.getTime()
                        })
                    }
                })
            })
        });
    }
})

chrome.alarms.onAlarm.addListener(function (alarm) {
    chrome.storage.sync.get('tasks', result => {
        let tasks = result?.tasks || [];
        let task = tasks.find(t => {
            return t.id === alarm.name
        })
        if (task) {
            chrome.notifications.create({
                iconUrl: 'icons/todo_128.png',
                message: task.label,
                title: '提醒',
                type: 'basic',
                requireInteraction: true
            })
        }
    })
})
