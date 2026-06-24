/**
 * Pages — Renderização de cada página do R.N
 */

const pages = {

    // ==========================================
    // HOME
    // ==========================================
    home() {
        const produtos = getProdutosUnidade();
        return `
 <section class="hero">
 <h1>🍴 Sabor Nordestino Autêntico</h1>
 <p>Peça online e retire na unidade mais próxima. Tapiocas, cuscuz, cafés regionais e muito mais!</p>
 <button class="btn btn-secondary btn-lg" onclick​="app.navigate('cardapio')">Ver Cardápio</button>
 </section>

 <div class="container">
 ${CAMPANHAS.map(c => `
 <div class="promo-banner" ${c.itens ? `onclick="app.filterByCategory('junino');app.navigate('cardapio')" style="cursor:pointer"` : ''}>
 <strong>${c.titulo}</strong> — ${c.descricao} <small>(até ${c.validade})</small>
 ${c.itens ? `<div style="font-size:0.85rem;margin-top:4px;opacity:0.9">Inclui: ${c.itens.join(', ')} — clique para ver!</div>` : ''}
 </div>
 `).join('')}

 <div class="section-header" style="margin-top:var(--space-xl)">
 <h2 class="section-title">Destaques do Cardápio</h2>
 <button class="btn btn-ghost" onclick​="app.navigate('cardapio')">Ver tudo →</button>
 </div>

 <div class="grid-products">
 ${produtos.filter(p => p.destaque).map(p => renderProductCard(p)).join('')}
 ${produtos.filter(p => p.sazonal).slice(0, 2).map(p => renderProductCard(p)).join('')}
 </div>

 <div class="features-grid">
 <div class="feature-card">
 <div class="feature-icon">📱</div>
 <h3>Peça pelo App ou Web</h3>
 <p>Faça seu pedido de onde estiver, com cardápio dinâmico por unidade.</p>
 </div>
 <div class="feature-card">
 <div class="feature-icon">⭐</div>
 <h3>Programa Fidelidade</h3>
 <p>Acumule pontos a cada pedido e troque por recompensas exclusivas.</p>
 </div>
 <div class="feature-card">
 <div class="feature-icon">📍</div>
 <h3>Múltiplas Unidades</h3>
 <p>Presente em 6 cidades do Nordeste. Escolha a unidade mais perto de você.</p>
 </div>
 <div class="feature-card">
 <div class="feature-icon">🔒</div>
 <h3>Seus Dados Protegidos</h3>
 <p>Conformidade total com a LGPD. Você controla seus dados.</p>
 </div>
 </div>
 </div>
 `;
    },

    // ==========================================
    // CARDÁPIO
    // ==========================================
    cardapio() {
        const produtos = getProdutosUnidade();
        return `
 <div class="container">
 <div class="section-header">
 <h2 class="section-title">Cardápio — ${store.currentUnit.nome}</h2>
 <span style="color:var(--cinza-500);font-size:0.9rem">${produtos.filter(p => p.disponivel).length} itens disponíveis</span>
 </div>

 <div class="cardapio-header">
 <div class="search-bar">
 <span>🔍</span>
 <input type="text" placeholder="Buscar no cardápio..." id="search-input" oninput​="app.filterProducts()" aria-label="Buscar produtos" />
 </div>
 </div>

 <div class="chips" id="category-chips">
 ${CATEGORIAS.map(c => `
 <button class="chip ${c.id === 'todos' ? 'active' : ''}" 
 data-cat="${c.id}" 
 onclick​="app.filterByCategory('${c.id}')">
 ${c.icone} ${c.nome}
 </button>
 `).join('')}
 </div>

 <div class="grid-products" id="products-grid">
 ${produtos.map(p => renderProductCard(p)).join('')}
 </div>
 </div>
 `;
    },

    // ==========================================
    // CARRINHO
    // ==========================================
    carrinho() {
        if (store.cart.length === 0) {
            return `
 <div class="container">
 <h2 class="section-title">Carrinho</h2>
 <div class="empty-state">
 <div class="empty-state-icon">🛒</div>
 <h3>Seu carrinho está vazio</h3>
 <p>Adicione itens do nosso cardápio!</p>
 <button class="btn btn-primary" onclick​="app.navigate('cardapio')" style="margin-top:var(--space-md)">Ver Cardápio</button>
 </div>
 </div>
 `;
        }

        return `
 <div class="container">
 <h2 class="section-title" style="margin-bottom:var(--space-lg)">Carrinho</h2>
 <div class="cart-layout">
 <div class="cart-items">
 ${store.cart.map((item, i) => {
            const opcoesPreco = item.opcoes.reduce((sum, op) => sum + (op.preco || 0), 0);
            const precoUnitario = item.product.preco + opcoesPreco;
            const precoTotal = precoUnitario * item.qty;
            return `
 <div class="cart-item">
 <div class="cart-item-img">
 ${item.product.imagem
                    ? `<img src="${item.product.imagem}" alt="${item.product.nome}" style="width:60px;height:60px;border-radius:8px;object-fit:cover;">`
                    : item.product.icone}
 </div>
 <div class="cart-item-info">
 <div class="cart-item-name">${item.product.nome}</div>
 <div class="cart-item-desc">
 ${item.opcoes.length > 0
                    ? item.opcoes.map(op => `${op.nome}${op.preco > 0 ? ` (+R$${op.preco.toFixed(2)})` : ''}`).join(', ')
                    : item.product.descricao}
 </div>
 ${item.product.opcoes && item.product.opcoes.length > 0 ? `
 <button class="btn btn-ghost btn-sm" style="padding:2px 8px;font-size:0.75rem;margin-top:4px" 
 onclick​="app.editCartItemOptions(${i})">✏️ Editar opcionais</button>
 ` : ''}
 <div class="cart-item-actions">
 <div class="qty-control">
 <button class="qty-btn" onclick​="app.updateQty(${i}, ${item.qty - 1})" aria-label="Diminuir quantidade">−</button>
 <span class="qty-value">${item.qty}</span>
 <button class="qty-btn" onclick​="app.updateQty(${i}, ${item.qty + 1})" aria-label="Aumentar quantidade">+</button>
 </div>
 <span class="price">R$ ${precoTotal.toFixed(2)}</span>
 </div>
 </div>
 <button class="btn-icon" style="color:var(--terracota);font-size:1.2rem;position:absolute;top:8px;right:8px;" 
 onclick​="app.removeItem(${i})" aria-label="Remover item">✕</button>
 </div>
 `}).join('')}
 </div>

 <div class="cart-summary">
 <h3>Resumo do Pedido</h3>
 <div class="summary-row">
 <span>Subtotal (${store.getCartCount()} itens)</span>
 <span>R$ ${store.getCartTotal().toFixed(2)}</span>
 </div>
 <div class="summary-row">
 <span>Taxa de serviço</span>
 <span>Grátis</span>
 </div>
 <div class="summary-row summary-total">
 <span>Total</span>
 <span class="price">R$ ${store.getCartTotal().toFixed(2)}</span>
 </div>
 <button class="btn btn-primary btn-full btn-lg" style="margin-top:var(--space-md)" onclick​="app.navigate('checkout')">
 Finalizar Pedido
 </button>
 <button class="btn btn-outline btn-full" style="margin-top:var(--space-sm)" onclick​="app.navigate('cardapio')">
 Continuar Comprando
 </button>
 </div>
 </div>
 </div>
 `;
    },

    // ==========================================
    // CHECKOUT (PAGAMENTO)
    // ==========================================
    checkout() {

        if (store.cart.length === 0) {
            app.navigate('carrinho');
            return '';
        }
        return `
 <div class="container" style="max-width:700px">
 <h2 class="section-title" style="margin-bottom:var(--space-lg)">Finalizar Pedido</h2>

 <div class="info-box info-box-info">
 📍 Retirada em: <strong>${store.currentUnit.nome} — ${store.currentUnit.cidade}</strong>
 </div>

 <div class="order-card">
 <h3 style="margin-bottom:var(--space-md)">Forma de Pagamento</h3>
 <div class="payment-methods" id="payment-methods">
 <div class="payment-method selected" data-method="PIX" onclick​="app.selectPayment(this, 'PIX')">
 <div class="payment-method-icon">📱</div>
 <div class="payment-method-name">PIX</div>
 </div>
 <div class="payment-method" data-method="Crédito" onclick​="app.selectPayment(this, 'Crédito')">
 <div class="payment-method-icon">💳</div>
 <div class="payment-method-name">Crédito</div>
 </div>
 <div class="payment-method" data-method="Débito" onclick​="app.selectPayment(this, 'Débito')">
 <div class="payment-method-icon">💳</div>
 <div class="payment-method-name">Débito</div>
 </div>
 <div class="payment-method" data-method="Carteira Digital" onclick​="app.selectPayment(this, 'Carteira Digital')">
 <div class="payment-method-icon">👛</div>
 <div class="payment-method-name">Carteira Digital</div>
 </div>
 </div>
 </div>

 <div class="order-card">
 <h3 style="margin-bottom:var(--space-sm)">Resumo</h3>
 ${store.cart.map(item => {
            const opcoesPreco = item.opcoes.reduce((sum, op) => sum + (op.preco || 0), 0);
            const precoUnitario = item.product.preco + opcoesPreco;
            return `
 <div class="summary-row">
 <span>${item.qty}x ${item.product.nome}${item.opcoes.filter(o => o.preco > 0).length > 0 ? ' + adicionais' : ''}</span>
 <span>R$ ${(precoUnitario * item.qty).toFixed(2)}</span>
 </div>
 `}).join('')}
 <div class="summary-row summary-total">
 <span>Total</span>
 <span class="price">R$ ${store.getCartTotal().toFixed(2)}</span>
 </div>
 </div>

 <div class="info-box info-box-warning">
 🔒 Pagamento processado via gateway externo seguro. Seus dados financeiros não são armazenados.
 </div>

 <div class="form-checkbox" style="margin-bottom:var(--space-md)">
 <input type="checkbox" id="consent-checkout" />
 <label for="consent-checkout">
 Li e aceito os <a href="#" onclick​="app.navigate('lgpd');return false;">Termos de Uso e Política de Privacidade</a> 
 conforme a LGPD.
 </label>
 </div>

 <button class="btn btn-primary btn-full btn-lg" onclick​="app.processPayment()">
 Confirmar e Pagar — R$ ${store.getCartTotal().toFixed(2)}
 </button>
 </div>
 `;
    },

    // ==========================================
    // PEDIDOS (ACOMPANHAMENTO)
    // ==========================================
    pedidos() {
        const filtroAtivo = app._pedidoFiltro || 'todos';
        const pedidosList = store.getPedidosFiltrados(filtroAtivo);

        return `
 <div class="container" style="max-width:800px">
 <h2 class="section-title" style="margin-bottom:var(--space-lg)">Meus Pedidos</h2>
 
 <div class="chips" style="margin-bottom:var(--space-lg)">
 <button class="chip ${filtroAtivo === 'todos' ? 'active' : ''}" onclick​="app.filterPedidos('todos')">Todos</button>
 <button class="chip ${filtroAtivo === 'andamento' ? 'active' : ''}" onclick​="app.filterPedidos('andamento')">Em andamento</button>
 <button class="chip ${filtroAtivo === 'entregues' ? 'active' : ''}" onclick​="app.filterPedidos('entregues')">Entregues</button>
 </div>

 ${pedidosList.length === 0 ? `
 <div class="empty-state">
 <div class="empty-state-icon">📋</div>
 <h3>Nenhum pedido ${filtroAtivo === 'andamento' ? 'em andamento' : filtroAtivo === 'entregues' ? 'entregue' : ''}</h3>
 <p>${filtroAtivo === 'andamento' ? 'Seus pedidos em preparo aparecerão aqui.' : 'Faça seu primeiro pedido!'}</p>
 <button class="btn btn-primary" onclick​="app.navigate('cardapio')" style="margin-top:var(--space-md)">Ver Cardápio</button>
 </div>
 ` : pedidosList.map(p => `
 <div class="order-card" style="position:relative;">
 <div class="order-header">
 <div>
 <div class="order-number">${p.id}</div>
 <div style="font-size:0.85rem;color:var(--cinza-500)">${p.data} · ${p.unidade}</div>
 <div style="font-size:0.8rem;color:var(--cinza-400);margin-top:2px">Pagamento: ${p.pagamento || 'PIX'}</div>
 </div>
 <span class="order-status-badge ${p.status}">${p.statusTexto}</span>
 </div>

 ${p.status === 'preparing' ? `
 <div class="status-bar">
 ${renderStatusBar(p.etapa)}
 </div>
 <div class="info-box info-box-warning">
 ⏱️ Previsão de retirada: <strong>${p.previsao}</strong>
 </div>
 ` : ''}

 <div style="margin-top:var(--space-sm)">
 ${p.itens.map(it => `
 <div class="summary-row">
 <span>
 ${it.qtd}x ${it.nome}
 ${it.opcoes && it.opcoes.length > 0 ? `<span style="font-size:0.8rem;color:var(--cinza-400)"> (${it.opcoes.join(', ')})</span>` : ''}
 </span>
 <span>R$ ${(it.preco * it.qtd).toFixed(2)}</span>
 </div>
 `).join('')}
 <div class="summary-row summary-total">
 <span>Total</span>
 <span class="price">R$ ${p.total.toFixed(2)}</span>
 </div>
 </div>

 <div style="margin-top:var(--space-sm);display:flex;justify-content:space-between;align-items:center;">
 <span style="font-size:0.85rem;color:${p.pontosContabilizados ? 'var(--verde)' : 'var(--cinza-400)'}">
 ${p.pontosContabilizados
                ? `⭐ +${p.pontosGanhos} pontos de fidelidade`
                : `⏳ +${p.pontosGanhos} pontos (após entrega)`}
 </span>
 ${p.avaliacao ? `
 <span style="font-size:0.85rem;color:var(--mostarda)">
 ${'★'.repeat(p.avaliacao)}${'☆'.repeat(5 - p.avaliacao)}
 </span>
 ` : p.status === 'delivered' ? `
 <button class="btn btn-ghost btn-sm" onclick​="app.avaliarPedido('${p.id}')">Avaliar pedido</button>
 ` : ''}
 </div>

 ${p.status === 'delivered' ? `
 <div style="margin-top:var(--space-sm)">
 <button class="btn btn-outline btn-sm" onclick​="app.reorderItems(${JSON.stringify(p.itens).replace(/"/g, '&quot;')})">🔄 Pedir novamente</button>
 </div>
 ` : ''}
 </div>
 `).join('')}

<div class="info-box info-box-info" style="margin-top:var(--space-lg)">
 📋 Mostrando ${pedidosList.length} pedido${pedidosList.length !== 1 ? 's' : ''}. Pedidos mais antigos são arquivados após 90 dias.
 </div>
 </div>
 `;
    },

    // ==========================================
    // FIDELIDADE
    // ==========================================
    fidelidade() {
        const pts = store.loyalty.pontos;
        const pedidosEntregues = store.pedidos.filter(p => p.pontosContabilizados);
        const totalGasto = pedidosEntregues.reduce((sum, p) => sum + p.total, 0);
        const totalPedidos = pedidosEntregues.length;
        const pedidosEmAndamento = store.pedidos.filter(p => p.status === 'preparing');
        const pontosEmAndamento = pedidosEmAndamento.reduce((sum, p) => sum + p.pontosGanhos, 0);
        const nextReward = RECOMPENSAS.find(r => r.pontos > pts);
        const progress = nextReward ? ((pts / nextReward.pontos) * 100).toFixed(0) : 100;

        return `
 <div class="container" style="max-width:800px">
 <div class="points-card">
 <div class="points-label">Seus Pontos</div>
 <div class="points-value">${pts}</div>
 <div class="points-label">Nível: ${store.loyalty.nivel} · +${store.loyalty.historicoMes} pontos este mês</div>
 ${nextReward ? `
 <div class="progress-bar">
 <div class="progress-fill" style="width:${progress}%"></div>
 </div>
 <div class="points-label" style="margin-top:var(--space-sm)">
 Faltam ${nextReward.pontos - pts} pontos para "${nextReward.nome}"
 </div>
 ` : ''}
 </div>

 ${pontosEmAndamento > 0 ? `
 <div class="info-box info-box-warning" style="margin-top:var(--space-md)">
 ⏳ Você tem <strong>+${pontosEmAndamento} pontos pendentes</strong> de pedidos em andamento. 
 Os pontos serão adicionados quando o pedido for entregue.
 </div>
 ` : ''}

 <div class="features-grid" style="margin-top:var(--space-lg);grid-template-columns:repeat(3,1fr);">
 <div class="feature-card" style="padding:var(--space-md);">
 <div class="feature-icon" style="font-size:1.5rem;">📦</div>
 <h3 style="font-size:1rem;">${totalPedidos}</h3>
 <p style="font-size:0.8rem;">Pedidos entregues</p>
 </div>
 <div class="feature-card" style="padding:var(--space-md);">
 <div class="feature-icon" style="font-size:1.5rem;">💰</div>
 <h3 style="font-size:1rem;">R$ ${totalGasto.toFixed(0)}</h3>
 <p style="font-size:0.8rem;">Total gasto</p>
 </div>
 <div class="feature-card" style="padding:var(--space-md);">
 <div class="feature-icon" style="font-size:1.5rem;">⭐</div>
 <h3 style="font-size:1rem;">${pts}</h3>
 <p style="font-size:0.8rem;">Pontos acumulados</p>
 </div>
 </div>

 <div class="section-header" style="margin-top:var(--space-xl)">
 <h2 class="section-title">Recompensas Disponíveis</h2>
 </div>

 <div class="loyalty-grid">
 ${RECOMPENSAS.map(r => `
 <div class="reward-card ${pts >= r.pontos ? 'redeemable' : ''}">
 <div class="reward-icon">${r.icone}</div>
 <div class="reward-name">${r.nome}</div>
 <div class="reward-points">${r.pontos} pontos</div>
 ${pts >= r.pontos
                ? `<button class="btn btn-success btn-sm" style="margin-top:var(--space-sm)" 
 onclick​="app.redeemReward('${r.nome}', ${r.pontos})">Resgatar</button>`
                : `<div style="font-size:0.8rem;color:var(--cinza-400);margin-top:var(--space-sm)">
 Faltam ${r.pontos - pts} pts</div>`
            }
 </div>
 `).join('')}
 </div>

 <div class="order-card" style="margin-top:var(--space-xl)">
 <h3 style="margin-bottom:var(--space-sm)">Histórico de Pontos</h3>
 <div style="font-size:0.9rem;">
 ${store.pedidos.slice(0, 6).map(p => `
 <div class="summary-row" style="padding:8px 0;border-bottom:1px solid var(--cinza-100);">
 <span>
 <strong style="color:${p.pontosContabilizados ? 'var(--verde)' : 'var(--cinza-400)'}">
 ${p.pontosContabilizados ? '+' : '⏳ +'}${p.pontosGanhos} pts
 </strong>
 <span style="color:var(--cinza-400);margin-left:8px;">${p.data.split(' ')[0]}</span>
 ${!p.pontosContabilizados ? '<span style="font-size:0.75rem;color:var(--mostarda);margin-left:4px">(pendente)</span>' : ''}
 </span>
 <span style="color:var(--cinza-500);">${p.id}</span>
 </div>
 `).join('')}
 </div>
 </div>

 <div class="info-box info-box-info" style="margin-top:var(--space-lg)">
 <strong>Como funciona?</strong><br>
 A cada R$ 1,00 em pedidos, você ganha 1 ponto. Pontos são creditados após a entrega do pedido.
 Pontos expiram em 12 meses. 
 Resgates são aplicados como desconto no próximo pedido. Às sextas-feiras, você ganha pontos em dobro!
 </div>
 </div>
 `;
    },

    // ==========================================
    // LOGIN
    // ==========================================
    login() {
        if (store.isLoggedIn) {
            return `
 <div class="login-container">
 <h2>👤 Minha Conta</h2>
 <div style="text-align:center;margin-bottom:var(--space-lg)">
 <p style="font-size:1.2rem;font-weight:600">${store.user.nome}</p>
 <p style="color:var(--cinza-500)">${store.user.email}</p>
 <p style="color:var(--cinza-400);font-size:0.85rem">CPF: ${store.user.cpf}</p>
 </div>
 <div style="display:flex;flex-direction:column;gap:var(--space-sm)">
 <button class="btn btn-outline btn-full" onclick​="app.navigate('pedidos')">📦 Meus Pedidos</button>
 <button class="btn btn-outline btn-full" onclick​="app.navigate('fidelidade')">⭐ Fidelidade (${store.loyalty.pontos} pts)</button>
 <button class="btn btn-outline btn-full" onclick​="app.navigate('lgpd')">🔒 Privacidade</button>
 <button class="btn btn-danger btn-full" onclick​="store.logout()">Sair da Conta</button>
 </div>
 </div>
 `;
        }

        return `
 <div class="login-container">
 <h2>Entrar na Conta</h2>

<form onsubmit​="event.preventDefault(); store.login(document.getElementById('login-email').value, document.getElementById('login-senha').value)">
 <div class="form-group">
 <label class="form-label" for="login-email">E-mail ou CPF</label>
 <input class="form-input" type="text" id="login-email" placeholder="seu@email.com" required autocomplete="email" />
 </div>
 <div class="form-group">
 <label class="form-label" for="login-senha">Senha</label>
 <input class="form-input" type="password" id="login-senha" placeholder="••••••••" required autocomplete="current-password" />
 </div>
 <div class="form-checkbox" style="margin-bottom:var(--space-md)">
 <input type="checkbox" id="lgpd-login-consent" required />
 <label for="lgpd-login-consent" style="font-size:0.85rem">
 Concordo com os <a href="#" onclick​="app.navigate('lgpd');return false;">Termos de Uso</a> e 
 <a href="#" onclick​="app.navigate('lgpd');return false;">Política de Privacidade</a> (LGPD).
 </label>
 </div>
 <button type="submit" class="btn btn-primary btn-full btn-lg">Entrar</button>
 </form>
 <div class="login-divider">ou</div>
 <button class="btn btn-outline btn-full" onclick​="app.showToast('Cadastro simulado: em desenvolvimento')">
 Criar Conta
 </button>
 </div>
 `;
    },

    // ==========================================
    // LGPD / PRIVACIDADE
    // ==========================================
    lgpd() {
        return `
 <div class="lgpd-container container">
 <h2 class="section-title" style="margin-bottom:var(--space-sm)">🔒 Privacidade e Proteção de Dados</h2>
 <p style="color:var(--cinza-500);margin-bottom:var(--space-lg)">
 Gerencie suas preferências de privacidade conforme a Lei Geral de Proteção de Dados (LGPD — Lei 13.709/2018).
 </p>

 ${store.lgpdConsent.accepted ? `
 <div class="info-box info-box-success" style="margin-bottom:var(--space-lg)" id="lgpd-saved-msg">
 ✅ Suas preferências de privacidade foram salvas com sucesso.
 </div>
 ` : ''}

 <div class="consent-group">
 <div class="consent-toggle">
 <div>
 <h4>🔧 Cookies Essenciais</h4>
 <p>Necessários para o funcionamento básico do site. Não podem ser desativados.</p>
 </div>
 <label class="toggle">
 <input type="checkbox" checked disabled />
 <span class="toggle-slider"></span>
 </label>
 </div>
 </div>

 <div class="consent-group">
 <div class="consent-toggle">
 <div>
 <h4>📊 Analytics e Desempenho</h4>
 <p>Permitem medir o uso do site para melhorias. Dados anonimizados.</p>
 </div>
 <label class="toggle">
 <input type="checkbox" id="consent-analytics" 
 ${store.lgpdConsent.analytics ? 'checked' : ''}
 onchange​="store.setConsent('analytics', this.checked)" />
 <span class="toggle-slider"></span>
 </label>
 </div>
 </div>

 <div class="consent-group">
 <div class="consent-toggle">
 <div>
 <h4>📢 Marketing e Comunicação</h4>
 <p>Permitem o envio de promoções, campanhas e ofertas personalizadas.</p>
 </div>
 <label class="toggle">
 <input type="checkbox" id="consent-marketing"
 ${store.lgpdConsent.marketing ? 'checked' : ''}
 onchange​="store.setConsent('marketing', this.checked)" />
 <span class="toggle-slider"></span>
 </label>
 </div>
 </div>

 <div class="consent-group">
 <div class="consent-toggle">
 <div>
 <h4>🎯 Personalização</h4>

👏
👍
😊



<p>Permitem personalizar o cardápio e sugestões baseadas no seu histórico.</p>
 </div>
 <label class="toggle">
 <input type="checkbox" id="consent-personalization"
 ${store.lgpdConsent.personalization ? 'checked' : ''}
 onchange​="store.setConsent('personalization', this.checked)" />
 <span class="toggle-slider"></span>
 </label>
 </div>
 </div>

 <div style="display:flex;gap:var(--space-sm);flex-wrap:wrap;margin-top:var(--space-lg)">
 <button class="btn btn-primary" onclick​="app.saveLGPD()">Salvar Preferências</button>
 <button class="btn btn-outline" onclick​="app.acceptAllLGPD()">Aceitar Todos</button>
 <button class="btn btn-ghost" onclick​="app.rejectAllLGPD()">Rejeitar Opcionais</button>
 </div>

 <div class="order-card" style="margin-top:var(--space-xl)">
 <h3 style="margin-bottom:var(--space-sm)">Seus Direitos (LGPD)</h3>
 <ul style="font-size:0.9rem;color:var(--cinza-500);line-height:2">
 <li><strong>Acesso:</strong> Solicitar cópia de todos os dados pessoais armazenados</li>
 <li><strong>Correção:</strong> Retificar dados incorretos ou desatualizados</li>
 <li><strong>Exclusão:</strong> Solicitar a eliminação dos dados pessoais</li>
 <li><strong>Portabilidade:</strong> Transferir seus dados para outro serviço</li>
 <li><strong>Revogação:</strong> Revogar consentimento a qualquer momento</li>
 <li><strong>Oposição:</strong> Se opor ao tratamento de dados</li>
 </ul>
 <p style="font-size:0.85rem;color:var(--cinza-400);margin-top:var(--space-sm)">
 DPO (Encarregado de Dados): privacidade@raizesdonordeste.com.br
 </p>
 </div>

 ${store.isLoggedIn ? `
 <div class="order-card" style="margin-top:var(--space-md)">
 <h3 style="margin-bottom:var(--space-sm)">Ações sobre seus dados</h3>
 <div style="display:flex;gap:var(--space-sm);flex-wrap:wrap">
 <button class="btn btn-outline btn-sm" onclick​="app.showToast('Solicitação de exportação enviada')">📥 Exportar meus dados</button>
 <button class="btn btn-outline btn-sm" onclick​="app.showToast('Solicitação de correção enviada')">✏️ Solicitar correção</button>
 <button class="btn btn-danger btn-sm" onclick​="app.confirmDeleteData()">🗑️ Solicitar exclusão</button>
 </div>
 </div>
 ` : ''}
 </div>
 `;
    },
};

// ==========================================
// HELPER: Render product card
// ==========================================
function renderProductCard(product) {
    const hasDiscount = product.festivalJunino;
    return `
 <div class="card product-card" data-cat="${product.categoria}" data-name="${product.nome.toLowerCase()}">
 <div class="card-img" style="position:relative">
 ${product.imagem
            ? `<img src="${product.imagem}" alt="${product.nome}" style="width:100%;height:160px;object-fit:cover;border-radius:var(--radius-md) var(--radius-md) 0 0;">`
            : `<span style="font-size:3.5rem">${product.icone}</span>`
        }
 <div style="position:absolute;top:8px;right:8px;display:flex;flex-direction:column;gap:4px">
 ${product.festivalJunino ? '<span class="badge badge-seasonal">🎉 -15% Junino</span>' : ''}
 ${product.destaque && !product.festivalJunino ? '<span class="badge badge-promo">Destaque</span>' : ''}
 ${!product.disponivel ? '<span class="badge badge-spicy">Indisponível</span>' : ''}
 </div>
 </div>
 <div class="card-body">
 <div class="card-title">${product.nome}</div>
 <div class="card-desc">${product.descricao}</div>
 ${product.opcoes && product.opcoes.length > 0 ? `
 <div class="card-opcoes" style="font-size:0.75rem;color:var(--cinza-400);margin-top:4px;">
 Opções: ${product.opcoes.map(o => typeof o === 'object' ? (o.preco > 0 ? `${o.nome} (+R$${o.preco.toFixed(2)})` : o.nome) : o).join(', ')}
 </div>
 ` : ''}
 <div class="allergen-tags">
 ${product.alergenos.map(a => `<span class="allergen-tag">⚠️ ${a}</span>`).join('')}
 </div>
 </div>
 <div class="card-footer">
 <div>
 ${hasDiscount ? `<span style="text-decoration:line-through;color:var(--cinza-400);font-size:0.8rem;">R$ ${product.precoOriginal.toFixed(2)}</span> ` : ''}
 <span class="price">R$ ${product.preco.toFixed(2)}</span>
 </div>
 ${product.disponivel
            ? `<button class="btn btn-primary btn-sm" onclick​="app.openProductModal(${product.id})" aria-label="Adicionar ${product.nome} ao carrinho">Adicionar</button>`
            : `<span style="color:var(--cinza-400);font-size:0.8rem">Indisponível</span>`
        }
 </div>
 </div>
 `;
}

// ==========================================
// HELPER: Render status bar
// ==========================================
function renderStatusBar(currentStep) {
    const steps = [
        { label: 'Recebido', icon: '✓' },
        { label: 'Confirmado', icon: '✓' },
        { label: 'Preparo', icon: '🍳' },
        { label: 'Pronto', icon: '🔔' },
    ];

    let html = '';
    steps.forEach((step, i) => {
        const state = i < currentStep ? 'completed' : (i === currentStep ? 'active' : '');
        html += `
 <div class="status-step ${state}">
 <div class="status-dot">${i < currentStep ? '✓' : step.icon}</div>
 <div class="status-label">${step.label}</div>
 </div>
 `;
        if (i < steps.length - 1) {
            html += `<div class="status-line ${i < currentStep ? 'completed' : ''}"></div>`;
        }
    });
    return html;
}

