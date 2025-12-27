import * as React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";

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
        <ScrollArea className="flex-1 pb-6 pt-4">
          <div className="px-4">
            {children}
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};
