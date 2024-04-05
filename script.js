const abertoFechado = document.getElementById("aberto-fechado")
const menu = document.getElementById("menu")
const telaCarrinho = document.getElementById("tela-carrinho")
const fecharBtn = document.getElementById("fechar-btn")
const itensCarrinho = document.getElementById("itens-carrinho")
const totalCarrinho = document.getElementById("total-carrinho")
const observacoesEntrada = document.getElementById("observacoes")
const enderecoEntrada = document.getElementById("endereco")
const alertaEndereco = document.getElementById("alerta-endereco")
const realizaPedido = document.getElementById("pedido-btn")
const carrinhoBtn = document.getElementById("carrinho-btn")
const qntCarrinho = document.getElementById("qnt-carrinho")

let carrinho = [];

carrinhoBtn.addEventListener("click", function() {
    atualizaOCarrinho();
    telaCarrinho.style.display = "flex"
})

telaCarrinho.addEventListener("click", function(event){
    if(event.target === telaCarrinho){
        telaCarrinho.style.display = "none"
    }
})

fecharBtn.addEventListener("click", function(){
    telaCarrinho.style.display = "none"
})

menu.addEventListener("click", function(){

    let proxbtn = event.target.closest(".adicionar-btn")

    if(proxbtn){
        const nome = proxbtn.getAttribute("data-name")
        const preco = parseFloat(proxbtn.getAttribute("data-price"))
        adicionarNoCarrinho(nome, preco)
    }
})

function adicionarNoCarrinho(nome, preco){

    const comparaItem = carrinho.find(item => item.nome === nome)
    
    if (comparaItem){
        comparaItem.qnt += 1;
    }else{
        carrinho.push({
            nome,
            preco,
            qnt: 1
    })
    }
    atualizaOCarrinho()
}

function atualizaOCarrinho(){
    itensCarrinho.innerHTML = "";

    let valorTotal = 0;

    carrinho.forEach(item =>{
        const itensDentroDoCarrinho = document.createElement("div");
        itensDentroDoCarrinho.classList.add("flex", "justify-between", "mb-4", "flex-col")

        itensDentroDoCarrinho.innerHTML = `
        <div class="flex items-center justify-between">
        <div>
            <p class="font-medium">${item.nome}</p>
            <p>Quantidade: ${item.qnt}</p>
            <p class="font-medium mt-2">R$ ${item.preco.toFixed(2)}</p>
        </div>

        <button class="removeItem" data-name="${item.nome}">
        Remover
        </button>
        </div>
        `

        valorTotal += item.preco * item.qnt;

    itensCarrinho.appendChild(itensDentroDoCarrinho)    
    })

    totalCarrinho.textContent = valorTotal.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    qntCarrinho.innerHTML = carrinho.length;
}

itensCarrinho.addEventListener("click", function(event){
    if(event.target.classList.contains("removeItem")){
        const nome = event.target.getAttribute("data-name")
        removeItemdoCarrinho(nome);
    }
})

function removeItemdoCarrinho(nome){
    const index = carrinho.findIndex(item => item.nome === nome);

    if(index !== -1){
        const item = carrinho[index];
        
        if(item.qnt > 1){
            item.qnt -= 1;
            atualizaOCarrinho();
            return;
        }

        carrinho.splice(index, 1);
        atualizaOCarrinho();
    }
}

enderecoEntrada.addEventListener("input", function(event){
    let valorEndereco = event.target.value;

    if(valorEndereco !== ""){
        enderecoEntrada.classList.remove("border-red-500")
        alertaEndereco.classList.add("hidden")
    }
})

realizaPedido.addEventListener("click", function(){

    const estaAberto = verAbertoOuFechado();
    if(!estaAberto){
        Toastify({
            text: "Ops, infelizmente estamos fechado !",
            duration: 3000,
            close: true,
            gravity: "top", 
            position: "center",
            stopOnFocus: true,
            style: {
              background: "#ef4444",
            },
        }).showToast();

        return;
    }
    
    if(carrinho.length === 0) return;
    if(enderecoEntrada.value === ""){
        alertaEndereco.classList.remove("hidden")
        enderecoEntrada.classList.add("border-red-500")
        return;
    }

    const itensCarrinho = carrinho.map((item) => {
        return(
            `${item.qnt}- ${item.nome} Valor: R$ ${item.preco} | `
        )
    }).join("")

const mensagem = encodeURIComponent(itensCarrinho)
const numeroTel = "43999999999"

window.open(`https://wa.me/${numeroTel}?text=${mensagem}%0AObservações: ${observacoesEntrada.value}%0AEntregar no Endereço: ${enderecoEntrada.value}`, "_blank")

carrinho = [];
atualizaOCarrinho();
})

function verAbertoOuFechado(){
    const data = new Date();
    const hora = data.getHours();
    const dia = data.getDay();
    return hora >= 17 && hora < 23 && (dia === 4 || dia === 5 || dia === 6)
}

const estaAberto = verAbertoOuFechado();

if (estaAberto){
    abertoFechado.classList.remove("bg-red-500");
    abertoFechado.classList.add("bg-green-500")
}else{
    abertoFechado.classList.remove("bg-green-500")
    abertoFechado.classList.add("bg-red-500");
}