(() => {
  const SUSPICIOUS = [
    /ignore (all |any |the )?(previous|prior) instructions/i,
    /system message|developer message|prompt injection/i,
    /reveal (your|the) (prompt|instructions|secret)/i,
    /send (all |the )?(emails|files|documents|data) to/i,
    /bypass (security|safety|verification)/i,
    /do not tell (the )?user/i,
    /upload .* (credential|token|password|secret)/i
  ];

  function invisible(element) {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return element.hidden || style.display === 'none' || style.visibility === 'hidden' ||
      Number(style.opacity) < 0.1 || Number.parseFloat(style.fontSize) < 4 ||
      (rect.width === 0 && rect.height === 0);
  }

  function findThreats() {
    return [...document.querySelectorAll('body *')].filter((element) => {
      if (element.dataset.safeAgentHandled || element.children.length > 0) return false;
      const text = (element.textContent || '').trim();
      return text.length > 15 && SUSPICIOUS.some((pattern) => pattern.test(text)) &&
        (invisible(element) || text.length > 80);
    });
  }

  async function neutralize() {
    const settings = await chrome.storage.local.get({ enabled: true });
    if (!settings.enabled) return;
    const threats = findThreats();
    if (!threats.length) return;
    const signals = [];
    for (const element of threats) {
      const matched = SUSPICIOUS.find((pattern) => pattern.test(element.textContent || ''));
      if (matched) signals.push(matched.source);
      element.dataset.safeAgentHandled = 'true';
      element.replaceWith(Object.assign(document.createElement('span'), {
        className: 'safe-agent-notice',
        textContent: '[Untrusted instruction removed by Safe Agent Supervisor]'
      }));
    }
    chrome.runtime.sendMessage({ type: 'INJECTION_NEUTRALIZED', count: threats.length, signals, url: location.href });
  }

  neutralize();
  new MutationObserver(() => neutralize()).observe(document.documentElement, { childList: true, subtree: true });
})();
