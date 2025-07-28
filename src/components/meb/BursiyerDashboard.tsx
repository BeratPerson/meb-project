"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Section } from "@/components/core/section/Section";
import { getInitials } from "@/lib/utils/initials";
import { Search, GraduationCap, Users, MessageSquare, ExternalLink } from "lucide-react";
import { Badge } from "../ui/badge";
import Image from "next/image";

interface BursiyerDashboardProps {
  user: any;
  profile?: any;
}

export function BursiyerDashboard({ user, profile }: BursiyerDashboardProps) {
  const [selectedField, setSelectedField] = useState<string>("");
  const [programs, setPrograms] = useState<any[]>([]);
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Statik araştırma alanları - MEB tarafından sağlanan öncelikli alanlar
  const researchAreas = [
    "Optik",
    "Biyoteknoloji",
    "Yapay Zekâ",
    "Siyasal Bilimler",
    "Makine Mühendisliği",
    "Elektrik-Elektronik Mühendisliği",
    "Bilgisayar Mühendisliği",
    "Kimya Mühendisliği",
    "Fizik",
    "Matematik",
    "Biyoloji",
    "Tıp",
    "Eğitim Bilimleri",
    "İktisat",
    "İşletme"
  ];

  const searchPrograms = async (field: string) => {
    setLoading(true);
    console.log("🔍 Searching programs for field:", field);
    try {
      const response = await fetch(`/api/programs?field=${encodeURIComponent(field)}&limit=500`);
      const data = await response.json();
      if (data.programs) {
        setPrograms(data.programs);
        setLoading(false);
      }
    } catch (error) {
      console.error("❌ Program arama hatası:", error);
    }
  };

  const searchMentors = async (field: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/mentors?field=${encodeURIComponent(field)}`);
      const data = await response.json();
      if (data.mentors) {
        setMentors(data.mentors);
      }
    } catch (error) {
      console.error("Mentor arama hatası:", error);
    }
  };

  const handleFieldChange = (field: string) => {
    setSelectedField(field);
    if (field) {
      searchPrograms(field);
      searchMentors(field);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Section>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Hoş Geldiniz, {user.name}!</h1>
          <p className="text-muted-foreground">
            MEB 1416 YLSY Bursiyer Platformu&apos;nda araştırma alanınızı keşfedin ve mentorluk alın.
          </p>
        </div>



        <Tabs defaultValue="research" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="research">🎯 Araştırma Alanları</TabsTrigger>
            <TabsTrigger value="programs">🔍 Doktora Programları</TabsTrigger>
            <TabsTrigger value="mentors">🤝 Mentorlar</TabsTrigger>
          </TabsList>

          <TabsContent value="research" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Bu Yılın Araştırma Alanları</CardTitle>
                <CardDescription>
                  MEB tarafından belirlenen öncelikli araştırma alanları
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {researchAreas.map((area, index) => (
                    <Card key={index} className="card-modern">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{area}</h3>
                          <Badge variant="secondary">{index + 1}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Bu alanda doktora programları ve mentorlar bulunmaktadır.
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="programs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Doktora Programları</CardTitle>
                <CardDescription>
                  Alanınıza uygun dünya çapında en iyi doktora programları
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Select onValueChange={handleFieldChange} value={selectedField}>
                    <SelectTrigger>
                      <SelectValue placeholder="Araştırma alanı seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {researchAreas.map((area) => (
                        <SelectItem key={area} value={area}>
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {loading && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">Programlar aranıyor...</p>
                  </div>
                )}

                {!loading && programs.length > 0 && (
                  <div className="space-y-4">
                    {programs.map((program) => (
                      <Card key={program.id} className="card-modern">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-lg">{program.name}</h3>
                                <Badge variant="outline" className="text-xs">
                                  {program.apiSource}
                                </Badge>
                              </div>

                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-medium text-base">{program.university.name}</h4>
                                <Badge variant="secondary" className="text-xs">
                                  {program.university.country}
                                </Badge>
                              </div>

                              <p className="text-sm text-muted-foreground mb-3">
                                {program.department}
                              </p>

                              {program.description && (
                                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                  {program.description}
                                </p>
                              )}

                              <div className="flex flex-wrap gap-2 mb-3">
                                {program.publicationCount && (
                                  <Badge variant="outline" className="text-xs">
                                    📚 {program.publicationCount} yayın
                                  </Badge>
                                )}
                                {program.facultyCount && (
                                  <Badge variant="outline" className="text-xs">
                                    👥 {program.facultyCount} öğretim üyesi
                                  </Badge>
                                )}
                                {program.language && (
                                  <Badge variant="secondary" className="text-xs">
                                    🌍 {program.language}
                                  </Badge>
                                )}
                                {program.duration && (
                                  <Badge variant="secondary" className="text-xs">
                                    ⏱️ {program.duration}
                                  </Badge>
                                )}
                              </div>

                              <div className="flex gap-2">
                                {program.website && (
                                  <Button variant="outline" size="sm" asChild>
                                    <a href={program.website} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="h-4 w-4 mr-2" />
                                      Üniversite Sitesi
                                    </a>
                                  </Button>
                                )}
                                <Button size="sm" variant="outline">
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Detaylar
                                </Button>
                              </div>
                            </div>

                            {program.university.logo && (
                              <div className="ml-4">
                                <Image
                                  src={program.university.logo}
                                  alt={program.university.name}
                                  width={64}
                                  height={64}
                                  className="w-16 h-16 object-cover rounded-lg border"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {!loading && selectedField && programs.length === 0 && (
                  <div className="text-center py-8">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      &quot;{selectedField}&quot; alanında henüz program bulunmamaktadır.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mentors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mentorlar</CardTitle>
                <CardDescription>
                  Aynı alanda eğitim almış eski bursiyerlerle iletişime geçin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Select onValueChange={handleFieldChange} value={selectedField}>
                    <SelectTrigger>
                      <SelectValue placeholder="Araştırma alanı seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {researchAreas.map((area) => (
                        <SelectItem key={area} value={area}>
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {loading && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">Mentorlar aranıyor...</p>
                  </div>
                )}

                {!loading && mentors.length > 0 && (
                  <div className="space-y-4">
                    {mentors.map((mentor) => (
                      <Card key={mentor.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src="" />
                              <AvatarFallback>
                                {getInitials(mentor.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-lg">{mentor.name}</h3>
                                <Badge variant="outline" className="text-xs">
                                  {mentor.apiSource}
                                </Badge>
                              </div>

                              <p className="text-sm text-muted-foreground mb-2">
                                {mentor.lastKnownInstitution} • {mentor.country}
                              </p>

                              {mentor.expertise && mentor.expertise.length > 0 && (
                                <p className="text-sm text-muted-foreground mb-3">
                                  <strong>Uzmanlık Alanları:</strong> {mentor.expertise.join(', ')}
                                </p>
                              )}

                              <div className="flex flex-wrap gap-2 mb-3">
                                {mentor.hIndex > 0 && (
                                  <Badge variant="outline" className="text-xs">
                                    📊 h-index: {mentor.hIndex}
                                  </Badge>
                                )}
                                {mentor.worksCount > 0 && (
                                  <Badge variant="outline" className="text-xs">
                                    📚 {mentor.worksCount} yayın
                                  </Badge>
                                )}
                                {mentor.citedByCount > 0 && (
                                  <Badge variant="outline" className="text-xs">
                                    📖 {mentor.citedByCount} atıf
                                  </Badge>
                                )}
                              </div>

                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  İletişime Geç
                                </Button>
                                {mentor.orcid && (
                                  <Button size="sm" variant="outline" asChild>
                                    <a href={`https://orcid.org/${mentor.orcid}`} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="h-4 w-4 mr-2" />
                                      ORCID
                                    </a>
                                  </Button>
                                )}
                                {mentor.profileUrl && !mentor.orcid && (
                                  <Button size="sm" variant="outline" asChild>
                                    <a href={mentor.profileUrl} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="h-4 w-4 mr-2" />
                                      Profil
                                    </a>
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {!loading && selectedField && mentors.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      &quot;{selectedField}&quot; alanında henüz mentor bulunmamaktadır.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Section>
    </div>
  );
} 