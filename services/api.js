const API_URL = 'https://seu-backend.com/api'; // 🔥 Coloque sua URL aqui

export const apiService = {

  login: async (email, senha) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        throw new Error('Erro ao fazer login');
      }

      const data = await response.json();
      // Supondo que a resposta contenha um token e dados do usuário
      return data;
    } catch (error) {
      console.error('Erro em login:', error);
      throw error;
    }
  },
  //buscar usuario por email
  getUsuarioByEmail: async (email) => {
  try {
    const response = await fetch(`${API_URL}/usuario/email/${encodeURIComponent(email)}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar usuário');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro em getUsuarioByEmail:', error);
    throw error;
  }
},
  // Buscar todos os desafios
  getDesafios: async () => {
    try {
      const response = await fetch(`${API_URL}/desafios`);
      if (!response.ok) {
        throw new Error('Erro ao buscar desafios');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro em getDesafios:', error);
      throw error;
    }
  },

  // Buscar um desafio específico
  getDesafioById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/desafios/${id}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar desafio');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro em getDesafioById:', error);
      throw error;
    }
  },

  // Criar um novo desafio
  createDesafio: async (desafio) => {
    try {
      const response = await fetch(`${API_URL}/desafios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(desafio),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar desafio');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro em createDesafio:', error);
      throw error;
    }
  },

  // Atualizar um desafio
  updateDesafio: async (id, desafio) => {
    try {
      const response = await fetch(`${API_URL}/desafios/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(desafio),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar desafio');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro em updateDesafio:', error);
      throw error;
    }
  },

  // Deletar um desafio
  deleteDesafio: async (id) => {
    try {
      const response = await fetch(`${API_URL}/desafios/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar desafio');
      }

      return true;
    } catch (error) {
      console.error('Erro em deleteDesafio:', error);
      throw error;
    }
  },
  getRanking: async (desafioId) => {
    try {
      const response = await fetch(`${API_URL}/membros-desafio/desafio/${desafioId}/ranking`);
      if (!response.ok) {
        throw new Error('Erro ao buscar ranking');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro em getRanking:', error);
      throw error;
    }
  },
  getDesafiosByUsuario: async (usuarioId) => {
    try {
      const response = await fetch(`${API_URL}/membros-desafio/usuario/${usuarioId}/desafios`);
      if (!response.ok) {
        throw new Error('Erro ao buscar desafios do usuário');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro em getDesafiosByUsuario:', error);
      throw error;
    }
  },
  // No seu apiService
  getCheckinsByDesafio: async (desafioId) => {
    try {
      const response = await fetch(`${API_URL}/check-in/desafio/${desafioId}`);
      if (!response.ok) {
        if (response.status === 204) { 
          return [];
        }
        throw new Error('Erro ao buscar check-ins');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro em getCheckinsByDesafio:', error);
      throw error;
    }
  },
  async listarCategorias() {
    const response = await fetch(`${BASE_URL}/categorias/`);
    if (!response.ok) throw new Error("Erro ao buscar categorias");
    return await response.json();
  },

  async listarGruposDoUsuario(userId) {
    const response = await fetch(`${BASE_URL}/membros-grupo/usuario/${userId}`);
    if (!response.ok) throw new Error("Erro ao buscar grupos do usuário");
    return await response.json();
  },
};
