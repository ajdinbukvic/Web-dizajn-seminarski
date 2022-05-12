const BASE_URL = 'https://ptf-web-dizajn-2022.azurewebsites.net';

const handleErrors = (response) => {
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
}

getBooks();

const renderBooks = books => {

    const carousel = document.getElementById('carousel-main');

    let result = '';
    let activeBook = false;
    books.forEach(book => {
        if(!activeBook) {
            result += `
            <div class="carousel-item active">`
        }   
        else {
            result += `
            <div class="carousel-item">`
        }
            result += `
                <img src=${book.image} class="d-block" alt="...">
                <div class="carousel-caption">
                    <h3>&quot;${book.name}&quot;</h3>
                    <p>${book.genre}</p>
                    <h4>${book.author.name}</h4>
                </div>
            </div>`;
    
        activeBook = true;
    });

    carousel.innerHTML = result;
}

const login = () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if(username === 'admin' && password === 'admin') {
        location.href("https://www.google.ba/?gws_rd=ssl&pccc=1");
    }
}