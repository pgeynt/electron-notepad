
# React Notepad

A simple **notepad** application built with **React**, featuring a **rich text editor**, note management, and image insertion. The UI is powered by **React Bootstrap** and **react-bootstrap-icons**.

## Features

- **Rich Text Editing**: Bold, italic, underline, lists, font size, and color changes, all via a toolbar.
- **Note Management**: Create, edit, and delete notes. Notes are saved to `localStorage`.
- **Image Insertion & Resizing**: Insert images into any note, drag to reposition, and resize with draggable corners.
- **Sidebar**: Filter notes by title or show only “starred” items.
- **Context Menus**: Right-click on notes or images to perform actions like editing the title, changing color, or removing items.

## Prerequisites

- **Node.js** (version 14+ recommended)
- **npm** or **yarn**

## Installation

1. Clone or download this repository.
2. Navigate to the project root directory.
3. Install dependencies:

   ```bash
   npm install
   # or
   yarn
   ```

4. Start the development server:

   ```bash
   npm start
   # or
   yarn start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Dependencies

- **React** (18+)
- **React Bootstrap**  
- **Bootstrap**  
- **react-bootstrap-icons**

Make sure to import Bootstrap’s CSS in your entry file (e.g., `index.js`):

```js
import 'bootstrap/dist/css/bootstrap.min.css';
```

## Usage

- **Create a new note**: Click the “New Note” button in the sidebar.
- **Edit note content**: Click on the rich text editor area in the right panel. Use the toolbar for styling, lists, and more.
- **Add images**: Click the “Image” button in the toolbar or right-click inside the editor to insert images.
- **Resizing images**: Use the draggable corners around images to resize them.
- **Star notes**: Click the star icon on any note in the list to toggle its “starred” status.
- **Delete notes**: Right-click the note or use the context menu actions.

---

Feel free to customize the UI, styles, or add more features as needed!
