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
    id: 'c14',
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
    dataHoraCheckin: '2025-06-16T07:00:00',
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
  {
    id: 'c4',
    membroDesafio: {
      id: 'md4',
      usuario: {
        id: 'u4',
        nome: 'Ana Paula',
        avatar: 'https://exemplo.com/avatar-ana.jpg',
      },
      desafio: {
        id: '2',
        nome: 'Musculação Básica',
      },
      status: 'ATIVO',
    },
    urlFoto: 'https://example.com/checkin-ana-foto1.jpg',
    local: 'Academia Central',
    dataHoraCheckin: '2025-05-20T18:00:00',
    status: 'CONCLUIDO',
  },
  {
    id: 'c5',
    membroDesafio: {
      id: 'md5',
      usuario: {
        id: 'u5',
        nome: 'Lucas Mendes',
        avatar: 'https://exemplo.com/avatar-lucas.jpg',
      },
      desafio: {
        id: '2',
        nome: 'Musculação Básica',
      },
      status: 'ATIVO',
    },
    urlFoto: 'https://example.com/checkin-lucas-foto1.jpg',
    local: 'Academia Central',
    dataHoraCheckin: '2025-05-22T19:30:00',
    status: 'EM_ANDAMENTO',
  },
  {
    id: 'c6',
    membroDesafio: {
      id: 'md6',
      usuario: {
        id: 'u6',
        nome: 'Fernanda Lima',
        avatar: 'https://exemplo.com/avatar-fernanda.jpg',
      },
      desafio: {
        id: '2',
        nome: 'Musculação Básica',
      },
      status: 'ATIVO',
    },
    urlFoto: 'https://example.com/checkin-fernanda-foto1.jpg',
    local: 'Academia Central',
    dataHoraCheckin: '2025-05-25T20:30:00',
    status: 'PENDENTE',
  },

  {
    id: 'c7',
    membroDesafio: {
      id: 'md7',
      usuario: {
        id: 'u7',
        nome: 'Bruno Silva',
        avatar: 'https://exemplo.com/avatar-bruno.jpg',
      },
      desafio: {
        id: '3',
        nome: 'Artes Marciais Iniciante',
      },
      status: 'ATIVO',
    },
    urlFoto: 'https://example.com/checkin-bruno-foto1.jpg',
    local: 'Dojo Central',
    dataHoraCheckin: '2025-06-12T10:00:00',
    status: 'CONCLUIDO',
  },
  {
    id: 'c8',
    membroDesafio: {
      id: 'md8',
      usuario: {
        id: 'u8',
        nome: 'Paula Torres',
        avatar: 'https://exemplo.com/avatar-paula.jpg',
      },
      desafio: {
        id: '3',
        nome: 'Artes Marciais Iniciante',
      },
      status: 'ATIVO',
    },
    urlFoto: 'https://example.com/checkin-paula-foto1.jpg',
    local: 'Dojo Central',
    dataHoraCheckin: '2025-06-12T11:00:00',
    status: 'EM_ANDAMENTO',
  },
  {
    id: 'c9',
    membroDesafio: {
      id: 'md9',
      usuario: {
        id: 'u9',
        nome: 'Ricardo Gomes',
        avatar: 'https://exemplo.com/avatar-ricardo.jpg',
      },
      desafio: {
        id: '3',
        nome: 'Artes Marciais Iniciante',
      },
      status: 'ATIVO',
    },
    urlFoto: 'https://example.com/checkin-ricardo-foto1.jpg',
    local: 'Dojo Central',
    dataHoraCheckin: '2025-06-12T12:00:00',
    status: 'PENDENTE',
  },

  {
    id: 'c10',
    membroDesafio: {
      id: 'md10',
      usuario: {
        id: 'u10',
        nome: 'Sofia Martins',
        avatar: 'https://exemplo.com/avatar-sofia.jpg',
      },
      desafio: {
        id: '4',
        nome: 'Yoga para Iniciantes',
      },
      status: 'ATIVO',
    },
    urlFoto: 'https://example.com/checkin-sofia-foto1.jpg',
    local: 'Estúdio Yoga',
    dataHoraCheckin: '2025-06-15T07:00:00',
    status: 'CONCLUIDO',
  },
  {
    id: 'c11',
    membroDesafio: {
      id: 'md11',
      usuario: {
        id: 'u11',
        nome: 'Gabriel Costa',
        avatar: 'https://exemplo.com/avatar-gabriel.jpg',
      },
      desafio: {
        id: '4',
        nome: 'Yoga para Iniciantes',
      },
      status: 'ATIVO',
    },
    urlFoto: 'https://example.com/checkin-gabriel-foto1.jpg',
    local: 'Estúdio Yoga',
    dataHoraCheckin: '2025-06-15T08:00:00',
    status: 'EM_ANDAMENTO',
  },
  {
    id: 'c12',
    membroDesafio: {
      id: 'md12',
      usuario: {
        id: 'u12',
        nome: 'Helena Rocha',
        avatar: 'https://exemplo.com/avatar-helena.jpg',
      },
      desafio: {
        id: '4',
        nome: 'Yoga para Iniciantes',
      },
      status: 'ATIVO',
    },
    urlFoto: 'https://example.com/checkin-helena-foto1.jpg',
    local: 'Estúdio Yoga',
    dataHoraCheckin: '2025-06-15T09:00:00',
    status: 'PENDENTE',
  },
  {
  id: 'c13',
  membroDesafio: {
    id: 'md13',
    usuario: {
      id: 'u1',
      nome: 'João Silva',
      avatar: 'https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVyZmlsfGVufDB8fDB8fHwwfHx8fDE2OTY1MjQ0NjA&auto=format&fit=crop&w=3000&q=60',
    },
    desafio: {
      id: '4',
      nome: 'Yoga para Iniciantes',
    },
    status: 'ATIVO',
  },
  urlFoto: 'https://example.com/checkin-joao-foto2.jpg',
  local: 'Estúdio Yoga',
  dataHoraCheckin: '2025-06-17T07:00:00',
  status: 'CONCLUIDO',
},
{
  id: 'c14',
  membroDesafio: {
    id: 'md14',
    usuario: {
      id: 'u1',
      nome: 'João Silva',
      avatar: 'https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVyZmlsfGVufDB8fDB8fHwwfHx8fDE2OTY1MjQ0NjA&auto=format&fit=crop&w=3000&q=60',
    },
    desafio: {
      id: '5',
      nome: 'Desafio de Resistência',
    },
    status: 'ATIVO',
  },
  urlFoto: 'https://example.com/checkin-joao-foto3.jpg',
  local: 'Parque Central',
  dataHoraCheckin: '2025-06-18T06:00:00',
  status: 'CONCLUIDO',
},

];

const MOCK_GRUPOS = [
  {
    id: 'grp1',
    nome: 'Maratona Run Dev',
    imagem: 'https://images.unsplash.com/photo-1552674605-db6ffd4c1d68?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cnVubmluZyUyMGdyb3VwfGVufDB8fDB8fHww',
    descricao: 'Grupo para desenvolvedores que amam correr e se exercitar. Foco em maratonas e saúde mental.',
    membros: 21,
    limiteMembros: 50,
    categoria: 'Corrida',
    tipo: 'publico',
    codigoAcesso: null,
    administrador: 'Manuel Silva',
  },
  {
    id: 'grp2',
    nome: 'Intensivão CrossFR',
    imagem: 'https://images.unsplash.com/photo-1594918712771-550304a0808a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y3Jvc3NmaXQlMjBncm91cHxlbnwwfHwwfHx8MA%3D%3D',
    descricao: 'Treinos intensivos de Cross Functional para todos os níveis. Venha superar seus limites!',
    membros: 25,
    limiteMembros: 80,
    categoria: 'Musculação',
    tipo: 'privado',
    codigoAcesso: 'CROSSFR123',
    administrador: 'Ana Carolina',
  },
  {
    id: 'grp3',
    nome: 'Galera do Bike',
    imagem: 'https://images.unsplash.com/photo-1572118671850-25e21c3227ed?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGJpa2luZwlMjBncm91cHxlbnwwfHwwfHx8MA%3D%3D',
    descricao: 'Aquele pedal de fim de semana para explorar novas trilhas e se divertir com a galera.',
    membros: 16,
    limiteMembros: 50,
    categoria: 'Ciclismo',
    tipo: 'publico',
    codigoAcesso: null,
    administrador: 'Pedro Souza',
  },
  {
    id: 'grp4',
    nome: 'Yoga Zen',
    imagem: 'https://plus.unsplash.com/photos/bM1Q9p3n4d8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHlvZ2ElMjBncm91cHxlbnwwfHwwfHx8MA%3D%3D',
    descricao: 'Para quem busca equilíbrio e bem-estar através do yoga. Aulas diárias ao pôr do sol.',
    membros: 10,
    limiteMembros: 30,
    categoria: 'Yoga',
    tipo: 'privado',
    codigoAcesso: 'YOGA2025',
    administrador: 'Sofia Mendes',
  },
  {
    id: 'grp5',
    nome: 'Caminhada Saudável',
    imagem: 'https://plus.unsplash.com/photos/P8N9z2Q_Y0w?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHdhbGtpbmclMjBncm91cHxlbnwwfHwwfHx8MA%3D%3D',
    descricao: 'Um grupo para caminhadas matinais e noturnas, explorando a cidade e a natureza.',
    membros: 40,
    limiteMembros: 100,
    categoria: 'Caminhada',
    tipo: 'publico',
    codigoAcesso: null,
    administrador: 'Mariana Lima',
  },
];


// Adicionando funções mockadas

export const apiService = {
  // 🔐 Login
  login: async (email, senha) => {
    console.log(`Mock login recebido: email=${email}, senha=${senha}`);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const usuarioValido = 'usuario@exemplo.com';
    const senhaValida = 'senha123';

    if (email === usuarioValido && senha === senhaValida) {
      return {
        token: 'mocked-jwt-token-abcdef123456',
        user: {
          id: 'u1',
          nome: 'Usuário de Teste',
          email: usuarioValido,
        },
      };
    } else {
      throw new Error('Email ou senha inválidos');
    }
  },

  async listarGruposDoUsuario(userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userGroups = MOCK_GRUPOS.filter(group => group.administrador === 'Manuel Silva');
        resolve(userGroups);
      }, 500);
    });
  },

   getGrupos: async (filtro = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let gruposFiltrados = MOCK_GRUPOS;
        if (filtro.termo) {
          const termoLower = filtro.termo.toLowerCase();
          gruposFiltrados = gruposFiltrados.filter(
            (grupo) =>
              grupo.nome.toLowerCase().includes(termoLower) ||
              grupo.categoria.toLowerCase().includes(termoLower)
          );
        }
        if (filtro.tipo && filtro.tipo !== 'todos') {
          gruposFiltrados = gruposFiltrados.filter(
            (grupo) => grupo.tipo === filtro.tipo
          );
        }
        resolve(gruposFiltrados);
      }, 500);
    });
  },

  criarGrupo: async (novoGrupo) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const nomeExiste = MOCK_GRUPOS.some(grupo => grupo.nome === novoGrupo.nome);
        if (nomeExiste) {
          reject({ success: false, message: 'Nome do grupo já existe.' });
          return;
        }

        const id = `grp${MOCK_GRUPOS.length + 1}`;
        const codigoAcesso = novoGrupo.tipo === 'privado' && !novoGrupo.codigoAcesso
          ? Math.random().toString(36).substring(2, 8).toUpperCase()
          : novoGrupo.codigoAcesso;

        const grupoCompleto = {
          id,
          ...novoGrupo,
          membros: 1,
          limiteMembros: novoGrupo.limiteMembros || 50,
          codigoAcesso: novoGrupo.tipo === 'privado' ? codigoAcesso : null,
          administrador: 'Manuel Silva',
        };
        MOCK_GRUPOS.push(grupoCompleto);
        resolve({ success: true, grupo: grupoCompleto });
      }, 1000);
    });
  },

  entrarGrupo: async (grupoId, codigo) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const grupo = MOCK_GRUPOS.find(g => g.id === grupoId);
        if (!grupo) {
          return reject({ success: false, message: 'Grupo não encontrado.' });
        }
        if (grupo.tipo === 'privado' && grupo.codigoAcesso !== codigo) {
          return reject({ success: false, message: 'Código de acesso incorreto.' });
        }
        if (grupo.membros >= grupo.limiteMembros) {
          return reject({ success: false, message: 'Grupo lotado.' });
        }
        grupo.membros += 1;
        resolve({ success: true, message: 'Você entrou no grupo!', grupo });
      }, 500);
    });
  },

  // 🔥 Listar todos os desafios
  getDesafios: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_DESAFIOS);
      }, 600);
    });
  },

  // 🔍 Buscar desafio por ID
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

  // 📋 Buscar check-ins por desafio
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

   getCheckInsByUsuarioId: async (usuarioId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const checkins = MOCK_CHECKINS.filter(
          (checkin) => checkin.membroDesafio.usuario.id === usuarioId
        );
        resolve(checkins);
      }, 500);
    });
  },

  // 📋 Buscar check-in específico
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

  // 🏷️ Listar categorias
  listarCategorias: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 'cat1', nome: 'Corrida' },
          { id: 'cat2', nome: 'Ciclismo' },
          { id: 'cat3', nome: 'Caminhada' },
          { id: 'cat4', nome: 'Yoga' },
        ]);
      }, 500);
    });
  },

  getMembrosPorUsuario: async (usuarioId) => {
  console.log(`Mock: buscando membros para usuário ${usuarioId}`);

  await new Promise((resolve) => setTimeout(resolve, 500));

  const membros = MOCK_CHECKINS
    .filter((checkin) => checkin.membroDesafio.usuario.id === usuarioId)
    .map((checkin) => checkin.membroDesafio);

  const membrosUnicos = membros.filter(
    (membro, index, self) =>
      index ===
      self.findIndex((m) => m.id === membro.id)
  );

  return membrosUnicos;
},


  // 👥 Listar grupos do usuário
  listarGruposDoUsuario: async (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 'grp1', nome: 'Grupo Academia' },
          { id: 'grp2', nome: 'Desafio dos 30 Dias' },
          { id: 'grp3', nome: 'Amigos na Corrida' },
        ]);
      }, 500);
    });
  },

  // 🆕 Criar desafio
  criarDesafio: async (body) => {
    return new Promise((resolve) => {
      console.log('Desafio enviado:', body);
      setTimeout(() => {
        resolve({ mensagem: 'Desafio criado com sucesso', data: body });
      }, 1000);
    });
  },

  // 🟩🟦🟥 Novas chamadas mockadas 🟩🟦🟥

  // 🔹 Meus desafios (simula desafios que o usuário participa)
  getMeusDesafios: async (usuarioId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const meus = MOCK_DESAFIOS.filter((d) =>
          ['1', '2'].includes(d.id) // Simulando que o usuário participa desses
        );
        resolve(meus);
      }, 500);
    });
  },

  // 🔸 Desafios "Pra Você" (simula desafios recomendados)
  getDesafiosPraVoce: async (usuarioId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const praVoce = MOCK_DESAFIOS.filter((d) =>
          ['3', '4'].includes(d.id) // Simula recomendados
        );
        resolve(praVoce);
      }, 500);
    });
  },

  // 🔺 Explorar desafios (todos os desafios públicos disponíveis)
  getExplorarDesafios: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const explorar = MOCK_DESAFIOS.filter((d) =>
          ['5', '6'].includes(d.id) // Simula desafios para explorar
        );
        resolve(explorar);
      }, 500);
    });
  },

  participarDesafio: async (usuarioId, desafioId, status = 'ATIVO', dataConclusao = null) => {
    const dataFinal = dataConclusao || new Date().toISOString().slice(0, 10);

    const body = {
      usuario: { id: usuarioId },
      desafio: { id: desafioId },
      status,
      dataConclusao: dataFinal,
    };

    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('POST /membros-desafio', JSON.stringify(body, null, 2));

    return {
      id: 'mock-id-123',
      ...body,
      criadoEm: new Date().toISOString(),
    };
  },

  getRankingByDesafioId: async (desafioId) => {
  return {
    podium: {
      primeiro: {
        id: "u2",
        nome: "Usuário 2",
        avatar: "https://example.com/avatar2.png",
        pontos: 1600,
      },
      segundo: {
        id: "u1",
        nome: "Usuário 1",
        avatar: "https://example.com/avatar1.png",
        pontos: 1400,
      },
      terceiro: {
        id: "u3",
        nome: "Usuário 3",
        avatar: "https://example.com/avatar3.png",
        pontos: 1300,
      },
    },
    ranking: [
      {
        id: "u2",
        nome: "Usuário 2",
        avatar: "https://example.com/avatar2.png",
        pontos: 1600,
        posicao: 1,
        diasConsecutivos: 5,
      },
      {
        id: "u1",
        nome: "Usuário 1",
        avatar: "https://example.com/avatar1.png",
        pontos: 1400,
        posicao: 2,
        diasConsecutivos: 3,
      },
      {
        id: "u3",
        nome: "Usuário 3",
        avatar: "https://example.com/avatar3.png",
        pontos: 1300,
        posicao: 3,
        diasConsecutivos: 2,
      },
      {
        id: "u4",
        nome: "Usuário 3",
        avatar: "https://example.com/avatar3.png",
        pontos: 1200,
        posicao: 4,
        diasConsecutivos: 2,
      },
      // outros usuários...
    ],
  };
},
  desistirDoDesafio: async (desafioId, usuarioId) => {
    return new Promise((resolve, reject) => {
      console.log("Chamada API: desistirDoDesafio");
      console.log("desafioId:", desafioId);
      console.log("usuarioId:", usuarioId);

    
      setTimeout(() => {
        if (desafioId && usuarioId) {
          resolve({ message: "Desistência confirmada" });
        } else {
          reject(new Error("IDs inválidos para desistir do desafio"));
        }
      }, 1000);
    });
  },
  getUsuario: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      id: "1",
      nome: "Joao Oliveira",
      email: "joao.oliveira@email.com",
      senha: "Maria123@", // normalmente você não deveria expor isso no frontend
      role: "USER",
      dataNascimento: "1988-09-15T00:00:00.000+00:00",
      objetivo: "GANHO_DE_MASSA_MUSCULAR",
      urlFoto: "https://newmillen.com.br/wp-content/uploads/2021/09/tipos-de-academia-1.jpeg",
      dataCriacao: "2024-06-05T10:30:00",
      status: "ATIVO",
      exibirHistorico: true,
      tipoUsuario: "MEMBRO",
      saldo: 250.0,
      chavePix: "maria@pix.com",
      bio: "Apaixonado por desafios e evolução constante! 💪",
      username: "joao_oliveira",
      estatisticas: {
        desafiosCompletos: 8,
        desafiosAtivos: 2,
        pontosTotais: 950,
      },
    };
  },

  atualizarUsuario: async (dados) => {
    console.log("Usuário atualizado:", dados);
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { ...dados };
  },

  depositar: async (valor) => {
    console.log(`Depósito de R$ ${valor} realizado`);
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { status: "sucesso" };
  },

  sacar: async (valor) => {
    console.log(`Saque de R$ ${valor} realizado`);
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { status: "sucesso" };
  },

  getNotificacoes: async () => {
    return [
      {
        data_criacao: '2025-06-18T09:00:00.000000',
        notificacoes: [
          {
            uuid: '10',
            mensagem: 'Novo desafio "Desafio dos 10k" foi criado.',
            tipo: 'NOVO_DESAFIO',
            lida: 0,
          },
          {
            uuid: '11',
            mensagem: 'Você recebeu um convite para o grupo "Corredores Noturnos".',
            tipo: 'CONVITE_GRUPO',
            lida: 0,
          },
        ],
      },
      {
        data_criacao: '2025-06-17T21:30:00.000000',
        notificacoes: [
          {
            uuid: '4',
            mensagem: 'Atenção! Faltam 2 dias para encerrar o desafio "Corrida Matinal".',
            tipo: 'ALERTA_TEMPO',
            lida: 1,
          },
          {
            uuid: '5',
            mensagem: 'Você recebeu um convite para o desafio "Desafio dos Feras".',
            tipo: 'CONVITE_DESAFIO',
            lida: 0,
          },
        ],
      },
      {
        data_criacao: '2025-06-17T18:47:36.000000',
        notificacoes: [
          {
            uuid: '1',
            mensagem: 'O desafio Corrida Matinal 7 Dias foi encerrado.',
            tipo: 'DESAFIO_ENCERRADO',
            lida: 0,
          },
          {
            uuid: '2',
            mensagem: 'Parabéns! Você ficou em 2º lugar no desafio "Corrida Matinal".',
            tipo: 'PREMIO_DESAFIO',
            lida: 0,
          },
        ],
      },
      {
        data_criacao: '2025-06-17T18:40:07.000000',
        notificacoes: [
          {
            uuid: '3',
            mensagem: 'Lucas Almeida fez um check-in no desafio Corrida Matinal.',
            tipo: 'CHECK_IN',
            lida: 1,
          },
        ],
      },
      {
        data_criacao: '2025-06-16T10:15:00.000000',
        notificacoes: [
          {
            uuid: '6',
            mensagem: 'Maria Souza fez um check-in no desafio "Desafio dos 10k".',
            tipo: 'CHECK_IN',
            lida: 1,
          },
          {
            uuid: '7',
            mensagem: 'Novo membro João entrou no desafio "Desafio dos Feras".',
            tipo: 'NOVO_MEMBRO_DESAFIO',
            lida: 0,
          },
          {
            uuid: '8',
            mensagem: 'Pedro comentou no desafio "Desafio dos Feras".',
            tipo: 'NOVO_COMENTARIO',
            lida: 0,
          },
        ],
      },
      {
        data_criacao: '2025-06-15T15:45:00.000000',
        notificacoes: [
          {
            uuid: '9',
            mensagem: 'O desafio "Desafio da Resistência" foi cancelado.',
            tipo: 'DESAFIO_CANCELADO',
            lida: 1,
          },
        ],
      },
    ];
  },

  getEstatisticas: async () => ({
    totalNotificacoes: 12,
    notificacoesNaoLidas: 5,
  }),

  getConfiguracoes: async () => ({
    desafios: true,
    receberEmail: false,
    notificacoesPush: true,
  }),
};

