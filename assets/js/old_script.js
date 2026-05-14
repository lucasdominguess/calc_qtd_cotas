// Inicializa com 2 linhas para o exemplo (60% / 40%)
document.addEventListener('DOMContentLoaded', () => {
    adicionarLinha();
    adicionarLinha();
});

function adicionarLinha() {
    const container = document.getElementById('ativos-container');
    const index = container.children.length;
    
    const html = `
        <div class="row g-2 mb-2 align-items-end" id="linha-${index}">
            <div class="col-lg-2 col-md-2">
                <label class="form-label small">Ticket</label>
                <input type="text" class="form-control ticket" placeholder="Ex: VGIR11">
            </div>
            <div class="col-lg-2 col-md-2">
                <label class="form-label small">Preço Atual (R$)</label>
                <input type="number" class="form-control preco" step="0.01" placeholder="0.00" onchange="calcularPorcentagemPaga(this)">
            </div>
            <div class="col-lg-1 col-md-1">
                <label class="form-label small">% Alvo</label>
                <input type="number" class="form-control porc" step="1" placeholder="0">
            </div>
            <div class="col-lg-2 col-md-2">
                <label class="form-label small">Dividendo/Cota (R$)</label>
                <input type="number" class="form-control dividendo" step="0.01" placeholder="0.00" onchange="calcularPorcentagemPaga(this)">
            </div>
            <div class="col-lg-2 col-md-2">
                <label class="form-label small">% Paga</label>
                <input type="number" class="form-control porcentagem-paga" step="0.01" placeholder="0.00%" disabled>
            </div>
            <div class="col-lg-1 col-md-1">
                <button class="btn btn-danger btn-lg w-110" onclick="removerLinha('linha-${index}')">Remover</button>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
}

function removerLinha(id) {
    document.getElementById(id).remove();
}

function calcularPorcentagemPaga(element) {
    // Encontra a linha do elemento que foi alterado
    const linha = element.closest('.row');
    const preco = parseFloat(linha.querySelector('.preco').value) || 0;
    const dividendo = parseFloat(linha.querySelector('.dividendo').value) || 0;
    const porcentagemPagaInput = linha.querySelector('.porcentagem-paga');
    
    if (preco > 0) {
        const porcentagemPaga = (dividendo / preco) * 100;
        porcentagemPagaInput.value = porcentagemPaga.toFixed(2);
    } else {
        porcentagemPagaInput.value = '';
    }
}

function calcular() {
    const valorTotal = parseFloat(document.getElementById('valorTotal').value) || 0;
    const linhas = document.querySelectorAll('#ativos-container .row');
    const tbody = document.getElementById('tabela-resultado');
    let trocoGeral = 0;
    let somaPorcentagem = 0;

    tbody.innerHTML = ''; // Limpa resultados anteriores

    // Validação simples de soma das porcentagens
    linhas.forEach(linha => {
        somaPorcentagem += parseFloat(linha.querySelector('.porc').value) || 0;
    });

    if (somaPorcentagem !== 100) {
        alert('A soma das porcentagens deve ser igual a 100%!');
        return;
    }

    linhas.forEach(linha => {
        const ticket = linha.querySelector('.ticket').value.toUpperCase() || 'N/A';
        const preco = parseFloat(linha.querySelector('.preco').value) || 0;
        const porc = parseFloat(linha.querySelector('.porc').value) || 0;
        const dividendoPorCota = parseFloat(linha.querySelector('.dividendo').value) || 0;

        if (preco <= 0) return;

        // Lógica Financeira
        const valorAlvo = valorTotal * (porc / 100);
        const qtdCotas = Math.floor(valorAlvo / preco); // Arredonda para baixo (não existe meia cota padrão)
        const totalGasto = qtdCotas * preco;
        const troco = valorAlvo - totalGasto; // Troco referente àquela fatia do bolo

        // Adicionar ao troco geral (somamos o troco da fatia + o que não foi alocado se % < 100)
        trocoGeral += troco;

        // Calcula o dividendo total com base no valor digitado pelo usuário
        const dividendoTotal = qtdCotas * dividendoPorCota;

        const tr = `
            <tr>
                <td>${ticket}</td>
                <td>${porc}%</td>
                <td class="fw-bold">${qtdCotas}</td>
                <td>R$ ${totalGasto.toFixed(2)}</td>
                <td>R$ ${troco.toFixed(2)}</td>
                <td>R$ ${dividendoTotal.toFixed(2)}</td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', tr);
    });

    // Adiciona ao troco o dinheiro que sequer entrou na porcentagem (ex: alocou só 90%)
    const valorNaoAlocado = valorTotal * ((100 - somaPorcentagem) / 100);
    trocoGeral += (valorNaoAlocado > 0 ? valorNaoAlocado : 0);

    document.getElementById('troco-total').innerText = `R$ ${trocoGeral.toFixed(2)}`;
    document.getElementById('resultado').classList.remove('d-none');
}
    