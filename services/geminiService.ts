
import { GoogleGenAI, Type } from "@google/genai";
import type { UserInfo, FortuneData, FortuneImagePrompts, FortuneImages } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fortuneSchema = {
  type: Type.OBJECT,
  properties: {
    meal: { type: Type.STRING, description: "A single meal menu item, e.g., 'Kimchi stew' or 'Pasta'." },
    color: { type: Type.STRING, description: "A single lucky color, e.g., 'Red' or 'Sky Blue'." },
    number: { type: Type.INTEGER, description: "A single lucky number between 1 and 100." },
    proverb: { type: Type.STRING, description: "A short, positive proverb or fortune cookie message." },
    imagePrompts: {
      type: Type.OBJECT,
      properties: {
        meal: { type: Type.STRING, description: "A DALL-E style prompt for a visually appealing, photorealistic image of the suggested meal." },
        color: { type: Type.STRING, description: "A DALL-E style prompt for an abstract, beautiful image representing the lucky color. Focus on textures and mood." },
        number: { type: Type.STRING, description: "A DALL-E style prompt for a creative, artistic, and stylized representation of the lucky number. Not just the digit, but art based on it." },
        proverb: { type: Type.STRING, description: "A DALL-E style prompt for a serene, symbolic, and inspiring landscape or scene that visually represents the essence of the proverb." },
      },
      required: ["meal", "color", "number", "proverb"]
    },
  },
  required: ["meal", "color", "number", "proverb", "imagePrompts"],
};

export const generateFortune = async (userInfo: UserInfo): Promise<FortuneData> => {
  const prompt = `Based on the user's gender (${userInfo.gender}) and date of birth (${userInfo.dob}), generate a unique daily fortune. Ensure the lucky number is between 1 and 100. Generate four distinct, creative image prompts for a 2x2 grid that correspond to each fortune item.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: fortuneSchema,
      },
    });

    const jsonString = response.text.trim();
    const fortuneData = JSON.parse(jsonString);

    // Validate lucky number
    if(fortuneData.number < 1 || fortuneData.number > 100) {
        fortuneData.number = Math.floor(Math.random() * 100) + 1;
    }

    return fortuneData as FortuneData;
  } catch (error) {
    console.error("Error generating fortune:", error);
    throw new Error("Could not connect to the fortune teller. Please check your connection and try again.");
  }
};


const generateSingleImage = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '1:1',
            },
        });
        if (response.generatedImages && response.generatedImages.length > 0) {
            return response.generatedImages[0].image.imageBytes;
        } else {
            throw new Error('No image was generated.');
        }
    } catch (error) {
        console.error(`Error generating image for prompt "${prompt}":`, error);
        throw new Error("Failed to generate an image.");
    }
}

export const generateImages = async (prompts: FortuneImagePrompts): Promise<FortuneImages> => {
    try {
        const [mealImg, colorImg, numberImg, proverbImg] = await Promise.all([
            generateSingleImage(prompts.meal),
            generateSingleImage(prompts.color),
            generateSingleImage(prompts.number),
            generateSingleImage(prompts.proverb)
        ]);

        return {
            meal: mealImg,
            color: colorImg,
            number: numberImg,
            proverb: proverbImg
        };
    } catch (error) {
        console.error("Error generating image grid:", error);
        throw new Error("Could not generate the fortune images. Please try again.");
    }
}
