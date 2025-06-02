document.addEventListener('DOMContentLoaded', function() {
    const inputNota = document.getElementById('nota');
    const btnAdicionar = document.getElementById('adicionar');
    const btnLimparTudo = document.getElementById('limparTudo');
    const listaNotas = document.getElementById('listaNotas');
    const conselhoDiv = document.getElementById('conselho');

    carregarNotas();

    btnAdicionar.addEventListener('click', function() {
        const textoNota = inputNota.value.trim();
        if (textoNota !== '') {
            adicionarNota(textoNota);
            inputNota.value = '';
            salvarNotas();
            exibirConselho();
        }
    });

    inputNota.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            btnAdicionar.click();
        }
    });

    btnLimparTudo.addEventListener('click', function() {
        if (confirm('Tem certeza que deseja apagar todas as notas?')) {
            localStorage.removeItem('notas');
            listaNotas.innerHTML = '';
        }
    });

    function adicionarNota(texto) {
        const divNota = document.createElement('div');
        divNota.className = 'nota-item';
        const spanTexto = document.createElement('span');
        spanTexto.textContent = texto;
        const btnExcluir = document.createElement('button');
        btnExcluir.textContent = '✕';
        btnExcluir.className = 'excluir-nota';
        btnExcluir.title = 'Excluir esta nota';
        divNota.appendChild(spanTexto);
        divNota.appendChild(btnExcluir);
        listaNotas.appendChild(divNota);
        divNota.addEventListener('click', function() {
            divNota.classList.toggle('riscada');
            salvarNotas();
        });
        btnExcluir.addEventListener('click', function() {
            divNota.remove();
            salvarNotas();
        });
    }

    function salvarNotas() {
        const notas = [];
        document.querySelectorAll('.nota-item span').forEach(function(item) {
            notas.push(item.textContent);
        });
        localStorage.setItem('notas', JSON.stringify(notas));
    }

    function carregarNotas() {
        const notasSalvas = JSON.parse(localStorage.getItem('notas')) || [];
        notasSalvas.forEach(function(nota) {
            adicionarNota(nota);
        });
    }

    function exibirConselho() {
        fetch('https://api.adviceslip.com/advice')
            .then(response => response.json())
            .then(data => {
                conselhoDiv.textContent = data.slip.advice;
                conselhoDiv.style.display = 'block';
                setTimeout(() => {
                    conselhoDiv.style.display = 'none';
                }, 3000);
            })
            .catch(error => {
                console.error('Erro ao buscar conselho:', error);
                conselhoDiv.textContent = 'Erro ao carregar conselho. Tente novamente.';
                conselhoDiv.style.display = 'block';
                setTimeout(() => {
                    conselhoDiv.style.display = 'none';
                }, 3000);
            });
    }
});
