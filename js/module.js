//default Books API url
const BASE_URL = 'https://ptf-web-dizajn-2022.azurewebsites.net';

//adding fixed navbar and changing navbar opacity on page scrolling
document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar-top');
        if (window.scrollY > 50) {
            navbar.classList.add('fixed-top');
            navbar.setAttribute('style', 'opacity: 80%');
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            document.body.style.paddingTop = navbarHeight + 'px';
        } 
        else {
            navbar.classList.remove('fixed-top');
            navbar.style.removeProperty('opacity');
            document.body.style.paddingTop = '0';
        } 
    });
}); 

const infoMessage = (message, sec, topPosition = 0) => { //default value for 'top' is 0 (when modal is closed)
    //popup message called to shown results of users operations (sucessful/unsuccessful)
    const popupMessage = document.createElement('div');
    popupMessage.setAttribute('class', 'info-message'); //setting class defined in CSS
    popupMessage.setAttribute('style', `top:${topPosition}px;`); //defining 'top' because message is not shown when modal is opened
    popupMessage.innerHTML = message;
    setTimeout(() => {
        popupMessage.parentNode.removeChild(popupMessage); //deleting new div element after '?' seconds forwarded in function call
    }, sec);
    document.body.appendChild(popupMessage); //displaying popup message on screen
}

const handleErrors = response => {
    if (!response.ok) {
        throw Error(response);
    }
    return response.json();
}

const getBooks = () => {
    fetch(`${BASE_URL}/books`)
        .then(handleErrors)
        .then(data => {
            renderBooks(data);
        })
        .catch(err => {
            console.log(err);
        });
}

getBooks(); //calling function on page load 

const getAuthors = () => {
    fetch(`${BASE_URL}/authors`)
        .then(handleErrors)
        .then(data => {
            renderAuthors(data);
        })
        .catch(err => {
            console.log(err);
        });
}

getAuthors(); //calling function on page load