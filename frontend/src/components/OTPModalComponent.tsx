import type React from "react";
import { useState, useEffect } from "react";

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (otp: string) => void;
  onResend: () => void;
}

const OtpModal: React.FC<OtpModalProps> = ({ isOpen, onClose, onSubmit, onResend }) => {
  const [otp, setOtp] = useState("");
  const [canResend, setCanResend] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setOtp("");
      setCanResend(false);
      const timer = setTimeout(() => setCanResend(true), 60000); // 60 seconds
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl mb-4">Enter OTP</h2>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />
        <div className="flex justify-end">
          {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
<button
            onClick={onClose}
            className="bg-gray-300 text-black py-2 px-4 rounded mr-2"
          >
            Cancel
          </button>
          {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
<button
            onClick={() => onSubmit(otp)}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Confirm
          </button>
        </div>
        {canResend ? (
          // biome-ignore lint/a11y/useButtonType: <explanation>
<button onClick={onResend} className="text-blue-500 mt-2">
            Resend OTP
          </button>
        ) : (
          <p className="text-gray-500 mt-2">You can resend OTP in 60 seconds.</p>
        )}
      </div>
    </div>
  );
};

export default OtpModal;
