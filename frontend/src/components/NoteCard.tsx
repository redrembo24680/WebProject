import React, { useState } from 'react';
import { Trash2, Loader, Heart } from 'lucide-react';
import { Note } from '../services/authService';
import ConfirmationModal from './ConfirmationModal';

interface NoteCardProps {
  note: Note;
  onDelete: (id: number) => Promise<void>;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  const handleDelete = async () => {
    setShowConfirm(true);
  };

  const [showConfirm, setShowConfirm] = useState(false);

  const confirmDelete = async () => {
    setShowConfirm(false);
    setIsDeleting(true);
    setError(null);
    try {
      await onDelete(note.id);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return null;
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
    const baseUrl = apiBase.replace('/api/v1', '');
    return `${baseUrl}/${imagePath}`;
  };

  const imageUrl = getImageUrl(note.image_url);

  return (
    <div className="group relative h-full bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-600/50 hover:border-blue-500/50">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />

      {/* Image Preview */}
      {imageUrl && (
        <div className="relative h-48 overflow-hidden bg-gray-600 group-hover:brightness-110 transition-all duration-300">
          <img
            src={imageUrl}
            alt={note.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          {/* Image Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
        </div>
      )}

      {/* Content */}
      <div className="relative p-5 flex flex-col h-full z-20">
        {/* Like Button */}
        <div className="flex justify-end mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-2 rounded-full transition-all duration-200 ${
              isLiked
                ? 'bg-red-600 text-white'
                : 'bg-gray-600/50 text-gray-300 hover:bg-red-600/20 hover:text-red-400'
            }`}
          >
            <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-300 transition-colors duration-200">
          {note.title}
        </h3>

        {/* Content Preview */}
        <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-grow group-hover:text-gray-300 transition-colors duration-200">
          {note.content}
        </p>

        {/* Date */}
        <div className="flex items-center justify-between mb-4 text-xs text-gray-500 group-hover:text-gray-400 transition-colors duration-200">
          <span>📅 {formatDate(note.created_at)}</span>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-md bg-red-900/30 border border-red-700/50 p-2 mb-4">
            <p className="text-xs text-red-300">{error}</p>
          </div>
        )}

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
        >
          {isDeleting ? (
            <>
              <Loader size={16} className="animate-spin" />
              <span className="text-sm">Видалення...</span>
            </>
          ) : (
            <>
              <Trash2 size={16} />
              <span className="text-sm">Видалити</span>
            </>
          )}
        </button>
        {showConfirm && (
          <ConfirmationModal
            title="Видалити нотатку"
            message={`Ви впевнені, що хочете назавжди видалити «${note.title}»?`}
            confirmLabel="Видалити"
            cancelLabel="Скасувати"
            onConfirm={confirmDelete}
            onCancel={() => setShowConfirm(false)}
          />
        )}
      </div>
    </div>
  );
};
