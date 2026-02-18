import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini client
// Note: In a real production app, ensure this is handled securely or via a backend proxy.
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export const generateSupportResponse = async (query: string): Promise<string> => {
  if (!apiKey) return "API Key not configured. Please set process.env.API_KEY.";
  
  try {
    const model = 'gemini-3-flash-preview';
    const systemInstruction = `You are a helpful and empathetic customer support agent for "Spotify Enhanced". 
    Key features of the app: 
    - AI Music Detection
    - Dynamic Themes
    - Playlist Battles
    - Deep Stats
    - Shared Listening
    
    Keep answers concise, friendly, and helpful. If a user asks about bugs, apologize and suggest clearing cache.`;

    const response = await ai.models.generateContent({
      model,
      contents: query,
      config: {
        systemInstruction,
      }
    });

    return response.text || "I'm having trouble thinking right now. Please try again later.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I am currently offline. Please try again later.";
  }
};

export const analyzePlaylistVibe = async (playlistName: string, tracks: string[]): Promise<string> => {
    if (!apiKey) return "AI Analysis requires API Key.";

    try {
        const model = 'gemini-3-flash-preview';
        const prompt = `Analyze the vibe of a playlist named "${playlistName}" containing these artists: ${tracks.join(', ')}. 
        Give me a 1-sentence catchy description and 3 keywords using emojis.`;

        const response = await ai.models.generateContent({
            model,
            contents: prompt,
        });

        return response.text || "Vibe analysis unavailable.";
    } catch (e) {
        return "Could not analyze vibe.";
    }
}
