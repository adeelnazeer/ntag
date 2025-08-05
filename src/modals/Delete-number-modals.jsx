import React from 'react';
import { IoMdCloseCircle } from "react-icons/io";

const DeleteConfirmationModal = ({ isOpen, onClose, onDelete, selectedNumber, processingAction }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 p-2 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6">
        <div
          className="absolute right-4 top-4 cursor-pointer text-xl text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <IoMdCloseCircle />
        </div>

        <div className="mt-4">
          <h5 className="font-bold text-gray-900 text-lg">
            Confirm Deletion?
          </h5>
        </div>

        <div className="mt-3">
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm text-gray-700">
              Are you sure you want to delete the mobile number +{selectedNumber?.msisdn}?
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <button
            className="flex-1 py-2.5 bg-gray-300 text-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onClose}
            disabled={processingAction}
          >
            Cancel
          </button>
          <button
            className="flex-1 py-2.5 bg-red-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onDelete}
            disabled={processingAction}
          >
            {processingAction ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;