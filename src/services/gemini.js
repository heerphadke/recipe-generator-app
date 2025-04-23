import { GoogleGenerativeAI } from '@google/generative-ai';

export const generateRecipe = async (ingredients) => {
  try {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key is missing. Please check your .env file.');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    console.log('Generating recipe for ingredients:', ingredients);

    const prompt = `Generate a simple recipe using only the provided ingredients. Format the recipe exactly as shown below:

[Recipe Title] - simple and descriptive

Ingredients:
• [Ingredient 1] - [basic descriptor if needed]
• [Ingredient 2] - [basic descriptor if needed]
(list all ingredients with bullet points)

Instructions:
1. [First step]
2. [Second step]
3. [Third step]
(number each step, use clear and concise language)

Rules:
- Keep the recipe simple and straightforward
- Use only the provided ingredients: ${ingredients.join(', ')}
- Format exactly as shown above with bullet points for ingredients and numbered steps
- Keep instructions clear and brief
- Don't add any extra sections or notes
- Don't suggest additional ingredients
- Don't include cooking time or servings`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Detailed error in generateRecipe:', error);
    if (!process.env.REACT_APP_GEMINI_API_KEY) {
      throw new Error('API key is missing. Please add REACT_APP_GEMINI_API_KEY to your .env file');
    }
    throw error;
  }
}; 