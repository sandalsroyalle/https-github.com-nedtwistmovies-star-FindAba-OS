const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export async function askElderKalu(
  messages: ChatMessage[],
  systemPrompt: string
): Promise<string> {
  try {
    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://findaba.com.ng',
          'X-Title': 'FindAba - Elder Kalu AI',
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.3-70b-instruct',
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            ...messages,
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error('OpenRouter API Error:', errorText);

      throw new Error(
        `OpenRouter request failed (${response.status})`
      );
    }

    const data = await response.json();

    console.log('OpenRouter response:', data);

    const content =
      data?.choices?.[0]?.message?.content;

    if (!content || typeof content !== 'string') {
      throw new Error('Invalid AI response format');
    }

    return content.trim();
  } catch (error) {
    console.error('Elder Kalu Error:', error);

    return 'Elder Kalu is temporarily unavailable. Please try again shortly.';
  }
}
