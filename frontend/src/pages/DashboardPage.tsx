import React, { useState } from 'react';
import { Plus, LogOut, Loader, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotes } from '../hooks/useNotes';
import { NoteCard } from '../components/NoteCard';
import { NoteForm } from '../components/NoteForm';

export const DashboardPage: React.FC = () => {
  const { logout, user } = useAuth();
  const { notes, loading, error, createNote, deleteNote, editNote } = useNotes();
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateNote = async (
    title: string,
    content: string,
    file?: File
  ) => {
    await createNote(title, content, file);
  };

  // Фільтрування нотаток за пошуковим запитом
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-800/95 backdrop-blur-md border-b border-gray-700/50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <div className="text-4xl">📝</div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                    Personal Note Manager
                  </h1>
                  {user && (
                    <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                      Залогінений як <span className="text-blue-400 font-semibold">{user.email}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setShowForm(true)}
                className="group flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              >
                <Plus size={20} className="group-hover:rotate-90 transition-transform duration-200" />
                <span className="hidden sm:inline font-medium">Додати</span>
              </button>

              <button
                onClick={logout}
                className="group flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-700 hover:bg-red-600/20 text-gray-300 hover:text-red-400 rounded-lg transition-all duration-200 border border-gray-600 hover:border-red-600/50"
              >
                <LogOut size={20} />
                <span className="hidden sm:inline font-medium">Вийти</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="rounded-lg bg-red-900/20 border border-red-700/50 p-4 mb-6 backdrop-blur-sm animate-in fade-in">
            <p className="text-sm font-medium text-red-300">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && notes.length === 0 ? (
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-6">
                <Loader size={64} className="text-blue-500 animate-spin absolute inset-0" />
              </div>
              <p className="text-lg text-gray-400">Завантаження нотаток...</p>
            </div>
          </div>
        ) : notes.length === 0 ? (
          /* Empty State */
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center max-w-md">
              <div className="text-6xl mb-4">📚</div>
              <h2 className="text-3xl font-bold text-white mb-2">Немає нотаток</h2>
              <p className="text-gray-400 mb-8">
                Починайте писати! Першу нотатку можна створити зараз же
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 font-medium"
              >
                <Plus size={20} />
                Створити першу нотатку
              </button>
            </div>
          </div>
        ) : (
          /* Notes Section */
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header and Search */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Ваші нотатки
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  Всього: <span className="text-blue-400 font-semibold">{notes.length}</span>
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Пошук нотаток..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Results Info */}
            {searchQuery && (
              <p className="text-sm text-gray-400">
                Знайдено: <span className="text-blue-400 font-semibold">{filteredNotes.length}</span> нотат(ок)
              </p>
            )}

            {/* Notes Grid */}
            {filteredNotes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNotes.map((note, index) => (
                  <div key={note.id} className="animate-in fade-in duration-300" style={{ animationDelay: `${index * 50}ms` }}>
                    <NoteCard
                      note={note}
                      onDelete={deleteNote}
                      onEdit={async (id, title, content, file) => {
                        await editNote(id, title, content, file);
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">Нічого не знайдено за запитом "{searchQuery}"</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Note Form Modal */}
      {showForm && (
        <NoteForm
          onSubmit={handleCreateNote}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};
