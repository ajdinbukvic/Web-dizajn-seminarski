const BASE_URL = 'https://ptf-web-dizajn-2022.azurewebsites.net';

document.addEventListener("DOMContentLoaded", () => {
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar-top');
        if (window.scrollY > 50) {
          navbar.classList.add('fixed-top');
          navbar.setAttribute('style', 'opacity: 80%');
          const navbarHeight = document.querySelector('.navbar').offsetHeight;
          document.body.style.paddingTop = navbarHeight + 'px';
        } else {
          navbar.classList.remove('fixed-top');
          navbar.style.removeProperty('opacity');
          document.body.style.paddingTop = '0';
        } 
    });
}); 

const infoMessage = (message, sec) =>
{
    const div = document.createElement("div");
    div.setAttribute("style","background-color: #434343;color:#f8f8f8; width: 350px;height: 100px;position: absolute;top:0;bottom:0;left:0;right:0;margin:auto;border: 4px solid #faebcd;font-family:arial;font-size:24px;font-weight:bold;display: flex; align-items: center; justify-content: center; text-align: center;");
    div.innerHTML = message;
    setTimeout(() => {
        div.parentNode.removeChild(div);
    }, sec);
    document.body.appendChild(div);
}

const handleErrors = response => {
    if (!response.ok) {
        throw Error(response);
    }
    return response.json()
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

getBooks();

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

getAuthors();