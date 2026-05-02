import React, { useState, useEffect } from "react";

const STORAGE_KEY = "bac_disclaimer_accepted";

export function DisclaimerModal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(STORAGE_KEY);
    if (!accepted) {
      setVisible(true);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      data-testid="disclaimer-overlay"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 text-right"
        dir="rtl"
        data-testid="disclaimer-modal"
      >
        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div className="bg-amber-50 border border-amber-200 rounded-full p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-amber-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-slate-800 text-center mb-5">
          تنبيه مهم
        </h2>

        {/* Body */}
        <div className="space-y-3 text-slate-600 text-[15px] leading-relaxed">
          <p>
            هذا الموقع يهدف فقط إلى المساعدة في تسهيل عملية التوجيه الجامعي.
          </p>
          <p>
            المعطيات المعروضة تعتمد على نتائج السنوات السابقة ولا تمثل مرجعًا رسميًا.
          </p>
          <p>
            هذا الموقع غير تابع لوزارة التعليم العالي أو أي مؤسسة رسمية، ولا يمكن الاعتماد عليه كبديل عن النتائج الرسمية.
          </p>
          <p className="font-semibold text-slate-700">
            يرجى الرجوع إلى المصادر الرسمية لاتخاذ القرار النهائي.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 my-6" />

        {/* Button */}
        <button
          onClick={handleAccept}
          className="w-full bg-primary text-primary-foreground font-bold text-base py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all duration-150"
          data-testid="disclaimer-accept-btn"
        >
          فهمت
        </button>
      </div>
    </div>
  );
}
