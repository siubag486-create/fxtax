import type { ComponentType } from "react";
import { Blocks, FileText, LayoutTemplate, MousePointerClick } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

function SectionTitle({
  title,
  description,
  icon: Icon
}: {
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export default function ComponentsPage() {
  return (
    <main className="w-full px-4 py-10 md:px-8">
      <div className="mx-auto flex w-full max-w-none flex-col gap-8">
        <section className="space-y-4">
          <SectionTitle
            title={"\uacf5\ud1b5 \ucef4\ud3ec\ub10c\ud2b8"}
            description={"\uc804\uc5ed \ud14c\ub9c8\ub97c \uadf8\ub300\ub85c \uc0ac\uc6a9\ud558\ub294 \uacf5\ud1b5 UI \uc694\uc18c \ubaa8\uc74c\uc785\ub2c8\ub2e4."}
            icon={LayoutTemplate}
          />
          <Separator />
        </section>

        <section className="space-y-4">
          <SectionTitle
            title={"\ubc84\ud2bc"}
            description={"\uae30\ubcf8, \ubcf4\uc870, \uace0\uc2a4\ud2b8 \ubc84\ud2bc \uc2a4\ud0c0\uc77c\uc744 \uc81c\uacf5\ud569\ub2c8\ub2e4."}
            icon={MousePointerClick}
          />
          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Button className="w-full">{"\uae30\ubcf8 \ubc84\ud2bc"}</Button>
            <Button variant="outline" className="w-full">
              {"\uc544\uc6c3\ub77c\uc778 \ubc84\ud2bc"}
            </Button>
            <Button variant="ghost" className="w-full">
              {"\uace0\uc2a4\ud2b8 \ubc84\ud2bc"}
            </Button>
            <Button size="sm" className="w-full">
              {"\uc791\uc740 \ubc84\ud2bc"}
            </Button>
          </div>
          <Separator />
        </section>

        <section className="space-y-4">
          <SectionTitle
            title={"\ubc30\uc9c0"}
            description={"\uc0c1\ud0dc \ub610\ub294 \uce74\ud14c\uace0\ub9ac\ub97c \uc9e7\uac8c \ud45c\uc2dc\ud569\ub2c8\ub2e4."}
            icon={Blocks}
          />
          <div className="flex w-full flex-wrap gap-2">
            <Badge>{"\uae30\ubcf8"}</Badge>
            <Badge variant="secondary">{"\ubcf4\uc870"}</Badge>
            <Badge variant="outline">{"\uc544\uc6c3\ub77c\uc778"}</Badge>
            <Badge variant="destructive">{"\uc8fc\uc758"}</Badge>
          </div>
          <Separator />
        </section>

        <section className="space-y-4">
          <SectionTitle
            title={"\uc785\ub825 \ud544\ub4dc"}
            description={"\ub77c\ubca8, \ub2e8\uc77c \uc785\ub825, \ub2e4\uc911 \uc785\ub825\uc744 \uacf5\ud1b5 \uaddc\uaca9\uc73c\ub85c \uc0ac\uc6a9\ud569\ub2c8\ub2e4."}
            icon={FileText}
          />
          <Card className="w-full">
            <CardHeader>
              <CardTitle>{"\ubb38\uc758 \uc591\uc2dd \uc608\uc2dc"}</CardTitle>
              <CardDescription>
                {"\ubaa8\ub4e0 \uc785\ub825 \uc694\uc18c\ub294 \uae00\ub85c\ubc8c \ud1a0\ud070 \uc0c9\uc0c1\uc744 \ub530\ub985\ub2c8\ub2e4."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{"\uc774\ub984"}</Label>
                <Input id="name" placeholder={"\uc774\ub984\uc744 \uc785\ub825\ud558\uc138\uc694"} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{"\uc774\uba54\uc77c"}</Label>
                <Input id="email" type="email" placeholder="example@domain.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">{"\ub0b4\uc6a9"}</Label>
                <Textarea id="message" placeholder={"\ubb38\uc758 \ub0b4\uc6a9\uc744 \uc785\ub825\ud558\uc138\uc694"} />
              </div>
              <div className="flex w-full justify-end">
                <Button>{"\ubcf4\ub0b4\uae30"}</Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
