
import React, { useState } from 'react';


const EMOJIS = ['❤️', '😂', '😮', '😢', '😡', '🙌'];

export default function StoryUpload({ onUpload }) {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    if (!selected.type.startsWith('video/')) {
      setError('Solo se permiten videos.');
      setFile(null);
      setPreview(null);
      return;
    }
    // Validar duración del video
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      if (video.duration > 15) {
        setError('El video no puede durar más de 15 segundos.');
        setFile(null);
        setPreview(null);
      } else {
        setError('');
        setFile(selected);
        setPreview(URL.createObjectURL(selected));
      }
    };
    video.src = URL.createObjectURL(selected);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      setError('Selecciona un video válido.');
      return;
    }
    setError('');
    onUpload && onUpload({ file, text });
  };

  return (
    <div style={{ padding: 24, background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px #0002', maxWidth: 400, margin: '40px auto' }}>
      <h3>Subir historia</h3>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="video/*" onChange={handleFileChange} />
        {preview && <video src={preview} controls style={{ width: '100%', marginTop: 12 }} />}
        {/* Emoji selector */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, margin: '12px 0 4px 0' }}>
          {EMOJIS.map((emoji) => (
            <button
              type="button"
              key={emoji}
              style={{ fontSize: 22, background: 'none', border: 'none', cursor: 'pointer' }}
              onClick={() => setText(text + emoji)}
              tabIndex={-1}
            >
              {emoji}
            </button>
          ))}
        </div>
        <textarea
          placeholder="Agrega texto o emojis (opcional)"
          value={text}
          onChange={e => setText(e.target.value)}
          style={{ width: '100%', marginTop: 4, borderRadius: 6, padding: 8, resize: 'none' }}
          rows={2}
        />
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
        <button type="submit" style={{ marginTop: 16, width: '100%', padding: 10, borderRadius: 6, background: '#2196f3', color: '#fff', border: 'none', fontWeight: 'bold' }}>Subir historia</button>
      </form>
    </div>
  );
}
