import { UserButton } from "@clerk/react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthLayout from "@/layouts/AuthLayout";

function AccessMessage({ title, children }) {
  return (
    <AuthLayout>
      <Card className="mx-4 w-full max-w-md">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {children}
          <div className="flex items-center gap-2 border-t pt-4">
            <UserButton />
            <span className="text-sm text-muted-foreground">Account</span>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}

export default AccessMessage;
