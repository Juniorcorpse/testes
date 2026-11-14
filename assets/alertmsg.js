//----- função para exibir o alerta ----//
function show(text) {
    const alert = document.querySelector('.alert');
    alert.textContent = text;
    alert.classList.add('display');
    
    setTimeout(() => {
        alert.classList.remove('display');
        alert.textContent = '';
    }, 10000);
}

window.alertmsg = { show };

