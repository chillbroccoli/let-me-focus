import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [currentTab, setCurrentTab] = useState<chrome.tabs.Tab>();
  const [blocklist, setBlocklist] = useState<string[]>([]);

  const rootUrl = currentTab?.url ? new URL(currentTab.url).hostname : "";

  const getStorageItems = async () => {
    const items = await chrome.storage.sync.get("let-me-focus.blocklist");
    setBlocklist(JSON.parse(items["let-me-focus.blocklist"] ?? "[]"));
  };

  const saveStorageItems = async (newItems: string[]) => {
    const stringifiedItems = JSON.stringify(newItems);
    const data = { "let-me-focus.blocklist": stringifiedItems };
    await chrome.storage.sync.set(data);
  };

  useEffect(() => {
    const getCurrentTabInfo = async () => {
      const [currentTab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (!currentTab.url) return;
      setCurrentTab(currentTab);
    };

    getCurrentTabInfo();
    getStorageItems();
  }, []);

  const reloadPage = async () => {
    await chrome.tabs.update({
      active: true,
      url: currentTab?.url,
    });
  };

  const addToBlockList = () => {
    if (!blocklist.includes(rootUrl)) {
      const next = [...blocklist, rootUrl];
      setBlocklist(next);
      saveStorageItems(next);
      reloadPage();
    }
  };

  const removeFromBlocklist = (item: string) => {
    const updatedBlocklist = blocklist.filter((i) => i !== item);

    setBlocklist(updatedBlocklist);
    saveStorageItems(updatedBlocklist);
  };

  const protocol = currentTab?.url ? new URL(currentTab.url).protocol : null;
  const isValidUrl = protocol === "https:" || protocol === "http:";
  const isAlreadyAdded = blocklist.includes(rootUrl);

  return (
    <div className="container">
      <ul className="list">
        {blocklist && blocklist.length
          ? blocklist.map((item) => (
              <li key={item} className="list-item">
                {item}
                <button
                  className="times"
                  onClick={() => removeFromBlocklist(item)}
                >
                  &times;
                </button>
              </li>
            ))
          : null}
      </ul>
      <button
        className="blockBtn"
        onClick={addToBlockList}
        disabled={!isValidUrl || isAlreadyAdded}
      >
        {isValidUrl && !isAlreadyAdded
          ? "Block This Site"
          : "Cannot Block This Site"}
      </button>
    </div>
  );
}

export default App;
