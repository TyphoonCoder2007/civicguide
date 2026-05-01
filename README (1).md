# CivicGuide: AI-Powered Election Assistant

[![React](https://img.shields.io/badge/React-19.0.1-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.3-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.14-38B2AC.svg)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-Available-4285F4.svg)](https://ai.google.dev/)

CivicGuide is an advanced, interactive AI assistant designed to educate users about the Indian electoral system. Built with a modern tech stack and powered by Google's Gemini AI, it simplifies complex election processes (Lok Sabha, Vidhan Sabha, Panchayats), voter registration (EPIC, NVSP), finding polling booths, and timelines into easy-to-understand, engaging experiences.

## ✨ Key Features

*   **Interactive Election Timeline:** Step-by-step breakdown of the election cycle, from notification to results, with deep-dive AI explanations.
*   **Voter Registration Guide:** Clear eligibility requirements and actionable steps for online (NVSP) and offline (BLO) registration.
*   **Voting Options & Ballot Explainer:** Learn about different voting methods (EVMs, Postal Ballots) and understand the roles of various elected positions (MP, MLA, President, etc.).
*   **Advanced AI Chat Assistant:** Ask any election-related question. The AI provides neutral, factual, and unbiased information strictly based on Election Commission of India (ECI) guidelines.
*   **Interactive Simulations:** Roleplay and learn! Generate guided simulations to experience elections as a **Voter**, **Candidate**, or **Election Officer**.
*   **Personalized Voting Plan:** The AI can generate a custom, printable checklist based on your chat history and selected state to ensure you are ready for Election Day.
*   **Contextual "Deep Dive with AI":** Quick-action buttons embedded throughout the UI allow users to instantly ask the AI for analogies, examples, or specific details about the content they are reading.

## 🚀 Technology Stack

*   **Frontend:** React 19, TypeScript, Vite
*   **Styling:** Tailwind CSS 4, Lucide React (Icons)
*   **AI Integration:** `@google/genai` (Google Gemini API)
*   **Markdown Rendering:** `react-markdown`, `remark-gfm`

## 🛠️ Getting Started

### Prerequisites

*   Node.js (v18 or higher recommended)
*   A Google Gemini API Key

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/civicguide.git
    cd civicguide
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the root directory and add your Gemini API Key:
    ```env
    VITE_GEMINI_API_KEY="your_api_key_here"
    ```
    *Note: If running in AI Studio, the environment variable `GEMINI_API_KEY` is automatically injected.*

4.  **Start the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

5.  Open your browser and navigate to `http://localhost:3000`.

## 📁 Project Structure

```
├── src/
│   ├── components/      # UI components (if separated later)
│   ├── data/            # Static data (elections timelines, options)
│   │   └── electionData.ts
│   ├── lib/             # Utility functions and API integrations
│   │   ├── gemini.ts    # Gemini API wrapper & system prompts
│   │   └── utils.ts     # Tailwind class merging utility
│   ├── App.tsx          # Main application component & layout
│   ├── main.tsx         # React entry point
│   └── index.css        # Global styles & Tailwind entry
├── .env.example         # Example environment variables
├── package.json         # Project dependencies and scripts
├── tailwind.config.js   # Tailwind CSS configuration
└── vite.config.ts       # Vite configuration
```

## 🧠 AI System Instructions Overview

CivicGuide uses specialized system instructions for the Gemini API to ensure behavior alignment:
*   **Impartiality:** Strictly neutral, non-partisan, avoiding any political bias or predictions.
*   **Structure:** Responses are structured using overviews, steps, timelines, and important notes.
*   **Authoritative:** Prompts are instructed to guide users to official ECI websites when needed.
*   **Safety:** Polite refusal to guess specific local laws if exact data is missing, directing users to official sources.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/civicguide/issues).
