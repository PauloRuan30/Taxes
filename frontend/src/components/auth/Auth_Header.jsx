import React from 'react';
import { Link } from 'react-router-dom';

export function Header({ heading, paragraph, linkName, linkUrl }) {
  return (
    <div className="text-center mb-6">
      {/* ✅ Logo da empresa */}
      <img
        src="https://ik.imagekit.io/pibjyepn7p9/Lilac_Navy_Simple_Line_Business_Logo_CGktk8RHK.png"
        alt="Logo"
        className="h-16 w-16 mx-auto"
      />

      {/* ✅ Título */}
      <h1 className="text-3xl font-extrabold text-gray-900 mt-4">{heading}</h1>

      {/* ✅ Parágrafo com link */}
      <p className="text-sm text-gray-600 mt-2">
        {paragraph}{' '}
        <Link to={linkUrl} className="font-medium text-blue-500 hover:text-blue-400">
          {linkName}
        </Link>
      </p>
    </div>
  );
}
