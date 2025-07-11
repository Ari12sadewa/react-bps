// src/components/confirmationMessage.jsx
import React from 'react';

export const ConfirmMessage = ({ visible, onConfirm, onCancel, message }) => {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 ">
            <div className="bg-white rounded-lg p-6 shadow-xl w-80 text-center z-50 ">
                <h2 className="text-lg font-semibold mb-4">Hapus Publikasi ?</h2>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex justify-center gap-4">
                    <button
                        className="bg-red-600 hover:bg-red-700 text-white cursor-pointer font-semibold py-2 px-4 rounded transition-colors"
                        onClick={onConfirm}
                    >
                        Hapus
                    </button>
                    <button
                        className="bg-gray-300 hover:bg-gray-400 cursor-pointer text-gray-800 font-semibold py-2 px-4 rounded transition-colors"
                        onClick={onCancel}
                    >
                        Batal
                    </button>
                </div>
            </div>
            <div
                className="fixed inset-0 bg-blue-200 opacity-70"
                onClick={onCancel}
            ></div>
        </div>
    );
};
