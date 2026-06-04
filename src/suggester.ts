import { InferenceClient } from '@huggingface/inference';
import type { Finding } from './analyzer.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const hf = new InferenceClient(process.env.HF_TOKEN);

export async function getSuggestion(finding: Finding): Promise<string> {
  const prompt = `
You are an expert TypeScript assistant. Review the following static analysis finding where a type annotation is missing, and provide the exact fix.

FILE: ${finding.file}
LINE: ${finding.line}
ISSUE TYPE: ${finding.kind}
DESCRIPTION: ${finding.message}

CODE SNIPPET CONTEXT:
\`\`\`typescript
${finding.code}
\`\`\`

INSTRUCTIONS:
1. Identify how to fix the missing type annotation.
2. Provide a clear, brief explanation of the recommended type.
3. Give the suggestion in the form of markdown.
`;

  try {
    const chatCompletion = await hf.chatCompletion({
      model: 'meta-llama/Meta-Llama-3-8B-Instruct',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 512,
    });

    const suggestion = chatCompletion.choices[0]?.message?.content;

    if (!suggestion) {
      throw new Error('Received an empty response from Hugging Face Inference API.');
    }

    return suggestion.trim();
  } catch (error) {
    throw new Error(`Failed to generate suggestion: ${error instanceof Error ? error.message : String(error)}`);
  }
}