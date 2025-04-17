import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Keyboard } from 'lucide-react';

const shortcuts = [
  { keys: ['⌘', 'N'], description: 'Create new alert' },
  { keys: ['⌘', 'F'], description: 'Focus search' },
  { keys: ['/'], description: 'Focus search' },
  { keys: ['⌘', 'H'], description: 'Go to home' },
  { keys: ['⌘', 'S'], description: 'Go to settings' },
];

export function KeyboardHelp() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Keyboard className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Use these keyboard shortcuts to quickly navigate the app.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          {shortcuts.map(({ keys, description }) => (
            <div
              key={keys.join('+')}
              className="flex items-center justify-between"
            >
              <span className="text-sm text-muted-foreground">
                {description}
              </span>
              <div className="flex items-center gap-1">
                {keys.map((key, index) => (
                  <React.Fragment key={key}>
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                      {key}
                    </kbd>
                    {index < keys.length - 1 && (
                      <span className="text-muted-foreground">+</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
