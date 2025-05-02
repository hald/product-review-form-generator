import OpenAI from "openai";
import { formStructureSchema, type FormStructure } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || ""
});

/**
 * Generates a form structure based on product type using OpenAI
 */
export async function generateFormStructure(productType: string): Promise<FormStructure> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key is not set. Please provide OPENAI_API_KEY in environment variables.");
    }

    const prompt = `
You are a helpful assistant that creates review form structures for different product types.
Generate a review form structure for "${productType}".

IMPORTANT GUIDELINES:
1. DO NOT INCLUDE ANY FIELDS THAT REQUEST PERSONALLY IDENTIFIABLE INFORMATION (PII) such as:
   - Name
   - Email
   - Phone number
   - Address
   - Location
   - Social media handles
   - User ID
   - Any personal contact information

2. ORGANIZE THE FORM LOGICALLY:
   - Start with a "General" section for overall ratings and impressions
   - Group related fields into clear, logical sections
   - Arrange sections in order of importance (most important first)
   - Keep the form concise (no more than 10-15 fields total)
   - Ensure each section has a clear purpose

3. FOCUS ON PRODUCT EXPERIENCE:
   - Include fields about product quality, performance, and value
   - Ask about specific features relevant to the product type
   - Include both objective (ratings) and subjective (comments) fields

Return the response as a JSON object with the following structure:
{
  "title": "string", // Title for the form, e.g. "Smartphone Review Form"
  "sections": ["string"], // Array of section names to organize the form (always include "General" first)
  "fields": [
    {
      "name": "string", // Field name in camelCase (e.g., "overallRating")
      "label": "string", // User-friendly field label (e.g., "Overall Rating")
      "type": "string", // Field type (one of: text, textarea, number, select, radio, checkbox, date, range, rating)
      "required": boolean, // Whether this field is required
      "options": [{ "label": "string", "value": "string" }], // Required for select, radio types
      "placeholder": "string", // Optional placeholder text
      "min": number, // Optional minimum value for number/range inputs
      "max": number, // Optional maximum value for number/range inputs
      "section": "string" // Section name this field belongs to (always provide this)
    }
  ]
}

Always include these standard fields in the "General" section:
- reviewTitle (text type, required): "Review Title"
- overallRating (rating type, required): "Overall Rating" 
- recommendProduct (radio type, required): "Would You Recommend This Product?" with options Yes/No/Maybe
- pros (textarea type): "What You Liked"
- cons (textarea type): "What Could Be Improved"

Then add product-specific fields that make sense for "${productType}" in logical sections.
For ratings, use the "rating" type (1-5 scale).
For "select" and "radio" types, always provide options array.
Make field labels clear, descriptive, and user-friendly.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a helpful assistant that generates accurate JSON structures for product review forms." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    // Parse the response content
    const parsedContent = JSON.parse(content);
    
    // Validate against our schema
    const validatedStructure = formStructureSchema.parse(parsedContent);
    
    return validatedStructure;
  } catch (error) {
    if (error instanceof ZodError) {
      // Convert Zod error to more readable format
      throw new Error(`Invalid form structure: ${fromZodError(error).message}`);
    }
    
    if (error instanceof SyntaxError) {
      throw new Error("Failed to parse OpenAI response as JSON");
    }
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error("Unknown error occurred while generating form structure");
  }
}
