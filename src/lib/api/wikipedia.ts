// Wikipedia API Service
// https://en.wikipedia.org/api/rest_v1/

const WIKIPEDIA_BASE_URL = 'https://en.wikipedia.org/api/rest_v1';

export interface WikipediaPage {
  title: string;
  pageid: number;
  extract: string;
  content_urls: {
    desktop: {
      page: string;
    };
    mobile: {
      page: string;
    };
  };
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  coordinates?: Array<{
    lat: number;
    lon: number;
  }>;
}

export interface WikipediaSearchResult {
  title: string;
  pageid: number;
  snippet: string;
  wordcount: number;
  timestamp: string;
}

export interface WikipediaUniversityInfo {
  name: string;
  country: string;
  city: string;
  established: string;
  type: string;
  website: string;
  coordinates?: {
    lat: number;
    lon: number;
  };
  description: string;
}

class WikipediaAPI {
  private baseUrl: string;
  private rateLimitDelay: number = 100; // ms between requests

  constructor() {
    this.baseUrl = WIKIPEDIA_BASE_URL;
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
        throw new Error(`Wikipedia API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Wikipedia API request failed:', error);
      throw error;
    }
  }

  // Search pages
  async searchPages(query: string, limit: number = 20): Promise<WikipediaSearchResult[]> {
    const params = {
      action: 'query',
      list: 'search',
      srsearch: query,
      srlimit: limit,
      format: 'json'
    };

    const result = await this.makeRequest('/page/summary', params);
    return result.query?.search || [];
  }

  // Get page summary
  async getPageSummary(title: string): Promise<WikipediaPage> {
    return await this.makeRequest(`/page/summary/${encodeURIComponent(title)}`);
  }

  // Search universities
  async searchUniversities(query: string, country?: string, limit: number = 20): Promise<WikipediaSearchResult[]> {
    let searchQuery = `${query} university`;
    if (country) {
      searchQuery += ` ${country}`;
    }

    const params = {
      action: 'query',
      list: 'search',
      srsearch: searchQuery,
      srlimit: limit,
      format: 'json'
    };

    const result = await this.makeRequest('/page/summary', params);
    return result.query?.search || [];
  }

  // Get university information
  async getUniversityInfo(universityName: string): Promise<WikipediaUniversityInfo | null> {
    try {
      const page = await this.getPageSummary(universityName);
      
      // Extract basic information from the page
      const info: WikipediaUniversityInfo = {
        name: page.title,
        country: '',
        city: '',
        established: '',
        type: '',
        website: '',
        description: page.extract
      };

      // Try to extract more detailed information from the page content
      // This would require additional API calls to get the full page content
      // For now, we'll return the basic summary information

      return info;
    } catch (error) {
      console.error('Failed to get university info:', error);
      return null;
    }
  }

  // Get country information
  async getCountryInfo(countryName: string): Promise<WikipediaPage | null> {
    try {
      return await this.getPageSummary(countryName);
    } catch (error) {
      console.error('Failed to get country info:', error);
      return null;
    }
  }

  // Search for cities
  async searchCities(query: string, country?: string, limit: number = 20): Promise<WikipediaSearchResult[]> {
    let searchQuery = `${query} city`;
    if (country) {
      searchQuery += ` ${country}`;
    }

    const params = {
      action: 'query',
      list: 'search',
      srsearch: searchQuery,
      srlimit: limit,
      format: 'json'
    };

    const result = await this.makeRequest('/page/summary', params);
    return result.query?.search || [];
  }

  // Get coordinates for a location
  async getCoordinates(title: string): Promise<{ lat: number; lon: number } | null> {
    try {
      const page = await this.getPageSummary(title);
      return page.coordinates?.[0] || null;
    } catch (error) {
      console.error('Failed to get coordinates:', error);
      return null;
    }
  }

  // Search for academic fields/disciplines
  async searchAcademicFields(query: string, limit: number = 20): Promise<WikipediaSearchResult[]> {
    const searchQuery = `${query} (academic discipline OR field of study)`;

    const params = {
      action: 'query',
      list: 'search',
      srsearch: searchQuery,
      srlimit: limit,
      format: 'json'
    };

    const result = await this.makeRequest('/page/summary', params);
    return result.query?.search || [];
  }

  // Get information about a specific academic field
  async getAcademicFieldInfo(fieldName: string): Promise<WikipediaPage | null> {
    try {
      return await this.getPageSummary(fieldName);
    } catch (error) {
      console.error('Failed to get academic field info:', error);
      return null;
    }
  }
}

export const wikipediaAPI = new WikipediaAPI(); 