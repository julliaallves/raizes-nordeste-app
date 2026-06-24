/**
 * Mock Data — Raízes do Nordeste
 * Dados simulados para cardápio, unidades, pedidos e fidelidade
 */

const UNIDADES = [
    { id: 1, nome: 'Boa Viagem', cidade: 'Recife', estado: 'PE', endereco: 'Av. Boa Viagem, 3200' },
    { id: 2, nome: 'Shopping Recife', cidade: 'Recife', estado: 'PE', endereco: 'R. Padre Carapuceiro, 777' },
    { id: 3, nome: 'Meireles', cidade: 'Fortaleza', estado: 'CE', endereco: 'Av. Beira Mar, 1500' },
    { id: 4, nome: 'Pelourinho', cidade: 'Salvador', estado: 'BA', endereco: 'R. das Laranjeiras, 45' },
    { id: 5, nome: 'Ponta Negra', cidade: 'Natal', estado: 'RN', endereco: 'Av. Roberto Freire, 2100' },
    { id: 6, nome: 'Pajuçara', cidade: 'Maceió', estado: 'AL', endereco: 'Av. Dr. Antônio Gouveia, 800' },
];

const CATEGORIAS = [
    { id: 'todos', nome: 'Todos', icone: '🍽️' },
    { id: 'tapiocas', nome: 'Tapiocas', icone: '🥘' },
    { id: 'cuscuz', nome: 'Cuscuz', icone: '🌽' },
    { id: 'bebidas', nome: 'Bebidas', icone: '🥤' },
    { id: 'cafes', nome: 'Cafés', icone: '☕' },
    { id: 'sobremesas', nome: 'Sobremesas', icone: '🍰' },
    { id: 'junino', nome: 'Especial Junino', icone: '🎉' },
];

const PRODUTOS = [
    {
        id: 1, nome: 'Tapioca Carne Seca', categoria: 'tapiocas',
        descricao: 'Tapioca recheada com carne seca desfiada, queijo coalho e manteiga de garrafa.',
        preco: 14.90, icone: '🥘',
        imagem: 'https://images.unsplash.com/photo-1604909052743-94e838986d24?w=400&h=300&fit=crop',
        alergenos: ['Glúten', 'Lactose'],
        disponivel: true, destaque: true,
        unidades: [1, 2, 3, 4, 5, 6],
        opcoes: [
            { nome: 'Sem cebola', preco: 0 },
            { nome: 'Extra queijo', preco: 3.00 },
            { nome: 'Sem pimenta', preco: 0 },
        ],
    },
    {
        id: 2, nome: 'Tapioca Queijo Coalho', categoria: 'tapiocas',
        descricao: 'Tapioca com queijo coalho derretido, orégano e mel.',
        preco: 12.90, icone: '🧀',
        imagem: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
        alergenos: ['Lactose'],
        disponivel: true,
        unidades: [1, 2, 3, 4, 5, 6],
        opcoes: [
            { nome: 'Com mel', preco: 0 },
            { nome: 'Sem orégano', preco: 0 },
        ],
    },
    {
        id: 3, nome: 'Tapioca Frango com Catupiry', categoria: 'tapiocas',
        descricao: 'Tapioca com frango desfiado e catupiry cremoso.',
        preco: 15.90, icone: '🍗',
        imagem: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop',
        alergenos: ['Lactose'],
        disponivel: true,
        unidades: [1, 2, 4, 5],
        opcoes: [
            { nome: 'Extra catupiry', preco: 2.00 },
            { nome: 'Sem tempero', preco: 0 },
        ],
    },
    {
        id: 4, nome: 'Cuscuz com Ovo', categoria: 'cuscuz',
        descricao: 'Cuscuz nordestino com ovo frito, manteiga e queijo coalho.',
        preco: 9.90, icone: '🌽',
        imagem: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop',
        alergenos: ['Ovo', 'Lactose'],
        disponivel: true, destaque: true,
        unidades: [1, 2, 3, 4, 5, 6],
        opcoes: [
            { nome: 'Ovo mexido', preco: 0 },
            { nome: 'Sem queijo', preco: 0 },
            { nome: 'Extra ovo', preco: 2.00 },
        ],
    },
    {
        id: 5, nome: 'Cuscuz Recheado', categoria: 'cuscuz',
        descricao: 'Cuscuz recheado com charque, nata e queijo.',
        preco: 16.90, icone: '🍲',
        imagem: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop',
        alergenos: ['Lactose'],
        disponivel: true,
        unidades: [1, 2, 3, 5, 6],
        opcoes: [
            { nome: 'Sem nata', preco: 0 },
            { nome: 'Extra charque', preco: 4.00 },
        ],
    },
    {
        id: 6, nome: 'Bolo de Macaxeira', categoria: 'sobremesas',
        descricao: 'Bolo de macaxeira com coco e calda de leite condensado.',
        preco: 8.50, icone: '🍰',
        imagem: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
        alergenos: ['Lactose', 'Glúten'],
        disponivel: true,
        unidades: [1, 2, 3, 4, 5, 6],
        opcoes: [
            { nome: 'Sem calda', preco: 0 },
            { nome: 'Com sorvete', preco: 4.00 },
        ],
    },
    {
        id: 7, nome: 'Cartola', categoria: 'sobremesas',
        descricao: 'Banana frita com queijo coalho, açúcar e canela.',
        preco: 10.90, icone: '🍌',
        imagem: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=400&h=300&fit=crop',
        alergenos: ['Lactose'],
        disponivel: true,
        unidades: [1, 2, 4],
        opcoes: [
            { nome: 'Extra canela', preco: 0 },
            { nome: 'Com sorvete', preco: 4.00 },
        ],
    },
    {
        id: 8, nome: 'Suco de Acerola', categoria: 'bebidas',
        descricao: 'Suco natural de acerola, 500ml.',
        preco: 7.90, icone: '🍹',
        imagem: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&h=300&fit=crop',
        alergenos: [],
        disponivel: true,
        unidades: [1, 2, 3, 4, 5, 6],
        opcoes: [
            { nome: 'Com açúcar', preco: 0 },
            { nome: 'Sem açúcar', preco: 0 },
            { nome: 'Adoçante', preco: 0 },
        ],
    },
    {
        id: 9, nome: 'Suco de Cajá', categoria: 'bebidas',
        descricao: 'Suco natural de cajá, 500ml.',
        preco: 8.90, icone: '🥤',
        imagem: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&h=300&fit=crop',
        alergenos: [],
        disponivel: true,
        unidades: [1, 2, 3, 5],
        opcoes: [
            { nome: 'Com açúcar', preco: 0 },
            { nome: 'Sem açúcar', preco: 0 },
        ],
    },
    {
        id: 10, nome: 'Café Regional', categoria: 'cafes',
        descricao: 'Café coado com leite de coco e especiarias nordestinas.',
        preco: 5.90, icone: '☕',
        imagem: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
        alergenos: [],
        disponivel: true,
        unidades: [1, 2, 3, 4, 5, 6],
        opcoes: [
            { nome: 'Sem leite de coco', preco: 0 },
            { nome: 'Extra canela', preco: 0 },
        ],
    },
    {
        id: 11, nome: 'Cappuccino de Rapadura', categoria: 'cafes',
        descricao: 'Cappuccino com rapadura e canela, receita especial.',
        preco: 9.90, icone: '☕',
        imagem: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop',
        alergenos: ['Lactose'],
        disponivel: true,
        unidades: [1, 2, 4, 6],
        opcoes: [],
    },
    {

        id: 12, nome: 'Quentão Nordestino', categoria: 'junino',
        descricao: 'Quentão especial com cachaça, gengibre e especiarias. Edição São João!',
        preco: 12.90, precoOriginal: 15.18, icone: '🍷',
        imagem: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop',
        alergenos: [],
        disponivel: true, sazonal: true, festivalJunino: true,
        unidades: [1, 2, 3, 4, 5, 6],
        opcoes: [
            { nome: 'Sem álcool', preco: 0 },
            { nome: 'Extra gengibre', preco: 0 },
        ],
    },
    {
        id: 13, nome: 'Pamonha Recheada', categoria: 'junino',
        descricao: 'Pamonha de milho verde com recheio de queijo. Edição Junina especial!',
        preco: 11.90, precoOriginal: 14.00, icone: '🌽',
        imagem: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
        alergenos: ['Lactose'],
        disponivel: true, sazonal: true, festivalJunino: true,
        unidades: [1, 2, 3, 4, 5, 6],
        opcoes: [
            { nome: 'Sem recheio', preco: 0 },
            { nome: 'Extra queijo', preco: 3.00 },
        ],
    },
    {
        id: 14, nome: 'Canjica Cremosa', categoria: 'junino',
        descricao: 'Canjica com leite de coco, cravo e canela. Tradicional de São João!',
        preco: 10.90, precoOriginal: 12.82, icone: '🥥',
        imagem: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop',
        alergenos: ['Lactose'],
        disponivel: true, sazonal: true, festivalJunino: true,
        unidades: [1, 2, 3, 4, 5, 6],
        opcoes: [
            { nome: 'Com amendoim', preco: 1.00 },
        ],
    },
    {
        id: 15, nome: 'Água de Coco', categoria: 'bebidas',
        descricao: 'Água de coco natural gelada, 350ml.',
        preco: 6.50, icone: '🥥',
        imagem: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=400&h=300&fit=crop',
        alergenos: [],
        disponivel: true,
        unidades: [1, 2, 3, 4, 5, 6],
        opcoes: [],
    },
    {
        id: 16, nome: 'Acarajé Tradicional', categoria: 'tapiocas',
        descricao: 'Acarajé com vatapá, caruru e camarão seco. Receita baiana!',
        preco: 16.90, icone: '🫓',
        imagem: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
        alergenos: ['Glúten', 'Crustáceos'],
        disponivel: true,
        unidades: [4],
        opcoes: [
            { nome: 'Sem pimenta', preco: 0 },
            { nome: 'Extra camarão', preco: 5.00 },
        ],
    },
    {
        id: 17, nome: 'Tapioca de Coco', categoria: 'tapiocas',
        descricao: 'Tapioca com coco ralado, leite condensado e canela. Típica do RN!',
        preco: 11.90, icone: '🥥',
        imagem: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop',
        alergenos: ['Lactose'],
        disponivel: true,
        unidades: [5, 6],
        opcoes: [
            { nome: 'Sem leite condensado', preco: 0 },
            { nome: 'Extra coco', preco: 1.50 },
        ],
    },
];

const CAMPANHAS = [
    {
        titulo: '🎉 Festival Junino',
        descricao: 'Pratos especiais de São João com 15% de desconto!',
        validade: '30/06/2026',
        itens: ['Quentão Nordestino', 'Pamonha Recheada', 'Canjica Cremosa'],
    },
    {
        titulo: '⭐ Sexta Fidelidade',
        descricao: 'Às sextas, pontos em dobro no programa de fidelidade!',
        validade: 'Recorrente',
    },
];

// Pedidos iniciais (mock) — serão copiados para store.pedidos na inicialização
const PEDIDOS_INICIAIS = [
    {
        id: 'PED-2026-0847',
        data: '05/06/2026 19:32',
        status: 'delivered',
        statusTexto: 'Entregue',
        etapa: 4,
        itens: [
            { nome: 'Tapioca Carne Seca', qtd: 1, preco: 14.90, opcoes: ['Extra queijo (+R$3,00)'] },
            { nome: 'Suco de Acerola', qtd: 2, preco: 7.90, opcoes: [] },
        ],
        total: 33.70,
        unidade: 'Boa Viagem — Recife',
        previsao: '20:05',
        pontosGanhos: 33,
        pontosContabilizados: true,
        pagamento: 'PIX',
        avaliacao: 4,
    },
    {
        id: 'PED-2026-0831',
        data: '03/06/2026 12:15',
        status: 'delivered',
        statusTexto: 'Entregue',
        etapa: 4,
        itens: [
            { nome: 'Cuscuz com Ovo', qtd: 1, preco: 9.90, opcoes: ['Extra ovo (+R$2,00)'] },
            { nome: 'Café Regional', qtd: 1, preco: 5.90, opcoes: [] },
        ],
        total: 17.80,
        unidade: 'Shopping Recife',
        pontosGanhos: 17,
        pontosContabilizados: true,
        pagamento: 'Crédito',
        avaliacao: 5,
    },
    {
        id: 'PED-2026-0819',
        data: '01/06/2026 09:45',
        status: 'delivered',
        statusTexto: 'Entregue',
        etapa: 4,
        itens: [
            { nome: 'Pamonha Recheada', qtd: 2, preco: 11.90, opcoes: [] },
            { nome: 'Quentão Nordestino', qtd: 1, preco: 12.90, opcoes: ['Sem álcool'] },
            { nome: 'Canjica Cremosa', qtd: 1, preco: 10.90, opcoes: [] },
        ],
        total: 47.60,
        unidade: 'Meireles — Fortaleza',
        pontosGanhos: 47,
        pontosContabilizados: true,
        pagamento: 'PIX',
        avaliacao: 4,
    },
    {


        id: 'PED-2026-0802',
        data: '28/05/2026 20:10',
        status: 'delivered',
        statusTexto: 'Entregue',
        etapa: 4,
        itens: [
            { nome: 'Cartola', qtd: 1, preco: 10.90, opcoes: ['Com sorvete (+R$4,00)'] },
            { nome: 'Cappuccino de Rapadura', qtd: 1, preco: 9.90, opcoes: [] },
        ],
        total: 24.80,
        unidade: 'Boa Viagem — Recife',
        pontosGanhos: 24,
        pontosContabilizados: true,
        pagamento: 'Débito',
        avaliacao: 5,
    },
];

const RECOMPENSAS = [
    { id: 1, nome: 'Café Regional Grátis', pontos: 50, icone: '☕', disponivel: true },
    { id: 2, nome: 'Suco Natural Grátis', pontos: 80, icone: '🍹', disponivel: true },
    { id: 3, nome: 'Tapioca Simples Grátis', pontos: 120, icone: '🥘', disponivel: false },
    { id: 4, nome: 'Sobremesa Grátis', pontos: 150, icone: '🍰', disponivel: false },
    { id: 5, nome: 'Combo Completo Grátis', pontos: 300, icone: '🍽️', disponivel: false },
    { id: 6, nome: 'Desconto 20% no Pedido', pontos: 200, icone: '💰', disponivel: false },
];

// Helper: Retorna produtos disponíveis na unidade selecionada
function getProdutosUnidade() {
    const unitId = store.currentUnit.id;
    return PRODUTOS.filter(p => !p.unidades || p.unidades.includes(unitId));
}