const emailArray = [];
let pageCount = 1;

chrome.runtime.onMessage.addListener(function(request) {

    console.log("message received", request);

    if (request.isLoading) {
        pageCount++;
        const body =  document.querySelector('body');
        body.classList.add('isLoading');
    }

    if (request.doneLoading) {
        const body =  document.querySelector('body');
        body.classList.remove('isLoading');
    }

    if (request.emails) {
        console.log("received message with emails: ", request.emails);
        const emails = document.getElementById("emails");
        const emailTextNode = document.createTextNode(`${request.emails.join(", ")}, `);
        emails.appendChild(emailTextNode);

        emailArray.push(...request.emails);

        const summary = document.getElementById("summary").firstChild;
        summary.nodeValue = `directory pages scraped: ${pageCount}. total emails: ${emailArray.length}`
    }
  });