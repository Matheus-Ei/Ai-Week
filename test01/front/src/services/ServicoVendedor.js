class ServicoVendedor {
  static async listarVendedores() {
    try {
      const response = await fetch('http://localhost:3000/vendedores');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Erro ao listar vendedores:', error);
      throw error;
    }
  }

  static async obterVendedor(id) {
    try {
      const response = await fetch(`http://localhost:3000/vendedores/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Erro ao obter vendedor:', error);
      throw error;
    }
  }

  static async criarVendedor(vendedor) {
    try {
      const response = await fetch('http://localhost:3000/vendedores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vendedor),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Erro ao criar vendedor:', error);
      throw error;
    }
  }

  static async atualizarVendedor(id, vendedor) {
    try {
      const response = await fetch(`http://localhost:3000/vendedores/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vendedor),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Erro ao atualizar vendedor:', error);
      throw error;
    }
  }
  static async excluirVendedor(id) {
    try {
      const response = await fetch(`http://localhost:3000/vendedores/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Status 204 means successful deletion with no content to parse
      return { success: true };
    } catch (error) {
      console.error('Erro ao excluir vendedor:', error);
      throw error;
    }
  }
}

export default ServicoVendedor;
