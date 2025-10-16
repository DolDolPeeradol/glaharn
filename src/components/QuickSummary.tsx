"use client";

import { Person, PersonSummary, Payment } from "@/types";

interface QuickSummaryProps {
  summary: Record<string, PersonSummary>;
  payments: Payment[];
  people: Person[];
  totalItems: number;
}

export default function QuickSummary({ summary, payments, people, totalItems }: QuickSummaryProps) {
  const totalSpent = Object.values(summary).reduce((sum, s) => sum + s.owes, 0);
  const totalPaid = Object.values(summary).reduce((sum, s) => sum + s.paid, 0);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        สรุปรวม
      </h3>

      {/* Stats */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-xl">
          <span className="text-sm font-medium text-gray-600">จำนวนคน</span>
          <span className="text-lg font-bold text-teal-600">{people.length}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl">
          <span className="text-sm font-medium text-gray-600">รายการทั้งหมด</span>
          <span className="text-lg font-bold text-emerald-600">{totalItems}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
          <span className="text-sm font-medium text-gray-600">ค่าใช้จ่ายรวม</span>
          <span className="text-lg font-bold text-green-600">{totalSpent.toFixed(2)} ฿</span>
        </div>
      </div>

      {/* Per Person Summary */}
      {Object.keys(summary).length > 0 && (
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-bold text-gray-700 mb-3">ยอดแต่ละคน</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
            {Object.entries(summary).map(([personId, data]) => (
              <div
                key={personId}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow">
                    {data.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-800">{data.name}</p>
                    <p className="text-xs text-gray-500">{data.items.length} รายการ</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-sm ${data.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {data.balance >= 0 ? '+' : ''}{data.balance.toFixed(2)} ฿
                  </p>
                  <p className="text-xs text-gray-500">{data.owes.toFixed(2)} ฿</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payments */}
      {payments.length > 0 && (
        <div className="border-t border-gray-200 pt-4 mt-4">
          <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
            การโอนเงิน
          </h4>
          <div className="space-y-2">
            {payments.map((payment, idx) => {
              const fromPerson = people.find((p) => p.id === payment.from);
              const toPerson = people.find((p) => p.id === payment.to);
              return (
                <div
                  key={idx}
                  className="bg-cyan-50 p-3 rounded-lg border-l-4 border-cyan-400"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-xs text-gray-800">{fromPerson?.name}</span>
                    <svg className="w-3 h-3 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    <span className="font-semibold text-xs text-gray-800">{toPerson?.name}</span>
                  </div>
                  <p className="font-bold text-red-600 text-sm">{payment.amount.toFixed(2)} ฿</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {totalItems === 0 && (
        <div className="text-center py-8">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-gray-500 text-sm">ยังไม่มีรายการ</p>
        </div>
      )}
    </div>
  );
}
