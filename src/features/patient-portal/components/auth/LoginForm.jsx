import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { LogIn, Loader2 } from 'lucide-react';
import Input from '../../../../shared/components/ui/Input';
import LoadingButton from '../../../../shared/components/ui/LoadingButton';

const loginSchema = yup.object().shape({
  identifier: yup.string().required('Email o documento requerido'),
  password: yup.string().min(6, 'Mínimo 6 caracteres').required('Contraseña requerida')
});

const LoginForm = ({ onSubmit, isLoading, error }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(loginSchema)
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Email o Documento"
        name="identifier"
        register={register}
        error={errors.identifier?.message}
        placeholder="tu@email.com o 12345678"
      />

      <Input
        label="Contraseña"
        name="password"
        type="password"
        register={register}
        error={errors.password?.message}
        placeholder="••••••••"
      />

      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      <LoadingButton
        type="submit"
        variant="primary"
        loading={isLoading}
        loadingText="Iniciando sesión..."
        className="w-full"
        icon={<LogIn className="w-4 h-4" />}
      >
        Iniciar Sesión
      </LoadingButton>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          ¿Olvidaste tu contraseña?{' '}
          <button
            type="button"
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Recuperar
          </button>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;