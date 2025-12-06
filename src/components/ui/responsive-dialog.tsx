import * as React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";

interface ResponsiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface ResponsiveDialogContentProps {
  children: React.ReactNode;
  className?: string;
}

interface ResponsiveDialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface ResponsiveDialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface ResponsiveDialogDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

interface ResponsiveDialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

const ResponsiveDialogContext = React.createContext<{ isMobile: boolean }>({
  isMobile: false,
});

const useResponsiveDialogContext = () => React.useContext(ResponsiveDialogContext);

export const ResponsiveDialog = ({ open, onOpenChange, children }: ResponsiveDialogProps) => {
  const [isReady, setIsReady] = React.useState(false);
  const isMobile = useIsMobile();

  // Wait for first render to complete to ensure stable isMobile value
  React.useEffect(() => {
    setIsReady(true);
  }, []);

  // Don't render until mounted to prevent hydration mismatches
  if (!isReady) {
    return null;
  }

  return (
    <ResponsiveDialogContext.Provider value={{ isMobile }}>
      {isMobile ? (
        <Drawer open={open} onOpenChange={onOpenChange}>
          {children}
        </Drawer>
      ) : (
        <Dialog open={open} onOpenChange={onOpenChange}>
          {children}
        </Dialog>
      )}
    </ResponsiveDialogContext.Provider>
  );
};

export const ResponsiveDialogContent = ({ children, className }: ResponsiveDialogContentProps) => {
  const { isMobile } = useResponsiveDialogContext();

  if (isMobile) {
    return <DrawerContent className={className}>{children}</DrawerContent>;
  }

  return <DialogContent className={className}>{children}</DialogContent>;
};

export const ResponsiveDialogHeader = ({ children, className }: ResponsiveDialogHeaderProps) => {
  const { isMobile } = useResponsiveDialogContext();

  if (isMobile) {
    return <DrawerHeader className={className}>{children}</DrawerHeader>;
  }

  return <DialogHeader className={className}>{children}</DialogHeader>;
};

export const ResponsiveDialogTitle = ({ children, className }: ResponsiveDialogTitleProps) => {
  const { isMobile } = useResponsiveDialogContext();

  if (isMobile) {
    return <DrawerTitle className={className}>{children}</DrawerTitle>;
  }

  return <DialogTitle className={className}>{children}</DialogTitle>;
};

export const ResponsiveDialogDescription = ({ children, className }: ResponsiveDialogDescriptionProps) => {
  const { isMobile } = useResponsiveDialogContext();

  if (isMobile) {
    return <DrawerDescription className={className}>{children}</DrawerDescription>;
  }

  return <DialogDescription className={className}>{children}</DialogDescription>;
};

export const ResponsiveDialogFooter = ({ children, className }: ResponsiveDialogFooterProps) => {
  const { isMobile } = useResponsiveDialogContext();

  if (isMobile) {
    return <DrawerFooter className={className}>{children}</DrawerFooter>;
  }

  return <DialogFooter className={className}>{children}</DialogFooter>;
};

export const ResponsiveDialogClose = ({ children }: { children: React.ReactNode }) => {
  const { isMobile } = useResponsiveDialogContext();

  if (isMobile) {
    return <DrawerClose asChild>{children}</DrawerClose>;
  }

  return <DialogClose asChild>{children}</DialogClose>;
};
