const tableAuthors = document.getElementById('table-authors');
const tableBooks = document.getElementById('table-books');

const newAuthorInput = document.getElementById('author-input');
const addAuthorButton = document.getElementById('add-author-button');
addAuthorButton.addEventListener('click', () => {
    newAuthorInput.value = '';
})

const logout = () => {
    infoMessage('Uspješno ste se odjavili!', 1000);
    setTimeout(() => window.location.replace('../index.html'), 1000);
}

const renderAuthors = authors => {

    let authorsCounter = 1;
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

    if(newAuthor === '') {
        infoMessage('Morate prvo unijeti ime i prezime autora!', 1000);
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

    infoMessage('Uspješno ste dodali novog autora!', 1000);
}

const addAuthorsToDropdownList = () => {

    fetch(`${BASE_URL}/authors`)
    .then(handleErrors)
    .then(data => {
        const dropdownList = document.getElementById('book-author');
        let result = '';
        result += '<option selected disabled hidden>Odaberite autora</option>';
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

    const bookTitle = document.getElementById('book-title').value;
    const bookGenre = document.getElementById('book-genre').value;
    const bookImage = document.getElementById('book-image').value;
    const bookAuthor = document.getElementById('book-author').value;

    if(bookTitle === '' || bookGenre === '' || bookImage === '' || bookAuthor === 'Odaberite autora') {
        infoMessage('Morate prvo unijeti sve informacije o knjizi!', 1000);
        return false;
    }
    
    fetch(`${BASE_URL}/books`, {
        method: 'POST',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({
            name: bookTitle,
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

    $('#add-book-modal').modal('hide');

    $('#add-book-modal').on('hidden.bs.modal', (event) => {
        event.preventDefault();
        $('#add-book-form').find("input[type=text], textarea").val("");
     });
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
                        <button class="btn btn-primary" type="button" onclick="editBook('${book.id}')">
                        <img src="../img/icons/pencil.png">
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-danger" type="button" onclick="deleteBook(${book.id})">
                        <img src="../img/icons/delete.png">
                        </button>
                    </td>
                </tr>`
    });

    tableBooks.innerHTML = result;
}

const openBookImage = bookImage => {
    window.open(bookImage, '_blank').focus();
}

const editBook = bookId => {

}

const deleteBook = bookId => {

}
