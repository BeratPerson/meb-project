// University Service - Combines multiple APIs for comprehensive university data
import { openAlexAPI, OpenAlexInstitution } from './openalex';
import { semanticScholarAPI, SemanticScholarPaper } from './semantic-scholar';
import { wikipediaAPI, WikipediaUniversityInfo } from './wikipedia';

export interface UniversityData {
  id: string;
  name: string;
  country: string;
  city: string;
  website: string;
  logo?: string;
  qsRanking?: number;
  timesRanking?: number;
  description: string;
  coordinates?: {
    lat: number;
    lon: number;
  };
  stats: {
    worksCount: number;
    citedByCount: number;
    hIndex: number;
  };
  programs: DoctoralProgramData[];
  lastUpdated: Date;
}

export interface DoctoralProgramData {
  id: string;
  name: string;
  department: string;
  field: string;
  subField?: string;
  website?: string;
  language?: string;
  duration?: string;
  tuition?: string;
  requirements?: string;
  facultyCount?: number;
  labCount?: number;
  publicationCount?: number;
  apiSource: string;
  apiData: any;
}

export interface ResearchFieldData {
  id: string;
  name: string;
  description: string;
  level: number;
  worksCount: number;
  citedByCount: number;
  relatedFields: string[];
}

class UniversityService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTimeout = 24 * 60 * 60 * 1000; // 24 hours

  // Field mapping for Turkish to English
  private fieldMapping: Record<string, string> = {
    'Optik': 'Optics',
    'Biyoteknoloji': 'Biotechnology',
    'Yapay Zekâ': 'Artificial Intelligence',
    'Yapay Zeka': 'Artificial Intelligence',
    'Siyasal Bilimler': 'Political Science',
    'Makine Mühendisliği': 'Mechanical Engineering',
    'Elektrik-Elektronik Mühendisliği': 'Electrical Engineering',
    'Bilgisayar Mühendisliği': 'Computer Science',
    'Kimya Mühendisliği': 'Chemical Engineering',
    'Fizik': 'Physics',
    'Matematik': 'Mathematics',
    'Biyoloji': 'Biology',
    'Tıp': 'Medicine',
    'Eğitim Bilimleri': 'Education',
    'İktisat': 'Economics',
    'İşletme': 'Business Administration'
  };

  private translateField(field: string): string {
    return this.fieldMapping[field] || field;
  }

  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    return Date.now() - cached.timestamp < this.cacheTimeout;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private getCache(key: string): any | null {
    if (this.isCacheValid(key)) {
      console.log("📦 Using cached data for:", key);
      return this.cache.get(key)?.data;
    }
    console.log("🔄 Cache expired or not found for:", key);
    this.cache.delete(key);
    return null;
  }

  // Clear all cache
  clearCache(): void {
    console.log("🧹 Clearing all cache");
    this.cache.clear();
  }

  // Clear cache for specific key
  clearCacheFor(key: string): void {
    console.log("🧹 Clearing cache for:", key);
    this.cache.delete(key);
  }

  // Search universities by field and country - Only from APIs
  async searchUniversitiesByField(field: string, country?: string, limit: number = 20): Promise<UniversityData[]> {
    const translatedField = this.translateField(field);
    const cacheKey = `universities_${translatedField}_${country}_${limit}`;
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    console.log(`🔍 Searching universities for field: "${field}" -> "${translatedField}"`);

    try {
      // Get universities from OpenAlex using translated field
      const openAlexUnis = await openAlexAPI.searchInstitutions(translatedField, country, limit);
      
      // Get additional info from Wikipedia
      const universities: UniversityData[] = [];

      for (const uni of openAlexUnis) {
        try {
          const wikiInfo = await wikipediaAPI.getUniversityInfo(uni.display_name);
          const coordinates = await wikipediaAPI.getCoordinates(uni.display_name);

          const universityData: UniversityData = {
            id: uni.id,
            name: uni.display_name,
            country: uni.country_code,
            city: uni.city || '',
            website: uni.homepage_url || '',
            logo: uni.image_url,
            description: wikiInfo?.description || uni.display_name,
            coordinates: coordinates ? { lat: coordinates.lat, lon: coordinates.lon } : undefined,
            stats: {
              worksCount: uni.works_count,
              citedByCount: uni.cited_by_count,
              hIndex: uni.summary_stats?.h_index || 0
            },
            programs: [], // Empty programs array - will be filled by the calling function
            lastUpdated: new Date()
          };

          universities.push(universityData);
        } catch (error) {
          console.error(`Error processing university ${uni.display_name}:`, error);
        }
      }

      this.setCache(cacheKey, universities);
      return universities;
    } catch (error) {
      console.error('Error searching universities:', error);
      return [];
    }
  }

  // Get doctoral programs for a specific university
  async getDoctoralProgramsForUniversity(universityId: string, field: string): Promise<DoctoralProgramData[]> {
    const cacheKey = `programs_${universityId}_${field}`;
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const programs: DoctoralProgramData[] = [];

      // Get works from OpenAlex
      const works = await openAlexAPI.getInstitutionWorks(universityId, field, undefined, 50);
      
      // Group works by department/concept
      const departmentGroups = new Map<string, any[]>();
      
      works.forEach(work => {
        const department = work.authorships?.[0]?.institutions?.[0]?.display_name || 'Unknown Department';
        if (!departmentGroups.has(department)) {
          departmentGroups.set(department, []);
        }
        departmentGroups.get(department)!.push(work);
      });

      // Create program data from grouped works
      departmentGroups.forEach((works, department) => {
        const program: DoctoralProgramData = {
          id: `program_${universityId}_${department}`,
          name: `PhD in ${field}`,
          department: department,
          field: field,
          website: works[0]?.host_venue?.url,
          publicationCount: works.length,
          facultyCount: new Set(works.flatMap(w => w.authorships?.map(a => a.author.id) || [])).size,
          apiSource: 'OpenAlex',
          apiData: works
        };

        programs.push(program);
      });

      this.setCache(cacheKey, programs);
      return programs;
    } catch (error) {
      console.error('Error getting doctoral programs:', error);
      return [];
    }
  }

  // Search research fields
  async searchResearchFields(query: string, limit: number = 20): Promise<ResearchFieldData[]> {
    const cacheKey = `fields_${query}_${limit}`;
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const fields: ResearchFieldData[] = [];

      // Get concepts from OpenAlex
      const concepts = await openAlexAPI.searchConcepts(query, undefined, limit);
      
      for (const concept of concepts) {
        const relatedConcepts = await openAlexAPI.getRelatedConcepts(concept.id, 5);
        
        const fieldData: ResearchFieldData = {
          id: concept.id,
          name: concept.display_name,
          description: concept.description || '',
          level: concept.level,
          worksCount: concept.works_count,
          citedByCount: concept.cited_by_count,
          relatedFields: relatedConcepts.map(c => c.display_name)
        };

        fields.push(fieldData);
      }

      this.setCache(cacheKey, fields);
      return fields;
    } catch (error) {
      console.error('Error searching research fields:', error);
      return [];
    }
  }

  // Get top universities by field
  async getTopUniversitiesByField(field: string, country?: string, limit: number = 20): Promise<UniversityData[]> {
    const cacheKey = `top_unis_${field}_${country}_${limit}`;
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const universities = await openAlexAPI.getTopInstitutionsByField(field, country, limit);
      
      const universityData: UniversityData[] = [];

      for (const uni of universities) {
        try {
          const wikiInfo = await wikipediaAPI.getUniversityInfo(uni.display_name);
          const coordinates = await wikipediaAPI.getCoordinates(uni.display_name);

          const data: UniversityData = {
            id: uni.id,
            name: uni.display_name,
            country: uni.country_code,
            city: uni.city || '',
            website: uni.homepage_url || '',
            logo: uni.image_url,
            description: wikiInfo?.description || uni.display_name,
            coordinates: coordinates ? { lat: coordinates.lat, lon: coordinates.lon } : undefined,
            stats: {
              worksCount: uni.works_count,
              citedByCount: uni.cited_by_count,
              hIndex: uni.summary_stats?.h_index || 0
            },
            programs: [],
            lastUpdated: new Date()
          };

          universityData.push(data);
        } catch (error) {
          console.error(`Error processing top university ${uni.display_name}:`, error);
        }
      }

      this.setCache(cacheKey, universityData);
      return universityData;
    } catch (error) {
      console.error('Error getting top universities:', error);
      return [];
    }
  }

  // Search for PhD programs
  async searchPhDPrograms(field: string, country?: string, limit: number = 20): Promise<DoctoralProgramData[]> {
    const cacheKey = `phd_programs_${field}_${country}_${limit}`;
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    console.log("🔍 Searching PhD programs for:", { field, country, limit });

    try {
      const programs: DoctoralProgramData[] = [];

      // Get from OpenAlex
      console.log("📡 Calling OpenAlex API...");
      const openAlexWorks = await openAlexAPI.searchPhDPrograms(field, country, limit);
      console.log("📊 OpenAlex results:", openAlexWorks.length);
      
      // Get from Semantic Scholar
      console.log("📡 Calling Semantic Scholar API...");
      const semanticWorks = await semanticScholarAPI.searchPhDPrograms(field, limit);
      console.log("📊 Semantic Scholar results:", semanticWorks.length);

      // Process OpenAlex results
      openAlexWorks.forEach(work => {
        const program: DoctoralProgramData = {
          id: `openalex_${work.id}`,
          name: work.title,
          department: work.authorships?.[0]?.institutions?.[0]?.display_name || 'Unknown',
          field: field,
          website: work.host_venue?.url,
          publicationCount: 1,
          apiSource: 'OpenAlex',
          apiData: work
        };

        programs.push(program);
      });

      // Process Semantic Scholar results
      semanticWorks.forEach(work => {
        const program: DoctoralProgramData = {
          id: `semantic_${work.paperId}`,
          name: work.title,
          department: work.authors?.[0]?.affiliation || 'Unknown',
          field: field,
          website: work.openAccessPdf?.url,
          publicationCount: 1,
          apiSource: 'SemanticScholar',
          apiData: work
        };

        programs.push(program);
      });

      console.log("✅ Total programs found:", programs.length);
      this.setCache(cacheKey, programs);
      return programs;
    } catch (error) {
      console.error('❌ Error searching PhD programs:', error);
      return [];
    }
  }

  async searchMentorsByField(field: string, country?: string, limit: number = 20): Promise<any[]> {
    const translatedField = this.translateField(field);
    const cacheKey = `mentors_${translatedField}_${country}_${limit}`;
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    console.log(`🔍 Creating fake mentor data for field: "${field}" -> "${translatedField}"`);

    try {
      // Create realistic fake mentor data
      const fakeMentors = [
        {
          id: `mentor_1_${translatedField}`,
          name: "Dr. Sarah Johnson",
          email: "sarah.johnson@mit.edu",
          orcid: "0000-0001-2345-6789",
          hIndex: 45,
          worksCount: 127,
          citedByCount: 3240,
          lastKnownInstitution: "Massachusetts Institute of Technology",
          country: "US",
          field: field,
          expertise: [translatedField, "Machine Learning", "Data Science"],
          profileUrl: "https://orcid.org/0000-0001-2345-6789",
          apiSource: 'Fake Data',
          lastUpdated: new Date()
        },
        {
          id: `mentor_2_${translatedField}`,
          name: "Prof. Michael Chen",
          email: "m.chen@stanford.edu",
          orcid: "0000-0002-3456-7890",
          hIndex: 52,
          worksCount: 156,
          citedByCount: 4120,
          lastKnownInstitution: "Stanford University",
          country: "US",
          field: field,
          expertise: [translatedField, "Artificial Intelligence", "Neural Networks"],
          profileUrl: "https://orcid.org/0000-0002-3456-7890",
          apiSource: 'Fake Data',
          lastUpdated: new Date()
        },
        {
          id: `mentor_3_${translatedField}`,
          name: "Dr. Emily Rodriguez",
          email: "e.rodriguez@cambridge.ac.uk",
          orcid: "0000-0003-4567-8901",
          hIndex: 38,
          worksCount: 89,
          citedByCount: 2150,
          lastKnownInstitution: "University of Cambridge",
          country: "GB",
          field: field,
          expertise: [translatedField, "Computer Vision", "Robotics"],
          profileUrl: "https://orcid.org/0000-0003-4567-8901",
          apiSource: 'Fake Data',
          lastUpdated: new Date()
        },
        {
          id: `mentor_4_${translatedField}`,
          name: "Prof. David Kim",
          email: "d.kim@ethz.ch",
          orcid: "0000-0004-5678-9012",
          hIndex: 41,
          worksCount: 112,
          citedByCount: 2890,
          lastKnownInstitution: "ETH Zurich",
          country: "CH",
          field: field,
          expertise: [translatedField, "Software Engineering", "Systems"],
          profileUrl: "https://orcid.org/0000-0004-5678-9012",
          apiSource: 'Fake Data',
          lastUpdated: new Date()
        },
        {
          id: `mentor_5_${translatedField}`,
          name: "Dr. Lisa Thompson",
          email: "l.thompson@ox.ac.uk",
          orcid: "0000-0005-6789-0123",
          hIndex: 35,
          worksCount: 78,
          citedByCount: 1890,
          lastKnownInstitution: "University of Oxford",
          country: "GB",
          field: field,
          expertise: [translatedField, "Natural Language Processing", "Linguistics"],
          profileUrl: "https://orcid.org/0000-0005-6789-0123",
          apiSource: 'Fake Data',
          lastUpdated: new Date()
        },
        {
          id: `mentor_6_${translatedField}`,
          name: "Prof. James Wilson",
          email: "j.wilson@berkeley.edu",
          orcid: "0000-0006-7890-1234",
          hIndex: 48,
          worksCount: 134,
          citedByCount: 3560,
          lastKnownInstitution: "University of California, Berkeley",
          country: "US",
          field: field,
          expertise: [translatedField, "Distributed Systems", "Cloud Computing"],
          profileUrl: "https://orcid.org/0000-0006-7890-1234",
          apiSource: 'Fake Data',
          lastUpdated: new Date()
        },
        {
          id: `mentor_7_${translatedField}`,
          name: "Dr. Maria Garcia",
          email: "m.garcia@epfl.ch",
          orcid: "0000-0007-8901-2345",
          hIndex: 32,
          worksCount: 67,
          citedByCount: 1450,
          lastKnownInstitution: "École Polytechnique Fédérale de Lausanne",
          country: "CH",
          field: field,
          expertise: [translatedField, "Human-Computer Interaction", "UX Design"],
          profileUrl: "https://orcid.org/0000-0007-8901-2345",
          apiSource: 'Fake Data',
          lastUpdated: new Date()
        },
        {
          id: `mentor_8_${translatedField}`,
          name: "Prof. Robert Brown",
          email: "r.brown@imperial.ac.uk",
          orcid: "0000-0008-9012-3456",
          hIndex: 44,
          worksCount: 118,
          citedByCount: 2980,
          lastKnownInstitution: "Imperial College London",
          country: "GB",
          field: field,
          expertise: [translatedField, "Cybersecurity", "Cryptography"],
          profileUrl: "https://orcid.org/0000-0008-9012-3456",
          apiSource: 'Fake Data',
          lastUpdated: new Date()
        },
        {
          id: `mentor_9_${translatedField}`,
          name: "Dr. Jennifer Lee",
          email: "j.lee@cmu.edu",
          orcid: "0000-0009-0123-4567",
          hIndex: 39,
          worksCount: 95,
          citedByCount: 2230,
          lastKnownInstitution: "Carnegie Mellon University",
          country: "US",
          field: field,
          expertise: [translatedField, "Game Development", "Graphics"],
          profileUrl: "https://orcid.org/0000-0009-0123-4567",
          apiSource: 'Fake Data',
          lastUpdated: new Date()
        },
        {
          id: `mentor_10_${translatedField}`,
          name: "Prof. Thomas Davis",
          email: "t.davis@tum.de",
          orcid: "0000-0010-1234-5678",
          hIndex: 46,
          worksCount: 125,
          citedByCount: 3120,
          lastKnownInstitution: "Technical University of Munich",
          country: "DE",
          field: field,
          expertise: [translatedField, "Database Systems", "Big Data"],
          profileUrl: "https://orcid.org/0000-0010-1234-5678",
          apiSource: 'Fake Data',
          lastUpdated: new Date()
        },
        {
          id: `mentor_11_${translatedField}`,
          name: "Dr. Amanda White",
          email: "a.white@uwaterloo.ca",
          orcid: "0000-0011-2345-6789",
          hIndex: 36,
          worksCount: 82,
          citedByCount: 1980,
          lastKnownInstitution: "University of Waterloo",
          country: "CA",
          field: field,
          expertise: [translatedField, "Quantum Computing", "Algorithms"],
          profileUrl: "https://orcid.org/0000-0011-2345-6789",
          apiSource: 'Fake Data',
          lastUpdated: new Date()
        },
        {
          id: `mentor_12_${translatedField}`,
          name: "Prof. Christopher Miller",
          email: "c.miller@kth.se",
          orcid: "0000-0012-3456-7890",
          hIndex: 42,
          worksCount: 108,
          citedByCount: 2670,
          lastKnownInstitution: "KTH Royal Institute of Technology",
          country: "SE",
          field: field,
          expertise: [translatedField, "Network Security", "IoT"],
          profileUrl: "https://orcid.org/0000-0012-3456-7890",
          apiSource: 'Fake Data',
          lastUpdated: new Date()
        }
      ];

      // Return requested number of mentors
      const mentors = fakeMentors.slice(0, limit);
      console.log("📊 Fake mentors created:", mentors.length);
      
      this.setCache(cacheKey, mentors);
      return mentors;
      
    } catch (error) {
      console.error('Error creating fake mentors:', error);
      return [];
    }
  }

  // Get universities - Only from APIs, no database interaction
  async getUniversitiesFromDatabase(field: string, country?: string): Promise<UniversityData[]> {
    // This function now only fetches from APIs, despite the name
    // The name is kept for compatibility with existing code
    return await this.searchUniversitiesByField(field, country, 20);
  }
}

export const universityService = new UniversityService(); 