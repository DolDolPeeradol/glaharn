"use client";

import { Person, PersonSummary, Item, Payment } from "@/types";
import Modal from "./Modal";

interface PersonDetailModalProps {
  person: Person | null;
  isOpen: boolean;
  onClose: () => void;
  summary: PersonSummary;
  allItems: Item[];
  allPeople: Person[];
  paymentsToMake: Payment[];
  paymentsToReceive: Payment[];
}

export default function PersonDetailModal({
  person,
  isOpen,
  onClose,
  summary,
  allItems,
  allPeople,
  paymentsToMake,
  paymentsToReceive,
}: PersonDetailModalProps) {
  if (!person) return null;

  const itemsPaid = allItems.filter((item) => item.paidBy === person.id);
  const itemsConsumed = allItems.filter((item) =>
    item.sharedBy.includes(person.id)
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center pb-6 border-b border-gray-200">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-4xl mx-auto mb-4 shadow-2xl ring-4 ring-teal-100">
            {person.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{person.name}</h2>
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-gray-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              <span>{summary.items.length} รายการ</span>
            </div>
          </div>
        </div>

        {/* Balance Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-2xl border border-green-200">
            <p className="text-xs font-semibold text-green-700 mb-1">จ่ายไป</p>
            <p className="text-2xl font-bold text-green-700">{summary.paid.toFixed(2)} ฿</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-2xl border border-orange-200">
            <p className="text-xs font-semibold text-orange-700 mb-1">ค่าอาหาร</p>
            <p className="text-2xl font-bold text-orange-700">{summary.owes.toFixed(2)} ฿</p>
          </div>

          <div className={`bg-gradient-to-br p-4 rounded-2xl border ${
            summary.balance >= 0
              ? 'from-cyan-50 to-teal-50 border-cyan-200'
              : 'from-red-50 to-pink-50 border-red-200'
          }`}>
            <p className={`text-xs font-semibold mb-1 ${
              summary.balance >= 0 ? 'text-cyan-700' : 'text-red-700'
            }`}>
              {summary.balance >= 0 ? 'ได้คืน' : 'ต้องจ่าย'}
            </p>
            <p className={`text-2xl font-bold ${
              summary.balance >= 0 ? 'text-cyan-700' : 'text-red-700'
            }`}>
              {Math.abs(summary.balance).toFixed(2)} ฿
            </p>
          </div>
        </div>

        {/* Items Paid */}
        {itemsPaid.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
              รายการที่จ่าย ({itemsPaid.length})
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
              {itemsPaid.map((item) => {
                const sharers = allPeople.filter((p) => item.sharedBy.includes(p.id));
                return (
                  <div key={item.id} className="bg-green-50 p-3 rounded-xl border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">{item.name}</span>
                      <span className="font-bold text-green-700">{item.price.toFixed(2)} ฿</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                      <span>แบ่งกับ: {sharers.map(s => s.name).join(", ")}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Items Consumed */}
        {itemsConsumed.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
                <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
              </svg>
              รายการที่กิน ({itemsConsumed.length})
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
              {itemsConsumed.map((item) => {
                const payer = allPeople.find((p) => p.id === item.paidBy);
                const pricePerPerson = item.price / item.sharedBy.length;
                return (
                  <div key={item.id} className="bg-orange-50 p-3 rounded-xl border border-orange-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">{item.name}</span>
                      <span className="font-bold text-orange-700">{pricePerPerson.toFixed(2)} ฿</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      <span>{payer?.name} จ่าย • แบ่ง {item.sharedBy.length} คน</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Payments to Make */}
        {paymentsToMake.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
              </svg>
              ต้องจ่าย ({paymentsToMake.length})
            </h3>
            <div className="space-y-2">
              {paymentsToMake.map((payment, idx) => {
                const toPerson = allPeople.find((p) => p.id === payment.to);
                return (
                  <div key={idx} className="bg-red-50 p-4 rounded-xl border-l-4 border-red-500 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold shadow">
                        {toPerson?.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">โอนให้</p>
                        <p className="font-bold text-gray-900">{toPerson?.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-red-600">{payment.amount.toFixed(2)} ฿</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Payments to Receive */}
        {paymentsToReceive.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
              ได้รับ ({paymentsToReceive.length})
            </h3>
            <div className="space-y-2">
              {paymentsToReceive.map((payment, idx) => {
                const fromPerson = allPeople.find((p) => p.id === payment.from);
                return (
                  <div key={idx} className="bg-cyan-50 p-4 rounded-xl border-l-4 border-cyan-500 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold shadow">
                        {fromPerson?.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">รับจาก</p>
                        <p className="font-bold text-gray-900">{fromPerson?.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-cyan-600">{payment.amount.toFixed(2)} ฿</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {itemsPaid.length === 0 && itemsConsumed.length === 0 && (
          <div className="text-center py-8">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-500">ยังไม่มีรายการ</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
