import * as React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface MobileFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const MobileFormDrawer = ({
  isOpen,
  onClose,
  title,
  children,
}: MobileFormDrawerProps) => {
  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="h-[95vh] max-h-[95vh]">
        <DrawerHeader className="flex items-center justify-between border-b border-border pb-4">
          <DrawerTitle className="text-lg font-semibold">{title}</DrawerTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </DrawerHeader>
        {/* Native scrollable container instead of ScrollArea */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden pb-6 pt-4 px-4">
          <div className="w-full max-w-full">
            {children}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
