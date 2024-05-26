import React, { useState } from "react";
import html2canvas from "html2canvas";
import "./index.css"; // Importando o CSS com a configuração do fundo
import { FaHeart, FaShareAlt } from "react-icons/fa";

function App() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [noButtonPosition, setNoButtonPosition] = useState(null);
  const [rejectionCount, setRejectionCount] = useState(100);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [showAcceptanceModal, setShowAcceptanceModal] = useState(false);
  const [acceptanceDate, setAcceptanceDate] = useState(null);
  const [yourPhoto, setYourPhoto] = useState("/anonimo.webp");
  const [partnerPhoto, setPartnerPhoto] = useState("/anonimo.webp");

  const messages = ["Aceita namorar comigo?"];

  const handleNoClick = () => {
    const randomTop = Math.floor(Math.random() * (window.innerHeight - 50));
    const randomLeft = Math.floor(Math.random() * (window.innerWidth - 100));

    setNoButtonPosition({ top: randomTop, left: randomLeft });

    setRejectionCount(rejectionCount - 1);

    if (rejectionCount - 1 === 0) {
      setShowRejectionModal(true);
    }
  };

  const handleYesClick = () => {
    setAcceptanceDate(new Date());
    setShowAcceptanceModal(true);
  };

  const closeRejectionModal = () => {
    setShowRejectionModal(false);
    setRejectionCount(100);
  };

  const closeAcceptanceModal = () => {
    setShowAcceptanceModal(false);
  };

  const handlePhotoUpload = (event, setPhoto) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const shareResult = async () => {
    const canvas = await html2canvas(document.body);
    canvas.toBlob((blob) => {
      const file = new File([blob], "result.png", {
        type: "image/png",
      });

      if (navigator.share) {
        navigator
          .share({
            files: [file],
            title: "Desafio de Namoro",
            text: "Aceitei um pedido de namoro! Agora estamos oficialmente namorando!",
          })
          .then(() => console.log("Compartilhado com sucesso!"))
          .catch((error) => console.error("Erro ao compartilhar:", error));
      } else {
        // Fallback para navegadores que não suportam navigator.share
        alert("Desculpe, o compartilhamento não é suportado neste navegador.");
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen relative bg-cover bg-center">
      <h1 className="text-2xl text-white text-center p-1 font-bold mb-4">
        {messages[messageIndex]}
      </h1>
      <div className="flex space-x-4">
        <button
          onClick={handleYesClick}
          className="bg-pink-500 text-white px-6 py-2 m-2 rounded hover:bg-pink-600"
        >
          Sim
        </button>
        <button
          onClick={handleNoClick}
          className={`bg-pink-500 text-white px-6 py-2 m-2 rounded hover:bg-pink-600 ${
            noButtonPosition ? "absolute" : ""
          }`}
          style={
            noButtonPosition
              ? {
                  top: `${noButtonPosition.top}px`,
                  left: `${noButtonPosition.left}px`,
                }
              : {}
          }
        >
          Não
        </button>
      </div>
      {showRejectionModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">
              Você foi rejeitado 100 vezes! Não desanime, alguém especial está
              por aí esperando por você, mas esse alguém não sou eu.
            </h3>
            <button
              onClick={shareResult}
              className=" text-pink-500 px-6 py-2 rounded hover:bg-pink-600 hover:text-white"
            >
              <FaShareAlt />
            </button>
          </div>
        </div>
      )}
      {showAcceptanceModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg  flex justify-center items-center flex-col">
            <h2 className="text-2xl font-bold mb-4">
              Agora estamos oficialmente namorando!
            </h2>
            <p className="text-xl mb-4">
              Data de aceitação: {acceptanceDate?.toLocaleDateString()}{" "}
              {acceptanceDate?.toLocaleTimeString()}
            </p>
            <div className="flex items-center mb-4">
              <div className="relative w-24 h-24 mr-4 border rounded-full overflow-hidden cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => handlePhotoUpload(e, setYourPhoto)}
                />
                {yourPhoto ? (
                  <img
                    src={yourPhoto}
                    alt="Sua Foto"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-center w-full h-full flex items-center justify-center">
                    Sua Foto
                  </span>
                )}
              </div>
              <span className="text-2xl mx-4 text-red-700">
                <FaHeart />
              </span>
              <div className="relative w-24 h-24 ml-4 border rounded-full overflow-hidden cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => handlePhotoUpload(e, setPartnerPhoto)}
                />
                {partnerPhoto ? (
                  <img
                    src={partnerPhoto}
                    alt="Foto do Parceiro"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-center  w-full h-full flex items-center justify-center">
                    Foto do Parceiro
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={shareResult}
              className=" text-pink-500 px-6 py-2 rounded hover:bg-pink-600 hover:text-white"
            >
              <FaShareAlt />
            </button>
          </div>
        </div>
      )}
      <div className="fixed top-0 right-0 m-4 p-2 text-white rounded-full">
        Rejeições:{rejectionCount}
      </div>
    </div>
  );
}

export default App;
