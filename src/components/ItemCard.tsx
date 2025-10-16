"use client";

import { Item, Person } from "@/types";
import { useState } from "react";

interface ItemCardProps {
  item: Item;
  people: Person[];
  onEdit: (id: string, updates: Partial<Item>) => void;
  onDelete: (id: string) => void;
}

export default function ItemCard({ item, people, onEdit, onDelete }: ItemCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [editPrice, setEditPrice] = useState(item.price.toString());
  const [editPaidBy, setEditPaidBy] = useState(item.paidBy);
  const [editSharedBy, setEditSharedBy] = useState<string[]>(item.sharedBy);

  const payer = people.find((p) => p.id === item.paidBy);
  const sharers = people.filter((p) => item.sharedBy.includes(p.id));
  const pricePerPerson = item.price / item.sharedBy.length;

  const toggleEditShare = (personId: string) => {
    if (editSharedBy.includes(personId)) {
      setEditSharedBy(editSharedBy.filter((id) => id !== personId));
    } else {
      setEditSharedBy([...editSharedBy, personId]);
    }
  };

  const handleSave = () => {
    const price = parseFloat(editPrice);
    if (editName.trim() && price > 0 && editPaidBy && editSharedBy.length > 0) {
      onEdit(item.id, {
        name: editName.trim(),
        price: price,
        paidBy: editPaidBy,
        sharedBy: editSharedBy,
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditName(item.name);
    setEditPrice(item.price.toString());
    setEditPaidBy(item.paidBy);
    setEditSharedBy(item.sharedBy);
    setIsEditing(false);
  };

  return (
    <div className="group bg-white p-5 rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-200">
      {isEditing ? (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="ชื่อรายการ"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
            />
            <input
              type="number"
              value={editPrice}
              onChange={(e) => setEditPrice(e.target.value)}
              placeholder="ราคา"
              className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              ใครเป็นคนจ่าย?
            </label>
            <select
              value={editPaidBy}
              onChange={(e) => setEditPaidBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900 text-sm"
            >
              {people.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-gray-700">
                ใครกินบ้าง?
              </label>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setEditSharedBy(people.map(p => p.id))}
                  className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors font-medium"
                >
                  ทั้งหมด
                </button>
                <button
                  type="button"
                  onClick={() => setEditSharedBy([])}
                  className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors font-medium"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto custom-scrollbar">
              {people.map((person) => (
                <label
                  key={person.id}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-indigo-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={editSharedBy.includes(person.id)}
                    onChange={() => toggleEditShare(person.id)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                      {person.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{person.name}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2 border-t border-gray-200">
            <button
              onClick={handleSave}
              disabled={!editName.trim() || !editPrice || parseFloat(editPrice) <= 0 || !editPaidBy || editSharedBy.length === 0}
              className="flex-1 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              บันทึก
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 py-2 text-sm bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-bold text-xl text-gray-900">{item.name}</h3>
              <span className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-full text-sm shadow-md">
                {item.price.toFixed(2)} ฿
              </span>
            </div>
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-600">
                  จ่ายโดย: <span className="font-semibold text-gray-900">{payer?.name}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                <span className="text-gray-600">
                  กินโดย: <span className="font-semibold text-gray-900">{sharers.map((s) => s.name).join(", ")}</span>
                </span>
              </div>
              <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-lg inline-flex mt-2">
                <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm4-4a1 1 0 100 2h.01a1 1 0 100-2H13zM9 9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM7 8a1 1 0 000 2h.01a1 1 0 000-2H7z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold text-indigo-700">
                  {pricePerPerson.toFixed(2)} ฿/คน
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
              title="แก้ไข"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
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
