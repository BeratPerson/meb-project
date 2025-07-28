import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { getBursiyerProfile, getMentorProfile } from "@/lib/prisma";
import { Hero } from "@/components/core/hero/Hero";
import { Section } from "@/components/core/section/Section";
import { BursiyerDashboard } from "@/components/meb/BursiyerDashboard";
import { MentorDashboard } from "@/components/meb/MentorDashboard";
import { YoneticiDashboard } from "@/components/ui/YoneticiDashboard";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return (
      <>
        <Hero
          size="lg"
          title="MEB 1416 YLSY Bursiyer Platformu"
          description={
            <p className="text-lg text-pretty">
              Dünya çapında en iyi doktora programlarını keşfedin ve alanınızdaki eski bursiyerlerle bağlantı kurun.
            </p>
          }
        />
        <Section>
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              MEB 1416 YLSY Bursiyer Platformu
            </h2>
            <p className="text-muted-foreground mb-6">
              Dünya çapında en iyi doktora programlarını keşfedin ve alanınızdaki eski bursiyerlerle bağlantı kurun.
            </p>
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">🎯 Bu Yılın Araştırma Alanları</h3>
                <p className="text-sm text-muted-foreground">
                  MEB tarafından belirlenen öncelikli araştırma alanlarını inceleyin
                </p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">🔍 En İyi Doktora Programları</h3>
                <p className="text-sm text-muted-foreground">
                  Alanınıza uygun dünya çapında en iyi doktora programlarını keşfedin
                </p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">🤝 Mentorluk Desteği</h3>
                <p className="text-sm text-muted-foreground">
                  Aynı alanda eğitim almış eski bursiyerlerle iletişime geçin
                </p>
              </div>
            </div>
          </div>
        </Section>
      </>
    );
  }

  // Kullanıcı rolüne göre dashboard göster
  const user = session.user;
  
  if (user.userRole === "MEB_YONETICI") {
    return <YoneticiDashboard user={user} />;
  }
  
  if (user.userRole === "MENTOR") {
    return <MentorDashboard user={user} />;
  }
  
  return <BursiyerDashboard user={user} />;
}
