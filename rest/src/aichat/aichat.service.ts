import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Configuration, OpenAIApi } from 'azure-openai';
import { AIChat } from './entities/aichat.entity';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AIChatService {
  private openAiApi: OpenAIApi;

  constructor(
    @InjectRepository(AIChat)
    private AIChatRepository: Repository<AIChat>,
    private productsService: ProductsService,
    private configService: ConfigService,
  ) {
    this.openAiApi = new OpenAIApi(
      new Configuration({
        apiKey: this.configService.get<string>('OPENAI_API_KEY'),
        azure: {
          apiKey: this.configService.get<string>('OPENAI_API_KEY'),
          endpoint: this.configService.get<string>('OPENAI_AZURE_ENDPOINT'),
          deploymentName: this.configService.get<string>(
            'OPENAI_AZURE_DEPLOYMENT',
          ),
        },
      }),
    );
  }

  async create(
    userId: string,
    query: string,
    response: string,
  ): Promise<AIChat> {
    const chat = this.AIChatRepository.create({
      userId,
      query,
      response,
    });
    return this.AIChatRepository.save(chat);
  }

  async generateResponse(query: string): Promise<string> {
    // Step 1: Extract key terms from the natural language query
    // Remove common words like "recommend", "product", "me", "a", etc
    const searchTerms = query
      .toLowerCase()
      .replace(/recommend|product|me|a|that|is/g, '')
      .trim()
      .split(' ')
      .filter((term) => term.length > 2) // Filter out very short words
      .join(' ');

    // Step 2: Search for relevant products using the extracted terms
    const page = 1;
    const limit = 10;
    const { items: products } = await this.productsService.search(
      searchTerms,
      page,
      limit,
    );

    // Step 3: Build product context from search results
    let productContext = '';
    if (products.length > 0) {
      // Format matched products into searchable context
      for (const product of products) {
        productContext += `Product: ${product.name}\n`;
        productContext += `Description: ${product.description}\n`;
        productContext += `Price: $${product.price}\n`;
        productContext += `Category: ${product.category}\n\n`;
      }
    }

    // Step 4: Craft the prompt for natural language product recommendations
    const prompt = `
You are a knowledgeable product recommendation assistant. Based on the following relevant products from our catalog:

${productContext}

Please analyze the customer's query: "${query}" and recommend the most suitable products from the above list.
Consider factors like:
- How well the product features match the customer's requirements
- Use cases and practical applications
- Price point (if mentioned)
- Category relevance
- Overall suitability for their needs

If no products seem to be a good match, please explain why and suggest what types of products they might want to look for elsewhere.

Format your response in a natural, conversational way, but make sure to include:
- Specific product names
- Key features that match their needs
- Prices
- Clear reasoning for why each recommended product would be a good fit

Customer query: ${query}
`;

    // Step 5: Get AI-powered product recommendations
    try {
      const completion = await this.openAiApi.createChatCompletion({
        model: this.configService.get<string>('OPENAI_AZURE_DEPLOYMENT'),
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful product recommendation assistant that provides specific product suggestions based on the available catalog. Focus on matching customer needs with product features.',
          },
          { role: 'user', content: prompt },
        ],
        max_tokens: 1000,
      });

      return completion.data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      return 'Sorry, I encountered an error when trying to generate product recommendations.';
    }
  }
}
