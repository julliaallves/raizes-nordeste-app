/**
 * App — Controlador principal (SPA Router, eventos, interações)
 */

const app = {
    currentPage: 'home',
    _selectedPayment: 'PIX',
    _pedidoFiltro: 'todos',

    // ==================
    // INIT
    // ==================
    init() {
        // Initialize mock orders
        store.initPedidos();

        // Check LGPD consent
        if (!store.loadConsent()) {
            document.getElementById('lgpd-banner').classList.remove('hidden');
        }

        // Listen to hash changes
        window.addEventListener('hashchange', () => {
            const page = location.hash.replace('#', '') || 'home';
            this.navigate(page, false);
        });

        // Initial route
        const page = location.hash.replace('#', '') || 'home';
        this.navigate(page, false);

        // Update cart badge
        store.updateCartBadge();
    },

    // ==================
    // NAVIGATION
    // ==================
    navigate(page, pushHash = true) {
        this.currentPage = page;
        const content = document.getElementById('app-content');

        if (pages[page]) {
            content.innerHTML = pages[page]();
        } else {
            content.innerHTML = `
 <div class="container">
 <div class="empty-state">
 <div class="empty-state-icon">🔍</div>
 <h3>Página não encontrada</h3>
 <button class="btn btn-primary" onclick​="app.navigate('home')" style="margin-top:var(--space-md)">Voltar ao Início</button>
 </div>
 </div>
 `;
        }

        // Update nav active states
        document.querySelectorAll('.nav-link, .bottom-nav-item').forEach(el => {
            el.classList.toggle('active', el.dataset.page === page);
        });

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Push hash
        if (pushHash) {
            location.hash = page;
        }

        // Close mobile menu
        document.getElementById('mobile-menu').classList.add('hidden');
    },

    // ==================
    // PRODUCT ACTIONS
    // ==================
    addProduct(productId) {
        const product = PRODUTOS.find(p => p.id === productId);
        if (product && product.disponivel) {
            store.addToCart(product, 1, []);
        }
    },

    openProductModal(productId) {
        const product = PRODUTOS.find(p => p.id === productId);
        if (!product || !product.disponivel) return;

        document.getElementById('modal-title').textContent = product.nome;
        let html = `
 <div style="text-align:center;margin-bottom:var(--space-md)">
 ${product.imagem
                ? `<img src="${product.imagem}" alt="${product.nome}" style="width:100%;max-height:200px;object-fit:cover;border-radius:var(--radius-md);">`
                : `<span style="font-size:4rem">${product.icone}</span>`
            }
 </div>
 <p style="color:var(--cinza-500);margin-bottom:var(--space-md)">${product.descricao}</p>
 <p class="price" style="font-size:1.3rem;margin-bottom:var(--space-md)">
 ${product.precoOriginal ? `<span style="text-decoration:line-through;color:var(--cinza-400);font-size:0.9rem;">R$ ${product.precoOriginal.toFixed(2)}</span> ` : ''}
 R$ ${product.preco.toFixed(2)}
 ${product.festivalJunino ? ' <span class="badge badge-seasonal">-15% Junino</span>' : ''}
 </p>
 `;

        if (product.opcoes && product.opcoes.length > 0) {
            html += '<h4 style="margin-bottom:var(--space-sm)">Personalizar:</h4>';
            product.opcoes.forEach((opt, i) => {
                const optName = typeof opt === 'object' ? opt.nome : opt;
                const optPreco = typeof opt === 'object' ? opt.preco : 0;
                html += `
 <div class="form-checkbox" style="margin-bottom:var(--space-xs)">
 <input type="checkbox" id="opt-${i}" data-nome="${optName}" data-preco="${optPreco}" 
 onchange​="app.updateModalTotal(${product.id})" />
 <label for="opt-${i}">${optName}${optPreco > 0 ? ` (+R$${optPreco.toFixed(2)})` : ''}</label>
 </div>
 `;
            });
        }

        if (product.alergenos.length > 0) {
            html += `
 <div class="info-box info-box-warning" style="margin-top:var(--space-md)">
 ⚠️ Alérgenos: ${product.alergenos.join(', ')}
 </div>
 `;
        }

        html += `
 <button class="btn btn-primary btn-full btn-lg" style="margin-top:var(--space-md)" id="modal-add-btn"
 onclick​="app.addFromModal(${product.id})">
 Adicionar ao Carrinho — R$ ${product.preco.toFixed(2)}
 </button>
 `;

        document.getElementById('modal-body').innerHTML = html;
        document.getElementById('modal').classList.remove('hidden');
        document.getElementById('modal-overlay').classList.remove('hidden');
    },

    updateModalTotal(productId) {
        const product = PRODUTOS.find(p => p.id === productId);
        let total = product.preco;
        document.querySelectorAll('hashtag#modal-body input[type="checkbox"]:checked').forEach(cb => {
            total += parseFloat(cb.dataset.preco) || 0;
        });
        const btn = document.getElementById('modal-add-btn');
        if (btn) btn.textContent = `Adicionar ao Carrinho — R$ ${total.toFixed(2)}`;
    },

    addFromModal(productId) {
        const product = PRODUTOS.find(p => p.id === productId);
        const selected = [];
        document.querySelectorAll('hashtag#modal-body input[type="checkbox"]:checked').forEach(cb => {
            selected.push({ nome: cb.dataset.nome, preco: parseFloat(cb.dataset.preco) || 0 });
        });
        store.addToCart(product, 1, selected);
        this.closeModal();
    },

    // ==================
    // CART ACTIONS
    // ==================
    updateQty(index, qty) {
        store.updateCartQty(index, qty);
        this.navigate('carrinho', false);
    },

    removeItem(index) {
        store.removeFromCart(index);
        this.navigate('carrinho', false);
        this.showToast('Item removido do carrinho');
    },

    editCartItemOptions(index) {
        const item = store.cart[index];
        if (!item) return;
        const product = item.product;

        document.getElementById('modal-title').textContent = `Editar — ${product.nome}`;
        let html = `
 <p style="color:var(--cinza-500);margin-bottom:var(--space-md)">Altere os opcionais deste item:</p>
 <h4 style="margin-bottom:var(--space-sm)">Personalizar:</h4>
 `;

        const currentOpcoes = item.opcoes.map(op => op.nome);
        product.opcoes.forEach((opt, i) => {
            const optName = typeof opt === 'object' ? opt.nome : opt;
            const optPreco = typeof opt === 'object' ? opt.preco : 0;
            const isChecked = currentOpcoes.includes(optName);
            html += `
 <div class="form-checkbox" style="margin-bottom:var(--space-xs)">
 <input type="checkbox" id="edit-opt-${i}" data-nome="${optName}" data-preco="${optPreco}" 
 ${isChecked ? 'checked' : ''}
 onchange​="app.updateEditModalTotal(${index})" />
 <label for="edit-opt-${i}">${optName}${optPreco > 0 ? ` (+R$${optPreco.toFixed(2)})` : ''}</label>
 </div>
 `;
        });

        const opcoesPreco = item.opcoes.reduce((s, op) => s + (op.preco || 0), 0);
        html += `
 <div style="margin-top:var(--space-md);font-size:1.1rem;font-weight:600" id="edit-modal-price">
 Preço unitário: R$ ${(product.preco + opcoesPreco).toFixed(2)}
 </div>
 <button class="btn btn-primary btn-full btn-lg" style="margin-top:var(--space-md)" id="edit-modal-btn"
 onclick​="app.saveCartItemOptions(${index})">
 Salvar Alterações
 </button>
 `;

        document.getElementById('modal-body').innerHTML = html;
        document.getElementById('modal').classList.remove('hidden');
        document.getElementById('modal-overlay').classList.remove('hidden');
    },

    updateEditModalTotal(cartIndex) {
        const item = store.cart[cartIndex];
        if (!item) return;
        let total = item.product.preco;
        document.querySelectorAll('hashtag#modal-body input[type="checkbox"]:checked').forEach(cb => {
            total += parseFloat(cb.dataset.preco) || 0;
        });
        const priceEl = document.getElementById('edit-modal-price');
        if (priceEl) priceEl.textContent = `Preço unitário: R$ ${total.toFixed(2)}`;
    },

    saveCartItemOptions(cartIndex) {
        const selected = [];
        document.querySelectorAll('hashtag#modal-body input[type="checkbox"]:checked').forEach(cb => {
            selected.push({ nome: cb.dataset.nome, preco: parseFloat(cb.dataset.preco) || 0 });
        });
        store.updateCartItem(cartIndex, selected);
        this.closeModal();
        this.navigate('carrinho', false);
        this.showToast('Opcionais atualizados!');
    },

    reorderItems(itens) {
        itens.forEach(it => {
            const product = PRODUTOS.find(p => p.nome === it.nome);
            if (product && product.disponivel) {
                // Parse opcoes text back to objects
                const opcoes = (it.opcoes || []).map(opText => {
                    const match = opText.match(/\+R\$(\d+[.,]\d{2})/);
                    const preco = match ? parseFloat(match[1].replace(',', '.')) : 0;
                    const nome = opText.replace(/\s*\(\+R\$\d+[.,]\d{2}\)/, '').trim();
                    return { nome, preco };
                });
                store.addToCart(product, it.qtd, opcoes);
            }
        });
        this.navigate('carrinho');
    },

    redeemReward(nome, pontos) {
        if (store.loyalty.pontos >= pontos) {
            store.loyalty.pontos -= pontos;
            this.showToast(`Recompensa "${nome}" resgatada! Desconto aplicado no próximo pedido.`);
            this.navigate('fidelidade', false);
        }
    },

    avaliarPedido(pedidoId) {
        const pedido = store.pedidos.find(p => p.id === pedidoId);
        if (!pedido) return;

        document.getElementById('modal-title').textContent = `Avaliar Pedido ${pedidoId}`;
        let html = `
 <p style="color:var(--cinza-500);margin-bottom:var(--space-md)">Como foi sua experiência?</p>
 <div style="text-align:center;font-size:2.5rem;margin-bottom:var(--space-md)" id="star-rating">
 ${[1, 2, 3, 4, 5].map(n => `<span style="cursor:pointer;color:var(--cinza-200)" 
 onmouseover​="app._previewStars(${n})" 
 onmouseout​="app._resetStars()"
 onclick​="app._confirmRating('${pedidoId}', ${n})">★</span>`).join('')}
 </div>
 <p style="text-align:center;color:var(--cinza-400);font-size:0.9rem">Clique em uma estrela para avaliar</p>
 `;
        document.getElementById('modal-body').innerHTML = html;
        document.getElementById('modal').classList.remove('hidden');
        document.getElementById('modal-overlay').classList.remove('hidden');
    },

    _previewStars(n) {
        const stars = document.querySelectorAll('hashtag#star-rating span');
        stars.forEach((s, i) => { s.style.color = i < n ? 'var(--mostarda)' : 'var(--cinza-200)'; });
    },

    _resetStars() {
        const stars = document.querySelectorAll('hashtag#star-rating span');
        stars.forEach(s => { s.style.color = 'var(--cinza-200)'; });
    },

    _confirmRating(pedidoId, rating) {
        const pedido = store.pedidos.find(p => p.id === pedidoId);
        if (pedido) {
            pedido.avaliacao = rating;
        }
        this.closeModal();
        this.navigate('pedidos', false);
        this.showToast(`Avaliação de ${rating} estrela${rating > 1 ? 's' : ''} enviada! Obrigado.`);
    },

    // ==================
    // FILTER PRODUCTS
    // ==================
    filterProducts() {
        const query = document.getElementById('search-input').value.toLowerCase();
        document.querySelectorAll('.product-card').forEach(card => {
            const name = card.dataset.name;
            card.style.display = name.includes(query) ? '' : 'none';
        });
    },

    filterByCategory(catId) {
        // Update chip styles
        document.querySelectorAll('.chip').forEach(c => {
            c.classList.toggle('active', c.dataset.cat === catId);
        });

        document.querySelectorAll('.product-card').forEach(card => {
            if (catId === 'todos') {
                card.style.display = '';
            } else {
                card.style.display = card.dataset.cat === catId ? '' : 'none';
            }
        });
    },

    // ==================
    // PEDIDOS FILTER
    // ==================
    filterPedidos(filtro) {
        this._pedidoFiltro = filtro;
        this.navigate('pedidos', false);
    },

    // ==================
    // PAYMENT FLOW
    // ==================
    selectPayment(el, method) {
        document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('selected'));
        el.classList.add('selected');
        this._selectedPayment = method;
    },

    processPayment() {
        const consent = document.getElementById('consent-checkout');
        if (!consent || !consent.checked) {
            this.showToast('Aceite os termos de uso para continuar');
            return;
        }

        const total = store.getCartTotal();
        const pagamento = this._selectedPayment || 'PIX';

        // Simulate payment processing
        const content = document.getElementById('app-content');
        content.innerHTML = `
 <div class="container" style="text-align:center;padding:var(--space-2xl)">
 <div style="font-size:4rem;margin-bottom:var(--space-md)">⏳</div>
 <h2 style="color:var(--marrom)">Processando pagamento...</h2>
 <p style="color:var(--cinza-500)">Aguarde enquanto redirecionamos ao gateway seguro.</p>
 </div>
 `;

        setTimeout(() => {
            // Create real order in the store
            const newOrder = store.createOrder(pagamento);

            content.innerHTML = `
 <div class="container" style="text-align:center;padding:var(--space-2xl)">
 <div style="font-size:5rem;margin-bottom:var(--space-md)">✅</div>
 <h2 style="color:var(--verde);margin-bottom:var(--space-sm)">Pedido Confirmado!</h2>
 <p style="font-size:1.1rem;color:var(--marrom);margin-bottom:var(--space-sm)">
 Pedido <strong>#${newOrder.id}</strong>
 </p>

<p style="color:var(--cinza-500);margin-bottom:var(--space-sm)">
 Previsão de retirada: <strong>~25 min</strong> na unidade ${store.currentUnit.nome}
 </p>
 <div class="info-box info-box-warning" style="max-width:400px;margin:0 auto var(--space-sm)">
 ⏳ Você ganhará <strong>+${newOrder.pontosGanhos}</strong> pontos quando o pedido for entregue (~3 min)
 </div>
 <p style="font-size:0.85rem;color:var(--cinza-400);margin-bottom:var(--space-lg)">
 Acompanhe o status em "Meus Pedidos"
 </p>
 <div style="display:flex;gap:var(--space-sm);justify-content:center;flex-wrap:wrap">
 <button class="btn btn-primary" onclick​="app.navigate('pedidos')">Acompanhar Pedido</button>
 <button class="btn btn-outline" onclick​="app.navigate('home')">Voltar ao Início</button>
 </div>
 </div>
 `;
        }, 2000);
    },

    // ==================
    // UNIT MODAL
    // ==================
    openUnitModal() {
        document.getElementById('modal-title').textContent = 'Selecionar Unidade';
        let html = UNIDADES.map(u => {
            const prodCount = PRODUTOS.filter(p => !p.unidades || p.unidades.includes(u.id)).length;
            const isCurrent = store.currentUnit.id === u.id;
            return `
 <div style="padding:var(--space-sm);border-bottom:1px solid var(--cinza-100);cursor:pointer;transition:background 0.2s;${isCurrent ? 'background:var(--bege);' : ''}"
 onclick​="store.setUnit(${u.id})"
 onmouseover​="this.style.background='var(--cinza-50)'"
 onmouseout​="this.style.background='${isCurrent ? 'var(--bege)' : 'transparent'}'">
 <div style="font-weight:600;color:var(--marrom)">
 📍 ${u.nome} ${isCurrent ? '<span style="font-size:0.8rem;color:var(--verde)">(atual)</span>' : ''}
 </div>
 <div style="font-size:0.85rem;color:var(--cinza-500)">${u.endereco}, ${u.cidade}/${u.estado}</div>
 <div style="font-size:0.75rem;color:var(--cinza-400)">${prodCount} itens no cardápio</div>
 </div>
 `}).join('');
        document.getElementById('modal-body').innerHTML = html;
        document.getElementById('modal').classList.remove('hidden');
        document.getElementById('modal-overlay').classList.remove('hidden');
    },

    // ==================
    // MODAL
    // ==================
    closeModal() {
        document.getElementById('modal').classList.add('hidden');
        document.getElementById('modal-overlay').classList.add('hidden');
    },

    // ==================
    // LGPD ACTIONS
    // ==================
    openLGPD() {
        this.hideLGPDBanner();
        this.navigate('lgpd');
    },

    acceptAllCookies() {
        store.lgpdConsent.analytics = true;
        store.lgpdConsent.marketing = true;
        store.lgpdConsent.personalization = true;
        store.saveConsent();
        this.hideLGPDBanner();
    },

    rejectOptionalCookies() {
        store.lgpdConsent.analytics = false;
        store.lgpdConsent.marketing = false;
        store.lgpdConsent.personalization = false;
        store.saveConsent();
        this.hideLGPDBanner();
    },

    saveLGPD() {
        store.saveConsent();
        // Refresh page to show success message
        this.navigate('lgpd', false);
    },

    acceptAllLGPD() {
        document.getElementById('consent-analytics').checked = true;
        document.getElementById('consent-marketing').checked = true;
        document.getElementById('consent-personalization').checked = true;
        store.setConsent('analytics', true);
        store.setConsent('marketing', true);
        store.setConsent('personalization', true);
        store.saveConsent();
        // Refresh page to show success message
        this.navigate('lgpd', false);
    },


    rejectAllLGPD() {
        document.getElementById('consent-analytics').checked = false;
        document.getElementById('consent-marketing').checked = false;
        document.getElementById('consent-personalization').checked = false;
        store.setConsent('analytics', false);
        store.setConsent('marketing', false);
        store.setConsent('personalization', false);
        store.saveConsent();
        // Refresh page to show success message
        this.navigate('lgpd', false);
    },

    hideLGPDBanner() {
        document.getElementById('lgpd-banner').classList.add('hidden');
    },

    confirmDeleteData() {
        if (confirm('Tem certeza que deseja solicitar a exclusão de todos os seus dados pessoais? Esta ação é irreversível.')) {
            this.showToast('Solicitação de exclusão enviada. Prazo: até 15 dias úteis.');
        }
    },

    // ==================
    // MENU
    // ==================
    toggleMenu() {
        document.getElementById('mobile-menu').classList.toggle('hidden');
    },

    // ==================
    // TOAST
    // ==================
    showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.remove('hidden');
        clearTimeout(this._toastTimer);
        this._toastTimer = setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    },
};

// ==================
// BOOTSTRAP
// ==================
document.addEventListener('DOMContentLoaded', () => app.init());