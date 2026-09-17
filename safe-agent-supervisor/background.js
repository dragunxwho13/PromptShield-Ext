const MAX_EVENTS = 50;

chrome.runtime.onInstalled.addListener(async () => {
  const { events } = await chrome.storage.local.get('events');
  if (!events) await chrome.storage.local.set({ events: [], enabled: true });
  if (chrome.sidePanel?.setPanelBehavior) {
    await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  }
});

async function addEvent(event) {
  const { events = [] } = await chrome.storage.local.get('events');
  events.unshift({ id: crypto.randomUUID(), at: new Date().toISOString(), ...event });
  await chrome.storage.local.set({ events: events.slice(0, MAX_EVENTS) });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'INJECTION_NEUTRALIZED') {
    addEvent({
      kind: 'neutralized',
      url: sender.tab?.url || message.url,
      count: message.count,
      signals: message.signals
    }).then(() => sendResponse({ ok: true }));
    return true;
  }
  if (message.type === 'GET_STATUS') {
    chrome.storage.local.get({ events: [], enabled: true }).then(sendResponse);
    return true;
  }
  if (message.type === 'SET_ENABLED') {
    chrome.storage.local.set({ enabled: Boolean(message.enabled) }).then(() => sendResponse({ ok: true }));
    return true;
  }
  if (message.type === 'CLEAR_EVENTS') {
    chrome.storage.local.set({ events: [] }).then(() => sendResponse({ ok: true }));
    return true;
  }
});
