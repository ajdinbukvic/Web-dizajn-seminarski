const logout = () => {
    infoMessage('Uspješno ste se odjavili!', 1000);
    setTimeout(() => window.location.replace('../index.html'), 1000);
}

const renderBooks = books => {
    
    books.forEach(book => {
        console.log(book);
    });
}

const renderAuthors = authors => {

    authors.forEach(author => {
        console.log(author);
    });
}