// OpenAlex API Service
// https://docs.openalex.org/

const OPENALEX_BASE_URL = 'https://api.openalex.org';

export interface OpenAlexInstitution {
  id: string;
  display_name: string;
  country_code: string;
  type: string;
  city: string;
  region: string;
  homepage_url: string;
  image_url: string;
  image_thumbnail_url: string;
  works_count: number;
  cited_by_count: number;
  summary_stats: {
    works_count: number;
    cited_by_count: number;
    h_index: number;
  };
  counts_by_year: Array<{
    year: number;
    works_count: number;
    cited_by_count: number;
  }>;
  geo: {
    city: string;
    region: string;
    country: string;
    country_code: string;
    latitude: number;
    longitude: number;
  };
  international: {
    display_name: Record<string, string>;
  };
}

export interface OpenAlexWork {
  id: string;
  title: string;
  display_name: string;
  publication_year: number;
  publication_date: string;
  type: string;
  authorships: Array<{
    author: {
      id: string;
      display_name: string;
      orcid: string;
    };
    institutions: Array<{
      id: string;
      display_name: string;
      country_code: string;
      type: string;
    }>;
  }>;
  concepts: Array<{
    id: string;
    display_name: string;
    level: number;
  }>;
  cited_by_count: number;
  biblio: {
    volume: string;
    issue: string;
    first_page: string;
    last_page: string;
  };
  host_venue: {
    id: string;
    display_name: string;
    issn_l: string;
    issn: string[];
    url: string;
  };
}

export interface OpenAlexConcept {
  id: string;
  display_name: string;
  level: number;
  description: string;
  works_count: number;
  cited_by_count: number;
  ancestors: Array<{
    id: string;
    display_name: string;
    level: number;
  }>;
  related_concepts: Array<{
    id: string;
    display_name: string;
    level: number;
    score: number;
  }>;
}

export interface OpenAlexAuthor {
  id: string;
  display_name: string;
  orcid: string;
  email: string;
  works_count: number;
  cited_by_count: number;
  summary_stats: {
    works_count: number;
    cited_by_count: number;
    h_index: number;
  };
  last_known_institution: {
    id: string;
    display_name: string;
    country_code: string;
    type: string;
  };
  x_concepts: Array<{
    id: string;
    display_name: string;
    level: number;
    score: number;
  }>;
}

class OpenAlexAPI {
  private baseUrl: string;
  private rateLimitDelay: number = 100; // ms between requests

  constructor() {
    this.baseUrl = OPENALEX_BASE_URL;
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
        throw new Error(`OpenAlex API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('OpenAlex API request failed:', error);
      throw error;
    }
  }

  // Search institutions (universities)
  async searchInstitutions(query: string, country?: string, limit: number = 20): Promise<OpenAlexInstitution[]> {
    const params: Record<string, any> = {
      search: query,
      filter: 'type:education',
      per_page: Math.min(limit, 200), // OpenAlex max per_page is 200
      sort: 'cited_by_count:desc' // Sort by citation count to get top universities
    };

    if (country) {
      params.filter = `${params.filter},country_code:${country.toUpperCase()}`;
    }

    try {
      const result = await this.makeRequest('/institutions', params);
      let institutions = result.results || [];
      
      // If we need more results and there are more pages, fetch them
      if (limit > 200 && result.meta?.next_cursor) {
        console.log("📄 Fetching additional pages for more universities...");
        let cursor = result.meta.next_cursor;
        let pageCount = 1;
        
        while (institutions.length < limit && cursor && pageCount < 5) { // Max 5 pages to avoid rate limiting
          params.cursor = cursor;
          const nextResult = await this.makeRequest('/institutions', params);
          if (nextResult.results && nextResult.results.length > 0) {
            institutions = institutions.concat(nextResult.results);
            cursor = nextResult.meta?.next_cursor;
            pageCount++;
          } else {
            break;
          }
        }
      }
      
      console.log(`📊 Total institutions found: ${institutions.length} (requested: ${limit})`);
      return institutions.slice(0, limit);
    } catch (error) {
      console.error('Error searching institutions:', error);
      return [];
    }
  }

  // Get institution by ID
  async getInstitution(id: string): Promise<OpenAlexInstitution> {
    return await this.makeRequest(`/institutions/${id}`);
  }

  // Search works (publications) by field/concept
  async searchWorks(query: string, field?: string, year?: number, limit: number = 20): Promise<OpenAlexWork[]> {
    const params: Record<string, any> = {
      search: query,
      per_page: limit
    };

    if (field) {
      params.filter = `concepts.display_name:${field}`;
    }

    if (year) {
      params.filter = params.filter ? `${params.filter},publication_year:${year}` : `publication_year:${year}`;
    }

    const result = await this.makeRequest('/works', params);
    return result.results || [];
  }

  // Search concepts (research fields)
  async searchConcepts(query: string, level?: number, limit: number = 20): Promise<OpenAlexConcept[]> {
    const params: Record<string, any> = {
      search: query,
      per_page: limit
    };

    if (level) {
      params.filter = `level:${level}`;
    }

    const result = await this.makeRequest('/concepts', params);
    return result.results || [];
  }

  // Get top institutions by field
  async getTopInstitutionsByField(field: string, country?: string, limit: number = 20): Promise<OpenAlexInstitution[]> {
    const params: Record<string, any> = {
      filter: `type:education,works_count:>100`,
      sort: 'cited_by_count:desc',
      per_page: limit
    };

    if (country) {
      params.filter = `${params.filter},country_code:${country.toUpperCase()}`;
    }

    const result = await this.makeRequest('/institutions', params);
    return result.results || [];
  }

  // Get works from specific institution
  async getInstitutionWorks(institutionId: string, field?: string, year?: number, limit: number = 20): Promise<OpenAlexWork[]> {
    const params: Record<string, any> = {
      filter: `institutions.id:${institutionId}`,
      per_page: limit
    };

    if (field) {
      params.filter = `${params.filter},concepts.display_name:${field}`;
    }

    if (year) {
      params.filter = `${params.filter},publication_year:${year}`;
    }

    const result = await this.makeRequest('/works', params);
    return result.results || [];
  }

  // Get related concepts
  async getRelatedConcepts(conceptId: string, limit: number = 10): Promise<OpenAlexConcept[]> {
    const concept = await this.makeRequest(`/concepts/${conceptId}`);
    return concept.related_concepts?.slice(0, limit) || [];
  }

  // Search for PhD programs (using works with specific keywords)
  async searchPhDPrograms(field: string, country?: string, limit: number = 20): Promise<OpenAlexWork[]> {
    const params: Record<string, any> = {
      search: `"PhD program" OR "doctoral program" OR "doctorate" ${field}`,
      filter: 'type:journal-article',
      per_page: limit
    };

    if (country) {
      params.filter = `${params.filter},institutions.country_code:${country.toUpperCase()}`;
    }

    const result = await this.makeRequest('/works', params);
    return result.results || [];
  }

  async searchResearchers(field: string, country?: string, limit: number = 20): Promise<OpenAlexAuthor[]> {
    const params: Record<string, any> = {
      per_page: limit,
      select: 'id,display_name,orcid,email,works_count,cited_by_count,summary_stats,last_known_institution,x_concepts'
    };

    // First try without filter to see if endpoint works
    try {
      console.log("🔍 Searching OpenAlex authors with params:", params);
      const response = await this.makeRequest('/authors', params);
      console.log("📊 OpenAlex authors response:", response);
      
      if (response.results && response.results.length > 0) {
        // Filter results by field manually
        const filteredResults = response.results.filter((author: any) => {
          if (author.x_concepts && author.x_concepts.length > 0) {
            return author.x_concepts.some((concept: any) => 
              concept.display_name.toLowerCase().includes(field.toLowerCase())
            );
          }
          return false;
        });
        
        console.log("🔍 Filtered results for field:", field, "count:", filteredResults.length);
        return filteredResults;
      }
      
      return response.results || [];
    } catch (error) {
      console.error('Error searching researchers:', error);
      return [];
    }
  }
}

export const openAlexAPI = new OpenAlexAPI(); 