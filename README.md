# typecraft-cli

A minimalist, highly customizable, and distraction-free terminal-based typing test built for speed demons and keyboard enthusiasts. Test your words per minute (WPM), accuracy, and consistency right from your command line.

---

## 🚀 Features

* **Terminal-Native:** Clean, lightweight UI that fits perfectly into your existing workflow.
* **Real-time Stats:** Track your WPM, raw WPM, accuracy, and error count as you type.
* **Custom Modes:** Choose between timed tests (15, 30, 60 seconds) or word-count goals.
* **Syntax Highlighting:** Clear visual feedback for correct characters, typos, and unreached text.
* **No Bloat:** Zero tracking, zero ads—just pure typing.

---

## 🛠️ Installation

## 🔑 Prerequisites

This tool uses Hugging Face to generate type-fix suggestions. 

1. Get a free API token from [Hugging Face](https://huggingface.co/settings/tokens).
2. Create a `.env` file in the root of the project you want to scan.
3. Add your token to the file:
   ```env
   HUGGINGFACE_TOKEN=your_hf_token_here

### Build from Source
Clone the repository and build the binary manually:

```bash
# Clone the repository
git clone [https://github.com/Dreamervamsi/typd.git](https://github.com/Dreamervamsi/typd.git)

# Navigate into the project directory
cd typd

# Build the project
node build -o typd

# (Optional) Move it to your local bin to run it from anywhere
mv typd /usr/local/bin/
