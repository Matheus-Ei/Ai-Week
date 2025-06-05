const API_URL = 'http://localhost:3000/dashboard';

class ServicoDashboard {
  async getStats() {
    try {
      const response = await fetch(`${API_URL}/stats`);
      if (!response.ok) {
        throw new Error('Erro ao carregar estatísticas');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      throw error;
    }
  }

  async getVendasPorPeriodo(periodo = 30) {
    try {
      const response = await fetch(`${API_URL}/vendas-periodo?periodo=${periodo}`);
      if (!response.ok) {
        throw new Error('Erro ao carregar vendas por período');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao carregar vendas por período:', error);
      throw error;
    }
  }

  async getTopProdutos(limit = 10) {
    try {
      const response = await fetch(`${API_URL}/top-produtos?limit=${limit}`);
      if (!response.ok) {
        throw new Error('Erro ao carregar top produtos');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao carregar top produtos:', error);
      throw error;
    }
  }

  async getTopVendedores(limit = 10) {
    try {
      const response = await fetch(`${API_URL}/top-vendedores?limit=${limit}`);
      if (!response.ok) {
        throw new Error('Erro ao carregar top vendedores');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao carregar top vendedores:', error);
      throw error;
    }
  }

  async getAnaliseClientes() {
    try {
      const response = await fetch(`${API_URL}/analise-clientes`);
      if (!response.ok) {
        throw new Error('Erro ao carregar análise de clientes');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao carregar análise de clientes:', error);
      throw error;
    }
  }

  async getDistribuicaoCidades() {
    try {
      const response = await fetch(`${API_URL}/distribuicao-cidades`);
      if (!response.ok) {
        throw new Error('Erro ao carregar distribuição por cidades');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao carregar distribuição por cidades:', error);
      throw error;
    }
  }

  async getAnaliseEstoque() {
    try {
      const response = await fetch(`${API_URL}/analise-estoque`);
      if (!response.ok) {
        throw new Error('Erro ao carregar análise de estoque');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao carregar análise de estoque:', error);
      throw error;
    }
  }

  async getEvolucaoMensal() {
    try {
      const response = await fetch(`${API_URL}/evolucao-mensal`);
      if (!response.ok) {
        throw new Error('Erro ao carregar evolução mensal');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao carregar evolução mensal:', error);
      throw error;
    }
  }
}

export default new ServicoDashboard();
