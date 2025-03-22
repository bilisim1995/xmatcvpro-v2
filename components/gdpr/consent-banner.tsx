'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shield, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function ConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('gdpr-consent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('gdpr-consent', 'accepted');
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem('gdpr-consent', 'declined');
    setShow(false);
  };

  if (!show) return null;

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-600" />
            Privacy & Cookies Notice
          </DialogTitle>
        </DialogHeader>
        
        <Card className="p-4">
          <div className="flex items-start gap-4">
            <div className="flex-1 space-y-2">
              <p className="text-sm text-muted-foreground">
                We use cookies and similar technologies to provide the best experience on our website. By continuing to use this site, you consent to our use of cookies in accordance with our Privacy Policy.
              </p>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleAccept}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Accept All
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDecline}
                >
                  Decline Non-Essential
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </DialogContent>
    </Dialog>
  );
}