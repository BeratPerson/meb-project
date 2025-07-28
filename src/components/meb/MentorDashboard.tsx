"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/core/section/Section";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils/initials";
import { MessageSquare, Users, GraduationCap, ExternalLink, Settings } from "lucide-react";
import { Badge } from "../ui/badge";

interface MentorDashboardProps {
  user: any;
  profile?: any;
}

export function MentorDashboard({ user, profile }: MentorDashboardProps) {
  return (
    <div className="min-h-screen bg-background">
      <Section>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Hoş Geldiniz, {user.name}!</h1>
          <p className="text-muted-foreground">
            Mentorluk panelinizde bursiyerlerle bağlantı kurun ve deneyimlerinizi paylaşın.
          </p>
        </div>

        {!profile && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-orange-800">
                <GraduationCap className="h-5 w-5" />
                <p className="font-medium">Mentor profilinizi tamamlayın</p>
              </div>
              <p className="text-sm text-orange-700 mt-1">
                Mentor profilinizi oluşturarak bursiyerlerle bağlantı kurabilirsiniz.
              </p>
              <Button className="mt-3" variant="outline" size="sm">
                Profil Oluştur
              </Button>
            </CardContent>
          </Card>
        )}

        {profile && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Mentor Profili */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Mentor Profili</CardTitle>
                <CardDescription>Kişisel bilgileriniz ve mentorluk durumu</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.image} />
                    <AvatarFallback className="text-lg">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <Badge variant="outline">{profile.eskiBursiyerYili} Bursiyeri</Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">Araştırma Alanı</p>
                    <p className="text-sm text-muted-foreground">{profile.alan}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Doktora</p>
                    <p className="text-sm text-muted-foreground">
                      {profile.doktoraUniversite} ({profile.doktoraYili})
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Güncel Pozisyon</p>
                    <p className="text-sm text-muted-foreground">
                      {profile.guncelPozisyon} • {profile.guncelKurum}
                    </p>
                    <p className="text-sm text-muted-foreground">{profile.guncelUlke}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Mentorluk Durumu</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={profile.mentorlukAktif ? "default" : "secondary"}>
                        {profile.mentorlukAktif ? "Aktif" : "Pasif"}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {profile.mevcutMenteeSayisi}/{profile.maxMenteeSayisi} mentee
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Settings className="h-4 w-4 mr-2" />
                    Profili Düzenle
                  </Button>
                  {profile.linkedinUrl && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Ana İçerik */}
            <div className="lg:col-span-2 space-y-6">
              {/* İstatistikler */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-2xl font-bold">{profile.mevcutMenteeSayisi}</p>
                        <p className="text-sm text-muted-foreground">Aktif Mentee</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-2xl font-bold">12</p>
                        <p className="text-sm text-muted-foreground">Bu Ay Mesaj</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-2xl font-bold">5</p>
                        <p className="text-sm text-muted-foreground">Toplam Yıl</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Son Mesajlar */}
              <Card>
                <CardHeader>
                  <CardTitle>Son Mesajlar</CardTitle>
                  <CardDescription>Bursiyerlerden gelen son mesajlar</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 rounded-lg border">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>AB</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Ahmet Bilgin</h4>
                          <span className="text-xs text-muted-foreground">2 saat önce</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Merhaba, doktora başvuru sürecinde yardımınızı rica ediyorum...
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        Yanıtla
                      </Button>
                    </div>

                    <div className="flex items-center gap-4 p-3 rounded-lg border">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>FY</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Fatma Yılmaz</h4>
                          <span className="text-xs text-muted-foreground">1 gün önce</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Tez konusu seçimi konusunda önerilerinizi alabilir miyim?
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        Yanıtla
                      </Button>
                    </div>

                    <div className="text-center">
                      <Button variant="outline" size="sm">
                        Tüm Mesajları Görüntüle
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mentorluk Alanları */}
              <Card>
                <CardHeader>
                  <CardTitle>Mentorluk Alanları</CardTitle>
                  <CardDescription>Hangi alanlarda mentorluk yapıyorsunuz</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.mentorlukAlanlari?.map((alan: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {alan}
                      </Badge>
                    )) || (
                      <p className="text-muted-foreground">Henüz mentorluk alanı belirtilmemiş</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </Section>
    </div>
  );
} 