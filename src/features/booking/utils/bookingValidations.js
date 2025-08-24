import * as yup from 'yup';

export const validations = {
  dni: {
    pattern: /^[0-9]{8}$/,
    message: 'DNI debe tener exactamente 8 dígitos'
  },
  
  phone: {
    pattern: /^9[0-9]{8}$/,
    message: 'Teléfono debe tener 9 dígitos y empezar con 9'
  },
  
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Formato de email inválido'
  },
  
  names: {
    pattern: /^[a-zA-ZáéíóúñÑ\s]+$/,
    message: 'Solo se permiten letras y espacios'
  }
};

export const patientIdentificationSchema = yup.object().shape({
  dni: yup.string()
    .matches(validations.dni.pattern, validations.dni.message)
    .required('DNI es requerido')
});

export const patientRegistrationSchema = yup.object().shape({
  dni: yup.string()
    .matches(validations.dni.pattern, validations.dni.message)
    .required('DNI es requerido'),
  nombres: yup.string()
    .matches(validations.names.pattern, validations.names.message)
    .required('Nombres son requeridos'),
  apellidos: yup.string()
    .matches(validations.names.pattern, validations.names.message)
    .required('Apellidos son requeridos'),
  telefono: yup.string()
    .matches(validations.phone.pattern, validations.phone.message)
    .required('Teléfono es requerido'),
  email: yup.string()
    .matches(validations.email.pattern, validations.email.message)
    .required('Email es requerido'),
  fechaNacimiento: yup.date()
    .max(new Date(), 'Fecha de nacimiento no puede ser futura')
    .required('Fecha de nacimiento es requerida')
});

export const paymentCardSchema = yup.object().shape({
  cardNumber: yup.string()
    .matches(/^\d{16}$/, 'Número de tarjeta debe tener 16 dígitos')
    .required('Número de tarjeta es requerido'),
  cardName: yup.string()
    .matches(validations.names.pattern, 'Solo se permiten letras y espacios')
    .required('Nombre del titular es requerido'),
  expiryDate: yup.string()
    .matches(/^\d{2}\/\d{2}$/, 'Formato debe ser MM/YY')
    .required('Fecha de vencimiento es requerida'),
  cvv: yup.string()
    .matches(/^\d{3,4}$/, 'CVV debe tener 3 o 4 dígitos')
    .required('CVV es requerido')
});