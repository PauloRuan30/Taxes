  import { useState } from 'react';
  import { Header } from './Auth_Header'; // Reutilizando o Header

  export default function ForgotPassword() {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch('http://localhost:8000/auth/forgot-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        if (response.ok) {
          alert("Link de recuperação enviado para o e-mail informado!");
        } else {
          const errorData = await response.json();
          alert(errorData.detail || "Erro ao enviar link de recuperação.");
        }
      } catch (error) {
        console.error("Erro:", error);
        alert("Ocorreu um erro. Tente novamente.");
      }
    };

    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="max-w-md w-full bg-white p-8 rounded shadow-md">
          <Header
            heading="Recuperar senha"
            paragraph="Lembrou sua senha?"
            linkName="Faça login"
            linkUrl="/login"
          />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-2 border rounded mt-1"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Enviar link de recuperação
            </button>
          </form>
        </div>
      </div>
    );
  }
