// ponytail: local embeddings via transformers.js — zero API cost, zero GPU needed.
// The model (~23MB) downloads once on first call, then runs in WASM on the server.
// Output is 384-dim vectors (all-MiniLM-L6-v2).

import { pipeline } from '@xenova/transformers'

// Cache the pipeline so the model loads only once
let embedder: ReturnType<typeof pipeline> | null = null

export async function embedText(text: string): Promise<number[]> {
  if (!embedder) {
    embedder = pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
  }

  const model = await embedder
  const output: any = await model(text, { pooling: 'mean', normalize: true } as any)
  return Array.from(output.data as Float32Array)
}
