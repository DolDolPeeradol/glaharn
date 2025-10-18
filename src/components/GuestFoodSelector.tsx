"use client";

import { Item, Person } from "@/types";

interface GuestFoodSelectorProps {
  partyId: string;
  person: Person;
  allItems: Item[];
  onToggleItem: (itemId: string, isExcluded: boolean) => Promise<void>;
}

export default function GuestFoodSelector({
  partyId,
  person,
  allItems,
  onToggleItem,
}: GuestFoodSelectorProps) {
  const excludedItems = person.excludedItems || [];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">เลือกอาหารที่คุณกิน</h3>
        <span className="text-sm text-gray-500">
          {allItems.length - excludedItems.length}/{allItems.length} รายการ
        </span>
      </div>

      {allItems.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          ยังไม่มีรายการอาหาร
        </div>
      ) : (
        <div className="space-y-2">
          {allItems.map((item) => {
            const isExcluded = excludedItems.includes(item.id);
            const pricePerPerson = item.price / item.sharedBy.length;

            return (
              <label
                key={item.id}
                className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border-2 ${
                  isExcluded
                    ? "bg-gray-100 border-gray-300 opacity-60"
                    : "bg-emerald-50 border-emerald-200 hover:border-emerald-400"
                }`}
              >
                <input
                  type="checkbox"
                  checked={!isExcluded}
                  onChange={(e) => onToggleItem(item.id, !e.target.checked)}
                  className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`font-semibold ${isExcluded ? "text-gray-500 line-through" : "text-gray-800"}`}>
                      {item.name}
                    </span>
                    <span className={`font-bold ${isExcluded ? "text-gray-400" : "text-emerald-600"}`}>
                      {isExcluded ? "ไม่ได้กิน" : `${pricePerPerson.toFixed(2)} ฿`}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    ราคารวม {item.price} ฿ · แชร์โดย {item.sharedBy.length} คน
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      )}

      <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
        <p className="text-sm text-blue-800">
          💡 <strong>วิธีใช้:</strong> ติ๊กถูกเฉพาะอาหารที่คุณกิน ระบบจะคำนวณค่าใช้จ่ายอัตโนมัติ
        </p>
      </div>
    </div>
  );
}
