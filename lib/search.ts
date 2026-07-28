// ponytail: Minimal native fetch for internet search. Zero SDK bloat.
export async function searchInternet(query: string): Promise<string> {
  const apiKey = process.env.TAVILY_API_KEY
  if (!apiKey) return '' // graceful failure if unconfigured

  try {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        search_depth: 'advanced', // Gets deeper, high-quality content
        include_answer: true,
        max_results: 3
      })
    })

    if (!res.ok) throw new Error('Tavily search API error')

    const data = await res.json()
    // Join top chunks returned from LLM-optimized scraping
    return data.results
      .map((r: any) => `[Internet Source: ${r.title}]:\n${r.content}`)
      .join('\n\n')

  } catch (error) {
    // If the internet search fails, don't crash the RAG loop entirely.
    return ''
  }
}
