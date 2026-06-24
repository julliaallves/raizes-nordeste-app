/**
 * Store — Gerenciamento de Estado (Carrinho, Pedidos, Usuário, Consentimento LGPD)
 */

const store = {
    // Carrinho
    cart: [],

    // Pedidos (inicializado com mock data, novos pedidos são adicionados aqui)
    pedidos: [],

    // Usuário
    user: null,
    isLoggedIn: false,

    // Unidade selecionada
    currentUnit: UNIDADES[0],

    // LGPD
    lgpdConsent: {
        essential: true,
        analytics: false,
        marketing: false,
        personalization: false,
        accepted: false,
    },

    // Pontos fidelidade (pontos base dos pedidos mock já entregues)
    loyalty: {
        pontos: 85,
        nivel: 'Prata',
        historicoMes: 45,
    },

    // Timers para progressão de pedidos
    _orderTimers: [],

    // ==================
    // INIT
    // ==================
    initPedidos() {
        this.pedidos = JSON.parse(JSON.stringify(PEDIDOS_INICIAIS));
    },

    // ==================
    // CART METHODS
    // ==================
    addToCart(product, qty = 1, opcoes = []) {
        const existing = this.cart.find(
            (item) => item.product.id === product.id && JSON.stringify(item.opcoes) === JSON.stringify(opcoes)
        );
        if (existing) {
            existing.qty += qty;
        } else {
            this.cart.push({ product, qty, opcoes });
        }
        this.updateCartBadge();
        app.showToast(`${product.nome} adicionado ao carrinho!`);
    },

    removeFromCart(index) {
        this.cart.splice(index, 1);
        this.updateCartBadge();
    },

    updateCartItem(index, opcoes) {
        if (this.cart[index]) {
            this.cart[index].opcoes = opcoes;
        }
        this.updateCartBadge();
    },

    updateCartQty(index, qty) {
        if (qty <= 0) {
            this.removeFromCart(index);
        } else {
            this.cart[index].qty = qty;
        }
        this.updateCartBadge();
    },

    getCartTotal() {
        return this.cart.reduce((sum, item) => {
            const opcoesPreco = item.opcoes.reduce((s, op) => s + (op.preco || 0), 0);
            return sum + (item.product.preco + opcoesPreco) * item.qty;
        }, 0);
    },

    getCartCount() {
        return this.cart.reduce((sum, item) => sum + item.qty, 0);
    },

    clearCart() {
        this.cart = [];
        this.updateCartBadge();
    },

    updateCartBadge() {
        const badge = document.getElementById('cart-badge');
        const count = this.getCartCount();
        const total = this.getCartTotal();
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'block' : 'none';
        }
        // Floating cart
        const floatingCart = document.getElementById('floating-cart');
        if (floatingCart) {
            if (count > 0) {
                floatingCart.classList.remove('hidden');
                document.getElementById('floating-cart-count').textContent = count + (count === 1 ? ' item' : ' itens');
                document.getElementById('floating-cart-total').textContent = 'R$ ' + total.toFixed(2);
            } else {
                floatingCart.classList.add('hidden');
            }
        }
    },

    // ==================
    // ORDER METHODS
    // ==================
    createOrder(pagamento) {
        const now = new Date();
        const dataStr = now.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
            + ' ' + now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        const previsaoTime = new Date(now.getTime() + 25 * 60000);
        const previsaoStr = previsaoTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        const total = this.getCartTotal();
        const pontosGanhos = Math.round(total);
        const numPedido = 'PED-2026-' + String(Math.floor(Math.random() * 9000) + 1000);

        const itens = this.cart.map(item => {
            const opcoesTexto = item.opcoes
                .filter(op => op.nome)
                .map(op => op.preco > 0 ? `${op.nome} (+R$${op.preco.toFixed(2).replace('.', ',')})` : op.nome);
            const opcoesPreco = item.opcoes.reduce((s, op) => s + (op.preco || 0), 0);
            return {
                nome: item.product.nome,
                qtd: item.qty,
                preco: item.product.preco + opcoesPreco,
                opcoes: opcoesTexto,
            };
        });

        const newOrder = {
            id: numPedido,
            data: dataStr,
            status: 'preparing',
            statusTexto: 'Em Preparo',
            etapa: 1,
            itens: itens,
            total: total,
            unidade: `${this.currentUnit.nome} — ${this.currentUnit.cidade}`,
            previsao: previsaoStr,
            pontosGanhos: pontosGanhos,
            pontosContabilizados: false,
            pagamento: pagamento,
        };

        // Add at the beginning of the list
        this.pedidos.unshift(newOrder);

        // Schedule order progression: Em Preparo → Pronto (90s) → Entregue (180s = 3min)
        this._scheduleOrderProgression(numPedido);

        this.clearCart();
        return newOrder;
    },

    _scheduleOrderProgression(orderId) {
        // After 90 seconds: move to "Pronto" (step 3)
        const timer1 = setTimeout(() => {
            const order = this.pedidos.find(p => p.id === orderId);
            if (order && order.status === 'preparing') {
                order.etapa = 3;
                order.statusTexto = 'Pronto para Retirada';
                // Refresh the page if user is viewing pedidos
                if (app.currentPage === 'pedidos') {
                    app.navigate('pedidos', false);
                }
                app.showToast(`Pedido ${orderId} está pronto para retirada!`);
            }
        }, 90000);

        // After 180 seconds (3 min): move to "Entregue" (step 4) + add points
        const timer2 = setTimeout(() => {
            const order = this.pedidos.find(p => p.id === orderId);
            if (order && order.status !== 'delivered') {
                order.status = 'delivered';
                order.statusTexto = 'Entregue';
                order.etapa = 4;
                // Add loyalty points now
                if (!order.pontosContabilizados) {
                    order.pontosContabilizados = true;
                    this.loyalty.pontos += order.pontosGanhos;
                    this.loyalty.historicoMes += order.pontosGanhos;
                }
                // Refresh page if viewing pedidos or fidelidade
                if (app.currentPage === 'pedidos' || app.currentPage === 'fidelidade') {
                    app.navigate(app.currentPage, false);
                }
                app.showToast(`Pedido ${orderId} entregue! +${order.pontosGanhos} pontos adicionados.`);
            }
        }, 180000);

        this._orderTimers.push(timer1, timer2);
    },

    getPedidosFiltrados(filtro) {
        if (filtro === 'andamento') {
            return this.pedidos.filter(p => p.status === 'preparing');
        }
        if (filtro === 'entregues') {
            return this.pedidos.filter(p => p.status === 'delivered');
        }
        return this.pedidos;
    },

    // ==================
    // USER METHODS
    // ==================
    login(email, senha) {
        this.user = {
            nome: 'Julia Santos',
            email: email,
            cpf: '***.***.***-00',
        };

        this.isLoggedIn = true;
        app.showToast('Login realizado com sucesso!');
        app.navigate('home');
    },

    logout() {
        this.user = null;
        this.isLoggedIn = false;
        app.showToast('Você saiu da conta');
        app.navigate('home');
    },

    // ==================
    // LGPD METHODS
    // ==================
    setConsent(type, value) {
        this.lgpdConsent[type] = value;
    },

    saveConsent() {
        this.lgpdConsent.accepted = true;
        try {
            localStorage.setItem('lgpd_consent', JSON.stringify(this.lgpdConsent));
        } catch (e) { /* storage not available */ }
        app.showToast('Preferências de privacidade salvas');
    },

    loadConsent() {
        try {
            const saved = localStorage.getItem('lgpd_consent');
            if (saved) {
                this.lgpdConsent = JSON.parse(saved);
                return true;
            }
        } catch (e) { /* storage not available */ }
        return false;
    },

    // ==================
    // UNIT METHODS
    // ==================
    setUnit(unitId) {
        const unit = UNIDADES.find((u) => u.id === unitId);
        if (unit) {
            this.currentUnit = unit;
            document.getElementById('current-unit').textContent = `${unit.nome} — ${unit.cidade}`;
            app.showToast(`Unidade alterada para ${unit.nome}`);
            app.closeModal();
            // Refresh current page to reflect unit-specific products
            if (app.currentPage === 'cardapio' || app.currentPage === 'home') {
                app.navigate(app.currentPage, false);
            }
        }
    },
};
