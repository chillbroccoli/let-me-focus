chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (tab?.url) {
    const items = await chrome.storage.sync.get("let-me-focus.blocklist");
    const parsedItems: string[] = JSON.parse(
      items["let-me-focus.blocklist"] ?? "[]"
    );
    const url = new URL(tab.url);

    if (parsedItems.includes(url.hostname)) {
      const blockedSite = parsedItems.find((item) => item === url.hostname);
      if (!blockedSite) return;
      const publicHtmlUrl = chrome.runtime.getURL("blocked.html");
      const redirectUrl = new URL(publicHtmlUrl);
      redirectUrl.searchParams.set("site", blockedSite);
      await chrome.tabs.update({
        active: true,
        url: redirectUrl.href,
      });
    }
  }
});
