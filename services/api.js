const API_URL = "http://ec2-52-22-160-200.compute-1.amazonaws.com:8080";

export const apiService = {
  salvarCheckIn: async (payload) => {
    const response = await fetch(`${API_URL}/check-in`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Erro na resposta do backend:", errorBody);
      throw new Error("Erro ao salvar check-in");
    }

    if (response.status === 204) return null;

    const text = await response.text();
    if (!text) return null;

    return JSON.parse(text);
  },

  login: async (email, senha) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const token = await response.text();
      if (!response.ok) return { error: "Usuário ou Senha Invalidos!" };
      if (!token.startsWith("ey")) return { error: "Token inválido ou não recebido" };
      return { token };
    } catch (error) {
      return { error: error.message || "Erro desconhecido ao fazer login" };
    }
  },

  cadastroUsuario: async (payload) => {
    try {
      const response = await fetch(`${API_URL}/auth/cadastro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.status === 201) return { success: true };

      const text = await response.text();
      return {
        success: false,
        message: text || `Erro ao cadastrar usuário. Status: ${response.status}`,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Erro desconhecido ao cadastrar",
      };
    }
  },

  getMembroDesafioPorId: async (id) => {
    try {
      const response = await fetch(`${API_URL}/membros-desafio/${id}`);
      if (!response.ok) throw new Error(await response.text() || "Erro ao buscar membro do desafio");
      const text = await response.text();
      return text ? JSON.parse(text) : null;
    } catch (error) {
      console.error("Falha ao buscar membro do desafio:", error.message);
      throw error;
    }
  },

  listarNotificacoesPorUsuario: async (uuid) => {
    try {
      const response = await fetch(`${API_URL}/usuarios/${uuid}/notificacoes`);
      if (!response.ok) return response.status === 204 ? [] : [];
      const text = await response.text();
      return text ? JSON.parse(text) : [];
    } catch (error) {
      console.error("Erro em listarNotificacoesPorUsuario:", error);
      return [];
    }
  },

  getUsuarioByEmail: async (email) => {
    try {
      const response = await fetch(`${API_URL}/usuarios/email/${encodeURIComponent(email)}`);
      if (!response.ok) throw new Error("Erro ao buscar usuário");
      const text = await response.text();
      return text ? JSON.parse(text) : null;
    } catch (error) {
      console.error("Erro em getUsuarioByEmail:", error);
      throw error;
    }
  },

  getDesafios: async () => {
    try {
      const response = await fetch(`${API_URL}/desafios/`);
      if (response.status === 204) return [];
      if (!response.ok) throw new Error(`Erro ao buscar desafios. Status: ${response.status}`);
      const text = await response.text();
      if (!text) return [];
      const data = JSON.parse(text);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Erro em getDesafios:", error);
      return [];
    }
  },

  getDesafiosByGrupoId: async (grupoId) => {
    try {
      const response = await fetch(`${API_URL}/desafios/por-grupo/${grupoId}`);
      if (!response.ok) return response.status === 204 ? [] : [];
      const text = await response.text();
      return text ? JSON.parse(text) : [];
    } catch {
      return [];
    }
  },

  sairDoGrupo: async (membroId) => {
    const response = await fetch(`${API_URL}/membros-grupo/${membroId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Erro ao sair do grupo");
    }

    return true;
  },

  getCheckInsByDesafioId: async (desafioId) => {
    try {
      const response = await fetch(`${API_URL}/check-in/desafio/${desafioId}`);
      if (!response.ok) return response.status === 204 ? [] : [];
      const text = await response.text();
      return text ? JSON.parse(text) : [];
    } catch (error) {
      return [];
    }
  },

  getMembrosByDesafio: async (desafioId) => {
    try {
      const response = await fetch(`${API_URL}/membros-desafio/desafio/${desafioId}`);
      if (!response.ok) return response.status === 204 ? [] : [];
      const text = await response.text();
      return text ? JSON.parse(text) : [];
    } catch {
      return [];
    }
  },

  getGrupos: async () => {
    try {
      const response = await fetch(`${API_URL}/grupos/`);
      if (!response.ok) return response.status === 204 ? [] : [];
      const text = await response.text();
      return text ? JSON.parse(text) : [];
    } catch (error) {
      return [];
    }
  },

  getGrupoById: async (grupoId) => {
    try {
      const response = await fetch(`${API_URL}/grupos/${grupoId}`);
      if (!response.ok) throw new Error("Erro ao buscar detalhes do grupo");
      const text = await response.text();
      return text ? JSON.parse(text) : null;
    } catch (error) {
      throw error;
    }
  },

  getMembrosByGrupo: async (grupoId) => {
    try {
      const response = await fetch(`${API_URL}/membros-grupo/grupo/${grupoId}`);
      if (!response.ok) return response.status === 204 ? [] : [];
      const text = await response.text();
      return text ? JSON.parse(text) : [];
    } catch {
      return [];
    }
  },
  entrarGrupo: async (grupoId, usuarioId, codigoAcesso = null) => {
    try {
      const body = {
        grupo: { id: grupoId },
        usuario: { id: usuarioId },
        status: "ATIVO",
        dataEntrada: new Date().toISOString().split("T")[0],
        role: "MEMBRO",
      };

      if (codigoAcesso) body.codigoAcesso = codigoAcesso;

      const response = await fetch(`${API_URL}/membros-grupo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        let errorMessage = `Erro ${response.status} ao entrar no grupo`;

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          const textError = await response.text();
          if (textError) errorMessage = textError;
        }

        const error = new Error(errorMessage);
        error.status = response.status;
        throw error;
      }

      const text = await response.text();
      return text ? JSON.parse(text) : null;
    } catch (error) {
      throw error;
    }
  },

  getDesafioById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/desafios/${id}`);
      if (!response.ok) throw new Error("Erro ao buscar desafio");
      const text = await response.text();
      return text ? JSON.parse(text) : null;
    } catch (error) {
      throw error;
    }
  },

  criarGrupo: async (payload) => {
    try {
      const response = await fetch(`${API_URL}/grupos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : null;

      if (!response.ok) {
        return { success: false, error: data?.message || "Erro ao criar grupo" };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message || "Erro de conexão" };
    }
  },

  criarDesafio: async (desafio) => {
    try {
      const response = await fetch(`${API_URL}/desafios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(desafio),
      });

      if (!response.ok) {
        let errorMessage = "Erro ao criar desafio";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {}
        throw new Error(errorMessage);
      }

      const text = await response.text();
      return text ? JSON.parse(text) : null;
    } catch (error) {
      throw error;
    }
  },

  updateDesafio: async (id, desafio) => {
    try {
      const response = await fetch(`${API_URL}/desafios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(desafio),
      });

      if (!response.ok) throw new Error("Erro ao atualizar desafio");

      const text = await response.text();
      return text ? JSON.parse(text) : null;
    } catch (error) {
      throw error;
    }
  },

  deleteDesafio: async (id) => {
    try {
      const response = await fetch(`${API_URL}/desafios/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao deletar desafio");

      return true;
    } catch (error) {
      throw error;
    }
  },

  getRanking: async (desafioId) => {
    try {
      const response = await fetch(`${API_URL}/membros-desafio/desafio/${desafioId}/ranking`);
      if (!response.ok) return response.status === 204 ? [] : [];
      const text = await response.text();
      return text ? JSON.parse(text) : [];
    } catch (error) {
      return [];
    }
  },

  getDesafiosByUsuario: async (usuarioId) => {
    try {
      const response = await fetch(`${API_URL}/membros-desafio/usuario/${usuarioId}`);
      if (!response.ok) return response.status === 204 ? [] : [];
      const text = await response.text();
      return text ? JSON.parse(text) : [];
    } catch {
      return [];
    }
  },

  listarCategorias: async () => {
    try {
      const response = await fetch(`${API_URL}/categorias/`);
      if (!response.ok) throw new Error("Erro ao buscar categorias");
      const text = await response.text();
      return text ? JSON.parse(text) : [];
    } catch (error) {
      return [];
    }
  },

  listarGruposDoUsuario: async (userId) => {
    try {
      const response = await fetch(`${API_URL}/membros-grupo/usuario/${userId}`);
      if (!response.ok) return [];

      const text = await response.text();
      const data = text ? JSON.parse(text) : [];

      if (Array.isArray(data) && data[0]?.grupo) {
        return data.map((item) => item.grupo);
      }

      return data;
    } catch {
      return [];
    }
  },

  getMeusDesafios: async (usuarioId) => {
    try {
      const response = await fetch(`${API_URL}/membros-desafio/usuario/${usuarioId}`);
      if (!response.ok) return [];
      const text = await response.text();
      return text ? JSON.parse(text) : [];
    } catch {
      return [];
    }
  },

  getDesafiosPraVoce: async (usuarioId) => {
    try {
      const response = await fetch(`${API_URL}/desafios/pravoce/${usuarioId}`);
      if (!response.ok) return response.status === 204 ? [] : [];

      const text = await response.text();
      const data = text ? JSON.parse(text) : [];
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  getCheckInsByUsuarioId: async (usuarioId) => {
    try {
      const response = await fetch(`${API_URL}/check-in/usuario/${usuarioId}`);
      if (!response.ok) return response.status === 204 ? [] : [];
      const text = await response.text();
      return text ? JSON.parse(text) : [];
    } catch {
      return [];
    }
  },

  getRankingByDesafioId: async (desafioId) => {
    try {
      const response = await fetch(`${API_URL}/membros-desafio/desafio/${desafioId}/ranking`);
      if (!response.ok) return response.status === 204 ? [] : [];
      const text = await response.text();
      return text ? JSON.parse(text) : [];
    } catch {
      return [];
    }
  },

  getMembrosPorUsuario: async (usuarioId) => {
    try {
      const response = await fetch(`${API_URL}/membros-desafio/usuario/${usuarioId}`);
      if (!response.ok) return [];
      const text = await response.text();
      return text ? JSON.parse(text) : [];
    } catch {
      return [];
    }
  },

  participarDesafio: async (body) => {
    try {
      const response = await fetch(`${API_URL}/membros-desafio`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Erro ao participar do desafio");
      }

      const text = await response.text();
      return text ? JSON.parse(text) : null;
    } catch (error) {
      throw error;
    }
  },

  desistirDoDesafio: async (desafioId, usuarioId) => {
    try {
      const response = await fetch(`${API_URL}/membros-desafio/${desafioId}/desistir?usuarioId=${encodeURIComponent(usuarioId)}`, {
        method: "POST",
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("Desistência não permitida. O desafio pode não estar ativo.");
        }
        throw new Error("Erro ao desistir do desafio");
      }

      return true;
    } catch (error) {
      throw error;
    }
  },

  atualizarUsuario: async (dadosOriginais, dadosEditados) => {
    if (!dadosOriginais?.id)
      throw new Error("ID do usuário obrigatório para atualizar");

    const dadosParaAtualizar = {
      id: dadosOriginais.id,
      nome: dadosEditados.nome ?? dadosOriginais.nome,
      email: dadosEditados.email ?? dadosOriginais.email,
      dataNascimento: dadosEditados.dataNascimento ?? dadosOriginais.dataNascimento,
      chavePix: dadosEditados.chavePix ?? dadosOriginais.chavePix,
      objetivo: dadosEditados.objetivo ?? dadosOriginais.objetivo,
      urlFoto: dadosEditados.urlFoto ?? dadosOriginais.urlFoto,
      saldo: dadosEditados.saldo ?? dadosOriginais.saldo,
      status: dadosEditados.status ?? dadosOriginais.status,
    };

    try {
      const response = await fetch(`${API_URL}/usuarios/${dadosOriginais.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosParaAtualizar),
      });

      if (!response.ok) {
        const textError = await response.text();
        throw new Error(textError || "Erro ao atualizar usuário");
      }

      const text = await response.text();
      return text ? JSON.parse(text) : null;
    } catch (error) {
      throw error;
    }
  },

  depositar: async (idUsuario, valor) => {
    const response = await fetch(`${API_URL}/usuarios/${idUsuario}/depositar?valor=${valor}`, {
      method: "POST",
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "Erro ao realizar depósito");
    }

    const text = await response.text();
    return parseFloat(text);
  },

  sacar: async (idUsuario, valor) => {
    const response = await fetch(`${API_URL}/usuarios/${idUsuario}/sacar?valor=${valor}`, {
      method: "POST",
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "Erro ao realizar saque");
    }

    const text = await response.text();
    return parseFloat(text);
  },

  getNotificacoesByUsuario: async (usuarioId) => {
    try {
      const response = await fetch(`${API_URL}/usuarios/${usuarioId}/notificacoes`);
      if (!response.ok) return [];
      const text = await response.text();
      return text ? JSON.parse(text) : [];
    } catch {
      return [];
    }
  },
};

