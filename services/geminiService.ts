import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

let aiInstance: GoogleGenAI | null = null;

const getAIInstance = (): GoogleGenAI => {
  if (!aiInstance) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key not found in environment variables");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

export const createChatSession = (): Chat => {
  const ai = getAIInstance();
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7, // Balance between creativity and accuracy
      maxOutputTokens: 2000,
    }
  });
};

export const sendMessageToGemini = async (chat: Chat, message: string): Promise<string> => {
  try {
    const result: GenerateContentResponse = await chat.sendMessage({ message });
    return result.text || "抱歉，我无法生成回复。";
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    return "与 AI 导师通信时出错。请检查您的网络连接或 API 密钥。";
  }
};

export const explainTopic = async (promptContext: string): Promise<string> => {
    const ai = getAIInstance();
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `请为以下主题提供结构化的迷你课程：${promptContext}。包含清晰的中文解释和代码示例。`,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION
            }
        });
        return response.text || "无法生成课程内容。";
    } catch (error) {
        console.error("Error explaining topic:", error);
        return "加载课程内容失败。";
    }
}