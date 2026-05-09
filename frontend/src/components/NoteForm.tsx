import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload, Loader, Check } from 'lucide-react';

interface NoteFormProps {
  onSubmit: (title: string, content: string, file?: File) => Promise<void>;
  onClose: () => void;
  initialTitle?: string;
  initialContent?: string;
  submitLabel?: string;
}

export const NoteForm: React.FC<NoteFormProps> = ({ onSubmit, onClose, initialTitle = '', initialContent = '', submitLabel }) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(selectedFile.type)) {
        setError('Будь ласка, завантажте JPEG, PNG або WebP зображення');
        return;
      }

      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('Розмір файлу повинен бути менше 10 МБ');
        return;
      }

      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Введіть заголовок нотатки');
      return;
    }

    if (!content.trim()) {
      setError('Введіть текст нотатки');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(title, content, file || undefined);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    const successModal = (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center animate-in scale-in duration-300" onClick={(e) => e.stopPropagation()}>
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={32} className="text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Чудово!</h3>
          <p className="text-green-100">Нотатка успішно створена</p>
        </div>
      </div>
    );
    if (typeof document === 'undefined') return null;
    return createPortal(successModal, document.body);
  }

  const modal = (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in" onClick={onClose}>
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700/50 animate-in scale-in duration-200" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-700/50 bg-gradient-to-r from-gray-800 to-gray-800/95 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white">{submitLabel || 'Нова нотатка'}</h3>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-white hover:bg-gray-700/50 p-2 rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="rounded-lg bg-red-900/20 border border-red-700/50 p-4 backdrop-blur-sm animate-in fade-in">
              <p className="text-sm font-medium text-red-300">{error}</p>
            </div>
          )}

          {/* Title Input */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-white mb-2">
              Заголовок 📌
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Наприклад, 'Мої плани на сьогодні'"
              disabled={loading}
              maxLength={100}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 transition-all duration-200"
            />
            <p className="text-xs text-gray-500 mt-1">{title.length}/100</p>
          </div>

          {/* Content Textarea */}
          <div>
            <label htmlFor="content" className="block text-sm font-semibold text-white mb-2">
              Текст 📝
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Напишіть щось цікаве..."
              disabled={loading}
              rows={6}
              maxLength={5000}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 resize-none transition-all duration-200"
            />
            <p className="text-xs text-gray-500 mt-1">{content.length}/5000</p>
          </div>

          {/* File Upload */}
          <div>
            <label htmlFor="file" className="block text-sm font-semibold text-white mb-3">
              Додати зображення (опціонально) 🖼️
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <label
                htmlFor="file"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600/20 to-blue-700/20 border-2 border-dashed border-blue-500/50 hover:border-blue-500 hover:from-blue-600/30 hover:to-blue-700/30 rounded-lg text-blue-300 hover:text-blue-200 cursor-pointer transition-all duration-200 font-medium flex-shrink-0"
              >
                <Upload size={18} />
                <span>Вибрати зображення</span>
              </label>
              <input
                id="file"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                disabled={loading}
                className="hidden"
              />
              {fileName && (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-900/20 border border-green-700/50 rounded-lg">
                  <Check size={16} className="text-green-400" />
                  <span className="text-sm text-green-300">{fileName}</span>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Підтримуються: JPEG, PNG, WebP (макс. 10 МБ)
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-700/50">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gray-700/50 hover:bg-gray-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50 font-medium border border-gray-600 hover:border-gray-500"
            >
              Скасувати
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 font-semibold shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  {submitLabel ? `${submitLabel}...` : 'Створення...'}
                </>
              ) : (
                <>
                  <Check size={18} />
                  {submitLabel || 'Створити нотатку'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(modal, document.body);
};
