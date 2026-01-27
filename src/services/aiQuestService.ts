// aiQuestService: small wrapper that can call OpenAI (if configured) or return mock quests
type Quest = {
  id: string;
  title: string;
  description: string;
  xp: number;
  locationHint?: string;
};

export async function generateQuestsNearby(
  lat?: number,
  lng?: number
): Promise<Quest[]> {
  // If OPENAI_API_KEY is available via env, you can wire a serverless call here.
  // For safety in this repo we return deterministic mock quests.
  return Promise.resolve([
    {
      id: "q1",
      title: "Hidden Alley Photo Hunt",
      description:
        "Find a colorful alley and take a photo. Bonus for golden hour lighting.",
      xp: 50,
      locationHint: "near old town",
    },
    {
      id: "q2",
      title: "Local Snack Discovery",
      description: "Try a local snack recommended by the AI and rate it.",
      xp: 30,
      locationHint: "market areas",
    },
  ]);
}
