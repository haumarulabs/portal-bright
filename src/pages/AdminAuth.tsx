import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "@/hooks/use-toast";
import { api } from "@/services/api";
import { ShieldCheck, Loader2 } from "lucide-react";

const AUTHORIZED_EMAIL = "ahmadraheel@haumarulabs.co.nz";
const OTP_LENGTH = 6;

export default function AdminAuth() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    checkUserAccess();
  }, []);

  const checkUserAccess = async () => {
    try {
      const user = await api.whoami();
      setUserEmail(user.user?.email || "");
      
      // Check if user is the authorized admin
      if (user.user?.email !== AUTHORIZED_EMAIL) {
        toast({
          title: "Access Denied",
          description: "Only authorized administrators can access this page",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }
      
      // Check if already authenticated with OTP in this session
      const otpAuth = sessionStorage.getItem("admin_otp_auth");
      if (otpAuth === "verified") {
        navigate("/admin");
        return;
      }
    } catch (error) {
      navigate("/login");
    }
  };

  const sendOTP = async () => {
    setLoading(true);
    try {
      // In production, this would send an actual OTP
      // For now, we'll simulate it
      const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store OTP in sessionStorage (in production, store server-side)
      sessionStorage.setItem("temp_otp", generatedOTP);
      
      // Simulate sending email
      console.log("OTP for admin access:", generatedOTP);
      
      toast({
        title: "OTP Sent",
        description: `A verification code has been sent to ${AUTHORIZED_EMAIL}`,
      });
      
      setOtpSent(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (otp.length !== OTP_LENGTH) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a 6-digit code",
        variant: "destructive",
      });
      return;
    }

    setVerifying(true);
    try {
      // In production, verify OTP server-side
      const storedOTP = sessionStorage.getItem("temp_otp");
      
      if (otp === storedOTP) {
        sessionStorage.setItem("admin_otp_auth", "verified");
        sessionStorage.removeItem("temp_otp");
        
        toast({
          title: "Success",
          description: "OTP verified successfully",
        });
        
        navigate("/admin");
      } else {
        toast({
          title: "Invalid OTP",
          description: "The code you entered is incorrect",
          variant: "destructive",
        });
        setOtp("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify OTP",
        variant: "destructive",
      });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <ShieldCheck className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Admin Authentication</CardTitle>
          <CardDescription>
            {userEmail === AUTHORIZED_EMAIL 
              ? "Verify your identity to access the admin panel"
              : "Access restricted to authorized administrators only"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {userEmail === AUTHORIZED_EMAIL ? (
            <>
              {!otpSent ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center">
                    We'll send a verification code to:
                  </p>
                  <p className="text-center font-medium">{AUTHORIZED_EMAIL}</p>
                  <Button 
                    className="w-full" 
                    onClick={sendOTP}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending OTP...
                      </>
                    ) : (
                      "Send Verification Code"
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center">
                    Enter the 6-digit code sent to your email
                  </p>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={OTP_LENGTH}
                      value={otp}
                      onChange={(value) => setOtp(value)}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={verifyOTP}
                    disabled={verifying || otp.length !== OTP_LENGTH}
                  >
                    {verifying ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify & Continue"
                    )}
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full" 
                    onClick={() => {
                      setOtpSent(false);
                      setOtp("");
                    }}
                  >
                    Resend Code
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-sm text-destructive">
                You are not authorized to access this page.
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate("/dashboard")}
              >
                Return to Dashboard
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}