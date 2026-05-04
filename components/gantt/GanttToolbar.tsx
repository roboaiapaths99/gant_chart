'use client';

import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Download, Share2, Printer, Maximize2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface GanttToolbarProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitToScreen?: () => void;
  onExportPDF?: () => void;
  onExportPNG?: () => void;
  onShare?: () => void;
  onPrint?: () => void;
  readonly?: boolean;
}

export default function GanttToolbar({
  onZoomIn,
  onZoomOut,
  onFitToScreen,
  onExportPDF,
  onExportPNG,
  onShare,
  onPrint,
  readonly = false,
}: GanttToolbarProps) {
  const handleExportPNG = async () => {
    if (onExportPNG) {
      onExportPNG();
    } else {
      toast({
        title: 'Export',
        description: 'PNG export feature coming soon',
      });
    }
  };

  const handleExportPDF = async () => {
    if (onExportPDF) {
      onExportPDF();
    } else {
      toast({
        title: 'Export',
        description: 'PDF export feature coming soon',
      });
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      toast({
        title: 'Share',
        description: 'Share feature coming soon',
      });
    }
  };

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <div className="flex items-center gap-2 p-4 bg-white border-b rounded-t-lg">
      <Button
        variant="outline"
        size="sm"
        onClick={onZoomIn}
        title="Zoom In"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onZoomOut}
        title="Zoom Out"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onFitToScreen}
        title="Fit to Screen"
      >
        <Maximize2 className="h-4 w-4" />
      </Button>
      <div className="flex-1" />
      {!readonly && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPNG}
            title="Export as PNG"
          >
            <Download className="h-4 w-4 mr-2" />
            PNG
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPDF}
            title="Export as PDF"
          >
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            title="Share"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrint}
        title="Print"
      >
        <Printer className="h-4 w-4" />
      </Button>
    </div>
  );
}
