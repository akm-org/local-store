import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, QrCode } from "lucide-react";
import { useGetPaymentQR, useUpdatePaymentQR, getGetPaymentQRQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminPaymentPage() {
  const [, setLocation] = useLocation();
  const { isAdmin, isLoggedIn } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: qr, isLoading } = useGetPaymentQR();
  const [qrUrl, setQrUrl] = useState("");
  const [upiId, setUpiId] = useState("");

  const updateQR = useUpdatePaymentQR({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetPaymentQRQueryKey() });
        toast({ title: "Payment settings updated" });
      },
      onError: () => toast({ title: "Failed to update settings", variant: "destructive" }),
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQR.mutate({ data: { qrUrl: qrUrl || qr?.qrUrl, upiId: upiId || qr?.upiId } });
  };

  if (!isLoggedIn || !isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 py-20 text-center">
        <p className="text-muted-foreground mb-4">Admin access required</p>
        <Button onClick={() => setLocation("/admin/login")} className="rounded-none">Admin Login</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-20">
      <div className="py-8">
        <button
          onClick={() => setLocation("/admin")}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-2 transition-colors"
        >
          <ArrowLeft className="h-3 w-3" /> Dashboard
        </button>
        <h1 className="text-2xl font-black tracking-tight">Payment Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure QR payment for checkout</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Current QR */}
        <div>
          <h2 className="font-bold text-sm uppercase tracking-widest mb-5">Current QR Code</h2>
          <div className="border border-border p-8 text-center">
            {isLoading ? (
              <Skeleton className="w-48 h-48 mx-auto" />
            ) : qr?.qrUrl ? (
              <div>
                <img
                  src={qr.qrUrl}
                  alt="Payment QR"
                  className="w-48 h-48 mx-auto object-contain mb-4"
                  data-testid="img-current-qr"
                />
                {qr.upiId && (
                  <p className="text-sm text-muted-foreground font-mono">{qr.upiId}</p>
                )}
              </div>
            ) : (
              <div className="w-48 h-48 bg-muted mx-auto flex items-center justify-center">
                <QrCode className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </div>
          {!qr?.qrUrl && (
            <p className="text-xs text-muted-foreground mt-3 text-center">No QR code configured. Add one using the form.</p>
          )}
        </div>

        {/* Update form */}
        <div>
          <h2 className="font-bold text-sm uppercase tracking-widest mb-5">Update Settings</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-xs uppercase tracking-wider" htmlFor="qrUrl">QR Code Image URL</Label>
              <Input
                id="qrUrl"
                type="url"
                value={qrUrl}
                onChange={(e) => setQrUrl(e.target.value)}
                placeholder={qr?.qrUrl ?? "https://..."}
                className="mt-1 rounded-none"
                data-testid="input-qr-url"
              />
              <p className="text-xs text-muted-foreground mt-1">URL to the QR code image customers will scan</p>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider" htmlFor="upiId">UPI ID</Label>
              <Input
                id="upiId"
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder={qr?.upiId ?? "name@upi"}
                className="mt-1 rounded-none"
                data-testid="input-upi-id"
              />
              <p className="text-xs text-muted-foreground mt-1">Displayed to customers after QR scan</p>
            </div>
            <Button
              type="submit"
              className="w-full rounded-none"
              disabled={updateQR.isPending}
              data-testid="button-save-payment"
            >
              {updateQR.isPending ? "Saving..." : "Save Settings"}
            </Button>
          </form>

          <div className="mt-8 border border-border p-5 bg-muted/30">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3">How it works</h3>
            <ol className="text-xs text-muted-foreground space-y-2 list-decimal list-inside">
              <li>Upload your UPI QR code image to any image host</li>
              <li>Paste the image URL above</li>
              <li>Customers will see this QR during checkout</li>
              <li>They enter their UTR after payment</li>
              <li>Verify UTR in Orders and mark as Confirmed</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
