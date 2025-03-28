# Popcorn Shop with AI-Powered Recommendations

A modern e-commerce platform for Popcorn products featuring AI-powered product recommendations using Azure OpenAI.

## Technology Stack

### [Backend (REST API)](./rest/README.md)

The backend is built with NestJS and provides a robust REST API. See the [backend documentation](./rest/README.md) for:

- Detailed setup instructions
- API endpoints
- Database configuration
- Development commands
- Docker deployment
- Authentication flows
- AI integration details

### [Frontend](./web/README.md)

The frontend is built with Next.js and provides a modern user interface. See the [frontend documentation](./web/README.md) for:

- Project setup
- Development workflow
- Component structure
- Styling guidelines
- Build and deployment
- Integration with backend

## LLM Integration Approach

The project leverages Azure OpenAI's GPT-3.5-turbo model through a multi-step recommendation process:

1. **Query Processing**

   - Extracts key search terms from natural language input
   - Filters common words and short terms for better matching
   - Preserves user intent while optimizing for product search

2. **Product Context Building**

   - Searches product catalog using processed terms
   - Builds structured context from matched products
   - Includes product names, descriptions, prices, and categories

3. **Intelligent Prompting**

   - Uses a two-part prompt structure:
     - System prompt: Defines the AI's role as a product recommendation assistant
     - User prompt: Combines product context with customer query
   - Includes specific guidance for considering features, use cases, pricing, and relevance

4. **Response Generation**
   - Generates natural, conversational recommendations
   - Ensures responses include specific product details
   - Provides reasoning for each recommendation

## Trade-offs and Future Improvements

### Current Trade-offs

- **Context Window Management**:

  - Current: Single-turn conversations without history
  - Impact: Each query is processed independently, missing potential context from previous interactions
  - Example: Can't reference "the red popcorn I asked about earlier"

- **Search Precision vs Recall**:

  - Current: Simple term-based search with PostgreSQL
  - Impact: Limited fuzzy matching and semantic search capabilities
  - Example: Searching for "movie night snacks" might not match "cinema treats"

- **Database Structure**:
  - Current: Relational PostgreSQL database
  - Impact: Rigid schema limits flexibility for varied product attributes
  - Example: Adding new product features requires schema modifications

### Planned Improvements

- Implement conversation state management to maintain context across queries
- Migrate to a hybrid database approach:
  - MongoDB for flexible product schema
  - Elasticsearch for advanced search capabilities:
    - Fuzzy matching
    - Semantic search
    - Multi-language support
    - Custom scoring and boosting
- Enhance prompt engineering with:
  - Product popularity metrics
  - Customer review insights
  - Seasonal relevance
- Develop robust fallback recommendation system
- Add request caching with intelligent invalidation
- Implement response streaming for faster initial display
- Optimize search performance with:
  - Elasticsearch synonyms
  - Custom analyzers
  - Relevance tuning
  - Aggregations for faceted search
