// src/pages/Home_page.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { BuildingOfficeIcon, DocumentArrowUpIcon, ClipboardDocumentListIcon } from "@heroicons/react/24/outline";

const HomePage = () => {
  const currentDateTime = new Date();
  const formattedTime = currentDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = currentDateTime.toLocaleDateString([], { month: 'long', day: '2-digit' });
  
  return (
    <div className="flex flex-col items-center gap-8 p-4">
      <div className="flex flex-wrap gap-8 justify-center">
        {/* Render each card component for different features with routes */}
        <Link to="/BusinessManagement">
          <FeatureCard 
            title="Cadastrar Empresas" 
            description="Veja e Registre novas Empresas" 
            Icon={BuildingOfficeIcon} 
          />
        </Link>
        <Link to="/importArchives">
          <FeatureCard 
            title="Importar arquivos" 
            description="Importe seus arquivos" 
            Icon={DocumentArrowUpIcon} 
          />
        </Link>
        <Link to="/registered-companies">
          <FeatureCard 
            title="Empresas Cadastradas" 
            description="View all registered companies" 
            Icon={ClipboardDocumentListIcon} 
          />
        </Link>
      </div>
      {/* Render InfoBox components for recent activities */}
      <div className="flex flex-col gap-4 w-full max-w-xl">
        <InfoBox
          time={formattedTime}
          date={formattedDate}
          label="Arquivo acessado por ultimo"
          content="Content goes here. Keep it short and simple. And smile :)"
        />
        <InfoBox
          time={formattedTime}
          date={formattedDate}
          label="Empresa acessada por ultimo"
          content="Content goes here. Keep it short and simple. And smile :)"
        />
      </div>
    </div>
  );
};

// FeatureCard component with icon support
const FeatureCard = ({ title, description, Icon }) => (
  <div className="w-full max-w-xs md:w-80 lg:w-96 h-auto p-4 rounded-xl shadow-md flex flex-col transition-transform duration-300 hover:scale-105">
    <div className="grid grid-cols-3 gap-2 mb-4">
      <Square bg="bg-stone-300" />
      <Square bg="bg-stone-300/50" />
      <Square bg="bg-stone-300" />
      <Square bg="bg-stone-300/50" />
      <Square bg="bg-stone-300" />
      <Square bg="bg-stone-300/50" />
    </div>
    <div className="p-4 flex items-center gap-2">
      <Icon className="h-6 w-6 text-gray-600" />
      <h2 className="text-black text-lg font-medium">{title}</h2>
    </div>
    <p className="text-zinc-700 text-sm mt-1 px-4">{description}</p>
  </div>
);

// Reusable Square component for each box in the grid
const Square = ({ bg }) => <div className={`w-20 h-20 rounded ${bg}`} />;

// InfoBox component for displaying recent activity with time, date, and content
const InfoBox = ({ time, date, label, content }) => (
  <div className="w-full p-6 rounded-3xl shadow-md flex flex-col items-start gap-2">
    <div className="flex items-center gap-4">
      <div className="text-center">
        <p className="text-black text-sm font-semibold">{time}</p>
        <p className="text-stone-500 text-sm">{date}</p>
      </div>
      <div className="w-px h-10 bg-neutral-200 mx-4" />
      <div>
        <h3 className="text-black text-lg font-medium">{label}</h3>
        <p className="text-zinc-700 text-sm mt-1">{content}</p>
      </div>
    </div>
  </div>
);

export default HomePage;
