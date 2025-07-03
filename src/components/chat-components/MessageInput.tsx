// src/components/chat/MessageInput.tsx
import React, { useState, useRef, FormEvent } from 'react';

interface MessageInputProps {
  onSendText: (text: string) => void;
  onSendFile: (file: File) => void;
}

export default function MessageInput({
  onSendText,
  onSendFile,
}: MessageInputProps) {
  const [text, setText] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (trimmed) {
      onSendText(trimmed);
      setText('');
    }
  };

  const handleFileChange = () => {
    const inputEl = fileRef.current;
    // 널 체크와 파일 유무 체크
    if (!inputEl || !inputEl.files || inputEl.files.length === 0) return;
    const file = inputEl.files[0];
    onSendFile(file);
    inputEl.value = '';
  };

  return (
    <div className="border-t p-4 flex flex-col">
      {/* 텍스트 입력 */}
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="메시지를 입력하세요"
          className="flex-1 border rounded-lg px-3 py-2 focus:outline-none text-black"
        />
        <button
          type="submit"
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          전송
        </button>
      </form>

      {/* 파일 업로드 */}
      <div className="mt-2 flex items-center">
        <input
          type="file"
          ref={fileRef}
          onChange={handleFileChange}
          className="flex-1"
        />
      </div>
    </div>
  );
}
