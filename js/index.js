const loginUsername = 'admin';
const loginPassword = 'admin';
const maxAuthors = 9;
let favoriteAuthorsCounter = 0;

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
                    <h5>${book.author.name}</h5>
                </div>
            </div>`;
    
        activeBook = true;
    });

    carousel.innerHTML = result;
}

const authorsImages = [
    './img/tolstoj.jpg',
    './img/dostojevski.jpg',
    './img/stamper.jpg',
    './img/megan.jpg',
    './img/leigh.jpg',
    './img/moyer.jpg',
    './img/nora.jpg',
    './img/romian.jpg',
    './img/terry.jpg'
];

const renderAuthors = authors => {

    const card = document.getElementById('card');
    let authorsCounter = 0;
    let result = '';

    authors.every(author => {
        if(authorsCounter >= maxAuthors) {
            return false;
        }
        result += `
            <div class="card col-4 mx-auto my-2 card-list" style="width: 18em; background-color: #f8f8f8">
                <img src=${authorsImages[authorsCounter]} class="card-img-top" alt="..." style="height:30vh">
                <div class="card-body">
                    <h5 class="card-title text-center" style="color: #434343">${author.name}</h5>
                    <div class="text-center">
                        <div class="container" id="container-button-${authorsCounter}">
                            <button id="add-favorites-button" type="button" class="btn btn-primary" onclick="getAuthorById('${author.id}')">
                                <i class="bi bi-person-plus"></i>
                            </button>
                            <button type="button" class="btn btn-primary" data-bs-toggle="collapse" data-bs-target="#demo-${authorsCounter}" id="show-books-${authorsCounter}" onclick="getBooksByAuthorId('${author.id}', ${authorsCounter})">Prikaži knjige</button>
                            <div class="collapse" id="demo-${authorsCounter}">
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        authorsCounter++;
        return true;
    });

    card.innerHTML = result;
}

const getAuthorById = authorId => {

    fetch(`${BASE_URL}/authors/${authorId}`)
        .then(handleErrors)
        .then(data => {
            addAuthorToFavorites(data);
        })
        .catch(err => {
            console.log(err);
        });
}

const addAuthorToFavorites = author => {

    const authorList = document.getElementById('favorite-authors-list');
    const authorListCounter = document.getElementById('favorite-authors-counter');

    if(favoriteAuthorsCounter === 0) {
        authorList.innerHTML = '';
    }

    if(authorList.innerHTML.includes(`${author.name}`)) {
        infoMessage('Autor već postoji u favoritima!', 2000);
        return false;
    }

    authorList.innerHTML += `<li class="list-group-item mb-3" id="favorite-author-${favoriteAuthorsCounter}">
                                <i class="bi bi-person"></i></i><span class="ms-2"></span>${author.name}
                                <button id="remove-favorites-button-${favoriteAuthorsCounter}" type="button" class="btn" onclick="removeFavoriteAuthor(${favoriteAuthorsCounter})">
                                    <i class="bi bi-x"></i>
                                </button>
                            </li>`;
    
    favoriteAuthorsCounter++;
    authorListCounter.innerHTML = `Moji omiljeni autori [ ${favoriteAuthorsCounter} ]`;
    infoMessage('Uspješno ste dodali autora u favorite!', 2000);
}

const removeFavoriteAuthor = removeAuthorId => {

    const removeAuthor = document.getElementById(`favorite-author-${removeAuthorId}`);
    const authorList = document.getElementById('favorite-authors-list');
    const authorListCounter = document.getElementById('favorite-authors-counter');

    removeAuthor.parentNode.removeChild(removeAuthor);
    favoriteAuthorsCounter--;

    if(favoriteAuthorsCounter === 0) {
        authorList.innerHTML = `<li class="list-group-item mb-3">
                                    </i><span class="ms-2"></span>Trenutno nemate omiljenih autora...
                                </li>`;
    }

    authorListCounter.innerHTML = `Moji omiljeni autori [ ${favoriteAuthorsCounter} ]`;
    infoMessage('Uspješno ste uklonili autora iz favorita!', 2000);
}

const getBooksByAuthorId = (authorId, authorsCounter) => {

    const authorCard = document.getElementById(`demo-${authorsCounter}`);

    fetch(`${BASE_URL}/authors/${authorId}/books`)
        .then(handleErrors)
        .then(data => {
            authorCard.innerHTML = ''
            showAuthorBooks(data, authorsCounter);
        })
        .catch(err => {
            console.log(err);
        });
}

const showAuthorBooks = (books, authorsCounter) => {

    const authorCard = document.getElementById(`demo-${authorsCounter}`);
 
    if(books.length === 0) {
        authorCard.innerHTML = `<p id="books-text">Trenutno nema knjiga od ovog autora...</p>`;
    }
    else { 
        books.forEach(book => {
            authorCard.innerHTML += `<p id="books-text">Naslov: ${book.name} (žanr: ${book.genre})</p>`;
        })
    }
}

const searchBooks = () => {
    const searchInput = document.getElementById('search-input');
}

const login = event => {

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    event.preventDefault();

    if(username === loginUsername && password === loginPassword) {
        infoMessage('Uspješno ste se prijavili!', 2000);
        setTimeout(() => window.location.replace('./html/admin.html'), 2000);
    }
    else {
        infoMessage('Pogrešno korisničko ime ili lozinka!', 2000);
        return;
    }
}