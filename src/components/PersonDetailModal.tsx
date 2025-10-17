"use client";

import { useState } from "react";
import { Person, PersonSummary, Item, Payment, PaymentMethod } from "@/types";
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
  onUpdatePaymentMethod: (personId: string, paymentMethod: PaymentMethod) => void;
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
  onUpdatePaymentMethod,
}: PersonDetailModalProps) {
  const [isEditingPayment, setIsEditingPayment] = useState(false);
  const [promptpay, setPromptpay] = useState(person?.paymentMethod?.promptpay || "");
  const [bankName, setBankName] = useState(person?.paymentMethod?.bankAccount?.bankName || "");
  const [accountNumber, setAccountNumber] = useState(person?.paymentMethod?.bankAccount?.accountNumber || "");
  const [accountName, setAccountName] = useState(person?.paymentMethod?.bankAccount?.accountName || "");
  const [qrCodeImage, setQrCodeImage] = useState(person?.paymentMethod?.qrCodeImage || "");

  if (!person) return null;

  const handleSavePaymentMethod = () => {
    const paymentMethod: PaymentMethod = {};

    if (promptpay.trim()) {
      paymentMethod.promptpay = promptpay.trim();
    }

    if (bankName.trim() && accountNumber.trim()) {
      paymentMethod.bankAccount = {
        bankName: bankName.trim(),
        accountNumber: accountNumber.trim(),
        accountName: accountName.trim() || person.name,
      };
    }

    if (qrCodeImage.trim()) {
      paymentMethod.qrCodeImage = qrCodeImage.trim();
    }

    onUpdatePaymentMethod(person.id, paymentMethod);
    setIsEditingPayment(false);
  };

  const handleQrCodeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setQrCodeImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const itemsPaid = allItems.filter((item) => item.paidBy === person.id);
  const itemsConsumed = allItems.filter((item) =>
    item.sharedBy.includes(person.id)
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="full">
      <div className="space-y-6">
        {/* Compact Header - Responsive */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 pb-4 border-b-2 border-gray-200">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-lg ring-4 ring-teal-100 flex-shrink-0">
              {person.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{person.name}</h2>
              <p className="text-xs sm:text-sm text-gray-600 font-medium">{summary.items.length} รายการ</p>
            </div>
          </div>

          {/* Balance Summary - Responsive */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="text-center px-2 sm:px-4 py-2 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
              <p className="text-xs font-semibold text-green-700">จ่ายไป</p>
              <p className="text-base sm:text-lg font-bold text-green-700">{summary.paid.toFixed(0)} ฿</p>
            </div>

            <div className="text-center px-2 sm:px-4 py-2 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200">
              <p className="text-xs font-semibold text-orange-700">ค่าอาหาร</p>
              <p className="text-base sm:text-lg font-bold text-orange-700">{summary.owes.toFixed(0)} ฿</p>
            </div>

            <div className={`text-center px-2 sm:px-4 py-2 bg-gradient-to-br rounded-xl border-2 ${
              summary.balance >= 0
                ? 'from-cyan-50 to-teal-50 border-cyan-200'
                : 'from-red-50 to-pink-50 border-red-200'
            }`}>
              <p className={`text-xs font-semibold ${
                summary.balance >= 0 ? 'text-cyan-700' : 'text-red-700'
              }`}>
                {summary.balance >= 0 ? 'ได้คืน' : 'ต้องจ่าย'}
              </p>
              <p className={`text-base sm:text-lg font-bold ${
                summary.balance >= 0 ? 'text-cyan-700' : 'text-red-700'
              }`}>
                {Math.abs(summary.balance).toFixed(0)} ฿
              </p>
            </div>
          </div>
        </div>

        {/* 2 Column Layout - Responsive */}
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">

          {/* Left Column */}
          <div className="space-y-6">
            {/* Items Paid */}
            {itemsPaid.length > 0 && (
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
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
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
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
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Payments to Make */}
            {paymentsToMake.length > 0 && (
              <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
              </svg>
              ต้องจ่าย ({paymentsToMake.length})
            </h3>
            <div className="space-y-3">
              {paymentsToMake.map((payment, idx) => {
                const toPerson = allPeople.find((p) => p.id === payment.to);
                return (
                  <div key={idx} className="bg-red-50 p-4 rounded-xl border-2 border-red-200">
                    <div className="flex items-center justify-between mb-3">
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

                    {/* Payment Method Information */}
                    {toPerson?.paymentMethod && Object.keys(toPerson.paymentMethod).length > 0 && (
                      <div className="mt-3 pt-3 border-t-2 border-red-200 space-y-2">
                        <p className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          วิธีโอน:
                        </p>

                        {/* PromptPay */}
                        {toPerson.paymentMethod.promptpay && (
                          <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-emerald-200">
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                              </svg>
                              <div>
                                <p className="text-xs text-gray-600 font-semibold">พร้อมเพย์</p>
                                <p className="text-sm font-bold text-gray-900">{toPerson.paymentMethod.promptpay}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => navigator.clipboard.writeText(toPerson.paymentMethod?.promptpay || '')}
                              className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-xs font-semibold shadow-sm"
                            >
                              คัดลอก
                            </button>
                          </div>
                        )}

                        {/* Bank Account */}
                        {toPerson.paymentMethod.bankAccount && (
                          <div className="flex items-start justify-between bg-white p-3 rounded-lg border border-blue-200">
                            <div className="flex items-start gap-2">
                              <svg className="w-4 h-4 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                              </svg>
                              <div>
                                <p className="text-xs text-gray-600 font-semibold">บัญชีธนาคาร</p>
                                <p className="text-xs font-bold text-gray-900">{toPerson.paymentMethod.bankAccount.bankName}</p>
                                <p className="text-sm font-bold text-gray-900">{toPerson.paymentMethod.bankAccount.accountNumber}</p>
                                <p className="text-xs text-gray-600">{toPerson.paymentMethod.bankAccount.accountName}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => navigator.clipboard.writeText(toPerson.paymentMethod?.bankAccount?.accountNumber || '')}
                              className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs font-semibold shadow-sm"
                            >
                              คัดลอก
                            </button>
                          </div>
                        )}

                        {/* QR Code */}
                        {toPerson.paymentMethod.qrCodeImage && (
                          <div className="bg-white p-3 rounded-lg border border-gray-200">
                            <p className="text-xs text-gray-600 font-semibold mb-2">QR Code</p>
                            <div className="flex justify-center">
                              <img
                                src={toPerson.paymentMethod.qrCodeImage}
                                alt="QR Code"
                                className="w-32 h-32 sm:w-40 sm:h-40 object-contain border border-gray-200 rounded-lg"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* No Payment Method */}
                    {(!toPerson?.paymentMethod || Object.keys(toPerson.paymentMethod).length === 0) && (
                      <div className="mt-3 pt-3 border-t-2 border-red-200">
                        <p className="text-xs text-gray-500 italic text-center">
                          {toPerson?.name} ยังไม่ได้ใส่ข้อมูลการรับเงิน
                        </p>
                      </div>
                    )}
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

        {/* Payment Method Section */}
        {paymentsToReceive.length > 0 && (
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                ข้อมูลการรับเงิน
              </h3>
              <button
                onClick={() => setIsEditingPayment(!isEditingPayment)}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm font-semibold flex items-center gap-2 shadow-md"
              >
                {isEditingPayment ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    ยกเลิก
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    {person.paymentMethod && Object.keys(person.paymentMethod).length > 0 ? 'แก้ไข' : 'เพิ่ม'}
                  </>
                )}
              </button>
            </div>

            {isEditingPayment ? (
              <div className="space-y-4 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-xl border-2 border-emerald-200">
                {/* PromptPay */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    พร้อมเพย์
                  </label>
                  <input
                    type="text"
                    value={promptpay}
                    onChange={(e) => setPromptpay(e.target.value)}
                    placeholder="เบอร์โทรศัพท์ หรือ เลขบัตรประชาชน"
                    className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900"
                  />
                </div>

                {/* Bank Account */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    บัญชีธนาคาร
                  </label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="ชื่อธนาคาร เช่น กสิกรไทย"
                    className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                  />
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="เลขที่บัญชี"
                    className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                  />
                  <input
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="ชื่อบัญชี"
                    className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                  />
                </div>

                {/* QR Code Upload */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                    QR Code
                  </label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleQrCodeUpload}
                      className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-500 file:text-white hover:file:bg-emerald-600"
                    />
                    {qrCodeImage && (
                      <div className="mt-3 flex justify-center">
                        <img src={qrCodeImage} alt="QR Code" className="w-48 h-48 object-contain border-2 border-emerald-300 rounded-lg shadow-md" />
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleSavePaymentMethod}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all font-semibold text-lg shadow-lg flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  บันทึกข้อมูล
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {person.paymentMethod?.promptpay && (
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 font-semibold">พร้อมเพย์</p>
                        <p className="text-lg font-bold text-gray-900">{person.paymentMethod.promptpay}</p>
                      </div>
                      <button
                        onClick={() => navigator.clipboard.writeText(person.paymentMethod?.promptpay || '')}
                        className="px-3 py-2 bg-white text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors text-sm font-semibold border border-emerald-300"
                      >
                        คัดลอก
                      </button>
                    </div>
                  </div>
                )}

                {person.paymentMethod?.bankAccount && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 font-semibold">บัญชีธนาคาร</p>
                        <p className="text-sm font-bold text-gray-900">{person.paymentMethod.bankAccount.bankName}</p>
                        <p className="text-lg font-bold text-gray-900">{person.paymentMethod.bankAccount.accountNumber}</p>
                        <p className="text-sm text-gray-600">{person.paymentMethod.bankAccount.accountName}</p>
                      </div>
                      <button
                        onClick={() => navigator.clipboard.writeText(person.paymentMethod?.bankAccount?.accountNumber || '')}
                        className="px-3 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-semibold border border-blue-300"
                      >
                        คัดลอก
                      </button>
                    </div>
                  </div>
                )}

                {person.paymentMethod?.qrCodeImage && (
                  <div className="bg-white p-4 rounded-xl border-2 border-gray-200 flex justify-center">
                    <img src={person.paymentMethod.qrCodeImage} alt="QR Code" className="w-64 h-64 object-contain" />
                  </div>
                )}

                {(!person.paymentMethod || Object.keys(person.paymentMethod).length === 0) && (
                  <div className="text-center py-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <p className="text-gray-500 text-sm">ยังไม่มีข้อมูลการรับเงิน</p>
                    <p className="text-gray-400 text-xs mt-1">คลิกปุ่ม "เพิ่ม" ด้านบนเพื่อเพิ่มข้อมูล</p>
                  </div>
                )}
              </div>
            )}
              </div>
            )}
          </div>
        </div>

        {/* Empty State */}
        {itemsPaid.length === 0 && itemsConsumed.length === 0 && paymentsToMake.length === 0 && paymentsToReceive.length === 0 && (
          <div className="text-center py-12 col-span-2">
            <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-500 text-lg">ยังไม่มีรายการ</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
