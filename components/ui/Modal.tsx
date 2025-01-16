import { FaXmark } from "react-icons/fa6";
import { Button } from "./Button";

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

export function Modal({ title, children, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <FaXmark className="w-5 h-5" />
          </Button>
        </div>
        <div className="p-4" role="dialog">
          {children}
        </div>
      </div>
    </div>
  );
}
