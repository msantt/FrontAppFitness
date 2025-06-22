const API_URL = "http://ec2-52-22-160-200.compute-1.amazonaws.com:8080";

export const apiService = {
  // 🔐 Login
  login: async (email, senha) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const token = await response.text();

      if (!response.ok) {
        throw new Error(token || "Erro ao fazer login");
      }

      if (!token.startsWith("ey")) {
        throw new Error("Token inválido ou não recebido");
      }

      console.log("Login realizado com sucesso:", token);
      return { token };
    } catch (error) {
      console.error("Falha no login:", error.message);
      throw error;
    }
  },

  listarNotificacoesPorUsuario: async (uuid) => {
    try {
      const response = await fetch(`${API_URL}/usuarios/${uuid}/notificacoes`);
      if (!response.ok) {
        if (response.status === 204) return []; // sem conteúdo, retorna lista vazia
        throw new Error("Erro ao buscar notificações");
      }
      return await response.json();
    } catch (error) {
      console.error("Erro em listarNotificacoesPorUsuario:", error);
      throw error;
    }
  },

  // 🔍 Buscar usuário por email
  getUsuarioByEmail: async (email) => {
    try {
      const response = await fetch(
        `${API_URL}/usuarios/email/${encodeURIComponent(email)}`
      );
      if (!response.ok) throw new Error("Erro ao buscar usuário");
      return await response.json();
    } catch (error) {
      console.error("Erro em getUsuarioByEmail:", error);
      throw error;
    }
  },

  // 🔥 Buscar todos os desafios
  getDesafios: async () => {
    try {
      const response = await fetch(`${API_URL}/desafios/`);
      console.log("Status getDesafios:", response.status);
      if (!response.ok) throw new Error("Erro ao buscar desafios");
      const data = await response.json();
      console.log("Data getDesafios:", data);
      return data;
    } catch (error) {
      console.error("Erro em getDesafios:", error);
      throw error;
    }
  },
  getMembrosByDesafio: async (desafioId) => {
    try {
      const response = await fetch(`${API_URL}/membros-desafio/desafio/${desafioId}`);
      if (!response.ok) {
        if (response.status === 204) return [];
        throw new Error(`Erro ao buscar membros do desafio (status ${response.status})`);
      }
      return await response.json();
    } catch (error) {
      console.error("Erro em getMembrosByDesafio:", error);
      throw error;
    }
  },

  getGrupos: async () => {
    try {
      const response = await fetch(`${API_URL}/grupos/`);
      if (!response.ok) {
        if (response.status === 204) return [];
        throw new Error("Erro ao buscar grupos");
      }
      return await response.json();
    } catch (error) {
      console.error("Erro em getGrupos:", error);
      throw error;
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

      if (codigoAcesso) {
        body.codigoAcesso = codigoAcesso;
      }

      const response = await fetch(`${API_URL}/membros-grupo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const status = response.status;
        let errorMessage = `Erro ${status} ao entrar no grupo`;

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          const textError = await response.text();
          if (textError) errorMessage = textError;
        }

        const error = new Error(errorMessage);
        error.status = status;
        throw error;
      }

      return await response.json();
    } catch (error) {
      console.error("Erro em entrarGrupo:", error);
      throw error;
    }
  },

  // 🔥 Buscar desafio por ID
  getDesafioById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/desafios/${id}`);
      if (!response.ok) throw new Error("Erro ao buscar desafio");
      return await response.json();
    } catch (error) {
      console.error("Erro em getDesafioById:", error);
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

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.message || "Erro ao criar grupo" };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message || "Erro de conexão" };
    }
  },

  criarDesafio: async (desafio) => {
    try {
      console.log("Criando desafio com dados:", desafio);
      const response = await fetch(`${API_URL}/desafios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

      return await response.json();
    } catch (error) {
      console.error("Erro em criarDesafio:", error);
      throw error;
    }
  },

  // ✏️ Atualizar desafio
  updateDesafio: async (id, desafio) => {
    try {
      const response = await fetch(`${API_URL}/desafios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(desafio),
      });

      if (!response.ok) throw new Error("Erro ao atualizar desafio");

      return await response.json();
    } catch (error) {
      console.error("Erro em updateDesafio:", error);
      throw error;
    }
  },

  // 🗑️ Deletar desafio
  deleteDesafio: async (id) => {
    try {
      const response = await fetch(`${API_URL}/desafios/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao deletar desafio");

      return true;
    } catch (error) {
      console.error("Erro em deleteDesafio:", error);
      throw error;
    }
  },

  // 🏆 Buscar ranking do desafio
  getRanking: async (desafioId) => {
    try {
      const response = await fetch(
        `${API_URL}/membros-desafio/desafio/${desafioId}/ranking`
      );
      if (!response.ok) throw new Error("Erro ao buscar ranking");
      return await response.json();
    } catch (error) {
      console.error("Erro em getRanking:", error);
      throw error;
    }
  },

  // 🔎 Buscar desafios que o usuário participa
  getDesafiosByUsuario: async (usuarioId) => {
    try {
      const response = await fetch(
        `${API_URL}/membros-desafio/usuario/${usuarioId}`
      );
      if (!response.ok) throw new Error("Erro ao buscar desafios do usuário");
      return await response.json();
    } catch (error) {
      console.error("Erro em getDesafiosByUsuario:", error);
      throw error;
    }
  },

  // 📋 Buscar check-ins de um desafio
  getCheckinsByDesafio: async (desafioId) => {
    try {
      const response = await fetch(`${API_URL}/check-in/desafio/${desafioId}`);
      if (!response.ok) {
        if (response.status === 204) return [];
        throw new Error("Erro ao buscar check-ins");
      }
      return await response.json();
    } catch (error) {
      console.error("Erro em getCheckinsByDesafio:", error);
      throw error;
    }
  },

  // 🏷️ Listar categorias
  listarCategorias: async () => {
    const response = await fetch(`${API_URL}/categorias/`);
    if (!response.ok) throw new Error("Erro ao buscar categorias");
    return await response.json();
  },

  // 👥 Listar grupos do usuário
  // Em services/api.js (ou onde estiver seu apiService)
  listarGruposDoUsuario: async (userId) => {
    const response = await fetch(`${API_URL}/membros-grupo/usuario/${userId}`);
    if (!response.ok) {
      throw new Error("Erro ao buscar grupos");
    }
    const data = await response.json();

    console.log("listarGruposDoUsuario - dados recebidos:", data);

    // Se data for array de membrosGrupo, map para pegar só grupo:
    if (Array.isArray(data)) {
      // Verifica se o primeiro item tem a propriedade 'grupo'
      if (data.length > 0 && data[0].grupo) {
        return data.map((item) => item.grupo);
      }
      // Se não tem grupo, já retorna o que vier
      return data;
    }

    // Se não for array, retorna como está
    return data;
  },

  // 🔥🔹🔹 NOVAS CHAMADAS 🔹🔹🔥

  // Buscar Meus Desafios (Desafios que o usuário está participando)
  getMeusDesafios: async (usuarioId) => {
    try {
      const response = await fetch(
        `${API_URL}/membros-desafio/usuario/${usuarioId}`
      );
      if (!response.ok) throw new Error("Erro ao buscar meus desafios");
      return await response.json();
    } catch (error) {
      console.error("Erro em getMeusDesafios:", error);
      throw error;
    }
  },

  // Buscar Desafios Pra Você (Recomendados)
  getDesafiosPraVoce: async (usuarioId) => {
    try {
      const url = `${API_URL}/desafios/pravoce/${usuarioId}`;
      const response = await fetch(url);

      if (!response.ok) {
        // Se status 204 (No Content), retorna array vazio
        if (response.status === 204) return [];
        console.warn(
          `Não foi possível carregar desafios pra você: status ${response.status}`
        );
        return [];
      }

      // Lê o texto da resposta
      const text = await response.text();

      // Se veio texto vazio, retorna array vazio para evitar erro
      if (!text) return [];

      // Tenta fazer parse do JSON
      try {
        const data = JSON.parse(text);
        // Se não for array, converte para array vazio
        if (!Array.isArray(data)) return [];
        return data;
      } catch {
        console.warn(
          "Falha ao parsear JSON de desafios pra você, retornando array vazio"
        );
        return [];
      }
    } catch (error) {
      console.error("Erro em getDesafiosPraVoce:", error);
      return []; // fallback para não quebrar o app
    }
  },

  getCheckInsByUsuarioId: async (usuarioId) => {
    try {
      const response = await fetch(`${API_URL}/check-in/usuario/${usuarioId}`);
      if (!response.ok) {
        if (response.status === 204) return []; // Sem conteúdo
        throw new Error("Erro ao buscar check-ins do usuário");
      }
      return await response.json();
    } catch (error) {
      console.error("Erro em getCheckInsByUsuarioId:", error);
      throw error;
    }
  },

  getMembrosPorUsuario: async (usuarioId) => {
    const response = await fetch(
      `${API_URL}/membros-desafio/usuario/${usuarioId}`
    );
    if (!response.ok) throw new Error("Erro ao buscar membros do usuário");
    return await response.json();
  },

  participarDesafio: async (
    usuarioId,
    desafioId,
    status = "ATIVO",
    dataConclusao = null
  ) => {
    try {
      const dataFinal = dataConclusao || new Date().toISOString().slice(0, 10);

      const body = {
        usuario: { id: usuarioId },
        desafio: { id: desafioId },
        status,
        dataConclusao: dataFinal,
      };

      const response = await fetch(`${API_URL}/membros-desafio`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao participar do desafio");
      }

      return await response.json();
    } catch (error) {
      console.error("Erro em participarDesafio:", error);
      throw error;
    }
  },

  desistirDoDesafio: async (desafioId, usuarioId) => {
    try {
      const url = `${API_URL}/membros-desafio/${desafioId}/desistir?usuarioId=${encodeURIComponent(
        usuarioId
      )}`;
      const response = await fetch(url, {
        method: "POST",
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error(
            "Desistência não permitida. O desafio pode não estar ativo."
          );
        }
        throw new Error("Erro ao desistir do desafio");
      }

      return true;
    } catch (error) {
      console.error("Erro em desistirDoDesafio:", error);
      throw error;
    }
  },

  atualizarUsuario: async (dadosOriginais, dadosEditados) => {
    console.log(dadosEditados);
    if (!dadosOriginais?.id)
      throw new Error("ID do usuário obrigatório para atualizar");

    const dadosParaAtualizar = {
      id: dadosOriginais.id,
      nome: dadosEditados.nome ?? dadosOriginais.nome,
      email: dadosEditados.email ?? dadosOriginais.email,
      dataNascimento:
        dadosEditados.dataNascimento ?? dadosOriginais.dataNascimento,
      chavePix: dadosEditados.chavePix ?? dadosOriginais.chavePix,
      objetivo: dadosEditados.objetivo ?? dadosOriginais.objetivo,
      urlFoto: dadosEditados.urlFoto ?? dadosOriginais.urlFoto,
      saldo: dadosEditados.saldo ?? dadosOriginais.saldo,
      status: dadosEditados.status ?? dadosOriginais.status,
    };

    console.log("Enviando dados atualizados:", dadosParaAtualizar);

    try {
      const response = await fetch(`${API_URL}/usuarios/${dadosOriginais.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosParaAtualizar),
      });

      if (!response.ok) {
        let errorMessage = "Erro ao atualizar usuário";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          const textError = await response.text();
          if (textError) errorMessage = textError;
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro em atualizarUsuario:", error);
      throw new Error(error.message || "Erro inesperado ao atualizar usuário");
    }
  },

  depositar: async (idUsuario, valor) => {
    const url = `${API_URL}/usuarios/${idUsuario}/depositar?valor=${valor}`;

    const response = await fetch(url, {
      method: "POST",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log("Erro no deposito:", errorText);
      throw new Error("Erro ao realizar depósito");
    }

    const text = await response.text();
    const saldoAtualizado = parseFloat(text);
    return saldoAtualizado;
  },

  sacar: async (idUsuario, valor) => {
    const url = `${API_URL}/usuarios/${idUsuario}/sacar?valor=${valor}`;

    const response = await fetch(url, {
      method: "POST",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log("Erro no saque:", errorText);
      throw new Error("Erro ao realizar saque");
    }

    const text = await response.text();
    const saldoAtualizado = parseFloat(text);
    return saldoAtualizado;
  },
};
