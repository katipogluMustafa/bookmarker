const {shell} = require('electron');

const linksSection       = document.querySelector('.links');
const errorMessage       = document.querySelector('.error-message');
const newLinkForm        = document.querySelector('.new-link-form');
const newLinkUrl         = document.querySelector('.new-link-url');
const newLinkSubmit      = document.querySelector('.new-link-submit');
const clearStorageButton = document.querySelector('.clear-storage');

const parser = new DOMParser();

const parseResponse = (text) => {
    return parser.parseFromString(text, 'text/html');
}

const findHtmlPageTitle = (nodes) =>{
    return nodes.querySelector('title').innerText;
}

newLinkUrl.addEventListener('keyup', ()=>{
    if(newLinkUrl.validity.valid)
    {
        newLinkSubmit.disabled = false;
    }
    else
    {
        newLinkSubmit.disabled = true;
    }
});

const clearNewLinkFormField = ()=> {
    newLinkUrl.value = null;
}

newLinkForm.addEventListener('submit', (event)=>{
    event.preventDefault();

    const url = newLinkUrl.value;

    fetch(url)
        .then(validateResponse)
        .then(response => response.text())
        .then(parseResponse)
        .then(findHtmlPageTitle)
        .then(title => storeLink(title, url))
        .then(clearNewLinkFormField)
        .then(renderLinks)
        .catch(error => handleFetchErrors(error, url));
});

const storeLink = (title, url) => {
    localStorage.setItem(url, JSON.stringify({title: title, url: url}));
}

const getStoredLinks = () => {
    return Object.keys(localStorage)
                 .map(key => JSON.parse(localStorage.getItem(key)));
}

const convertToElement = (link) => {
    return `
    <div class="link">
        <h3>${link.title}</h3>
        <p>
            <a href="${link.url}">${link.url}</a>
        </p>
    </div>
    `;
}

const renderLinks = () => {
    const linkElements = getStoredLinks().map(convertToElement);
    linksSection.innerHTML = linkElements;
}

clearStorageButton.addEventListener('click', ()=>{
    localStorage.clear();
    linksSection.innerHTML = '';
});

renderLinks();

const handleFetchErrors = (error, url) => {
    errorMessage.innerHTML = `
    There was an issue adding "$(url)": ${error.message}
    `.trim();
    setTimeout(()=>errorMessage.innerText = null, 5000);
}

const validateResponse = (response) => {
    if(response.ok)
    {
        return response;
    }

    throw new Error(`Status code of ${response.status} ${response.statusText}`);
}

/*
 * Open the links in the links section in default system browser.
 */
linksSection.addEventListener('click', (event) =>{
    if(event.target.href)
    {
        event.preventDefault();

        shell.openExternal(event.target.href);
    }
});