import React, { useState } from "react";

// Minimal type for a note
function uuidv4() {
  // Simple random UUID for demo purposes
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

const COLORS = {
  primary: "#1976d2",
  secondary: "#424242",
  accent: "#ffc107"
};

// PUBLIC_INTERFACE
function NotesApp() {
  /**
   * Main Notes UI app with responsive, minimalist column layout.
   * Features: list notes, create, edit, delete, responsive/minimal.
   */
  const [notes, setNotes] = useState([
    {
      id: uuidv4(),
      title: "Demo Note",
      content: "This is your first note! Use the + button to create another."
    }
  ]);
  const [selectedId, setSelectedId] = useState(notes[0]?.id ?? null);
  const [editingId, setEditingId] = useState(null); // null or id of note being edited
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");

  // Create
  function handleCreate(newTitle, newContent) {
    const newNote = {
      id: uuidv4(),
      title: newTitle || "Untitled Note",
      content: newContent || ""
    };
    setNotes(n => [newNote, ...n]);
    setCreating(false);
    setSelectedId(newNote.id);
    setEditingId(null);
  }
  // Edit
  function handleEdit(id, newTitle, newContent) {
    setNotes(n =>
      n.map(note =>
        note.id === id
          ? { ...note, title: newTitle, content: newContent }
          : note
      )
    );
    setEditingId(null);
  }
  // Delete
  function handleDelete(id) {
    setNotes(n => n.filter(note => note.id !== id));
    if (selectedId === id) {
      const remaining = notes.filter(note => note.id !== id);
      setSelectedId(remaining[0]?.id ?? null);
    }
    setEditingId(null);
  }
  // UI: sidebar (note list)
  const filteredNotes = search
    ? notes.filter((n) =>
        n.title.toLowerCase().includes(search.toLowerCase())
      )
    : notes;

  // Compose minimal inline style objects (for accent)
  const sidebarStyle = {
    background: COLORS.secondary,
    color: "#fff",
    minWidth: 220,
    maxWidth: 340,
    width: "28vw",
    borderRight: `1px solid #eee`,
    display: "flex",
    flexDirection: "column",
    padding: "0.5rem 0.25rem",
    boxSizing: "border-box"
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "row",
        background: "#f8f9fa"
      }}
    >
      {/* Sidebar */}
      <aside style={sidebarStyle}>
        <div style={{ display: "flex", alignItems: "center", padding: "0.5rem" }}>
          {/* App title */}
          <span style={{
            fontWeight: 700,
            fontSize: "1.18rem",
            letterSpacing: "0.02em",
            flex: 1
          }}>Notes</span>
          <button
            title="New Note"
            onClick={() => {
              setCreating(true);
              setEditingId(null);
            }}
            style={{
              background: COLORS.accent,
              color: "#333",
              border: "none",
              fontSize: "1.35rem",
              borderRadius: 6,
              width: 34,
              height: 34,
              marginLeft: 4,
              cursor: "pointer"
            }}
            aria-label="Add Note"
          >+</button>
        </div>
        <input
          placeholder="Search notes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            margin: "0 0.5rem 0.5rem 0.5rem",
            borderRadius: 5,
            border: "none",
            padding: "0.4rem 0.7rem",
            background: "#fff",
            color: "#333"
          }}
        />
        <nav style={{ flex: 1, overflowY: "auto" }}>
          {filteredNotes.length === 0 && (
            <div style={{
              color: "#ccc",
              textAlign: "center",
              marginTop: "3rem"
            }}>No notes found</div>
          )}
          <ul style={{
            listStyle: "none",
            margin: 0,
            padding: 0
          }}>
            {filteredNotes.map(note => (
              <li key={note.id}>
                <button
                  onClick={() => {
                    setSelectedId(note.id);
                    setEditingId(null);
                    setCreating(false);
                  }}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    border: "none",
                    background: note.id === selectedId && !editingId && !creating
                      ? COLORS.primary : "transparent",
                    color: note.id === selectedId && !editingId && !creating
                      ? "#fff" : "#ececec",
                    fontWeight: note.id === selectedId ? 600 : 400,
                    padding: "0.6rem 0.86rem",
                    borderRadius: 5,
                    cursor: "pointer",
                    marginBottom: "2px"
                  }}
                >
                  {note.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <footer style={{
          fontSize: "0.87rem",
          color: "#bbb",
          textAlign: "center", marginTop: "1rem", marginBottom: 2, letterSpacing: "0.02em"
        }}>
          <span style={{ color: COLORS.accent }}>●</span> Minimal Notes
        </footer>
      </aside>

      {/* Main area */}
      <main
        style={{
          flex: 1, minWidth: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fff"
        }}
      >
        <div style={{ width: "100%", maxWidth: 740, padding: "2rem 1.2rem" }}>
          {/* CREATE */}
          {creating &&
            <NoteForm
              title="" content=""
              onSave={(t, c) => handleCreate(t, c)}
              onCancel={() => setCreating(false)}
              accentColor={COLORS.accent}
              primaryColor={COLORS.primary}
            />
          }
          {/* EDIT */}
          {!creating && editingId && (
            <NoteForm
              title={notes.find(n => n.id === editingId)?.title ?? ""}
              content={notes.find(n => n.id === editingId)?.content ?? ""}
              onSave={(t, c) => handleEdit(editingId, t, c)}
              onCancel={() => setEditingId(null)}
              accentColor={COLORS.accent}
              primaryColor={COLORS.primary}
            />
          )}
          {/* READ */}
          {!creating && !editingId && selectedId && (
            <NoteViewer
              note={notes.find(n => n.id === selectedId)}
              onEdit={() => setEditingId(selectedId)}
              onDelete={() => handleDelete(selectedId)}
              accentColor={COLORS.accent}
              primaryColor={COLORS.primary}
            />
          )}
          {/* Empty state */}
          {!creating && !editingId && !selectedId && (
            <div style={{
              color: "#bbb",
              textAlign: "center", padding: "1.2rem"
            }}>
              Select a note or create one to get started.
            </div>
          )}
        </div>
      </main>
      <style>{`
        @media (max-width: 750px) {
          aside {
            min-width: 46vw !important;
            width: 50vw !important;
            max-width: 90vw !important;
          }
          main {
            padding: 0 !important;
          }
        }
        @media (max-width: 580px) {
          aside {
            min-width: 80vw !important;
            width: 98vw !important;
            max-width: unset !important;
          }
          main > div {
            padding: 0.6rem !important;
          }
        }
      `}</style>
    </div>
  );
}

function NoteForm({ title, content, onSave, onCancel, accentColor, primaryColor }) {
  /**
   * Form for creating or editing a note.
   */
  const [t, setT] = useState(title);
  const [c, setC] = useState(content);

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSave(t, c);
      }}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        background: "#f3f7fb",
        borderRadius: 8,
        boxShadow: "0 1px 5px #ededed",
        padding: "2rem 1rem"
      }}
    >
      <input
        value={t}
        placeholder="Title"
        required
        onChange={e => setT(e.target.value)}
        style={{
          fontSize: "1.1rem",
          fontWeight: 600,
          border: `1.2px solid ${primaryColor}`,
          borderRadius: 6,
          padding: "0.7rem",
          background: "#fff",
          color: "#212121"
        }}
      />
      <textarea
        value={c}
        placeholder="Write your note here..."
        required
        rows={7}
        onChange={e => setC(e.target.value)}
        style={{
          resize: "vertical",
          fontSize: "1.09rem",
          padding: "0.72rem",
          border: "1px solid #cbd5e1",
          borderRadius: 5,
          background: "#fff",
          color: "#222"
        }}
      />
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            background: "#eee", color: "#334", border: "none",
            borderRadius: 6, padding: "0.5rem 1.2rem", fontWeight: 500, cursor: "pointer"
          }}
        >Cancel</button>
        <button
          type="submit"
          style={{
            background: accentColor,
            color: "#111",
            border: "none",
            borderRadius: 6,
            padding: "0.5rem 1.2rem",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 1px 6px #fcf7d5"
          }}
        >Save</button>
      </div>
    </form>
  );
}

function NoteViewer({ note, onEdit, onDelete, accentColor, primaryColor }) {
  /**
   * Display the selected note, with edit/delete controls.
   */
  return (
    <div style={{
      background: "#f3f7fb",
      borderRadius: 8,
      boxShadow: "0 1px 5px #ededed",
      padding: "2.4rem 1.2rem",
      position: "relative",
      minHeight: 140
    }}>
      <h2 style={{
        margin: 0,
        color: primaryColor,
        fontWeight: 700,
        fontSize: "1.42rem"
      }}>{note.title}</h2>
      <div style={{
        marginTop: 10,
        fontSize: "1.12rem",
        lineHeight: 1.73,
        color: "#232323",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word"
      }}>
        {note.content}
      </div>
      <div style={{
        position: "absolute", top: 12, right: 14, display: "flex", gap: 6
      }}>
        <button
          aria-label="Edit"
          title="Edit note"
          onClick={onEdit}
          style={{
            background: accentColor,
            color: "#223",
            border: "none",
            borderRadius: 5,
            padding: "0.2rem 0.76rem",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >Edit</button>
        <button
          aria-label="Delete"
          title="Delete note"
          onClick={() => {
            if (window.confirm("Delete this note?")) onDelete();
          }}
          style={{
            background: "#fff",
            color: "#c00",
            border: `1px solid #c00`,
            borderRadius: 5,
            padding: "0.2rem 0.6rem",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >Delete</button>
      </div>
    </div>
  );
}

export default NotesApp;
