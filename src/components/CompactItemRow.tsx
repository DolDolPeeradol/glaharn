"use client";

import { Item, Person } from "@/types";
import { useState } from "react";

interface CompactItemRowProps {
  item: Item;
  people: Person[];
  onEdit: (id: string, updates: Partial<Item>) => void;
  onDelete: (id: string) => void;
}

export default function CompactItemRow({ item, people, onEdit, onDelete }: CompactItemRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
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
      setIsExpanded(false);
    }
  };

  const handleCancel = () => {
    setEditName(item.name);
    setEditPrice(item.price.toString());
    setEditPaidBy(item.paidBy);
    setEditSharedBy(item.sharedBy);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm(`ลบรายการ "${item.name}" ใช่หรือไม่?`)) {
      onDelete(item.id);
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-md border border-emerald-200 mb-3">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">ชื่อรายการ</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">ราคา (บาท)</label>
              <input
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">ใครเป็นคนจ่าย?</label>
            <select
              value={editPaidBy}
              onChange={(e) => setEditPaidBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-gray-900 text-sm"
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
              <label className="block text-xs font-semibold text-gray-600">ใครกินบ้าง?</label>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setEditSharedBy(people.map(p => p.id))}
                  className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition-colors"
                >
                  ทั้งหมด
                </button>
                <button
                  type="button"
                  onClick={() => setEditSharedBy([])}
                  className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {people.map((person) => (
                <label
                  key={person.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-emerald-50 cursor-pointer transition-colors border border-gray-200"
                >
                  <input
                    type="checkbox"
                    checked={editSharedBy.includes(person.id)}
                    onChange={() => toggleEditShare(person.id)}
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <span className="text-sm font-medium text-gray-700">{person.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-3 border-t border-gray-200">
            <button
              onClick={handleSave}
              disabled={!editName.trim() || !editPrice || parseFloat(editPrice) <= 0 || !editPaidBy || editSharedBy.length === 0}
              className="flex-1 py-2 text-sm bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md"
            >
              บันทึก
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 mb-2 overflow-hidden">
      {/* Compact Row */}
      <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
              {item.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{item.name}</h3>
              <p className="text-xs text-gray-500">
                {payer?.name} จ่าย • {sharers.length} คน
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="font-bold text-lg text-emerald-600">{item.price.toFixed(2)} ฿</p>
            <p className="text-xs text-gray-500">{pricePerPerson.toFixed(2)} ฿/คน</p>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
              setIsExpanded(true);
            }}
            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            title="แก้ไข"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="ลบ"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-4 space-y-3 animate-slideDown">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">จ่ายโดย</p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  {payer?.name.charAt(0).toUpperCase()}
                </div>
                <p className="font-semibold text-gray-800">{payer?.name}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">ราคาต่อคน</p>
              <p className="font-bold text-lg text-emerald-600">{pricePerPerson.toFixed(2)} ฿</p>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-2">กินโดย ({sharers.length} คน)</p>
            <div className="flex flex-wrap gap-2">
              {sharers.map((sharer) => (
                <div key={sharer.id} className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm">
                  <div className="w-5 h-5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    {sharer.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{sharer.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
