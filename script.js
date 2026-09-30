// CONFIGURAÇÃO DO SUPABASE
// Substitua pelas credenciais do seu projeto no Supabase
const SUPABASE_URL = 'https://ayaxihdrmtdaxiciqyon.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_d798gznbwIA72tVIF2djqw_qkSSU1_x';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ELEMENTOS DO DOM
const livroForm = document.getElementById('livro-form');
const nomeLivroInput = document.getElementById('nome_livro');
const dataInput = document.getElementById('data');
const livrosLista = document.getElementById('livros-lista');

// Função para buscar e listar os livros
async function buscarLivros() {
    livrosLista.innerHTML = '<tr><td colspan="4">Carregando...</td></tr>';

    // Certifique-se de que o nome da tabela no Supabase é 'livros'
    const { data: livros, error } = await supabase
        .from('livros')
        .select('*')
        .order('id', { ascending: true });

    if (error) {
        console.error('Erro ao buscar dados:', error);
        livrosLista.innerHTML = '<tr><td colspan="4">Erro ao carregar dados.</td></tr>';
        return;
    }

    livrosLista.innerHTML = '';

    livros.forEach(livro => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${livro.id}</td>
            <td>${livro.nome_livro}</td>
            <td>${new Date(livro.data).toLocaleDateString('pt-BR')}</td>
            <td>
                <button class="btn-deletar" onclick="deletarLivro(${livro.id})">Excluir</button>
            </td>
        `;
        livrosLista.appendChild(tr);
    });
}

// Função para adicionar um novo livro
livroForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome_livro = nomeLivroInput.value;
    const data = dataInput.value;

    const { error } = await supabase
        .from('livros')
        .insert([{ nome_livro, data }]);

    if (error) {
        console.error('Erro ao inserir dados:', error);
        alert('Erro ao salvar o livro.');
    } else {
        livroForm.reset();
        buscarLivros(); // Atualiza a tabela
    }
});

// Função para deletar um livro
async function deletarLivro(id) {
    if (confirm('Tem certeza que deseja excluir este livro?')) {
        const { error } = await supabase
            .from('livros')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Erro ao deletar dados:', error);
            alert('Erro ao excluir o livro.');
        } else {
            buscarLivros(); // Atualiza a tabela
        }
    }
}

// Executa a busca assim que a página carrega
buscarLivros();
