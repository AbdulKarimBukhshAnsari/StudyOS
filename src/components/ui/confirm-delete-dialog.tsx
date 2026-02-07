'use client';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export interface ConfirmDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Dialog title, e.g. "Delete note" */
  title: string;
  /** Name of the item being deleted (shown in description). */
  itemName: string;
  /** Optional custom description. If not set, uses default: "Are you sure you want to delete \"{itemName}\"? This cannot be undone." */
  description?: string;
  onConfirm: () => void;
  /** Whether the delete request is in progress (disables button, shows "Deleting..."). */
  loading?: boolean;
  /** Confirm button label when not loading. Default: "Delete" */
  confirmLabel?: string;
}

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  title,
  itemName,
  description,
  onConfirm,
  loading = false,
  confirmLabel = 'Delete',
}: ConfirmDeleteDialogProps) {
  const defaultDescription = `Are you sure you want to delete "${itemName}"? This cannot be undone.`;
  const message = description ?? defaultDescription;

  const handleClose = () => {
    if (!loading) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">{message}</p>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Deleting...' : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
