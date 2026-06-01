import { CheckoutRoute } from "@/features/checkout";
import { AuthGuard } from "../../../../lib/client/auth-guard";

export default function CheckoutScreenRoute() {
  return (
    <AuthGuard>
      <CheckoutRoute />
    </AuthGuard>
  );
}
