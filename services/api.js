const API_URL = 'https://seu-backend.com/api'; // 🔥 Coloque sua URL correta

export const apiService = {

  // 🔐 Login
  login: async (email, senha) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) throw new Error('Erro ao fazer login');

      return await response.json();
    } catch (error) {
      console.error('Erro em login:', error);
      throw error;
    }
  },

  listarNotificacoesPorUsuario: async (uuid) => {
  try {
    const response = await fetch(`${API_URL}/usuarios/${uuid}/notificacoes`);
    if (!response.ok) {
      if (response.status === 204) return []; // sem conteúdo, retorna lista vazia
      throw new Error('Erro ao buscar notificações');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro em listarNotificacoesPorUsuario:', error);
    throw error;
  }
},

  // 🔍 Buscar usuário por email
  getUsuarioByEmail: async (email) => {
    try {
      const response = await fetch(`${API_URL}/usuario/email/${encodeURIComponent(email)}`);
      if (!response.ok) throw new Error('Erro ao buscar usuário');
      return await response.json();
    } catch (error) {
      console.error('Erro em getUsuarioByEmail:', error);
      throw error;
    }
  },

  // 🔥 Buscar todos os desafios
  getDesafios: async () => {
    try {
      const response = await fetch(`${API_URL}/desafios`);
      if (!response.ok) throw new Error('Erro ao buscar desafios');
      return await response.json();
    } catch (error) {
      console.error('Erro em getDesafios:', error);
      throw error;
    }
  },

  // 🔥 Buscar desafio por ID
  getDesafioById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/desafios/${id}`);
      if (!response.ok) throw new Error('Erro ao buscar desafio');
      return await response.json();
    } catch (error) {
      console.error('Erro em getDesafioById:', error);
      throw error;
    }
  },

  // 🆕 Criar desafio
  createDesafio: async (desafio) => {
    try {
      const response = await fetch(`${API_URL}/desafios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(desafio),
      });

      if (!response.ok) throw new Error('Erro ao criar desafio');

      return await response.json();
    } catch (error) {
      console.error('Erro em createDesafio:', error);
      throw error;
    }
  },

  // ✏️ Atualizar desafio
  updateDesafio: async (id, desafio) => {
    try {
      const response = await fetch(`${API_URL}/desafios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(desafio),
      });

      if (!response.ok) throw new Error('Erro ao atualizar desafio');

      return await response.json();
    } catch (error) {
      console.error('Erro em updateDesafio:', error);
      throw error;
    }
  },

  // 🗑️ Deletar desafio
  deleteDesafio: async (id) => {
    try {
      const response = await fetch(`${API_URL}/desafios/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erro ao deletar desafio');

      return true;
    } catch (error) {
      console.error('Erro em deleteDesafio:', error);
      throw error;
    }
  },

  // 🏆 Buscar ranking do desafio
  getRanking: async (desafioId) => {
    try {
      const response = await fetch(`${API_URL}/membros-desafio/desafio/${desafioId}/ranking`);
      if (!response.ok) throw new Error('Erro ao buscar ranking');
      return await response.json();
    } catch (error) {
      console.error('Erro em getRanking:', error);
      throw error;
    }
  },

  // 🔎 Buscar desafios que o usuário participa
  getDesafiosByUsuario: async (usuarioId) => {
    try {
      const response = await fetch(`${API_URL}/membros-desafio/usuario/${usuarioId}`);
      if (!response.ok) throw new Error('Erro ao buscar desafios do usuário');
      return await response.json();
    } catch (error) {
      console.error('Erro em getDesafiosByUsuario:', error);
      throw error;
    }
  },

  // 📋 Buscar check-ins de um desafio
  getCheckinsByDesafio: async (desafioId) => {
    try {
      const response = await fetch(`${API_URL}/check-in/desafio/${desafioId}`);
      if (!response.ok) {
        if (response.status === 204) return [];
        throw new Error('Erro ao buscar check-ins');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro em getCheckinsByDesafio:', error);
      throw error;
    }
  },

  // 🏷️ Listar categorias
  listarCategorias: async () => {
    const response = await fetch(`${API_URL}/categorias/`);
    if (!response.ok) throw new Error('Erro ao buscar categorias');
    return await response.json();
  },

  // 👥 Listar grupos do usuário
  listarGruposDoUsuario: async (userId) => {
    const response = await fetch(`${API_URL}/membros-grupo/usuario/${userId}`);
    if (!response.ok) throw new Error('Erro ao buscar grupos do usuário');
    return await response.json();
  },

  // 🔥🔹🔹 NOVAS CHAMADAS 🔹🔹🔥

  // Buscar Meus Desafios (Desafios que o usuário está participando)
  getMeusDesafios: async (usuarioId) => {
    try {
      const response = await fetch(`${API_URL}/desafios/meus/${usuarioId}`);
      if (!response.ok) throw new Error('Erro ao buscar meus desafios');
      return await response.json();
    } catch (error) {
      console.error('Erro em getMeusDesafios:', error);
      throw error;
    }
  },

  // Buscar Desafios Pra Você (Recomendados)
  getDesafiosPraVoce: async (usuarioId) => {
    try {
      const response = await fetch(`${API_URL}/desafios/pravoce/${usuarioId}`);
      if (!response.ok) throw new Error('Erro ao buscar desafios pra você');
      return await response.json();
    } catch (error) {
      console.error('Erro em getDesafiosPraVoce:', error);
      throw error;
    }
  },
  getCheckInsByUsuarioId: async (usuarioId) => {
  try {
    const response = await fetch(`${API_URL}/check-in/usuario/${usuarioId}`);
    if (!response.ok) {
      if (response.status === 204) return []; // Sem conteúdo
      throw new Error('Erro ao buscar check-ins do usuário');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro em getCheckInsByUsuarioId:', error);
    throw error;
  }
},

getMembrosPorUsuario: async (usuarioId) => {
  const response = await fetch(`${API_URL}/membros-desafio/usuario/${usuarioId}`);
  if (!response.ok) throw new Error('Erro ao buscar membros do usuário');
  return await response.json();
},

participarDesafio: async (usuarioId, desafioId, status = 'ATIVO', dataConclusao = null) => {
  try {
    const dataFinal = dataConclusao || new Date().toISOString().slice(0, 10);

    const body = {
      usuario: { id: usuarioId },
      desafio: { id: desafioId },
      status,
      dataConclusao: dataFinal,
    };

    const response = await fetch(`${API_URL}/membros-desafio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao participar do desafio');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro em participarDesafio:', error);
    throw error;
  }
},

desistirDoDesafio: async (desafioId, usuarioId) => {
  try {
    const url = `${API_URL}/membros-desafio/${desafioId}/desistir?usuarioId=${encodeURIComponent(usuarioId)}`;
    const response = await fetch(url, {
      method: 'POST',
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Desistência não permitida. O desafio pode não estar ativo.');
      }
      throw new Error('Erro ao desistir do desafio');
    }

    return true;
  } catch (error) {
    console.error('Erro em desistirDoDesafio:', error);
    throw error;
  }
},

getUsuario: async () => {
    const email = "joao.oliveira@email.com";
    const response = await fetch(`${API_BASE_URL}/email/${encodeURIComponent(email)}`);
    if (!response.ok) {
      throw new Error("Erro ao buscar usuário");
    }
    return await response.json();
  },

  atualizarUsuario: async (dados) => {
    if (!dados.id) throw new Error("ID do usuário obrigatório para atualizar");

    const response = await fetch(`${API_BASE_URL}/${dados.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    if (!response.ok) {
      throw new Error("Erro ao atualizar usuário");
    }

    return await response.json();
  },

  depositar: async (idUsuario, valor) => {
    const response = await fetch(
      `${API_BASE_URL}/${idUsuario}/depositar?valor=${valor}`,
      {
        method: "POST",
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao realizar depósito");
    }

    return await response.json();
  },

  sacar: async (idUsuario, valor) => {
    const response = await fetch(
      `${API_BASE_URL}/${idUsuario}/sacar?valor=${valor}`,
      {
        method: "POST",
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao realizar saque");
    }

    return await response.json();
  },
};
