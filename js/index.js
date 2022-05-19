//default values for admin login
const loginUsername = 'admin';
const loginPassword = 'admin';
//max authors that can be shown on page (because there's a lot of 'test' authors in database)
const maxAuthors = 9;
//array of author images paths (using in renderAuthors() function to display authors with images)
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
//counter used to display number of users favorite authors
let favoriteAuthorsCounter = 0;

const login = event => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    event.preventDefault();
    if (username === loginUsername && password === loginPassword) { 
        infoMessage('Uspješno ste se prijavili!', 2000);
        setTimeout(() => window.location.replace('./html/admin.html'), 2000);
        //redirecting to admin page after 2 seconds if login is successful
    }
    else {
        infoMessage('Pogrešno korisničko ime ili lozinka!', 2000);
        return false;
    }
}

const renderBooks = books => {
    const carousel = document.getElementById('carousel-main');
    let result = '';
    let activeBook = false; //variable used for first element in slider (must have 'active' class)
    books.forEach(book => {
        if (!activeBook) {
            result += `<div class="carousel-item active">` //only if it's first element (sliding starts with element with class 'active')
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

const renderAuthors = authors => {
    const card = document.getElementById('card');
    let authorsCounter = 0; //variable used for giving every element unique id and showing images from authorImages array
    let result = '';
    authors.every(author => {
        if (authorsCounter >= maxAuthors) { //checking for max authors limit (only shown first 9 elements)
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
    if (favoriteAuthorsCounter === 0) { //clearing default text in author list before adding new favorite author
        authorList.innerHTML = '';
    }
    if (authorList.innerHTML.includes(`${author.name}`)) { //checking if author is already added to favorites
        infoMessage('Autor već postoji u favoritima!', 2000);
        return false;
    }
    authorList.innerHTML += `
                            <li class="list-group-item mb-3" id="favorite-author-${favoriteAuthorsCounter}">
                                <i class="bi bi-person"></i></i><span class="ms-2"></span>${author.name}
                                <button id="remove-favorites-button-${favoriteAuthorsCounter}" type="button" class="btn" onclick="removeFavoriteAuthor(${favoriteAuthorsCounter})">
                                    <i class="bi bi-x"></i>
                                </button>
                            </li>`;
    favoriteAuthorsCounter++;
    authorListCounter.innerHTML = `Moji omiljeni autori [ ${favoriteAuthorsCounter} ]`; //changing text effected by increasing favorite authors counter
    infoMessage('Uspješno ste dodali autora u favorite!', 2000);
}

const removeFavoriteAuthor = removeAuthorId => {
    const removeAuthor = document.getElementById(`favorite-author-${removeAuthorId}`);
    const authorList = document.getElementById('favorite-authors-list');
    const authorListCounter = document.getElementById('favorite-authors-counter');
    removeAuthor.parentNode.removeChild(removeAuthor); //removing only selected author from author list
    favoriteAuthorsCounter--;
    if (favoriteAuthorsCounter === 0) { //setting default text if there's no more favorite authors
        authorList.innerHTML = `
                                <li class="list-group-item mb-3">
                                    </i><span class="ms-2"></span>Trenutno nemate omiljenih autora...
                                </li>`;
    }
    authorListCounter.innerHTML = `Moji omiljeni autori [ ${favoriteAuthorsCounter} ]`; //changing text effected by decreasing favorite authors counter
    infoMessage('Uspješno ste uklonili autora iz favorita!', 2000);
}

const getBooksByAuthorId = (authorId, authorsCounter) => {
    const authorCard = document.getElementById(`demo-${authorsCounter}`); //getting element with unique ID
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
    const authorCard = document.getElementById(`demo-${authorsCounter}`); //getting element with unique ID
    if (books.length === 0) {
        authorCard.innerHTML = `<p id="books-text">Trenutno nema knjiga od ovog autora...</p>`;
    }
    else { 
        books.forEach(book => {
            authorCard.innerHTML += `<p id="books-text">Naslov: ${book.name} (žanr: ${book.genre})</p>`;
        })
    }
}

const searchBooks = () => {
    //default Google Books API url and generated api key
    const API_URL = 'https://www.googleapis.com/books/v1/volumes?q=';
    const API_KEY = '&key=AIzaSyAW1SIQLRUj-zcfxjhq4vdeAAayTGGpsSs';
    const searchInput = document.getElementById('search-input').value;
    if (searchInput === '') { //closing function if there's no input in search bar
        infoMessage('Morate prvo unijeti naslov knjige!', 2000);
        return false;
    }
    fetch(`${API_URL}${searchInput}${API_KEY}`)
        .then(handleErrors)
        .then(data => {
            showSearchBooks(data);
        })
        .catch(err => {
            console.log(err);
        });
}

const showSearchBooks = books => {
    const searchBookList = document.getElementById('search-books-list');
    searchBookList.innerHTML = ''; //clearing searhc book list before starting new search
    if (books.items.length === 0) { //setting default message if searched data is empty
        searchBookList.innerHTML = `<p class="text-white">Nema rezultata pretrage...</p>`; 
    }
    else {
        books.items.forEach(book => {
            searchBookList.innerHTML += `
                                        <li class="list-group-item mb-3">
                                            </i><span class="ms-2"></span>${book.volumeInfo.title}
                                            <button type="button" class="btn" onclick="openBook('${book.volumeInfo.previewLink}')">
                                                <i class="bi bi-book"></i> (Čitaj)
                                            </button>
                                        </li>`;
        })
    }
}

const openBook = bookLink => {
    window.open(bookLink, '_blank').focus(); //opening google book reader in new tab with chosen book
}

const clearSearchResults = () => {
    //clearing search input and search results after clicking 'trash' icon
    const searchInput = document.getElementById('search-input');
    searchInput.value = '';
    const searchBookList = document.getElementById('search-books-list');
    searchBookList.innerHTML = '';
}