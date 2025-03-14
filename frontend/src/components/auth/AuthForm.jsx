import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from './Auth_Header';
import FormExtra from '../FormExtra';

const formFields = {
  login: [
    {
      id: 'username',
      label: 'E-mail ou Usuário',
      type: 'text',
      placeholder: 'Digite seu e-mail ou usuário',
      autoComplete: 'username'
    },
    {
      id: 'password',
      label: 'Senha',
      type: 'password',
      placeholder: 'Digite sua senha',
      autoComplete: 'current-password'
    }
  ],
  signup: [
    {
      id: 'username',
      label: 'E-mail ou Usuário',
      type: 'text',
      placeholder: 'Digite seu e-mail ou usuário',
      autoComplete: 'username'
    },
    {
      id: 'password',
      label: 'Senha',
      type: 'password',
      placeholder: 'Digite sua senha',
      autoComplete: 'new-password'
    },
    {
      id: 'confirmPassword',
      label: 'Confirme sua senha',
      type: 'password',
      placeholder: 'Confirme sua senha',
      autoComplete: 'new-password'
    }
  ]
};

export default function AuthForm({ formType }) {
  const fields = formFields[formType];
  const navigate = useNavigate();
  const [formState, setFormState] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  // Re-initialize formState whenever fields change
  useEffect(() => {
    const initialState = Object.fromEntries(fields.map((field) => [field.id, '']));
    setFormState(initialState);
    setErrorMessage('');
  }, [fields]);

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;
      
      if (formType === 'login') {
        // For login, send JSON data that matches UserLogin model
        const loginPayload = {
          username: formState.username,
          password: formState.password
        };

        response = await fetch('http://localhost:8000/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(loginPayload)
        });
      } else {
        // For signup, we need to include confirm_password field
        if (formState.password !== formState.confirmPassword) {
          setErrorMessage('Passwords do not match');
          return;
        }

        const signupPayload = {
          username: formState.username,
          password: formState.password,
          confirm_password: formState.confirmPassword
        };

        response = await fetch('http://localhost:8000/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(signupPayload)
        });
      }

      if (response.ok) {
        const data = await response.json();

        if (formType === 'login') {
          // Store token in localStorage
          localStorage.setItem('token', data.access_token);
          navigate('/');
        } else {
          alert('Usuário cadastrado com sucesso!');
          navigate('/login');
        }
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.detail || 'Erro ao realizar o login ou cadastro.');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Erro de conexão com o servidor.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <div className="max-w-md w-full bg-gray-50 p-8 rounded shadow-md">
        <Header
          heading={formType === 'login' ? 'Faça login na sua conta' : 'Crie uma nova conta'}
          paragraph={formType === 'login' ? 'Não tem uma conta? ' : 'Já tem uma conta? '}
          linkName={formType === 'login' ? 'Cadastre-se' : 'Faça login'}
          linkUrl={formType === 'login' ? '/signup' : '/login'}
        />

        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(({ id, label, type, placeholder }) => (
            <div key={id} className="flex flex-col">
              <label htmlFor={id} className="text-sm font-medium text-gray-700">
                {label}
              </label>
              <input
                id={id}
                type={type}
                placeholder={placeholder}
                value={formState[id] || ''}
                onChange={handleChange}
                className="p-2 border rounded mt-1"
                required
              />
            </div>
          ))}

          {formType === 'login' && <FormExtra />}

          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {formType === 'login' ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>
      </div>
    </div>
  );
}