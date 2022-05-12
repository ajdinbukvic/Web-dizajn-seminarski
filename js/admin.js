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

const logout = () => {
    infoMessage('Uspješno ste se odjavili!', 1000);
    setTimeout(() => window.location.replace('../index.html'), 1000);
}