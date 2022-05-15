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

    const table = document.getElementById('table-authors');
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
    
    table.innerHTML = result;
}

const addAuthor = () => {

    const newAuthor = document.getElementById('author-input').value;
    const table = document.getElementById('table-authors');

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
        table.innerHTML = '';
        getAuthors();
    })

    infoMessage('Uspješno ste dodali novog autora!', 1000);
}

const renderBooks = books => {
    
    books.forEach(book => {
        console.log(book);
    });
}
