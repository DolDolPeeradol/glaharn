"use client";

import { Person } from "@/types";
import { useState } from "react";

interface PersonCardProps {
  person: Person;
  onEdit: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
}

export default function PersonCard({ person, onEdit, onDelete }: PersonCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(person.name);

  const handleSave = () => {
    if (editName.trim()) {
      onEdit(person.id, editName.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditName(person.name);
    setIsEditing(false);
  };

  return (
    <div className="group relative bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-3 rounded-xl border border-indigo-200 hover:border-indigo-300 transition-all duration-200 hover:shadow-md">
      {isEditing ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") handleCancel();
            }}
            className="flex-1 px-3 py-1.5 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900"
            autoFocus
          />
          <button
            onClick={handleSave}
            className="p-1.5 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
            title="บันทึก"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
          <button
            onClick={handleCancel}
            className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
            title="ยกเลิก"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
              {person.name.charAt(0).toUpperCase()}
            </div>
            <span className="font-semibold text-gray-800">{person.name}</span>
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
              title="แก้ไข"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(person.id)}
              className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
              title="ลบ"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
