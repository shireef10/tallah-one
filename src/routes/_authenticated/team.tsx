import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Mail, Phone, MessageCircle, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/team")({
  head: () => ({ meta: [{ title: "Team Directory — Tallah One" }] }),
  component: Team,
});

function Team() {
  const { data } = useQuery({
    queryKey: ["team"],
    queryFn: async () => {
      const { data } = await supabase.from("team_members").select("*").order("sort_order");
      return data ?? [];
    },
  });

  return (
    <div>
      <PageHeader
        eyebrow="Digital Transformation"
        title="Team Directory"
        description="Meet the people behind Tallah One. Reach out, ask a question, or join the WhatsApp group."
      />

      {!data || data.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center">
            <Users className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="font-medium">No team members yet</p>
            <p className="text-sm text-muted-foreground mt-1">Add team members from the admin panel.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.map((m) => (
            <Card key={m.id} className="border-border/60">
              <CardContent className="p-6 text-center">
                <Avatar className="h-20 w-20 mx-auto mb-3 ring-4 ring-primary/10">
                  <AvatarImage src={m.photo_url ?? undefined} />
                  <AvatarFallback className="bg-primary/15 text-primary text-lg">{m.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <h3 className="font-medium">{m.name}</h3>
                <p className="text-sm text-muted-foreground">{m.position}</p>
                {m.department && <Badge variant="secondary" className="mt-2">{m.department}</Badge>}
                {m.bio && <p className="text-xs text-muted-foreground mt-3 line-clamp-2">{m.bio}</p>}
                <div className="flex justify-center gap-2 mt-4">
                  {m.email && <Button asChild size="sm" variant="outline"><a href={`mailto:${m.email}`}><Mail className="h-3.5 w-3.5" /></a></Button>}
                  {m.phone && <Button asChild size="sm" variant="outline"><a href={`tel:${m.phone}`}><Phone className="h-3.5 w-3.5" /></a></Button>}
                  {m.whatsapp_group_url && <Button asChild size="sm" variant="outline"><a href={m.whatsapp_group_url} target="_blank" rel="noreferrer"><MessageCircle className="h-3.5 w-3.5" /></a></Button>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
