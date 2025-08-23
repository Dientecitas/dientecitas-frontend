import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { loginSchema } from '../../../shared/utils/validators';
import Button from '../../../shared/components/ui/Button';
import Input from '../../../shared/components/ui/Input';

const LoginForm = () => {
  const { login, isLoading, error } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    await login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Email"
        type="email"
        name="email"
        register={register}
        error={errors.email?.message}
        placeholder="tu@email.com"
      />

      <Input
        label="Contraseña"
        type="password"
        name="password"
        register={register}
        error={errors.password?.message}
        placeholder="••••••••"
      />

      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        loading={isLoading}
        disabled={isLoading}
      >
        {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </Button>
    </form>
  );
};

export default LoginForm;