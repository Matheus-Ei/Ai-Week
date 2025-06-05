class ServicoCliente {
  static async listarClientes() {
    try {
      const response = await fetch('http://localhost:3000/clientes');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Erro ao listar clientes:', error);
      throw error;
    }
  }

  static async obterCliente(id) {
    try {
      const response = await fetch(`http://localhost:3000/clientes/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Erro ao obter cliente:', error);
      throw error;
    }
  }

  static async criarCliente(cliente) {
    try {
      const response = await fetch('http://localhost:3000/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      throw error;
    }
  }

  static async atualizarCliente(id, cliente) {
    try {
      const response = await fetch(`http://localhost:3000/clientes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      throw error;
    }
  }
  static async excluirCliente(id) {
    try {
      const response = await fetch(`http://localhost:3000/clientes/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Status 204 means successful deletion with no content to parse
      return { success: true };
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      throw error;
    }
  }

  // Métodos para obter dados de relacionamento
  static async obterVendedoresDisponiveis() {
    try {
      const response = await fetch('http://localhost:3000/vendedores');
      if (!response.ok) {
        throw new Error(`Erro ao buscar vendedores: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao obter vendedores disponíveis:', error);
      throw error;
    }
  }
}

export default ServicoCliente;
