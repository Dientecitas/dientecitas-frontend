// Mock data for patient authentication
const mockPatients = [
  {
    id: '1',
    email: 'juan.perez@email.com',
    documento: '12345678',
    password: 'password123',
    nombre: 'Juan Carlos',
    apellido: 'Pérez López',
    telefono: '987654321',
    fechaNacimiento: '1990-05-15',
    fechaRegistro: '2024-01-15'
  },
  {
    id: '2',
    email: 'maria.gonzalez@email.com',
    documento: '87654321',
    password: 'password123',
    nombre: 'María Elena',
    apellido: 'González Ruiz',
    telefono: '912345678',
    fechaNacimiento: '1985-08-22',
    fechaRegistro: '2024-02-10'
  }
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const patientAuthService = {
  login: async (credentials) => {
    await delay(1000);
    
    const { identifier, password } = credentials;
    
    // Find patient by email or documento
    const patient = mockPatients.find(p => 
      (p.email === identifier || p.documento === identifier) && p.password === password
    );
    
    if (patient) {
      const { password: _, ...patientData } = patient;
      return {
        success: true,
        data: {
          token: `token_${patient.id}_${Date.now()}`,
          user: patientData
        }
      };
    }
    
    return {
      success: false,
      error: 'Credenciales incorrectas'
    };
  },

  register: async (userData) => {
    await delay(1200);
    
    // Check if email or documento already exists
    const existingPatient = mockPatients.find(p => 
      p.email === userData.email || p.documento === userData.documento
    );
    
    if (existingPatient) {
      return {
        success: false,
        error: 'El email o documento ya está registrado'
      };
    }
    
    // Create new patient
    const newPatient = {
      id: Date.now().toString(),
      ...userData,
      fechaRegistro: new Date().toISOString().split('T')[0]
    };
    
    mockPatients.push(newPatient);
    
    const { password: _, ...patientData } = newPatient;
    
    return {
      success: true,
      data: {
        token: `token_${newPatient.id}_${Date.now()}`,
        user: patientData
      }
    };
  },

  getCurrentUser: async (token) => {
    await delay(500);
    
    // Extract user ID from token (mock implementation)
    const userId = token.split('_')[1];
    const patient = mockPatients.find(p => p.id === userId);
    
    if (patient) {
      const { password: _, ...patientData } = patient;
      return {
        success: true,
        data: patientData
      };
    }
    
    return {
      success: false,
      error: 'Token inválido'
    };
  },

  refreshToken: async (token) => {
    await delay(300);
    
    const userId = token.split('_')[1];
    const patient = mockPatients.find(p => p.id === userId);
    
    if (patient) {
      return {
        success: true,
        data: {
          token: `token_${patient.id}_${Date.now()}`
        }
      };
    }
    
    return {
      success: false,
      error: 'Token inválido'
    };
  }
};