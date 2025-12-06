import { ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
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

  // Render both but only show the appropriate one based on screen size
  // This avoids conditional component tree issues during hydration
  return (
    <>
      {/* Desktop: Dialog */}
      <Dialog open={!isMobile && open} onOpenChange={onOpenChange}>
        {trigger && !isMobile && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>

      {/* Mobile: Drawer */}
      <Drawer open={isMobile && open} onOpenChange={onOpenChange}>
        {trigger && isMobile && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
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
    </>
  );
};
