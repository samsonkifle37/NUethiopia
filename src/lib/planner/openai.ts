import OpenAI from "openai";
import type { PlanningContext, PlannerDay } from "./types";

export async function enrichWithOpenAI(
  days: PlannerDay[],
  ctx: PlanningContext
): Promise<PlannerDay[]> {
  if (!process.env.OPENAI_API_KEY) {
    console.warn("OPENAI_API_KEY missing, skipping LLM enrichment");
    return days;
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  // We only want the LLM to rewrite 'theme' and 'reason' fields, and keep the structure exactly.
  // We'll pass the JSON to the LLM and ask it to return it with enriched reasoning.

  const prompt = `You are NU Planner — an Ethiopia travel intelligence engine.
Compose itinerary narrative from the supplied structured plan.
Never invent places. Use exact day count. Prefer verified entries.
Return only valid JSON matching the provided schema.

[CONTEXT]
Destination: ${ctx.destination}
Days: ${ctx.days}
Budget: ${ctx.budget}
Interests: ${ctx.interests.join(", ")}
Travel Style: ${ctx.travelStyle}
Pace: ${ctx.pace}
Group Type: ${ctx.groupType}

[SKELETON DATA]
${JSON.stringify(days, null, 2)}

[INSTRUCTIONS]
Rewrite the "theme" for each day to be more evocative and tailored to the context.
Rewrite the "reason" for each block. Explain why this specific place fits the user's interests, budget, and pace. Keep it concise (1-2 sentences).
If a block is not grounded (isGrounded: false), keep the reason focused on exploring the area.
Do not change placeIds, times, types, titles, or confidence levels.
Return a JSON object containing a "days" key with the array of updated days matching the original structure exactly, just with updated themes and reasons.

[SCHEMA EXPECTATION]
{
  "days": [
    // updated PlannerDay objects
  ]
}
`;

  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const output = res.choices[0]?.message?.content;
    if (output) {
      const parsed = JSON.parse(output);
      if (parsed.days && Array.isArray(parsed.days)) {
        return parsed.days;
      }
    }
  } catch (error) {
    console.error("OpenAI enrichment failed:", error);
  }
  return days;
}
