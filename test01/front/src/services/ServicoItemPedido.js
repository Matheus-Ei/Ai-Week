class ServicoItemPedido {
  static async listarItensPedido() {
    try {
      const response = await fetch('http://localhost:3000/itens-pedido');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Erro ao listar itens de pedido:', error);
      throw error;
    }
  }

  static async obterItemPedido(id) {
    try {
      const response = await fetch(`http://localhost:3000/itens-pedido/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Erro ao obter item de pedido:', error);
      throw error;
    }
  }

  static async criarItemPedido(itemPedido) {
    try {
      const response = await fetch('http://localhost:3000/itens-pedido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemPedido),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Erro ao criar item de pedido:', error);
      throw error;
    }
  }

  static async atualizarItemPedido(id, itemPedido) {
    try {
      const response = await fetch(`http://localhost:3000/itens-pedido/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemPedido),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Erro ao atualizar item de pedido:', error);
      throw error;
    }
  }
  static async excluirItemPedido(id) {
    try {
      const response = await fetch(`http://localhost:3000/itens-pedido/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Status 204 means successful deletion with no content to parse
      return { success: true };
    } catch (error) {
      console.error('Erro ao excluir item de pedido:', error);
      throw error;
    }
  }

  // Novos métodos para facilitar a interface
  static async obterPedidosDisponiveis() {
    try {
      const response = await fetch('http://localhost:3000/itens-pedido/pedidos-disponiveis');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Erro ao obter pedidos disponíveis:', error);
      throw error;
    }
  }

  static async obterProdutosDisponiveis() {
    try {
      const response = await fetch('http://localhost:3000/itens-pedido/produtos-disponiveis');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Erro ao obter produtos disponíveis:', error);
      throw error;
    }
  }
}

export default ServicoItemPedido;
