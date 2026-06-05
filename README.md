# typecraft-cli ⚡

`typecraft-cli` is a minimal, AI-powered static analysis CLI tool that automatically detects missing TypeScript type definitions and generates accurate annotations using Hugging Face LLMs. 

Instead of cluttering your terminal with clumsy or unreadable raw strings, `typecraft-cli` cleanly extracts AI suggestions and writes them directly into a beautifully organized file named `type-checker.md` right inside your working directory.

---

## 🚀 Features

*   **Automated Type Detection:** Scans your TypeScript files to catch missing implicit `any` types or unannotated parameters.
*   **AI-Powered Annotations:** Leverages specialized open-source models via Hugging Face to generate precise TypeScript types.
*   **Clean Markdown Reports:** Automatically pipes and streams the AI responses into a dedicated **`type-checker.md`** file, making it easy to read side-by-side with your code in your favorite IDE.
*   **Zero CLI Clutter:** Keeps your terminal workspace clean while delivering comprehensive code fixes locally.

---
## 🔑 Prerequisites

This tool uses a Hugging Face model to process your code and generate type-fix suggestions. You will need an API token to get started:

1. Grab a free API token directly from your [Hugging Face Settings](https://huggingface.co/settings/tokens).
2. Create a `.env` file in the root directory of the project you want to scan.
3. Add your token to the file like this:
```env
   HF_TOKEN=your_hf_token_here
 ```  

## 📦 Installation

Install the package globally or locally via npm:

# Run instantly without installing
npx typecraft-cli

# Or install globally on your system
npm install -g typecraft-cli

## Usage

⚠️ **CRITICAL:** You must run this command strictly from your project's **root directory** (where your `package.json` and `.env` file reside). Do not execute this command from `src/` or any other subdirectories.

Simply execute the command in the root folder of your TypeScript project:

```bash
typecraft-cli
```
