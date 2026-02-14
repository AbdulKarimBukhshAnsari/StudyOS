import { QUIZ_GENERATION_SYSTEM_PROMPT, buildQuizUserPrompt } from '@/constants/quizPrompt';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

export interface QuizQuestionFromAI {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

function getGroqApiKey(): string {
  const key = process.env.NEXT_PUBLIC_GROQ_API_KEY_QUIZ_GENERATION;
  if (!key) throw new Error('GROQ_API_KEY or NEXT_PUBLIC_GROQ_API_KEY_QUIZ_GENERATION is not set');
  return key;
}

export async function generateQuizQuestions(params: {
  notesContent: string;
  numQuestions: number;
  questionType: string;
  complexity: string;
}): Promise<QuizQuestionFromAI[]> {
  const userPrompt = buildQuizUserPrompt({
    notesContent: params.notesContent.slice(0, 28000),
    numQuestions: params.numQuestions,
    questionType: params.questionType,
    complexity: params.complexity,
  });

  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getGroqApiKey()}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: QUIZ_GENERATION_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 4096,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GROQ API error ${res.status}: ${err}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const raw =
    data?.choices?.[0]?.message?.content?.trim();
  if (!raw) throw new Error('Empty response from GROQ');

  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  let arr: unknown[];
  try {
    arr = JSON.parse(cleaned) as unknown[];
  } catch {
    throw new Error('Invalid JSON from GROQ');
  }

  if (!Array.isArray(arr)) throw new Error('Response is not an array');

  const questions: QuizQuestionFromAI[] = [];
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i] as Record<string, unknown>;
    if (!item || typeof item.question !== 'string' || !Array.isArray(item.options)) continue;
    const correctAnswer = Number(item.correctAnswer);
    if (!Number.isInteger(correctAnswer) || correctAnswer < 0 || correctAnswer >= item.options.length)
      continue;
    questions.push({
      question: item.question,
      options: item.options.filter((o): o is string => typeof o === 'string'),
      correctAnswer,
      explanation: typeof item.explanation === 'string' ? item.explanation : undefined,
    });
  }
  return questions;
}
