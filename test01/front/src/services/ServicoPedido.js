class ServicoPedido {
  static async listarPedidos() {
    try {
      const response = await fetch('http://localhost:3000/pedidos');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Erro ao listar pedidos:', error);
      throw error;
    }
  }

  static async obterPedido(id) {
    try {
      const response = await fetch(`http://localhost:3000/pedidos/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Erro ao obter pedido:', error);
      throw error;
    }
  }

  static async criarPedido(pedido) {
    try {
      const response = await fetch('http://localhost:3000/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      throw error;
    }
  }

  static async atualizarPedido(id, pedido) {
    try {
      const response = await fetch(`http://localhost:3000/pedidos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
      throw error;
    }
  }
  static async excluirPedido(id) {
    try {
      const response = await fetch(`http://localhost:3000/pedidos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Status 204 means successful deletion with no content to parse
      return { success: true };
    } catch (error) {
      console.error('Erro ao excluir pedido:', error);
      throw error;
    }
  }

  // Novos métodos para facilitar a interface
  static async obterClientesDisponiveis() {
    try {
      const response = await fetch('http://localhost:3000/pedidos/clientes-disponiveis');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Erro ao obter clientes disponíveis:', error);
      throw error;
    }
  }

  static async obterVendedoresDisponiveis() {
    try {
      const response = await fetch('http://localhost:3000/pedidos/vendedores-disponiveis');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Erro ao obter vendedores disponíveis:', error);
      throw error;
    }
  }
}

export default ServicoPedido;
