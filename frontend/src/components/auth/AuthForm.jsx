  import { useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { Header } from './Auth_Header'; // Import Header
  import FormExtra from '../FormExtra'; // Import FormExtra

  const formFields = {
    login: [
      { id: "email", label: "E-mail", type: "email", placeholder: "Digite seu e-mail", autoComplete: "email" },
      { id: "password", label: "Senha", type: "password", placeholder: "Digite sua senha", autoComplete: "current-password" }
    ],
    signup: [
      { id: "username", label: "Nome completo", type: "text", placeholder: "Escolha um nome de usuário", autoComplete: "username" },
      { id: "email", label: "E-mail", type: "email", placeholder: "Digite seu e-mail", autoComplete: "email" },
      { id: "password", label: "Senha", type: "password", placeholder: "Digite sua senha", autoComplete: "new-password" },
      { id: "confirmPassword", label: "Confirme sua senha", type: "password", placeholder: "Confirme sua senha", autoComplete: "new-password" }
    ]
  };

  export default function AuthForm({ formType }) {
    const fields = formFields[formType];
    const navigate = useNavigate();
    const [formState, setFormState] = useState(Object.fromEntries(fields.map((field) => [field.id, ''])));

    const handleChange = (e) => {
      setFormState({ ...formState, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const endpoint = formType === 'login' ? 'login' : 'signup';

      // Prepare the request payload
      const payload = formType === 'login'
        ? { email: formState.email, password: formState.password }
        : { username: formState.username, email: formState.email, password: formState.password };

      // Send the request to the backend
      const response = await fetch(`http://localhost:8000/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        if (formType === 'login') {
          localStorage.setItem('token', data.access_token);
          navigate('/');
        } else {
          alert('Usuário cadastrado com sucesso!');
          navigate('/');
        }
      } else {
        const errorData = await response.json();
        alert(errorData.detail || 'Erro ao realizar o login ou cadastro.');
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

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ id, label, type, placeholder }) => (
              <div key={id} className="flex flex-col">
                <label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</label>
                <input
                  id={id}
                  type={type}
                  placeholder={placeholder}
                  value={formState[id]}
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
