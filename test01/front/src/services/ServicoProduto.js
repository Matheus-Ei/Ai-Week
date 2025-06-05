class ServicoProduto {
  static async listarProdutos() {
    try {
      const response = await fetch('http://localhost:3000/produtos');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Erro ao listar produtos:', error);
      throw error;
    }
  }

  static async obterProduto(id) {
    try {
      const response = await fetch(`http://localhost:3000/produtos/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Erro ao obter produto:', error);
      throw error;
    }
  }

  static async criarProduto(produto) {
    try {
      const response = await fetch('http://localhost:3000/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produto),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw error;
    }
  }

  static async atualizarProduto(id, produto) {
    try {
      const response = await fetch(`http://localhost:3000/produtos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produto),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw error;
    }
  }
  static async excluirProduto(id) {
    try {
      const response = await fetch(`http://localhost:3000/produtos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Status 204 means successful deletion with no content to parse
      return { success: true };
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      throw error;
    }
  }
}

export default ServicoProduto;
