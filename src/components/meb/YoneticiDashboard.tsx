"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/core/section/Section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  GraduationCap, 
  Upload, 
  Settings, 
  BarChart3, 
  FileText,
  Plus,
  Edit,
  Trash2
} from "lucide-react";
import { Badge } from "../ui/badge";

interface YoneticiDashboardProps {
  user: any;
}

export function YoneticiDashboard({ user }: YoneticiDashboardProps) {
  return (
    <div className="min-h-screen bg-background">
      <Section>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">MEB Yönetici Paneli</h1>
          <p className="text-muted-foreground">
            MEB 1416 YLSY bursiyer platformunu yönetin ve içerikleri güncelleyin.
          </p>
        </div>

        {/* İstatistikler */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">1,416</p>
                  <p className="text-sm text-muted-foreground">Toplam Bursiyer</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">245</p>
                  <p className="text-sm text-muted-foreground">Aktif Mentor</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">15</p>
                  <p className="text-sm text-muted-foreground">Araştırma Alanı</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">1,200+</p>
                  <p className="text-sm text-muted-foreground">Doktora Programı</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content">📊 İçerik Yönetimi</TabsTrigger>
            <TabsTrigger value="users">👥 Kullanıcı Yönetimi</TabsTrigger>
            <TabsTrigger value="upload">📤 Veri Yükleme</TabsTrigger>
            <TabsTrigger value="settings">⚙️ Sistem Ayarları</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            {/* Araştırma Alanları */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Araştırma Alanları</CardTitle>
                    <CardDescription>Bu yılın öncelikli araştırma alanlarını yönetin</CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Alan Ekle
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Optik", priority: 1, active: true },
                    { name: "Biyoteknoloji", priority: 2, active: true },
                    { name: "Yapay Zekâ", priority: 3, active: true },
                    { name: "Siyasal Bilimler", priority: 4, active: true },
                    { name: "Makine Mühendisliği", priority: 5, active: true },
                  ].map((area, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">#{area.priority}</Badge>
                        <span className="font-medium">{area.name}</span>
                        <Badge variant={area.active ? "default" : "secondary"}>
                          {area.active ? "Aktif" : "Pasif"}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Doktora Programları */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Doktora Programları</CardTitle>
                    <CardDescription>Üniversite ve program bilgilerini yönetin</CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Program Ekle
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { 
                      name: "PhD in Computer Science", 
                      university: "MIT", 
                      country: "USA", 
                      field: "Bilgisayar Mühendisliği",
                      qsRanking: 1
                    },
                    { 
                      name: "PhD in Physics", 
                      university: "Stanford University", 
                      country: "USA", 
                      field: "Fizik",
                      qsRanking: 3
                    },
                    { 
                      name: "PhD in Engineering", 
                      university: "University of Cambridge", 
                      country: "UK", 
                      field: "Makine Mühendisliği",
                      qsRanking: 2
                    },
                  ].map((program, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{program.name}</span>
                          <Badge variant="outline">QS #{program.qsRanking}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {program.university} • {program.country} • {program.field}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Kullanıcı Yönetimi</CardTitle>
                <CardDescription>Bursiyer ve mentor hesaplarını yönetin</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Button variant="outline" className="flex-1">
                      <Users className="h-4 w-4 mr-2" />
                      Bursiyer Listesi
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <GraduationCap className="h-4 w-4 mr-2" />
                      Mentor Listesi
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">1,200</p>
                          <p className="text-sm text-muted-foreground">Aktif Bursiyer</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">245</p>
                          <p className="text-sm text-muted-foreground">Aktif Mentor</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-orange-600">16</p>
                          <p className="text-sm text-muted-foreground">Bekleyen Onay</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Veri Yükleme</CardTitle>
                <CardDescription>Excel/CSV dosyaları ile toplu veri yükleme</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Bursiyer Listesi Yükleme */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Bursiyer Listesi Yükle</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Excel veya CSV formatında bursiyer listesini yükleyin
                    </p>
                    <Button>
                      <Upload className="h-4 w-4 mr-2" />
                      Dosya Seç
                    </Button>
                  </div>

                  {/* Araştırma Alanları Yükleme */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Araştırma Alanları Yükle</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Bu yılın öncelikli araştırma alanlarını yükleyin
                    </p>
                    <Button>
                      <Upload className="h-4 w-4 mr-2" />
                      Dosya Seç
                    </Button>
                  </div>

                  {/* Mentor Profilleri Yükleme */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Mentor Profilleri Yükle</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Eski bursiyer profillerini toplu olarak yükleyin
                    </p>
                    <Button>
                      <Upload className="h-4 w-4 mr-2" />
                      Dosya Seç
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sistem Ayarları</CardTitle>
                <CardDescription>Platform genel ayarlarını yapılandırın</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Platform Erişimi</h4>
                      <p className="text-sm text-muted-foreground">
                        Yeni kullanıcı kayıtlarına izin ver
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">API Entegrasyonları</h4>
                      <p className="text-sm text-muted-foreground">
                        OpenAlex ve Semantic Scholar API ayarları
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">E-posta Bildirimleri</h4>
                      <p className="text-sm text-muted-foreground">
                        Sistem bildirimleri ve e-posta ayarları
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Yedekleme ve Güvenlik</h4>
                      <p className="text-sm text-muted-foreground">
                        Veri yedekleme ve güvenlik ayarları
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Section>
    </div>
  );
} 