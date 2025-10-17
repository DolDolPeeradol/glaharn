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
    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
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
            <div className="relative group/chip">
              <div
                className="flex items-center gap-1.5 sm:gap-2 bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-md hover:shadow-xl transition-all duration-200 border-2 border-emerald-200 hover:border-emerald-400 cursor-pointer group relative overflow-hidden"
                onClick={() => onViewDetail(person)}
                title="คลิกเพื่อดูรายละเอียด"
              >
                {/* Hover effect background */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-teal-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>

                <div className="relative flex items-center gap-1.5 sm:gap-2 w-full">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-md group-hover:scale-110 transition-transform ring-2 ring-white">
                    {person.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-gray-800 text-xs sm:text-sm group-hover:text-emerald-700 transition-colors">{person.name}</span>

                  {/* Click indicator icon - always visible */}
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 group-hover:text-emerald-600 transition-colors ml-0.5 sm:ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>

                  {hoveredId === person.id && (
                    <div className="flex gap-1 ml-auto animate-fadeIn">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(person);
                        }}
                        className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded-full transition-colors bg-white shadow-sm"
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
                        className="p-1.5 text-red-600 hover:bg-red-100 rounded-full transition-colors bg-white shadow-sm"
                        title="ลบ"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Tooltip for first-time users */}
              {hoveredId !== person.id && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover/chip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-10">
                  คลิกเพื่อดูรายละเอียด
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      <button
        onClick={onAdd}
        className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 font-semibold text-xs sm:text-sm"
      >
        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        เพิ่มคน
      </button>
    </div>
  );
}
