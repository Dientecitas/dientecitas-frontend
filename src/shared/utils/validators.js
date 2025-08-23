import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  email: yup.string().email('Email inválido').required('Email requerido'),
  password: yup.string().min(6, 'Mínimo 6 caracteres').required('Contraseña requerida')
});

export const registerSchema = yup.object().shape({
  nombre: yup.string().required('Nombre requerido'),
  apellido: yup.string().required('Apellido requerido'),
  email: yup.string().email('Email inválido').required('Email requerido'),
  password: yup.string().min(6, 'Mínimo 6 caracteres').required('Contraseña requerida'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
});

export const patientSchema = yup.object().shape({
  nombre: yup.string().required('Nombre requerido'),
  apellido: yup.string().required('Apellido requerido'),
  dni: yup.string().required('DNI requerido'),
  telefono: yup.string().required('Teléfono requerido'),
  email: yup.string().email('Email inválido').required('Email requerido'),
  fechaNacimiento: yup.date().required('Fecha de nacimiento requerida')
});

export const appointmentSchema = yup.object().shape({
  pacienteId: yup.string().required('Paciente requerido'),
  turnoId: yup.string().required('Turno requerido'),
  observaciones: yup.string()
});

export const paymentSchema = yup.object().shape({
  cardNumber: yup.string().matches(/^\d{16}$/, 'Número de tarjeta inválido').required('Número de tarjeta requerido'),
  cardName: yup.string().required('Nombre del titular requerido'),
  expiryDate: yup.string().matches(/^\d{2}\/\d{2}$/, 'Formato inválido (MM/YY)').required('Fecha de vencimiento requerida'),
  cvv: yup.string().matches(/^\d{3,4}$/, 'CVV inválido').required('CVV requerido')
});