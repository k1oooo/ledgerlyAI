"use client";

import * as React from "react";
import {
  MessageCircle,
  Pencil,
  Trash2,
  MoreHorizontal,
  Plus,
} from "lucide-react";

type ChatHistoryItem = {
  id: string;
  title: string;
  lastMessage?: string;
};

const initialHistory: ChatHistoryItem[] = [
  { id: "1", title: "VAT Query", lastMessage: "How do I file VAT returns?" },
  {
    id: "2",
    title: "Invoice Help",
    lastMessage: "Show me last month's invoices.",
  },
  { id: "3", title: "Analytics", lastMessage: "Summarize Q1 revenue." },
  { id: "4", title: "Payroll", lastMessage: "How to process payroll?" },
  {
    id: "5",
    title: "Tax Advice",
    lastMessage: "What are deductible expenses?",
  },
  { id: "6", title: "Bank Feed", lastMessage: "Sync my bank transactions." },
  { id: "7", title: "Budgeting", lastMessage: "Create a new budget for 2025." },
  { id: "8", title: "Audit", lastMessage: "Prepare for audit." },
  { id: "9", title: "Suppliers", lastMessage: "List all suppliers." },
  { id: "10", title: "Receipts", lastMessage: "Upload new receipt." },
];

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

export function ChatHistory({ onSelect }: { onSelect?: (id: string) => void }) {
  const [history, setHistory] =
    React.useState<ChatHistoryItem[]>(initialHistory);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editValue, setEditValue] = React.useState<string>("");
  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);

  const handleRename = (id: string, title: string) => {
    setEditingId(id);
    setEditValue(title);
    setOpenMenuId(null);
  };

  const handleRenameSubmit = (id: string) => {
    setHistory((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, title: editValue.trim() || item.title }
          : item
      )
    );
    setEditingId(null);
    setEditValue("");
  };

  const handleDelete = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditValue("");
    }
    setOpenMenuId(null);
  };

  const handleNewChat = () => {
    const newId = generateId();
    const newChat: ChatHistoryItem = {
      id: newId,
      title: "New Chat",
      lastMessage: "",
    };
    setHistory((prev) => [{ ...newChat }, ...prev]);
    setEditingId(newId);
    setEditValue("New Chat");
    if (onSelect) onSelect(newId);
  };

  // Close menu on outside click
  React.useEffect(() => {
    if (!openMenuId) return;
    const handler = () => setOpenMenuId(null);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [openMenuId]);

  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide px-3">
        <MessageCircle className="w-4 h-4" />
        Chat History
        <button
          className="ml-auto p-1 rounded hover:bg-blue-100 transition"
          title="New Chat"
          onClick={handleNewChat}
          type="button"
        >
          <Plus className="w-4 h-4 text-blue-600" />
        </button>
      </div>
      <div className="max-h-56 overflow-y-auto pr-1">
        <ul className="space-y-1 px-2">
          {history.map((item) => (
            <li key={item.id} className="group flex items-center relative">
              {editingId === item.id ? (
                <form
                  className="flex-1 flex items-center gap-1"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleRenameSubmit(item.id);
                  }}
                >
                  <input
                    className="w-full px-2 py-1 rounded border border-gray-300 text-sm"
                    value={editValue}
                    autoFocus
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => handleRenameSubmit(item.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        setEditingId(null);
                        setEditValue("");
                      }
                    }}
                  />
                </form>
              ) : (
                <button
                  className="flex-1 min-w-0 text-left px-3 py-2 rounded-md hover:bg-gray-100 transition group flex flex-col"
                  onClick={() => onSelect?.(item.id)}
                  type="button"
                  tabIndex={0}
                >
                  <div className="font-medium text-sm truncate group-hover:text-blue-600">
                    {item.title}
                  </div>
                  {item.lastMessage && (
                    <div className="text-xs text-gray-500 truncate">
                      {item.lastMessage}
                    </div>
                  )}
                </button>
              )}
              {/* ... menu */}
              <div className="flex-shrink-0 relative flex items-center ml-1">
                <button
                  className="p-1 rounded hover:bg-gray-200"
                  title="More"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(openMenuId === item.id ? null : item.id);
                  }}
                  tabIndex={0}
                  type="button"
                >
                  <MoreHorizontal className="w-4 h-4 text-gray-500" />
                </button>
                {openMenuId === item.id && (
                  <div
                    className="absolute right-0 top-7 z-10 bg-white border border-gray-200 rounded shadow-md min-w-[110px] py-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100"
                      onClick={() => handleRename(item.id, item.title)}
                      type="button"
                    >
                      <Pencil className="w-4 h-4 text-gray-500" />
                      Rename
                    </button>
                    <button
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-red-50"
                      onClick={() => handleDelete(item.id)}
                      type="button"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
