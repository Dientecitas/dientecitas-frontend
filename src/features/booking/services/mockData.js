// Datos mock para el sistema de reservas
export const mockDistricts = [
  {
    id: '1',
    name: 'Centro',
    address: 'Av. Principal 123, Centro de Lima',
    phone: '555-0001',
    hours: 'Lun-Vie: 8:00-18:00, Sáb: 8:00-14:00',
    coordinates: { lat: -12.0464, lng: -77.0428 },
    available: true,
    image: 'https://images.pexels.com/photos/305568/pexels-photo-305568.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '2',
    name: 'San Isidro',
    address: 'Av. Javier Prado 456, San Isidro',
    phone: '555-0002',
    hours: 'Lun-Vie: 8:00-19:00, Sáb: 8:00-15:00',
    coordinates: { lat: -12.0931, lng: -77.0465 },
    available: true,
    image: 'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '3',
    name: 'Miraflores',
    address: 'Av. Larco 789, Miraflores',
    phone: '555-0003',
    hours: 'Lun-Vie: 8:00-20:00, Sáb: 8:00-16:00',
    coordinates: { lat: -12.1211, lng: -77.0269 },
    available: true,
    image: 'https://images.pexels.com/photos/668300/pexels-photo-668300.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

export const mockServices = [
  {
    id: '1',
    name: 'Limpieza Dental',
    category: 'Limpieza y Prevención',
    description: 'Limpieza profunda y pulido dental para mantener una sonrisa saludable',
    duration: 60,
    price: 80,
    image: 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true
  },
  {
    id: '2',
    name: 'Blanqueamiento Dental',
    category: 'Odontología Estética',
    description: 'Tratamiento profesional para blanquear y mejorar el color de tus dientes',
    duration: 90,
    price: 250,
    image: 'https://images.pexels.com/photos/6812540/pexels-photo-6812540.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true
  },
  {
    id: '3',
    name: 'Ortodoncia Consulta',
    category: 'Ortodoncia',
    description: 'Evaluación inicial para tratamiento de ortodoncia y alineación dental',
    duration: 45,
    price: 120,
    image: 'https://images.pexels.com/photos/6812589/pexels-photo-6812589.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true
  },
  {
    id: '4',
    name: 'Endodoncia',
    category: 'Endodoncia',
    description: 'Tratamiento de conducto radicular para salvar dientes dañados',
    duration: 120,
    price: 350,
    image: 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true
  },
  {
    id: '5',
    name: 'Extracción Simple',
    category: 'Cirugía Oral',
    description: 'Extracción de dientes con técnicas mínimamente invasivas',
    duration: 60,
    price: 150,
    image: 'https://images.pexels.com/photos/6812540/pexels-photo-6812540.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true
  },
  {
    id: '6',
    name: 'Control Pediátrico',
    category: 'Odontopediatría',
    description: 'Revisión dental especializada para niños y adolescentes',
    duration: 45,
    price: 90,
    image: 'https://images.pexels.com/photos/6812589/pexels-photo-6812589.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true
  }
];

export const mockDentists = [
  {
    id: '1',
    name: 'Dr. Carlos Rodríguez',
    specialty: 'Ortodoncia',
    experience: '8 años',
    rating: 4.8,
    image: 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=200'
  },
  {
    id: '2',
    name: 'Dra. Ana García',
    specialty: 'Endodoncia',
    experience: '12 años',
    rating: 4.9,
    image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=200'
  },
  {
    id: '3',
    name: 'Dr. Luis Martínez',
    specialty: 'Cirugía Oral',
    experience: '15 años',
    rating: 4.7,
    image: 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=200'
  }
];

export const mockPatients = [
  {
    id: '1',
    dni: '12345678',
    nombres: 'Juan Carlos',
    apellidos: 'Pérez López',
    telefono: '987654321',
    email: 'juan.perez@email.com',
    fechaNacimiento: '1990-05-15'
  },
  {
    id: '2',
    dni: '87654321',
    nombres: 'María Elena',
    apellidos: 'González Ruiz',
    telefono: '912345678',
    email: 'maria.gonzalez@email.com',
    fechaNacimiento: '1985-08-22'
  }
];

export const generateMockTimeSlots = (date, districtId) => {
  const slots = [];
  const startHour = 8;
  const endHour = 18;
  const interval = 30;
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const available = Math.random() > 0.3; // 70% de disponibilidad
      const dentistId = Math.floor(Math.random() * mockDentists.length);
      
      slots.push({
        id: `${date}-${hour}-${minute}-${districtId}`,
        time,
        date,
        districtId,
        available,
        dentist: available ? mockDentists[dentistId] : null,
        duration: interval,
        reserved: false,
        reservedUntil: null
      });
    }
  }
  
  return slots;
};