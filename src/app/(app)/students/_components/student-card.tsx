import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Mail, Phone, Calendar, Users, CakeIcon, Edit } from "lucide-react";
import { Chip } from "@/components/ui/chip";
import { IStudent } from "../_models";
import { Button } from "@/components/ui/button";

type StudentCardProps = IStudent & {};

export function StudentCard({ id, name, avatar, age }: StudentCardProps) {
  return (
    <Card
      key={id}
      className="hover:-translate-y-1 cursor-pointer transition duration-200"
    >
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-4">
          <Avatar
            src={avatar}
            alt={name}
            fallback={name.charAt(0).toUpperCase()}
            className="h-10 w-10"
          />
          <div className="flex-1">
            <CardTitle className="text-md font-medium text-foreground">
              {name}
            </CardTitle>
            <div className="flex items-center space-x-2 mt-1">
              <Chip
                label={`${age} anos`}
                color="default"
                size="sm"
                startIcon={CakeIcon}
              />
            </div>
          </div>
          <Link href={`/students/edit/${id}`}>
            <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
              <Edit className="h-10 w-10" />
            </Button>
          </Link>
        </div>
      </CardHeader>
    </Card>
  );
}
