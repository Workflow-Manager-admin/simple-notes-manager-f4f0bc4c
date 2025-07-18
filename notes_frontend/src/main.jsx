import './style.css';
import React from "react";
import { createRoot } from "react-dom/client";
import NotesApp from "./NotesApp.jsx";

const container = document.getElementById("app");
const root = createRoot(container);
root.render(<NotesApp />);
