import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { FaTimes } from 'react-icons/fa'; // Ícone de 'X' do react-icons

const HelpButton = ({ bgColor = 'bg-blue-500', hoverColor = 'hover:bg-blue-700', textColor = 'text-white' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [readmeContent, setReadmeContent] = useState('');

  const handleHelpClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (isModalOpen) {
      // Carrega o conteúdo do README.md através do symlink no public
      fetch('/README.md')
        .then((response) => response.text())
        .then((text) => setReadmeContent(text))
        .catch((error) => console.error('Erro ao carregar o README:', error));
    }
  }, [isModalOpen]);

  return (
    <>
      <button
        onClick={handleHelpClick}
        className={`fixed top-4 right-4 ${bgColor} ${hoverColor} ${textColor} font-bold py-2 px-4 rounded-full shadow-lg`}
      >
        Precisa de Ajuda?
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full h-3/4 relative overflow-auto">
            {/* Ícone de fechar 'X' */}
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-4 text-gray-600 hover:text-gray-800 text-2xl font-bold"
            >
              <FaTimes size={24} /> {/* Ícone de 'X' */}
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Tutorial de uso do Simulador</h2>
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  className="w-full h-96"
                  src="https://www.youtube.com/embed/XKi54-5rfkk"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-4">Modo de Uso - Sistema de Controle</h2>
            <div className="markdown-content">
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => (
                    <h1 className="text-3xl font-bold mb-4" {...props} />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 className="text-2xl font-semibold mb-3" {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="text-xl font-medium mb-2" {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p className="text-base mb-2" {...props} />
                  ),
                }}
              >
                {readmeContent}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HelpButton;
