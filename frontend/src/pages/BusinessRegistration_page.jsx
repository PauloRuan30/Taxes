import React, { useState } from "react";
import axios from "axios";
import { Dialog } from "@headlessui/react";


const API_BASE_URL = "http://localhost:8000/business/";

const BusinessRegistration = ({ onClose, fetchBusinesses }) => {
  const [form, setForm] = useState({ cnpj: "", razao_social: "", porte_empresa: "", inscricao_municipal: "", inscricao_estadual: "" });

  const handleCreateBusiness = async () => {
    try {
      await axios.post(API_BASE_URL, form);
      alert("Empresa cadastrada com sucesso!");
      fetchBusinesses();
      onClose();
    } catch (error) {
      console.error("Erro ao cadastrar empresa:", error);
      alert("Falha ao cadastrar empresa");
    }
  };

  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Cadastrar Empresa</h2>
        <input
          type="text"
          placeholder="CNPJ"
          name="cnpj"
          value={form.cnpj}
          onChange={(e) => setForm({ ...form, cnpj: e.target.value })}
          className="w-full mb-2   p-2 border rounded-md"
        />
        <input
          type="text"
          placeholder="Razão Social"
          name="razao_social"
          value={form.razao_social}
          onChange={(e) => setForm({ ...form, razao_social: e.target.value })}
          className="w-full mb-2 p-2 border rounded-md"
        />
        <input
          type="text"
          placeholder="Inscrição Municipal"
          name="inscricao_municipal"
          value={form.inscricao_municipal}
          onChange={(e) => setForm({ ...form, inscricao_municipal: e.target.value })}
          className="w-full mb-2 p-2 border rounded-md"
        />
        <input
          type="text"
          placeholder="Inscrição Estadual"
          name="inscricao_estadual"
          value={form.inscricao_estadual}
          onChange={(e) => setForm({ ...form, inscricao_estadual: e.target.value })}
          className="w-full mb-2 p-2 border rounded-md"
        />
        <select
          name="porte_empresa"
          value={form.porte_empresa}
          onChange={(e) => setForm({ ...form, porte_empresa: e.target.value })}
          className="w-full mb-4 p-2 border rounded-md"
        >
          <option value="">Porte da Empresa</option>
          <option value="Pequeno Porte">Pequeno Porte</option>
          <option value="Médio Porte">Médio Porte</option>
          <option value="Grande Porte">Grande Porte</option>
        </select>

        <div className="flex justify-between">
          <button
            onClick={handleCreateBusiness}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Salvar
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Cancelar
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default BusinessRegistration;
  