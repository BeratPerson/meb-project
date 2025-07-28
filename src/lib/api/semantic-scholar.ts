// Semantic Scholar API Service
// https://api.semanticscholar.org/api-docs/

const SEMANTIC_SCHOLAR_BASE_URL = 'https://api.semanticscholar.org/graph/v1';

export interface SemanticScholarPaper {
  paperId: string;
  title: string;
  abstract: string;
  year: number;
  referenceCount: number;
  citationCount: number;
  influentialCitationCount: number;
  isOpenAccess: boolean;
  openAccessPdf: {
    url: string;
    status: string;
  };
  venue: string;
  publicationVenue: {
    id: string;
    name: string;
    type: string;
  };
  authors: Array<{
    authorId: string;
    name: string;
    url: string;
    affiliation: string;
  }>;
  fieldsOfStudy: string[];
  publicationTypes: string[];
  publicationDate: string;
  journal: {
    name: string;
    pages: string;
    volume: string;
  };
  externalIds: {
    DOI: string;
    ArXiv: string;
    PubMed: string;
    PubMedCentral: string;
  };
}

export interface SemanticScholarAuthor {
  authorId: string;
  name: string;
  url: string;
  affiliation: string;
  homepageUrl: string;
  paperCount: number;
  citationCount: number;
  hIndex: number;
  papers: SemanticScholarPaper[];
}

export interface SemanticScholarVenue {
  venueId: string;
  name: string;
  type: string;
  url: string;
  paperCount: number;
  citationCount: number;
  hIndex: number;
}

class SemanticScholarAPI {
  private baseUrl: string;
  private rateLimitDelay: number = 100; // ms between requests

  constructor() {
    this.baseUrl = SEMANTIC_SCHOLAR_BASE_URL;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async makeRequest(endpoint: string, params: Record<string, any> = {}): Promise<any> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    // Add parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });

    try {
      await this.delay(this.rateLimitDelay);
      
      const response = await fetch(url.toString(), {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'MEB-1416-Platform/1.0 (mailto:contact@meb1416.org)'
        }
      });

      if (!response.ok) {
        throw new Error(`Semantic Scholar API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Semantic Scholar API request failed:', error);
      throw error;
    }
  }

  // Search papers by query
  async searchPapers(query: string, fields?: string[], year?: number, limit: number = 20): Promise<SemanticScholarPaper[]> {
    const params: Record<string, any> = {
      query: query,
      limit: limit,
      fields: 'paperId,title,abstract,year,referenceCount,citationCount,influentialCitationCount,isOpenAccess,openAccessPdf,venue,publicationVenue,authors,fieldsOfStudy,publicationTypes,publicationDate,journal,externalIds'
    };

    if (fields && fields.length > 0) {
      params.fieldsOfStudy = fields.join(',');
    }

    if (year) {
      params.year = year;
    }

    const result = await this.makeRequest('/paper/search', params);
    return result.data || [];
  }

  // Get paper by ID
  async getPaper(paperId: string): Promise<SemanticScholarPaper> {
    const params = {
      fields: 'paperId,title,abstract,year,referenceCount,citationCount,influentialCitationCount,isOpenAccess,openAccessPdf,venue,publicationVenue,authors,fieldsOfStudy,publicationTypes,publicationDate,journal,externalIds'
    };

    return await this.makeRequest(`/paper/${paperId}`, params);
  }

  // Search authors
  async searchAuthors(query: string, limit: number = 20): Promise<SemanticScholarAuthor[]> {
    const params = {
      query: query,
      limit: limit,
      fields: 'authorId,name,url,affiliation,homepageUrl,paperCount,citationCount,hIndex'
    };

    const result = await this.makeRequest('/author/search', params);
    return result.data || [];
  }

  // Get author by ID
  async getAuthor(authorId: string): Promise<SemanticScholarAuthor> {
    const params = {
      fields: 'authorId,name,url,affiliation,homepageUrl,paperCount,citationCount,hIndex,papers.paperId,papers.title,papers.year,papers.citationCount'
    };

    return await this.makeRequest(`/author/${authorId}`, params);
  }

  // Get papers by field of study
  async getPapersByField(field: string, year?: number, limit: number = 20): Promise<SemanticScholarPaper[]> {
    const params: Record<string, any> = {
      query: field,
      limit: limit,
      fields: 'paperId,title,abstract,year,referenceCount,citationCount,influentialCitationCount,isOpenAccess,openAccessPdf,venue,publicationVenue,authors,fieldsOfStudy,publicationTypes,publicationDate,journal,externalIds'
    };

    if (year) {
      params.year = year;
    }

    const result = await this.makeRequest('/paper/search', params);
    return result.data || [];
  }

  // Get top papers by field
  async getTopPapersByField(field: string, year?: number, limit: number = 20): Promise<SemanticScholarPaper[]> {
    const params: Record<string, any> = {
      query: field,
      limit: limit,
      sort: 'citationCount:desc',
      fields: 'paperId,title,abstract,year,referenceCount,citationCount,influentialCitationCount,isOpenAccess,openAccessPdf,venue,publicationVenue,authors,fieldsOfStudy,publicationTypes,publicationDate,journal,externalIds'
    };

    if (year) {
      params.year = year;
    }

    const result = await this.makeRequest('/paper/search', params);
    return result.data || [];
  }

  // Get related papers
  async getRelatedPapers(paperId: string, limit: number = 10): Promise<SemanticScholarPaper[]> {
    const params = {
      limit: limit,
      fields: 'paperId,title,abstract,year,referenceCount,citationCount,influentialCitationCount,isOpenAccess,openAccessPdf,venue,publicationVenue,authors,fieldsOfStudy,publicationTypes,publicationDate,journal,externalIds'
    };

    const result = await this.makeRequest(`/paper/${paperId}/recommendations`, params);
    return result.data || [];
  }

  // Search for PhD programs (using specific keywords)
  async searchPhDPrograms(field: string, limit: number = 20): Promise<SemanticScholarPaper[]> {
    const query = `"PhD program" OR "doctoral program" OR "doctorate" ${field}`;
    
    const params = {
      query: query,
      limit: limit,
      fields: 'paperId,title,abstract,year,referenceCount,citationCount,influentialCitationCount,isOpenAccess,openAccessPdf,venue,publicationVenue,authors,fieldsOfStudy,publicationTypes,publicationDate,journal,externalIds'
    };

    const result = await this.makeRequest('/paper/search', params);
    return result.data || [];
  }

  // Get papers by author and field
  async getAuthorPapersByField(authorId: string, field: string, limit: number = 20): Promise<SemanticScholarPaper[]> {
    const params = {
      query: field,
      limit: limit,
      fields: 'paperId,title,abstract,year,referenceCount,citationCount,influentialCitationCount,isOpenAccess,openAccessPdf,venue,publicationVenue,authors,fieldsOfStudy,publicationTypes,publicationDate,journal,externalIds'
    };

    const result = await this.makeRequest(`/author/${authorId}/papers`, params);
    return result.data || [];
  }
}

export const semanticScholarAPI = new SemanticScholarAPI(); 