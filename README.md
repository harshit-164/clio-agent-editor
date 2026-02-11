# 🧠 Vibecode Editor – AI-Powered Web IDE

![Vibecode Editor Thumbnail](public/vibe-code-editor-thumbnail.svg)

**Vibecode Editor** is a blazing-fast, AI-integrated web IDE built entirely in the browser using **Next.js 15 App Router**, **WebContainers**, **Monaco Editor**, and **Qwen 2.5 Coder via Ollama**. It offers real-time code execution, an AI-powered chat assistant, and support for multiple tech stacks — all wrapped in a stunning developer-first UI.

---

## 🚀 Features

- 🔐 **OAuth Login with NextAuth** – Supports Google & GitHub login.
- 🎨 **Modern UI** – Built with TailwindCSS & ShadCN UI.
- 🌗 **Dark/Light Mode** – Seamlessly toggle between themes.
- 🧱 **Project Templates** – Choose from React, Next.js, Express, Hono, Vue, or Angular.
- 🗂️ **Custom File Explorer** – Create, rename, delete, and manage files/folders easily.
- 🖊️ **Enhanced Monaco Editor** – Syntax highlighting, formatting, keybindings, and AI autocomplete.
- 💡 **AI Suggestions with Ollama** – Local models give you code completion on `Ctrl + Space` or double `Enter`. Accept with `Tab`.
- ⚙️ **WebContainers Integration** – Instantly run frontend/backend apps right in the browser.
- 💻 **Terminal with xterm.js** – Fully interactive embedded terminal experience.
- 🤖 **AI Chat Assistant** – Share files with the AI and get help, refactors, or explanations.

---

## 🧱 Tech Stack

| Layer         | Technology                                   |
|---------------|----------------------------------------------|
| Framework     | Next.js 15.3.1 (App Router)                  |
| UI Library    | React 19.0.0                                 |
| Styling       | TailwindCSS 4.x + ShadCN UI + Radix UI       |
| Language      | TypeScript 5.x                               |
| Auth          | NextAuth v5 (Google + GitHub OAuth)          |
| Editor        | Monaco Editor 0.52.2                         |
| AI Model      | Qwen 2.5 Coder 1.5B (via Ollama)             |
| Runtime       | WebContainers 1.6.1                          |
| Terminal      | xterm.js 5.5.0 (with WebGL addon)            |
| Database      | MongoDB + Prisma ORM 6.10.0                  |
| State         | Zustand 5.0.5                                |
| Forms         | React Hook Form + Zod                        |

---

## 🛠️ Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/vibecode-editor.git
cd vibecode-editor
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file using the template:

```bash
cp .env.example .env.local
```

Then, fill in your credentials:

```env
AUTH_SECRET=your_auth_secret
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_secret
AUTH_GITHUB_ID=your_github_client_id
AUTH_GITHUB_SECRET=your_github_secret
DATABASE_URL=your_mongodb_connection_string
NEXTAUTH_URL=http://localhost:3000
```

### 4. Start Local Ollama Model

Make sure [Ollama](https://ollama.com/) is installed, then run:

```bash
ollama run qwen2.5-coder:1.5b
```

This will download and start the Qwen 2.5 Coder model optimized for code generation.

### 5. Run the Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 📁 Project Structure

```
.
├── app/                     # App Router-based pages & routes
├── components/              # UI components
├── editor/                 # Monaco, File Explorer, Terminal
├── lib/                     # Utility functions
├── public/                  # Static files (incl. thumbnail)
├── utils/                   # AI helpers, WebContainer logic
├── .env.example             # Example env vars
└── README.md
```

---

## 🎯 Keyboard Shortcuts

* `Ctrl + Space` or `Double Enter`: Trigger AI suggestions
* `Tab`: Accept AI suggestion
* `/`: Open Command Palette (if implemented)

---

## ✅ Roadmap

* [x] Google & GitHub Auth via NextAuth
* [x] Multiple stack templates
* [x] Monaco Editor + AI
* [x] WebContainers + terminal
* [x] AI chat for code assistance
* [ ] GitHub repo import/export
* [ ] Save/load playground from DB
* [ ] Real-time collaboration
* [ ] Plugin system for templates/tools
* [ ] One-click deploy via Vercel/Netlify

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙏 Acknowledgements

* [Monaco Editor](https://microsoft.github.io/monaco-editor/)
* [Ollama](https://ollama.com/) – for offline LLMs
* [WebContainers](https://webcontainers.io/)
* [xterm.js](https://xtermjs.org/)
* [NextAuth.js](https://next-auth.js.org/)

```

