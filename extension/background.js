let newTab;

async function collectEmails() {
  const urls = [];
  const emails = [];

  for (tr of document.getElementsByClassName("ca")) {
    try {
      const as = tr.getElementsByTagName("a");
      const onClick = as[0].getAttribute("onClick");

      // 'directory_view.php?id=NGJjY2QyZDdjZGI2NA=='
      const urlMatch = onClick.match(/'(directory_view\.php\?id=.*=)'/);
      if (urlMatch) {
        urls.push(urlMatch[1]);
      } 
      else {
        console.log("no match for onClick", onClick);
      }
    }
    catch(e) {
      console.log("something went wrong: ", e);
    }
  }

  // console.table(urls);

  const promises = [];

  for (url of urls) {
    console.log("url is", url);
    const promise = fetch(url);
    promises.push(promise);
    promise.then(async (response) => {
      const body = await response.text();
      // console.log("body is ", body);
      // <td class="dirviewrow">Kregos@comcast.net</td>
      const emailMatches = body.match(/(?<=>).*@.*(?=<)/g);

      if (emailMatches) {
        emails.push(...emailMatches); 
        chrome.runtime.sendMessage({emails: emailMatches});
      }
    });
  }

  await Promise.all(promises);
  chrome.runtime.sendMessage({doneLoading: true});
  // console.log("emails", emails)
  // navigator.clipboard.writeText(emails.toString());

  return emails;
}

chrome.action.onClicked.addListener(async (tab) => {
  console.log("clicked! tab is", newTab);

  if (!newTab) {
    newTab = await chrome.tabs.create({url:chrome.runtime.getURL("ui.html")});
  }
  else {
    chrome.tabs.update(newTab.id, {
      active: true
    })
  }

  console.log("newTab is", newTab);

  chrome.runtime.sendMessage({isLoading: true});

  const [response] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: collectEmails
  });

  // const emails = response.result;

  // console.log("emails are ", emails);
  // chrome.runtime.sendMessage({emails});
});