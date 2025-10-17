# 🚀 3D Developer Portfolio

A modern, animated 3D developer portfolio built with React, Three.js, TailwindCSS, and motion effects — designed to help you stand out and showcase your skills creatively.

![3d Portfolio Screenshot GitHub](https://github.com/user-attachments/assets/9b0ed20e-074e-4f2a-81d8-20c9da751e9e)

---

## 📚 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Assets](#-assets)
- [Contact Me](#-contact-me)
- [Suggestions or Feedback](#-suggestions-or-feedback)
- [Like This Project?](#-like-this-project)

---

## ✨ Features

- 🔥 3D visuals powered by **React Three Fiber** and **Drei**
- ⚡ Smooth transitions and scroll-based animations using **Framer Motion**
- 🎨 Clean, responsive UI with **TailwindCSS**
- 💌 Working contact form using **EmailJS**
- 🧱 Beautiful UI enhancements with **Aceternity UI** and **Magic UI**
- 🚀 Lightning-fast development with **Vite**

---

## 🛠 Tech Stack

| Tech              | Description                           |
|-------------------|---------------------------------------|
| React             | Front-end JavaScript library          |
| Vite              | Fast bundler and dev environment      |
| TailwindCSS       | Utility-first CSS framework           |
| React Three Fiber | 3D rendering with Three.js in React   |
| Drei              | Helpers and abstractions for R3F      |
| Framer Motion     | Animation library for React           |
| EmailJS           | Form handling and email integration   |
| Aceternity UI     | Custom UI components                  |
| Magic UI          | Prebuilt UI elements and design extras|

---

## 📁 Project Structure

```bash
├── public/
│   ├── assets/             # Images, textures, models
│   ├── models/             # 3D Astronaut model
│   └── vite.svg
├── src/
│   ├── components/         # Reusable components
│   ├── constants/          # Reusable datas
│   ├── sections/           # Portfolio sections (Hero, About, etc.)
│   ├── App.jsx             # Main app file
│   ├── index.css           # Tailwind css
│   └── main.jsx            # Entry point
├── tailwind.config.js
└── vite.config.js
```

---

## 🚀 Getting Started
1. Clone the Repository
```bash
git clone https://github.com/Ali-Sanati/Portfolio.git
cd Portfolio
```
2. Install Dependencies
```bash
npm install
```
3. Run the Development Server
```bash
npm run dev
```
The app will be available at http://localhost:5173.

---

## 🔗 Assets
Assets used in the project can be found [here](https://github.com/user-attachments/files/19820923/public.zip)

---

## 📬 Contact Me
[![Instagram](https://img.shields.io/badge/Instagram-%23E4405F.svg?logo=Instagram&logoColor=white)](https://www.instagram.com/ali.sanatidev/reels/) 
[![Static Badge](https://img.shields.io/badge/Youtube-%23FF0033?style=flat&logo=youtube)](https://www.youtube.com/channel/UCZhtUWTtk3bGJiMPN9T4HWA)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ali-sanati/) 

---

## 💡 Suggestions or Feedback?
Leave a comment on the [YouTube video](https://youtu.be/S9UQItTpwUQ) or open an issue here on GitHub.<br/>
👉 What should I build next?

- A beautiful Landing Page

- A complete E-commerce site

- A fun App Clone (YouTube, Netflix, etc.)

Or another interactive Portfolio

Let me know!

---

## ⭐ Like This Project?
Star the repo and [subscribe](https://www.youtube.com/channel/UCZhtUWTtk3bGJiMPN9T4HWA??sub_confirmation=1) to the YouTube channel for more dev content!

---

## 🤖 AI Chat widget (local dev)
This project includes a minimal client-side chat widget (`src/components/ChatWidget.jsx`) that calls a local proxy to the OpenAI Chat API.

To run it locally:

1. Install dependencies (if you haven't):

```bash
npm install
```

2. Set your OpenAI key and start the local proxy server (from project root):

```powershell
setx OPENAI_API_KEY "your_openai_key_here"; node server/openai-proxy.cjs
```

3. In another terminal run the dev server:

```powershell
npm run dev
```

4. Open the site at http://localhost:5173 and use the chat button at the bottom-right.

Security: Do not expose your OpenAI key in client-side code. The included `server/openai-proxy.js` is only for local testing. Use a proper serverless function or backend for production.

Environment file (.env)
---------------------------------
You can copy `.env.example` to `.env` and set your `OPENAI_API_KEY` there. The project `.gitignore` already ignores `.env` so your key won't be committed.

If you want the proxy to load values from `.env` automatically, install `dotenv` and add this near the top of `server/openai-proxy.cjs`:

```js
require('dotenv').config();
```

Then run the proxy with:

```powershell
node server/openai-proxy.cjs
```
