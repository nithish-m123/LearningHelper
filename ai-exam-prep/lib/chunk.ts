// Split markdown text into ~500-word chunks on heading boundaries
// ponytail: simple split, no overlap — add sliding window if retrieval quality drops
export function chunkMarkdown(text: string, maxWords = 500): string[] {
  const sections = text.split(/(?=^#{1,3} )/m).filter(Boolean)
  const chunks: string[] = []

  for (const section of sections) {
    const words = section.split(/\s+/)
    if (words.length <= maxWords) {
      chunks.push(section.trim())
    } else {
      // section too long — split by word count
      for (let i = 0; i < words.length; i += maxWords) {
        chunks.push(words.slice(i, i + maxWords).join(' '))
      }
    }
  }

  return chunks.filter(c => c.length > 40) // skip tiny fragments
}
