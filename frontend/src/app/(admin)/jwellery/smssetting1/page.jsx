"use client";
import { useState } from 'react';

export default function MessageSettingsPage() {
  const categories = [
    'Today Birthday',
    'Anniversary',
    'BBLC',
    'Festival',
    'Promotion',
    // 'General Notification',
  ];

  const [language, setLanguage] = useState('EN');
  const [audience, setAudience] = useState('Customer');
  const [messages, setMessages] = useState(
    categories.reduce((acc, key) => {
      acc[key] = { enabled: true, text: '' };
      return acc;
    }, {})
  );

  const handleToggle = (key) => {
    setMessages((prev) => ({
      ...prev,
      [key]: { ...prev[key], enabled: !prev[key].enabled },
    }));
  };

  const handleTextChange = (key, value) => {
    setMessages((prev) => ({
      ...prev,
      [key]: { ...prev[key], text: value },
    }));
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4 bg-white rounded-lg shadow">
  

      {/* Message Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((key) => (
          <div key={key}>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium">{key}</label>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={messages[key].enabled}
                  onChange={() => handleToggle(key)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-300 peer-checked:bg-blue-600 rounded-full relative transition-all">
                  <div className="absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-all peer-checked:translate-x-4"></div>
                </div>
              </label>
            </div>
            <textarea
              rows={3}
              className="w-full border border-gray-300 rounded p-2 text-sm"
              value={messages[key].text}
              onChange={(e) => handleTextChange(key, e.target.value)}
              placeholder={`Enter ${key} message...`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
