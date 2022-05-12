const BASE_URL = 'https://ptf-web-dizajn-2022.azurewebsites.net';
const loginUsername = 'admin';
const loginPassword = 'admin';

const infoMessage = (message, sec) =>
{
    const div = document.createElement('div');
    div.setAttribute("style","background-color: #434343;color:#f8f8f8; width: 500px;height: 100px;position: absolute;top:0;bottom:0;left:0;right:0;margin:auto;border: 4px solid #faebcd;font-family:arial;font-size:24px;font-weight:bold;display: flex; align-items: center; justify-content: center; text-align: center;");
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

const renderBooks = books => {

    const carousel = document.getElementById('carousel-main');

    let result = '';
    let activeBook = false;
    books.forEach(book => {
        if(!activeBook) {
            result += `<div class="carousel-item active">`
        }   
        else {
            result += `<div class="carousel-item">`
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

const authorsImages = [
    './img/tolstoj.jpg',
    './img/dostojevski.jpg',
    './img/stamper.jpg',
    './img/megan.jpg',
    './img/leigh.jpg',
    './img/moyer.jpg',
    './img/nora.jpg',
    './img/romian.jpg',
];

const renderAuthors = authors => {

    const card = document.getElementById('card');
    let authorsCounter = 0;
    let result = '';
    authors.forEach(author => {
        result += `
            <div class="card col-4 mx-auto my-2 card-list" style="width: 18em; background-color: #f8f8f8">
                <img src=${authorsImages[authorsCounter]} class="card-img-top" alt="..." style="height:30vh">
                <div class="card-body">
                    <h5 class="card-title text-center" style="color: #434343">${author.name}</h5>
                    <div class="text-center">
                        <div class="container" id="container-button-${authorsCounter}">
                            <button type="button" class="btn btn-primary" data-bs-toggle="collapse" data-bs-target="#demo-${authorsCounter}" id="show-books-${authorsCounter}" onclick="getBooksbyAuthorId('${author.id}', ${authorsCounter})">Prikaži knjige</button>
                            <div class="collapse" id="demo-${authorsCounter}">
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        authorsCounter++;
    });

    card.innerHTML = result;
}

const getBooksbyAuthorId = (authorId, authorsCounter) => {

    const container = document.getElementById(`demo-${authorsCounter}`);

    fetch(`${BASE_URL}/authors/${authorId}/books`)
        .then(handleErrors)
        .then(data => {
            if(data.length === 0) {
                container.innerHTML = `<p id="books-text">Trenutno nema knjiga od ovog autora...</p>`;
            }
            else { 
                data.forEach(book => {
                    container.innerHTML += `<p id="books-text">Naslov: ${book.name} (žanr: ${book.genre})</p>`;
                })
            }
        })
        .catch(err => {
            console.log(err);
        });
        container.innerHTML = '';
}

const login = event => {

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    event.preventDefault();

    if(username === loginUsername && password === loginPassword) {
        infoMessage('Uspješno ste se prijavili!', 1000);
        setTimeout(() => window.location.replace('./html/admin.html'), 1000);
    }
    else {
        infoMessage('Pogrešno korisničko ime ili lozinka!', 1000);
        return;
    }
}



