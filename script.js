const produtos = [
    {
        id: 1,
        nome: "Combo Sakura",
        tipo: "Combinado",
        preco: 39.90,
        descricao: "Uma seleção especial de sushis.",
        imagem: "COMBO.jpg"
    },
    {
        id: 2,
        nome: "Temaki Especial",
        tipo: "Temaki",
        preco: 24.90,
        descricao: "Temaki saboroso e bem recheado.",
        imagem: "TEMAKI.png"
    },
    {
        id: 3,
        nome: "Sashimi Dourado",
        tipo: "Sushi",
        preco: 32.90,
        descricao: "Cada peça preparadas com cuidado.",
        imagem: "shushi.dourado.png"
    },
    {
        id: 4,
        nome: "Combo de Molhos",
        tipo: "Sushi",
        preco: 15.00,
        descricao: "Shoyu, Molho de pimenta cremoso, Molho de pimenta agridoce, 50ml",
        imagem: "comboMolhos.png"
    },
    {
        id: 5,
        nome: "Molho Shoyu",
        tipo: "Sushi",
        preco: 5.00,
        descricao: "Molho Shoyu, 50ml",
        imagem: "molhoShoyu.png"
    },
    {
        id: 6,
        nome: "Molho Tare",
        tipo: "Combinado",
        preco: 5.00,
        descricao: "Molho Tare, 50ml",
        imagem: "molhoTare.png"
    },
    {
        id: 7,
        nome: "Combos de Bebidas Orientais",
        tipo: "Bebida",
        preco: 29.90,
        descricao: "Três bebidas orientais para experimentar novos sabores..",
        imagem: "bebidasJaponesas.png"
    }

];

let carrinho = [];
let pedidos = [];
let pessoa = null;
let categoriaAtual = "Todos";

function dinheiro(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function mostrarAviso(texto) {
    const aviso = document.getElementById("aviso");

    aviso.textContent = texto;
    aviso.classList.add("mostrar");

    setTimeout(function() {
        aviso.classList.remove("mostrar");
    }, 2500);
}

function mostrarProdutos() {
    const busca = document.getElementById("buscaProdutos")
        .value.trim().toLowerCase();

    const lista = document.getElementById("listaProdutos");

    const encontrados = produtos.filter(function(produto) {
        const nomeCombina = produto.nome.toLowerCase().includes(busca);
        const tipoCombina = categoriaAtual === "Todos" ||
            produto.tipo === categoriaAtual;

        return nomeCombina && tipoCombina;
    });

    lista.innerHTML = encontrados.map(function(produto) {
        return `
            <article class="produto">
                <img src="${produto.imagem}" alt="${produto.nome}">
                <div class="produto-info">
                    <h3>${produto.nome}</h3>
                    <p>${produto.descricao}</p>
                    <div class="linha-produto">
                        <span class="preco">${dinheiro(produto.preco)}</span>
                        <button class="adicionar"
                            data-adicionar="${produto.id}">+</button>
                    </div>
                </div>
            </article>
        `;
    }).join("");

    document.getElementById("semProduto").hidden =
        encontrados.length > 0;
}

function adicionarCarrinho(id) {
    const item = carrinho.find(function(produto) {
        return produto.id === id;
    });

    if (item) {
        item.quantidade++;
    } else {
        const produto = produtos.find(function(produto) {
            return produto.id === id;
        });

        carrinho.push({
            ...produto,
            quantidade: 1
        });
    }

    mostrarCarrinho();
    mostrarAviso("Produto adicionado ao carrinho!");
}

function mudarQuantidade(id, valor) {
    const item = carrinho.find(function(produto) {
        return produto.id === id;
    });

    if (!item) return;

    item.quantidade += valor;

    if (item.quantidade <= 0) {
        carrinho = carrinho.filter(function(produto) {
            return produto.id !== id;
        });
    }

    mostrarCarrinho();
}
function mostrarCarrinho() {
    const lista = document.getElementById("itensCarrinho");

    const subtotal = carrinho.reduce(function(soma, item) {
        return soma + item.preco * item.quantidade;
    }, 0);

    const quantidade = carrinho.reduce(function(soma, item) {
        return soma + item.quantidade;
    }, 0);

    const taxa = carrinho.length > 0 ? 5 : 0;

    document.getElementById("subtotal").textContent = dinheiro(subtotal);
    document.getElementById("entrega").textContent = dinheiro(taxa);
    document.getElementById("total").textContent = dinheiro(subtotal + taxa);

    if (carrinho.length === 0) {
        lista.innerHTML =
            '<p class="texto-fraco">Seu carrinho está vazio.</p>';
        return;
    }

    lista.innerHTML = carrinho.map(function(item) {
        return `
            <div class="item-carrinho">
                <img src="${item.imagem}" alt="${item.nome}">
                <div class="nome-item">
                    <b>${item.nome}</b>
                    <small>${dinheiro(item.preco)}</small>
                </div>
                <div class="controles">
                    <button data-menos="${item.id}">−</button>
                    <span>${item.quantidade}</span>
                    <button data-mais="${item.id}">+</button>
                    <button class="remover"
                        data-remover="${item.id}">×</button>
                </div>
            </div>
        `;
    }).join("");
}

function finalizarPedido() {
    if (carrinho.length === 0) {
        mostrarAviso("Adicione um produto antes de finalizar.");
        return;
    }

    const subtotal = carrinho.reduce(function(soma, item) {
        return soma + item.preco * item.quantidade;
    }, 0);

    const novoPedido = {
        numero: pedidos.length + 1001,
        data: new Date().toLocaleString("pt-BR"),
        itens: carrinho.map(function(item) {
            return { ...item };
        }),
        total: subtotal + 5,
        estado: "Em preparo"
    };

    pedidos.unshift(novoPedido);

    carrinho = [];

    mostrarCarrinho();
    mostrarPedidos();
    mostrarAviso("Pedido finalizado com sucesso!");

    document.getElementById("pedidos").scrollIntoView({
        behavior: "smooth"
    });
}

function mostrarPedidos() {
    const busca = document.getElementById("buscaPedidos")
        .value.trim().toLowerCase();

    const lista = document.getElementById("listaPedidos");

    const encontrados = pedidos.filter(function(pedido) {
        return String(pedido.numero).includes(busca);
    });

    if (encontrados.length === 0) {
        lista.innerHTML = pedidos.length > 0
            ? '<p class="texto-fraco">Nenhum pedido encontrado.</p>'
            : '<p class="texto-fraco">Seus pedidos aparecerão aqui.</p>';
        return;
    }

    lista.innerHTML = encontrados.map(function(pedido) {
        const nomes = pedido.itens.map(function(item) {
            return item.quantidade + "x " + item.nome;
        }).join(", ");

        return `
            <article class="pedido">
                <b>Pedido #${pedido.numero}</b>
                <span class="estado">${pedido.estado}</span>
                <small>${pedido.data}</small>
                <p>${nomes}</p>
                <b>Total: ${dinheiro(pedido.total)}</b>
            </article>
        `;
    }).join("");
}

function soNumeros(valor) {
    return valor.replace(/\D/g, "");
}

function formatarTelefone(valor) {
    let numero = soNumeros(valor).slice(0, 11);

    if (numero.length > 10) {
        return numero.replace(
            /^(\d{2})(\d{5})(\d{0,4}).*/,
            "($1) $2-$3"
        );
    }

    if (numero.length > 6) {
        return numero.replace(
            /^(\d{2})(\d{4})(\d{0,4}).*/,
            "($1) $2-$3"
        );
    }

    if (numero.length > 2) {
        return numero.replace(/^(\d{2})(\d*)/, "($1) $2");
    }

    return numero ? "(" + numero : "";
}

function formatarCpf(valor) {
    let numero = soNumeros(valor).slice(0, 11);

    numero = numero.replace(/^(\d{3})(\d)/, "$1.$2");
    numero = numero.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
    numero = numero.replace(/\.(\d{3})(\d{1,2})$/, ".$1-$2");

    return numero;
}

function formatarCep(valor) {
    return soNumeros(valor)
        .slice(0, 8)
        .replace(/^(\d{5})(\d)/, "$1-$2");
}

document.getElementById("telefone").addEventListener("input", function() {
    this.value = formatarTelefone(this.value);
});

document.getElementById("cpf").addEventListener("input", function() {
    this.value = formatarCpf(this.value);
});

document.getElementById("cep").addEventListener("input", function() {
    this.value = formatarCep(this.value);
});

["telefone", "cpf", "cep"].forEach(function(id) {
    document.getElementById(id).addEventListener("keydown", function(evento) {
        const teclasLivres = [
            "Backspace", "Delete", "Tab",
            "ArrowLeft", "ArrowRight", "Home", "End"
        ];

        if (teclasLivres.includes(evento.key) ||
            evento.ctrlKey || evento.metaKey) {
            return;
        }

        if (!/^\d$/.test(evento.key)) {
            evento.preventDefault();
        }
    });
});

document.getElementById("listaProdutos").addEventListener("click", function(evento) {
    const botao = evento.target.closest("[data-adicionar]");

    if (botao) {
        adicionarCarrinho(Number(botao.dataset.adicionar));
    }
});

document.getElementById("itensCarrinho").addEventListener("click", function(evento) {
    const botao = evento.target.closest("button");

    if (!botao) return;

    if (botao.dataset.mais) {
        mudarQuantidade(Number(botao.dataset.mais), 1);
    }

    if (botao.dataset.menos) {
        mudarQuantidade(Number(botao.dataset.menos), -1);
    }

    if (botao.dataset.remover) {
        carrinho = carrinho.filter(function(item) {
            return item.id !== Number(botao.dataset.remover);
        });

        mostrarCarrinho();
    }
});

document.getElementById("buscaProdutos").addEventListener("input", mostrarProdutos);

document.getElementById("buscaPedidos").addEventListener("input", mostrarPedidos);

document.querySelector(".categorias").addEventListener("click", function(evento) {
    const botao = evento.target.closest("[data-categoria]");

    if (!botao) return;

    categoriaAtual = botao.dataset.categoria;

    document.querySelectorAll(".categoria").forEach(function(item) {
        item.classList.toggle("ativa", item === botao);
    });

    mostrarProdutos();
});

document.getElementById("finalizarPedido").addEventListener("click", finalizarPedido);

document.getElementById("formCadastro").addEventListener("submit", function(evento) {
    evento.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefone = document.getElementById("telefone").value;
    const cpf = document.getElementById("cpf").value;
    const cep = document.getElementById("cep").value;
    const endereco = document.getElementById("endereco").value.trim();

    if (soNumeros(telefone).length < 10) {
        mostrarAviso("Confira o telefone informado.");
        return;
    }

    if (soNumeros(cpf).length !== 11) {
        mostrarAviso("O CPF deve ter 11 números.");
        return;
    }

    if (soNumeros(cep).length !== 8) {
        mostrarAviso("O CEP deve ter 8 números.");
        return;
    }

    pessoa = { nome, email, telefone, cpf, cep, endereco };

    mostrarPerfil();
    mostrarAviso("Cadastro realizado com sucesso!");

    document.getElementById("perfil").scrollIntoView({
        behavior: "smooth"
    });
});

function mostrarPerfil() {
    const area = document.getElementById("dadosPerfil");

    if (!pessoa) {
        area.innerHTML =
            '<p class="texto-fraco">Faça seu cadastro para ver seus dados.</p>';
        return;
    }

    area.innerHTML = `
        <div class="dado"><small>Nome completo</small><b></b></div>
        <div class="dado"><small>E-mail</small><b></b></div>
        <div class="dado"><small>Telefone</small><b></b></div>
        <div class="dado"><small>CPF</small><b></b></div>
        <div class="dado"><small>CEP</small><b></b></div>
        <div class="dado"><small>Endereço</small><b></b></div>
    `;

    const valores = [
        pessoa.nome, pessoa.email, pessoa.telefone,
        pessoa.cpf, pessoa.cep, pessoa.endereco
    ];

    area.querySelectorAll(".dado b").forEach(function(campo, indice) {
        campo.textContent = valores[indice];
    });
}
  
document.getElementById("formLogin").addEventListener("submit", function(evento) {
    evento.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const senha = document.getElementById("loginSenha").value;

    if (pessoa && email.toLowerCase() === pessoa.email.toLowerCase()) {
        mostrarAviso("Bem-vindo(a), " + pessoa.nome.split(" ")[0] + "!");
    } else {
        mostrarAviso("Faça seu cadastro nesta página primeiro.");
    }
});

document.getElementById("botaoTema").addEventListener("click", function() {
    document.body.classList.toggle("claro");

    if (document.body.classList.contains("claro")) {
        this.textContent = "☀";
        this.title = "Ativar modo escuro";
    } else {
        this.textContent = "☾";
        this.title = "Ativar modo claro";
    }
});

document.getElementById("botaoMenu").addEventListener("click", function() {
    document.getElementById("menu").classList.toggle("aberto");
});

document.querySelectorAll("#menu a").forEach(function(link) {
    link.addEventListener("click", function() {
        document.getElementById("menu").classList.remove("aberto");
    });
});

mostrarProdutos();
mostrarCarrinho();
mostrarPedidos();
mostrarPerfil();
