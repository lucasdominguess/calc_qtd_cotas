async function calcular() {
    const valorTotal = parseFloat(document.getElementById('valorTotal').value) || 0;
    const linhas = document.querySelectorAll('#ativos-container .row');
    const ativos = [];

    // 1. Monta o Payload para o Laravel
    linhas.forEach(linha => {
        ativos.push({
            ticker: linha.querySelector('.ticket').value,
            price: parseFloat(linha.querySelector('.preco').value) || 0,
            percentage: parseInt(linha.querySelector('.porc').value) || 0
        });
    });

    const payload = {
        amount: valorTotal,
        assets: ativos
    };

    try {
        // 2. Envia para a API
        const response = await fetch('http://localhost:8000/api/calcular-cotas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Erro na requisição');

        const result = await response.json();
        
        // 3. Renderiza o Resultado
        renderizarTabela(result);

    } catch (error) {
        console.error(error);
        alert('Erro ao calcular. Verifique o console.');
    }
}

function renderizarTabela(json) {
    const tbody = document.getElementById('tabela-resultado');
    tbody.innerHTML = '';

    // Itera sobre o array "data" retornado pelo Laravel
    json.data.forEach(item => {
        const tr = `
            <tr>
                <td>${item.ticker}</td>
                <td>${item.target_percentage}%</td>
                <td class="fw-bold">${item.quantity}</td>
                <td>R$ ${item.cost.toFixed(2)}</td>
                <td>--</td> </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', tr);
    });

    // Atualiza o Troco Total vindo do "summary"
    const troco = json.summary.change;
    document.getElementById('troco-total').innerText = `R$ ${troco.toFixed(2)}`;
    document.getElementById('resultado').classList.remove('d-none');
}