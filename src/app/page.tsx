"use client";

import { useState } from "react";
import { Person, Item, PersonSummary } from "@/types";
import Modal from "@/components/Modal";
import PeopleChips from "@/components/PeopleChips";
import CompactItemRow from "@/components/CompactItemRow";
import QuickSummary from "@/components/QuickSummary";
import PersonDetailModal from "@/components/PersonDetailModal";

export default function Home() {
  const [people, setPeople] = useState<Person[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [isPersonModalOpen, setIsPersonModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isPersonDetailOpen, setIsPersonDetailOpen] = useState(false);
  const [personName, setPersonName] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [selectedPayer, setSelectedPayer] = useState("");
  const [selectedShares, setSelectedShares] = useState<string[]>([]);

  const handleAddPerson = () => {
    if (personName.trim()) {
      setPeople([...people, { id: Date.now().toString(), name: personName.trim() }]);
      setPersonName("");
      setIsPersonModalOpen(false);
    }
  };

  const handleEditPerson = (id: string, newName: string) => {
    setPeople(people.map((p) => (p.id === id ? { ...p, name: newName } : p)));
  };

  const handleDeletePerson = (id: string) => {
    setPeople(people.filter((p) => p.id !== id));
    setItems(
      items
        .filter((item) => item.paidBy !== id)
        .map((item) => ({ ...item, sharedBy: item.sharedBy.filter((personId) => personId !== id) }))
        .filter((item) => item.sharedBy.length > 0)
    );
  };

  const handleAddItem = () => {
    if (itemName.trim() && itemPrice && parseFloat(itemPrice) > 0 && selectedPayer && selectedShares.length > 0) {
      setItems([...items, {
        id: Date.now().toString(),
        name: itemName.trim(),
        price: parseFloat(itemPrice),
        paidBy: selectedPayer,
        sharedBy: selectedShares,
      }]);
      setItemName("");
      setItemPrice("");
      setSelectedPayer("");
      setSelectedShares([]);
      setIsItemModalOpen(false);
    }
  };

  const handleEditItem = (id: string, updates: Partial<Item>) => {
    setItems(items.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const toggleShare = (personId: string) => {
    setSelectedShares(
      selectedShares.includes(personId)
        ? selectedShares.filter((id) => id !== personId)
        : [...selectedShares, personId]
    );
  };

  const calculateSummary = (): Record<string, PersonSummary> => {
    const summary: Record<string, PersonSummary> = {};
    people.forEach((person) => {
      summary[person.id] = { name: person.name, paid: 0, owes: 0, items: [], balance: 0 };
    });
    items.forEach((item) => {
      const pricePerPerson = item.price / item.sharedBy.length;
      if (summary[item.paidBy]) summary[item.paidBy].paid += item.price;
      item.sharedBy.forEach((personId) => {
        if (summary[personId]) {
          summary[personId].owes += pricePerPerson;
          summary[personId].items.push(`${item.name} (${pricePerPerson.toFixed(2)} ฿)`);
        }
      });
    });
    Object.keys(summary).forEach((personId) => {
      summary[personId].balance = summary[personId].paid - summary[personId].owes;
    });
    return summary;
  };

  const summary = calculateSummary();

  const calculatePayments = () => {
    const payments: { from: string; to: string; amount: number }[] = [];
    const balances: { [personId: string]: number } = {};
    Object.keys(summary).forEach((personId) => { balances[personId] = summary[personId].balance; });
    const creditors = Object.entries(balances).filter(([_, balance]) => balance > 0).map(([id, balance]) => ({ id, balance }));
    const debtors = Object.entries(balances).filter(([_, balance]) => balance < 0).map(([id, balance]) => ({ id, balance: Math.abs(balance) }));
    creditors.forEach((creditor) => {
      debtors.forEach((debtor) => {
        if (creditor.balance > 0 && debtor.balance > 0) {
          const amount = Math.min(creditor.balance, debtor.balance);
          payments.push({ from: debtor.id, to: creditor.id, amount });
          creditor.balance -= amount;
          debtor.balance -= amount;
        }
      });
    });
    return payments;
  };

  const payments = calculatePayments();
  const totalSpent = Object.values(summary).reduce((sum, s) => sum + s.owes, 0);

  const handleViewPersonDetail = (person: Person) => {
    setSelectedPerson(person);
    setIsPersonDetailOpen(true);
  };

  const getPersonPayments = (personId: string) => {
    return {
      paymentsToMake: payments.filter((p) => p.from === personId),
      paymentsToReceive: payments.filter((p) => p.to === personId),
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Beautiful Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAtMjBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6TTE2IDM0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wLTIwYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
        <div className="max-w-7xl mx-auto px-6 py-12 relative">
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-black text-white mb-3 drop-shadow-lg">
              💰 แบ่งบิลปาร์ตี้
            </h1>
            <p className="text-emerald-50 text-lg md:text-xl font-medium">
              แบ่งค่าใช้จ่ายแบบยุติธรรม ง่าย รวดเร็ว ชัดเจน
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/30">
              <div className="text-3xl font-bold text-white">{people.length}</div>
              <div className="text-sm text-emerald-50 mt-1">คน</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/30">
              <div className="text-3xl font-bold text-white">{items.length}</div>
              <div className="text-sm text-emerald-50 mt-1">รายการ</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/30">
              <div className="text-3xl font-bold text-white">{totalSpent.toFixed(0)}</div>
              <div className="text-sm text-emerald-50 mt-1">บาท</div>
            </div>
          </div>
        </div>
      </div>

      {/* People Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-6 border-2 border-emerald-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span className="text-3xl">👥</span>
              สมาชิก
            </h2>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
              {people.length} คน
            </span>
          </div>
          <PeopleChips
            people={people}
            onEdit={handleEditPerson}
            onDelete={handleDeletePerson}
            onAdd={() => setIsPersonModalOpen(true)}
            onViewDetail={handleViewPersonDetail}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-teal-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="text-3xl">🍽️</span>
                    รายการอาหาร
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">{items.length} รายการทั้งหมด</p>
                </div>
                <button
                  onClick={() => setIsItemModalOpen(true)}
                  disabled={people.length === 0}
                  className="px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-2xl hover:from-teal-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm flex items-center gap-2"
                >
                  <span className="text-xl">+</span>
                  เพิ่มรายการ
                </button>
              </div>

              {people.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-7xl mb-4">👆</div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">เพิ่มสมาชิกก่อนนะ</h3>
                  <p className="text-gray-500">กดปุ่ม "เพิ่มคน" ด้านบนเพื่อเริ่มต้น</p>
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-7xl mb-4">🍴</div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">ยังไม่มีรายการอาหาร</h3>
                  <p className="text-gray-500 mb-4">เริ่มเพิ่มเมนูที่สั่งกันได้เลย!</p>
                  <button
                    onClick={() => setIsItemModalOpen(true)}
                    className="px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-2xl hover:from-teal-600 hover:to-emerald-700 transition-all shadow-lg font-semibold"
                  >
                    เพิ่มรายการแรก
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <CompactItemRow
                      key={item.id}
                      item={item}
                      people={people}
                      onEdit={handleEditItem}
                      onDelete={handleDeleteItem}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <QuickSummary summary={summary} payments={payments} people={people} totalItems={items.length} />
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={isPersonModalOpen}
        onClose={() => { setIsPersonModalOpen(false); setPersonName(""); }}
        title="เพิ่มสมาชิกใหม่"
      >
        <div className="space-y-4">
          <input
            type="text"
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddPerson()}
            placeholder="ชื่อ-นามสกุล"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 text-lg"
            autoFocus
          />
          <button
            onClick={handleAddPerson}
            disabled={!personName.trim()}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            เพิ่มเลย!
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isItemModalOpen}
        onClose={() => {
          setIsItemModalOpen(false);
          setItemName("");
          setItemPrice("");
          setSelectedPayer("");
          setSelectedShares([]);
        }}
        title="เพิ่มรายการอาหาร"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">ชื่อเมนู</label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="เช่น ส้มตำ, ข้าวผัด, น้ำ"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">ราคา</label>
            <div className="relative">
              <input
                type="number"
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">฿</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">ใครจ่าย?</label>
            <select
              value={selectedPayer}
              onChange={(e) => setSelectedPayer(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-gray-900"
            >
              <option value="">เลือกคนจ่าย</option>
              {people.map((person) => (
                <option key={person.id} value={person.id}>{person.name}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-bold text-gray-700">ใครกิน?</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedShares(people.map(p => p.id))}
                  className="text-xs px-3 py-1 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 font-semibold"
                >
                  ทั้งหมด
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedShares([])}
                  className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold"
                >
                  ล้าง
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto custom-scrollbar">
              {people.map((person) => (
                <label
                  key={person.id}
                  className="flex items-center gap-2 p-3 rounded-xl hover:bg-teal-50 cursor-pointer border-2 border-transparent hover:border-teal-200 transition-all"
                >
                  <input
                    type="checkbox"
                    checked={selectedShares.includes(person.id)}
                    onChange={() => toggleShare(person.id)}
                    className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <span className="font-medium text-gray-700 text-sm">{person.name}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handleAddItem}
            disabled={!itemName.trim() || !itemPrice || parseFloat(itemPrice) <= 0 || !selectedPayer || selectedShares.length === 0}
            className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl hover:from-teal-600 hover:to-emerald-700 transition-all font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            เพิ่มรายการ
          </button>
        </div>
      </Modal>

      {selectedPerson && (
        <PersonDetailModal
          person={selectedPerson}
          isOpen={isPersonDetailOpen}
          onClose={() => { setIsPersonDetailOpen(false); setSelectedPerson(null); }}
          summary={summary[selectedPerson.id]}
          allItems={items}
          allPeople={people}
          paymentsToMake={getPersonPayments(selectedPerson.id).paymentsToMake}
          paymentsToReceive={getPersonPayments(selectedPerson.id).paymentsToReceive}
        />
      )}
    </div>
  );
}
