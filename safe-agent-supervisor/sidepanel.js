const $ = (selector) => document.querySelector(selector);

function hostname(value) { try { return new URL(value).hostname; } catch { return 'page'; } }
function time(value) { return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }

function render({ events, enabled }) {
  $('#enabled').checked = enabled;
  $('#state').textContent = enabled ? 'Protection enabled' : 'Protection paused';
  $('#dot').className = enabled ? 'on' : 'off';
  $('#events').innerHTML = events.length ? events.map((event) => `<article><strong>Instruction neutralized</strong><p>${event.count} block${event.count === 1 ? '' : 's'} removed on ${hostname(event.url)}</p><small>${time(event.at)}</small></article>`).join('') : '<p class="empty">No suspicious instructions neutralized yet.</p>';
}

async function refresh() { render(await chrome.runtime.sendMessage({ type: 'GET_STATUS' })); }
$('#enabled').addEventListener('change', async (event) => { await chrome.runtime.sendMessage({ type: 'SET_ENABLED', enabled: event.target.checked }); refresh(); });
$('#clear').addEventListener('click', async () => { await chrome.runtime.sendMessage({ type: 'CLEAR_EVENTS' }); refresh(); });
refresh();
