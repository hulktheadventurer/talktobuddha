'use client';

import React, { useState, useEffect, useRef } from 'react';
import DonateModal from '@/components/DonateModal';

export default function HomePage() {
  const [input, setInput] = useState('');
  const [thread, setThread] = useState<
    { role: string; message: string; timestamp: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [posted, setPosted] = useState(false);
  const chatBoxRef = useRef<HTMLDivElement | null>(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = {
      role: 'user',
      message: input,
      timestamp: new Date().toISOString(),
    };
    setThread((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/confess/reply-temp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ thread: [...thread, userMessage] }),
      });
      const data = await res.json();
      const buddhaMessage = {
        role: 'buddha',
        message: data.reply,
        timestamp: new Date().toISOString(),
      };
      setThread((prev) => [...prev, buddhaMessage]);
    } catch (err) {
      console.error('Reply error', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostToWall = async () => {
    try {
      const res = await fetch('/api/confess/final', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ thread, public: true }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log('Posted:', data);
        alert('✅ Your reflection has been shared on the Wall.');
        setPosted(true);
      } else {
        console.error('Post to wall failed:', data);
        alert('❌ Failed to post: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Post to wall crashed:', err);
      alert('❌ Network or server error');
    }
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [thread]);

  return (
    <div className="relative px-6 py-8 w-full max-w-3xl mx-auto z-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-yellow-800 z-10 relative">
        Share your thoughts with the Buddha 🪷
      </h2>

      <div
        ref={chatBoxRef}
        className={`bg-yellow-50 shadow-xl rounded-2xl p-6 border border-yellow-200 max-h-[60vh] overflow-y-auto flex flex-col ${
          thread.length === 0 ? 'justify-center min-h-[120px]' : 'space-y-3'
        }`}
      >
        {thread.length === 0 && !loading && (
          <p className="text-center text-yellow-400 italic">
            What rests on your heart today?
          </p>
        )}

        {thread.map((entry, idx) => (
          <div
            key={idx}
            className={`max-w-[80%] px-4 py-2 rounded-xl text-sm whitespace-pre-wrap ${
              ['father', 'devil', 'god', 'buddha'].includes(entry.role)
                ? 'bg-yellow-100 text-yellow-900 self-start'
                : 'bg-yellow-600 text-white self-end'
            }`}
          >
            <strong>{entry.role === 'user' ? 'You:' : 'Buddha:'}</strong> {entry.message}
          </div>
        ))}

        {loading && (
          <div className="italic text-yellow-600 self-start">The Buddha is listening...</div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex flex-col space-y-4 mt-4 z-10 relative"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Whisper your thoughts..."
          className="text-black w-full p-4 border-2 border-yellow-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-yellow-50"
          rows={3}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-600 text-white px-8 py-2 rounded-2xl hover:bg-yellow-700 font-semibold shadow"
          >
            Send
          </button>
          <button
            type="button"
            disabled={posted || thread.length === 0}
            onClick={handlePostToWall}
            className="bg-amber-700 text-white px-8 py-2 rounded-2xl hover:bg-amber-800 font-semibold shadow"
          >
            {posted ? '✅ Shared' : 'Share this reflection'}
          </button>
        </div>
      </form>

      <DonateModal
        isOpen={showDonateModal}
        onClose={() => setShowDonateModal(false)}
      />
    </div>
  );
}
