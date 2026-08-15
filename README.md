# Raunak Agrahari — Developer Portfolio

A premium, interactive, and fully responsive developer portfolio website. Built as a static React application, this site is optimized to run serverless and host for free on **GitHub Pages**, Vercel, Netlify, or similar platforms.

---

## ✨ Features

- **Dynamic Theme Selector:** Cyber-Navy, Carbon AMOLED, and Light Glass themes.
- **Developer Terminal Interface:** Fully interactive simulated Unix-style terminal executing custom commands (`about`, `skills`, `projects`, `stats`, `resume`, `clear`, etc.).
- **Interactive Project Showcase:** Categorized grids showing projects, stacks, challenges faced, and achievements.
- **Serverless Contact Form:** Fully functional contact submission form powered by Web3Forms (delivers messages directly to your email inbox without a backend server).

---

## 🛠️ Tech Stack

- **Framework:** React 18
- **Build System:** Vite
- **Styling:** Vanilla CSS (TailwindCSS free, customized glassmorphism and keyframe animations)
- **Email Delivery:** Web3Forms API (Serverless)

---

## 🚀 Getting Started

### 1. Install Dependencies
Run this in the project root:
```bash
npm install
```

### 2. Configure Email Notifications
1. Get a free access key from [Web3Forms](https://web3forms.com/) (takes 5 seconds, just enter your email).
2. Create a `.env` file in the root directory:
   ```env
   VITE_WEB3FORMS_KEY=your-access-key-here
   ```

### 3. Run Locally (Development Mode)
Launch the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
To compile the static React files into HTML, JS, and CSS for web servers:
```bash
npm run build
```
The compiled, optimized site is generated inside the `dist/` directory.
