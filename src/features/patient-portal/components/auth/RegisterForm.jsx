import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { UserPlus } from 'lucide-react';
import Input from '../../../../shared/components/ui/Input';
import LoadingButton from '../../../../shared/components/ui/LoadingButton';

const registerSchema = yup.object().shape({
  nombre: yup.string().required('Nombre requerido'),
  apellido: yup.string().required('Apellido requerido'),
  email: yup.string().email('Email inválido').required('Email requerido'),
  documento: yup.string()
    .matches(/^[0-9]{8}$/, 'Documento debe tener 8 dígitos')
    .required('Documento requerido'),
  telefono: yup.string()
    .matches(/^9[0-9]{8}$/, 'Teléfono debe tener 9 dígitos y empezar con 9')
    .required('Teléfono requerido'),
  fechaNacimiento: yup.date()
    .max(new Date(), 'Fecha no puede ser futura')
    .required('Fecha de nacimiento requerida'),
  password: yup.string()
    .min(6, 'Mínimo 6 caracteres')
    .required('Contraseña requerida'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Confirmar contraseña requerida')
});

const RegisterForm = ({ onSubmit, isLoading, error }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(registerSchema)
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Nombre"
          name="nombre"
          register={register}
          error={errors.nombre?.message}
          placeholder="Juan Carlos"
        />

        <Input
          label="Apellido"
          name="apellido"
          register={register}
          error={errors.apellido?.message}
          placeholder="Pérez López"
        />

        <Input
          label="Email"
          name="email"
          type="email"
          register={register}
          error={errors.email?.message}
          placeholder="tu@email.com"
        />

        <Input
          label="Documento"
          name="documento"
          register={register}
          error={errors.documento?.message}
          placeholder="12345678"
          maxLength={8}
        />

        <Input
          label="Teléfono"
          name="telefono"
          register={register}
          error={errors.telefono?.message}
          placeholder="987654321"
          maxLength={9}
        />

        <Input
          label="Fecha de Nacimiento"
          name="fechaNacimiento"
          type="date"
          register={register}
          error={errors.fechaNacimiento?.message}
        />

        <Input
          label="Contraseña"
          name="password"
          type="password"
          register={register}
          error={errors.password?.message}
          placeholder="••••••••"
        />

        <Input
          label="Confirmar Contraseña"
          name="confirmPassword"
          type="password"
          register={register}
          error={errors.confirmPassword?.message}
          placeholder="••••••••"
        />
      </div>

      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      <LoadingButton
        type="submit"
        variant="primary"
        loading={isLoading}
        loadingText="Registrando..."
        className="w-full"
        icon={<UserPlus className="w-4 h-4" />}
      >
        Crear Cuenta
      </LoadingButton>

      <div className="text-center">
        <p className="text-xs text-gray-600">
          Al registrarte, aceptas nuestros{' '}
          <button
            type="button"
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Términos y Condiciones
          </button>
          {' '}y{' '}
          <button
            type="button"
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Política de Privacidad
          </button>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;