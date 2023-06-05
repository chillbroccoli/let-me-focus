import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [currentTab, setCurrentTab] = useState<chrome.tabs.Tab>();
  const [rootUrl, setRootUrl] = useState("");
  const [blocklist, setBlocklist] = useState<string[]>([]);

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
      const url = new URL(currentTab.url);
      setRootUrl(url.hostname);
      setCurrentTab(currentTab);
    };

    getCurrentTabInfo();

    getStorageItems();
  }, []);

  const addToBlockList = () => {
    if (!blocklist.includes(rootUrl)) {
      setBlocklist([...blocklist, rootUrl]);
      saveStorageItems([...blocklist, rootUrl]);
    }
  };

  const protocol = currentTab?.url ? new URL(currentTab.url).protocol : null;
  const isValidUrl = protocol === "https:" || protocol === "http:";
  console.log("PROTOCOL", protocol);

  return (
    <div className="container">
      <ul className="list">
        {blocklist && blocklist.length
          ? blocklist.map((item) => (
              <li key={item} className="list-item">
                {item}
              </li>
            ))
          : null}
      </ul>
      <button
        className="blockBtn"
        onClick={addToBlockList}
        disabled={!isValidUrl}
      >
        {isValidUrl ? "Block This Site" : "Cannot Block This Site"}
      </button>
    </div>
  );
}

export default App;
