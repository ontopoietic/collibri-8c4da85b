import { ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";

interface ResponsiveFormContainerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  trigger?: ReactNode;
}

export const ResponsiveFormContainer = ({
  open,
  onOpenChange,
  title,
  children,
  trigger,
}: ResponsiveFormContainerProps) => {
  const isMobile = useIsMobile();

  return (
    <>
      {/* Trigger rendered outside modals - always visible */}
      {trigger && (
        <span onClick={() => onOpenChange(true)} style={{ cursor: 'pointer' }}>
          {trigger}
        </span>
      )}

      {/* Desktop: Dialog - only render when NOT mobile */}
      {!isMobile && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            {children}
          </DialogContent>
        </Dialog>
      )}

      {/* Mobile: Drawer - only render when mobile */}
      {isMobile && (
        <Drawer open={open} onOpenChange={onOpenChange}>
          <DrawerContent className="h-[100dvh] max-h-[100dvh] rounded-none">
            <DrawerHeader className="border-b border-border relative">
              <DrawerTitle>{title}</DrawerTitle>
              <DrawerClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DrawerClose>
            </DrawerHeader>
            <ScrollArea className="flex-1 px-4 py-4">
              {children}
            </ScrollArea>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};
