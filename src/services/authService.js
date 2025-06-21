import AsyncStorage from '@react-native-async-storage/async-storage';

// Chaves para armazenamento
const USERS_STORAGE_KEY = '@FrontAppFitness:users';
const CURRENT_USER_KEY = '@FrontAppFitness:currentUser';

// Serviço de autenticação
export const authService = {
  // Registrar um novo usuário
  register: async (userData) => {
    try {
      // Buscar usuários existentes
      const existingUsersJSON = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      const existingUsers = existingUsersJSON ? JSON.parse(existingUsersJSON) : [];
      
      // Verificar se o email já está em uso
      const emailExists = existingUsers.some(user => user.email === userData.email);
      if (emailExists) {
        return { success: false, message: 'Este email já está cadastrado' };
      }
      
      // Criar novo usuário com ID único
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date().toISOString()
      };
      
      // Adicionar à lista de usuários
      const updatedUsers = [...existingUsers, newUser];
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
      
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      return { success: false, message: 'Erro ao registrar usuário' };
    }
  },
  
  // Login de usuário
  login: async (email, password) => {
    try {
      // Buscar usuários
      const usersJSON = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      const users = usersJSON ? JSON.parse(usersJSON) : [];
      
      // Encontrar usuário com email e senha correspondentes
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        return { success: false, message: 'Email ou senha incorretos' };
      }
      
      // Armazenar usuário atual
      const userWithoutPassword = { ...user };
      delete userWithoutPassword.password; // Não armazenar senha no estado de autenticação
      
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      
      return { success: true, user: userWithoutPassword };
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return { success: false, message: 'Erro ao fazer login' };
    }
  },
  
  // Verificar se há usuário logado
  getCurrentUser: async () => {
    try {
      const userJSON = await AsyncStorage.getItem(CURRENT_USER_KEY);
      return userJSON ? JSON.parse(userJSON) : null;
    } catch (error) {
      console.error('Erro ao buscar usuário atual:', error);
      return null;
    }
  },
  
  // Logout
  logout: async () => {
    try {
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
      return { success: true };
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      return { success: false, message: 'Erro ao fazer logout' };
    }
  }
};
