// api.mock.detalhado.js

const MOCK_DESAFIOS = [
  {
    id: '1',
    nome: 'Corrida de 5km',
    descricao: 'Complete uma corrida de 5 km em 30 dias.',
    imagem: 'https://s2-ge.glbimg.com/Ac622fX9IsddFCDbLx5KSLC_nQ4=/0x0:1254x837/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_bc8228b6673f488aa253bbcb03c80ec5/internal_photos/bs/2023/o/P/t1zZFbRfyKCPUnr54VSA/istock-675941582.jpg',
    progresso: 70,
    posicao: 4,
    diasRestantes: 12,
    pontosGanhos: 1300,
    valorAposta: 50,
    ativos: 120,
    dataInicio: '2025-06-01',
    dataFim: '2025-06-30',
    cronograma: {
      seg: true,
      ter: true,
      qua: false,
      qui: true,
      sex: false,
      sab: true,
      dom: false,
    },
    timeline: [
      {
        id: 101,
        tempo: '07:00',
        status: 'concluido',
        participante: {
          nome: 'João Silva',
          avatar: 'https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVyZmlsfGVufDB8fDB8fHwwfHx8fDE2OTY1MjQ0NjA&auto=format&fit=crop&w=3000&q=60',
          distancia: 5,
          status: 'Concluído',
        },
      },
      {
        id: 102,
        tempo: '08:30',
        status: 'em_andamento',
        participante: {
          nome: 'Maria Souza',
          avatar: 'https://plus.unsplash.com/premium_photo-1688572454849-4348982edf7d?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Zm90byUyMGRvJTIwcGVyZmlsfGVufDB8fDB8fHww',
          distancia: 3,
          status: 'Em andamento',
        },
      },
      {
        id: 103,
        tempo: '10:00',
        status: 'pendente',
        participante: {
          nome: 'Carlos Pereira',
          avatar: 'https://img.freepik.com/fotos-gratis/focada-homem-negro-segurando-halteres-e-boxe_1262-16102.jpg',
          distancia: 0,
          status: 'Pendente',
        },
      },
    ],
  },

  {
    id: '2',
    nome: 'Musculação Básica',
    descricao: 'Treine musculação 3 vezes por semana durante 1 mês.',
    imagem: 'https://hubconteudo.dasa.com.br/wp-content/uploads/2022/08/abre_musculacao_saude.jpg',
    progresso: 55,
    posicao: 7,
    diasRestantes: 6,
    valorAposta: 50,
    pontosGanhos: 900,
    ativos: 80,
    dataInicio: '2025-05-15',
    dataFim: '2025-06-21',
    cronograma: {
      seg: true,
      ter: false,
      qua: true,
      qui: false,
      sex: true,
      sab: false,
      dom: false,
    },
    timeline: [
      {
        id: 201,
        tempo: '18:00',
        status: 'concluido',
        participante: {
          nome: 'Ana Paula',
          avatar: 'https://exemplo.com/avatar-ana.jpg',
          distancia: 0,
          status: 'Concluído',
        },
      },
      {
        id: 202,
        tempo: '19:30',
        status: 'em_andamento',
        participante: {
          nome: 'Lucas Mendes',
          avatar: 'https://exemplo.com/avatar-lucas.jpg',
          distancia: 0,
          status: 'Em andamento',
        },
      },
      {
        id: 203,
        tempo: '20:30',
        status: 'pendente',
        participante: {
          nome: 'Fernanda Lima',
          avatar: 'https://exemplo.com/avatar-fernanda.jpg',
          distancia: 0,
          status: 'Pendente',
        },
      },
    ],
  },

  {
    id: '3',
    nome: 'Artes Marciais Iniciante',
    descricao: 'Aulas semanais de artes marciais por 1 mês.',
    imagem: 'https://static.mundoeducacao.uol.com.br/mundoeducacao/2023/06/judo.jpg',
    progresso: 35,
    posicao: 12,
    diasRestantes: 20,
    pontosGanhos: 600,
    valorAposta: 30,
    ativos: 45,
    dataInicio: '2025-06-10',
    dataFim: '2025-07-10',
    cronograma: {
      seg: false,
      ter: true,
      qua: false,
      qui: true,
      sex: false,
      sab: false,
      dom: true,
    },
    timeline: [
      {
        id: 301,
        tempo: '10:00',
        status: 'concluido',
        participante: {
          nome: 'Bruno Silva',
          avatar: 'https://exemplo.com/avatar-bruno.jpg',
          distancia: 0,
          status: 'Concluído',
        },
      },
      {
        id: 302,
        tempo: '11:00',
        status: 'em_andamento',
        participante: {
          nome: 'Paula Torres',
          avatar: 'https://exemplo.com/avatar-paula.jpg',
          distancia: 0,
          status: 'Em andamento',
        },
      },
      {
        id: 303,
        tempo: '12:00',
        status: 'pendente',
        participante: {
          nome: 'Ricardo Gomes',
          avatar: 'https://exemplo.com/avatar-ricardo.jpg',
          distancia: 0,
          status: 'Pendente',
        },
      },
    ],
  },

  {
    id: '4',
    nome: 'Yoga para Iniciantes',
    descricao: 'Pratique yoga diariamente por 15 minutos durante 30 dias.',
    imagem: 'https://img.freepik.com/fotos-gratis/aulas-em-grupo-de-ioga-dentro-da-academia_1303-17162.jpg?semt=ais_hybrid&w=740',
    progresso: 80,
    posicao: 2,
    diasRestantes: 8,
    valorAposta: 40,
    pontosGanhos: 1400,
    ativos: 60,
    dataInicio: '2025-06-05',
    dataFim: '2025-07-05',
    cronograma: {
      seg: true,
      ter: false,
      qua: true,
      qui: false,
      sex: true,
      sab: false,
      dom: true,
    },
    timeline: [
      {
        id: 401,
        tempo: '07:00',
        status: 'concluido',
        participante: {
          nome: 'Sofia Martins',
          avatar: 'https://exemplo.com/avatar-sofia.jpg',
          distancia: 0,
          status: 'Concluído',
        },
      },
      {
        id: 402,
        tempo: '08:00',
        status: 'em_andamento',
        participante: {
          nome: 'Gabriel Costa',
          avatar: 'https://exemplo.com/avatar-gabriel.jpg',
          distancia: 0,
          status: 'Em andamento',
        },
      },
      {
        id: 403,
        tempo: '09:00',
        status: 'pendente',
        participante: {
          nome: 'Helena Rocha',
          avatar: 'https://exemplo.com/avatar-helena.jpg',
          distancia: 0,
          status: 'Pendente',
        },
      },
    ],
  },

  {
    id: '5',
    nome: 'Desafio de Resistência',
    descricao: 'Corra 10 km em 60 minutos durante 1 mês.',
    imagem: 'https://media.istockphoto.com/id/1367872098/pt/foto/full-length-shot-of-a-handsome-young-male-athlete-running-on-an-outdoor-track.jpg?s=612x612&w=0&k=20&c=YkyIUqt7wlFmUO9BZTAh1tZ01s6gDSWazD0ItOhxj94=',
    progresso: 100,
    posicao: 1,
    diasRestantes: 0,
    valorAposta: 50,
    pontosGanhos: 2000,
    ativos: 150,
    dataInicio: '2025-06-01',
    dataFim: '2025-07-01',
    cronograma: {
      seg: true,
      ter: true,
      qua: true,
      qui: true,
      sex: true,
      sab: true,
      dom: true,
    },
    timeline: [
      {
        id: 501,
        tempo: '06:00',
        status: 'concluido',
        participante: {
          nome: 'Marcelo Vieira',
          avatar: 'https://exemplo.com/avatar-marcelo.jpg',
          distancia: 10,
          status: 'Concluído',
        },
      },
      {
        id: 502,
        tempo: '07:00',
        status: 'concluido',
        participante: {
          nome: 'Renata Souza',
          avatar: 'https://exemplo.com/avatar-renata.jpg',
          distancia: 10,
          status: 'Concluído',
        },
      },
      {
        id: 503,
        tempo: '08:00',
        status: 'concluido',
        participante: {
          nome: 'Felipe Santos',
          avatar: 'https://exemplo.com/avatar-felipe.jpg',
          distancia: 10,
          status: 'Concluído',
        },
      },
    ],
  },

  {
    id: '6',
    nome: 'Desafio de Flexibilidade',
    descricao: 'Faça alongamento diário por 20 minutos durante 30 dias.',
    imagem: 'https://webrun.com.br/wp-content/uploads/2021/03/alongamento.png',
    progresso: 50,
    posicao: 8,
    diasRestantes: 15,
    valorAposta: 30,
    pontosGanhos: 750,
    ativos: 70,
    dataInicio: '2025-06-12',
    dataFim: '2025-07-12',
    cronograma: {
      seg: true,
      ter: true,
      qua: true,
      qui: false,
      sex: false,
      sab: true,
      dom: false,
    },
    timeline: [
      {
        id: 601,
        tempo: '07:30',
        status: 'concluido',
        participante: {
          nome: 'Paulo Henrique',
          avatar: 'https://exemplo.com/avatar-paulo.jpg',
          distancia: 0,
          status: 'Concluído',
        },
      },
      {
        id: 602,
        tempo: '08:30',
        status: 'em_andamento',
        participante: {
          nome: 'Juliana Costa',
          avatar: 'https://exemplo.com/avatar-juliana.jpg',
          distancia: 0,
          status: 'Em andamento',
        },
      },
      {
        id: 603,
        tempo: '09:30',
        status: 'pendente',
        participante: {
          nome: 'Roberto Lima',
          avatar: 'https://exemplo.com/avatar-roberto.jpg',
          distancia: 0,
          status: 'Pendente',
        },
      },
    ],
  },
];


const MOCK_CHECKINS = [
  {
    id: 'c1',
    membroDesafio: {
      id: 'md1',
      usuario: {
        id: 'u1',
        nome: 'João Silva',
        avatar: 'https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVyZmlsfGVufDB8fDB8fHwwfHx8fDE2OTY1MjQ0NjA&auto=format&fit=crop&w=3000&q=60',
      },
      desafio: {
        id: '1',
        nome: 'Corrida de 5km',
      },
      status: 'ATIVO',
    },
    urlFoto: 'https://example.com/checkin-joao-foto1.jpg',
    local: 'Parque Central',
    dataHoraCheckin: '2025-06-15T07:00:00',
    status: 'CONCLUIDO',
  },
  {
    id: 'c2',
    membroDesafio: {
      id: 'md2',
      usuario: {
        id: 'u2',
        nome: 'Maria Souza',
        avatar: 'https://plus.unsplash.com/premium_photo-1688572454849-4348982edf7d?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Zm90byUyMGRvJTIwcGVyZmlsfGVufDB8fDB8fHww',
      },
      desafio: {
        id: '1',
        nome: 'Corrida de 5km',
      },
      status: 'ATIVO',
    },
    urlFoto: 'https://example.com/checkin-maria-foto1.jpg',
    local: 'Parque Central',
    dataHoraCheckin: '2025-06-15T08:30:00',
    status: 'EM_ANDAMENTO',
  },
  {
    id: 'c3',
    membroDesafio: {
      id: 'md3',
      usuario: {
        id: 'u3',
        nome: 'Carlos Pereira',
        avatar: 'https://img.freepik.com/fotos-gratis/focada-homem-negro-segurando-halteres-e-boxe_1262-16102.jpg',
      },
      desafio: {
        id: '1',
        nome: 'Corrida de 5km',
      },
      status: 'ATIVO',
    },
    urlFoto: 'https://example.com/checkin-carlos-foto1.jpg',
    local: 'Parque Central',
    dataHoraCheckin: '2025-06-15T10:00:00',
    status: 'PENDENTE',
  },
];


export const apiService = {
  //login
  login: async (email, senha) => {
    console.log(`Mock login recebido: email=${email}, senha=${senha}`);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const usuarioValido = 'usuario@exemplo.com';
    const senhaValida = 'senha123';

    if (email === usuarioValido && senha === senhaValida) {
      return {
        token: 'mocked-jwt-token-abcdef123456',
        user: {
          id: 1,
          nome: 'Usuário de Teste',
          email: usuarioValido,
        },
      };
    } else {
      throw new Error('Email ou senha inválidos');
    }
  },
  async listarCategorias() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: "cat1", nome: "Corrida" },
          { id: "cat2", nome: "Ciclismo" },
          { id: "cat3", nome: "Caminhada" },
          { id: "cat4", nome: "Yoga" },
        ]);
      }, 500);
    });
  },

  async listarGruposDoUsuario(userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: "grp1", nome: "Grupo Academia" },
          { id: "grp2", nome: "Desafio dos 30 Dias" },
          { id: "grp3", nome: "Amigos na Corrida" },
        ]);
      }, 500);
    });
  },

  async criarDesafio(body) {
    return new Promise((resolve) => {
      console.log("Desafio enviado:", body);
      setTimeout(() => {
        resolve({ mensagem: "Desafio criado com sucesso", data: body });
      }, 1000);
    });
  },

  getDesafios: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_DESAFIOS);
      }, 600);
    });
  },

  getDesafioById: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const desafio = MOCK_DESAFIOS.find((d) => d.id === id);
        if (desafio) {
          resolve(desafio);
        } else {
          reject(new Error('Desafio não encontrado'));
        }
      }, 400);
    });
  },
  getCheckInsByDesafioId: async (desafioId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const checkins = MOCK_CHECKINS.filter(
          (checkin) => checkin.membroDesafio.desafio.id === desafioId
        );
        resolve(checkins);
      }, 500);
    });
  },

  getCheckInById: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const checkin = MOCK_CHECKINS.find((c) => c.id === id);
        if (checkin) {
          resolve(checkin);
        } else {
          reject(new Error('Check-in não encontrado'));
        }
      }, 400);
    });
  },
};
