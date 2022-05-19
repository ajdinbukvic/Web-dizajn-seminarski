//global variables
const tableAuthors = document.getElementById('table-authors');
const tableBooks = document.getElementById('table-books');
const newAuthorInput = document.getElementById('author-input');
const addAuthorButton = document.getElementById('add-author-button');
//clearing input after using addAuthor() function
addAuthorButton.addEventListener('click', () => {
    newAuthorInput.value = '';
})

const logout = () => {
    infoMessage('Uspješno ste se odjavili!', 2000);
    setTimeout(() => window.location.replace('../index.html'), 2000);
    //redirecting to index.html page after 2 seconds (when logout button is pressed)
}

const renderAuthors = authors => {
    let authorsCounter = 1; //authors displayed in table starts with 1 (not 0)
    let result = '';
    authors.forEach(author => {
        result += `
                <tr>
                    <th scope="row">${authorsCounter}</th>
                    <td>${author.name}</td>
                </tr>`;
        authorsCounter++;
    });
    tableAuthors.innerHTML = result;
}

const addAuthor = () => {
    const newAuthor = document.getElementById('author-input').value;
    if (newAuthor === '') { //closing function if there's no input
        infoMessage('Morate prvo unijeti ime i prezime autora!', 2000);
        return false;
    }
    fetch(`${BASE_URL}/authors`, {
        method: 'POST',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({
            name: newAuthor
        })
    })
    .then(res => { 
        console.log(res);
        tableAuthors.innerHTML = '';
        getAuthors();
    })
    infoMessage('Uspješno ste dodali novog autora!', 2000);
}

const addAuthorsToDropdownList = () => {
    fetch(`${BASE_URL}/authors`)
    .then(handleErrors)
    .then(data => {
        const dropdownList = document.getElementById('add-book-author');
        let result = '';
        result += '<option selected disabled hidden>Odaberite autora</option>'; //setting default value for dropdown list (placeholder)
        data.forEach(author => {
            result += `<option value='${author.id}'>${author.name}</option>`;
        });
        dropdownList.innerHTML = result;
    })
    .catch(err => {
        console.log(err);
    });
}

const addBook = () => {
    const bookName = document.getElementById('add-book-name').value;
    const bookGenre = document.getElementById('add-book-genre').value;
    const bookImage = document.getElementById('add-book-image').value;
    const bookAuthor = document.getElementById('add-book-author').value;
    if (bookName === '' || bookGenre === '' || bookImage === '' || bookAuthor === 'Odaberite autora') {
        infoMessage('Morate prvo unijeti sve informacije o knjizi!', 2000, 400);
        return false; //closing function if there's no input (all inputs must be filled before submiting form)
    }
    fetch(`${BASE_URL}/books`, {
        method: 'POST',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({
            name: bookName,
            genre: bookGenre,
            image: bookImage,
            authorId: bookAuthor
        })
    })
    .then(res => {
        console.log(res);
        tableBooks.innerHTML = '';
        getBooks();
    })
    $('#add-book-modal').modal('hide'); //closing modal after submitting form
    $('#add-book-modal').on('hidden.bs.modal', (event) => {
        event.preventDefault();
        $('#add-book-form').find("input[type=text], textarea").val(""); //clearing all input fields in modal after submitting form
    });
    infoMessage('Uspješno ste se dodali novu knjigu!', 2000);
}    

const renderBooks = books => {
    let result = '';
    books.forEach(book => {
        result += `
                <tr>
                    <td>
                        <div class="d-flex align-items-center justify-content-center">
                            <div class="ms-3">
                                <p class="fw-bold mb-1">${book.name}</p>
                                <p class="text-muted mb-0">${book.genre}</p>
                            </div>
                        </div>
                    </td>
                    <td>
                        <p class="fw-normal mb-1">${book.author.name}</p>
                    </td>
                    <td>
                        <button type="button" class="btn btn-link btn-sm btn-rounded" onclick="openBookImage('${book.image}')">Otvori</button>
                    </td>
                    <td>
                        <button class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#edit-book-modal" onclick="getBookById('${book.id}')">
                        <img src="../img/icons/pencil.png">
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-danger" type="button" onclick="deleteBook('${book.id}')">
                        <img src="../img/icons/delete.png">
                        </button>
                    </td>
                </tr>`
    });
    tableBooks.innerHTML = result;
}

const openBookImage = bookImage => {
    window.open(bookImage, '_blank').focus(); //opening book image of chosen book in new tab
}

const getBookById = bookId => {
    fetch(`${BASE_URL}/books/${bookId}`)
    .then(handleErrors)
    .then(data => {
        editBook(data);
    })
    .catch(err => {
        console.log(err);
    });
}

const editBook = book => {
    const bookId = document.getElementById('edit-book-id');
    const bookName = document.getElementById('edit-book-name');
    const bookGenre = document.getElementById('edit-book-genre');
    const bookAuthorId = document.getElementById('edit-book-author-id');
    //setting values of edit form with book chosen book (fetch - get by id)
    bookId.value = book.id;
    bookName.value = book.name;
    bookGenre.value = book.genre;
    bookAuthorId.value = book.authorId;
}

const updateBook = () => {
    const bookId = document.getElementById('edit-book-id').value;
    const bookName = document.getElementById('edit-book-name').value;
    const bookGenre = document.getElementById('edit-book-genre').value;
    const bookAuthorId = document.getElementById('edit-book-author-id').value;
    const bookImage = document.getElementById('edit-book-image').value;
    if (bookImage === '') {
        infoMessage('Morate prvo unijeti novi link slike!', 2000, 400);
        return false; //closing function if there's no input
    }
    fetch(`${BASE_URL}/books`, {
        method: 'PUT',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify ({
            bookId: bookId,
            name: bookName,
            genre: bookGenre,
            image: bookImage,
            authorId: bookAuthorId
        })
    })
    .then(res => {
        console.log(res);
        tableBooks.innerHTML = '';
        getBooks();
    })
    $('#edit-book-modal').modal('hide'); //closing modal after submitting form
    $('#edit-book-modal').on('hidden.bs.modal', (event) => {
        event.preventDefault();
        $('#edit-book-form').find("input[type=text], textarea").val(""); //clearing all input fields in modal after submitting form
    });
    infoMessage('Uspješno ste promijenili informacije knjige!', 2000);
}

const deleteBook = bookId => {
    if (!confirm('Jeste li sigurni da želite izbrisati ovu knjigu?')) { //showing dialog box with security question before deleting chosen book
        return false; 
    }
    fetch(`${BASE_URL}/books/${bookId}`, {
        method: 'DELETE'
    })
    .then(res => {
        console.log(res);
        tableBooks.innerHTML = '';
        getBooks();
    })
    infoMessage('Uspješno ste izbrisali knjigu!', 2000);
}