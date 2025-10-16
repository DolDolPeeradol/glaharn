"use client";

import { Person } from "@/types";
import { useState } from "react";

interface PeopleChipsProps {
  people: Person[];
  onEdit: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  onViewDetail: (person: Person) => void;
}

export default function PeopleChips({ people, onEdit, onDelete, onAdd, onViewDetail }: PeopleChipsProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleEdit = (person: Person) => {
    setEditingId(person.id);
    setEditName(person.name);
  };

  const handleSave = (id: string) => {
    if (editName.trim()) {
      onEdit(id, editName.trim());
      setEditingId(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditName("");
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {people.map((person) => (
        <div
          key={person.id}
          className="relative group"
          onMouseEnter={() => setHoveredId(person.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          {editingId === person.id ? (
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-full shadow-lg border-2 border-emerald-400">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave(person.id);
                  if (e.key === "Escape") handleCancel();
                }}
                className="w-24 px-2 py-1 text-sm border-none outline-none focus:ring-0 text-gray-900"
                autoFocus
              />
              <button
                onClick={() => handleSave(person.id)}
                className="p-1 text-green-600 hover:bg-green-50 rounded-full"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button
                onClick={handleCancel}
                className="p-1 text-red-600 hover:bg-red-50 rounded-full"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-emerald-300 cursor-pointer group"
              onClick={() => onViewDetail(person)}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:scale-110 transition-transform">
                {person.name.charAt(0).toUpperCase()}
              </div>
              <span className="font-semibold text-gray-800 text-sm">{person.name}</span>

              {hoveredId === person.id && (
                <div className="flex gap-1 ml-1 animate-fadeIn">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(person);
                    }}
                    className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
                    title="แก้ไข"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(person.id);
                    }}
                    className="p-1 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="ลบ"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 font-semibold text-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        เพิ่มคน
      </button>
    </div>
  );
}
