import React, { useState } from 'react';
import { Conversation } from '../../types';
import { ArrowLeft, Search, Trash2, FileUp, MessageSquare } from 'lucide-react';

interface Props {
  conversations: Conversation[];
  onSelect: (conv: Conversation) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

export const HistoryView: React.FC<Props> = ({
  conversations,
  onSelect,
  onDelete,
  onBack
}) => {
  const [search, setSearch] = useState('');

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = (c: Conversation) => {
    const markdown = `# ${c.title}\nExported from Millizai AI\nDate: ${new Date(c.updatedAt).toLocaleString()}\nMode: ${c.mode}\nModel: ${c.modelName}\n\n` +
      c.messages
        .map((m) => `### ${m.role === 'user' ? 'User' : 'Millizai AI'}\n${m.content}\n`)
        .join('\n');

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Millizai-Chat-${c.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col bg-[#080c14] text-slate-100 overflow-y-auto custom-scrollbar p-3 space-y-3.5">
      {/* Top Bar */}
      <div className="flex items-center gap-2 pb-1 border-b border-slate-800">
        <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-xs font-bold text-white">Chat History</h2>
          <p className="text-[10px] text-cyan-400">Encrypted Room SQLite Database</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search stored conversations..."
          className="w-full bg-[#12192c] border border-slate-700 focus:border-purple-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
        />
      </div>

      {/* Conversations List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No matching conversations found.
          </div>
        ) : (
          filtered.map((c) => (
            <div
              key={c.id}
              onClick={() => onSelect(c)}
              className="p-3 rounded-2xl bg-[#0f1728] border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    c.mode === 'offline' ? 'bg-blue-900/60 text-cyan-400' : 'bg-purple-900/60 text-purple-400'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-xs font-bold text-white truncate">{c.title}</h4>
                  <p className="text-[10px] text-slate-400">
                    {new Date(c.updatedAt).toLocaleDateString()} • {c.mode.toUpperCase()} • {c.messages.length} messages
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => handleExport(c)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                  title="Export Markdown"
                >
                  <FileUp className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onDelete(c.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                  title="Delete Conversation"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
