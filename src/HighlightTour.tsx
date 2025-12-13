"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./styles.css";

type HighlightClassNames = {
  overlay?: string;
  backdrop?: string;
  highlight?: string;
  tooltip?: string;
  tooltipHeader?: string;
  badge?: string;
  title?: string;
  description?: string;
  actions?: string;
  button?: string;
  buttonOutline?: string;
  buttonPrimary?: string;
  progress?: string;
  closeButton?: string;
};

type HighlightTourProps = {
  open: boolean;
  targetSelector: string;
  title: string;
  description: string;
  nextLabel?: string;
  backLabel?: string;
  closeLabel?: string;
  badgeLabel?: string;
  onNext?: () => void;
  onPrev?: () => void;
  onClose: () => void;
  progress?: { current: number; total: number };
  renderActions?: (props: {
    onClose: () => void;
    onNext?: () => void;
    onPrev?: () => void;
    closeLabel: string;
    backLabel?: string;
    nextLabel?: string;
  }) => ReactNode;
  classNames?: HighlightClassNames;
};

export const HighlightTour = ({
  open,
  targetSelector,
  title,
  description,
  nextLabel = "Next",
  backLabel = "Back",
  closeLabel = "Close",
  badgeLabel = "Guide",
  onNext,
  onPrev,
  onClose,
  progress,
  renderActions,
  classNames,
}: HighlightTourProps) => {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [targetEl, setTargetEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) {
      setTargetEl(null);
      setRect(null);
      return;
    }
    const findTarget = () => {
      const el = document.querySelector(targetSelector) as HTMLElement | null;
      if (el) {
        setTargetEl(el);
        return true;
      }
      return false;
    };

    if (findTarget()) {
      return;
    }

    if (typeof MutationObserver !== "undefined" && document?.body) {
      const observer = new MutationObserver(() => {
        if (findTarget()) {
          observer.disconnect();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      return () => observer.disconnect();
    }

    return undefined;
  }, [open, targetSelector]);

  useLayoutEffect(() => {
    if (!open || !targetEl) {
      return;
    }

    targetEl.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    const update = () => {
      const box = targetEl.getBoundingClientRect();
      setRect(box);
    };

    update();
    try {
      targetEl.focus({ preventScroll: true });
    } catch (error) {
      // Ignore if element cannot be focused
    }

    const ro = new ResizeObserver(update);
    ro.observe(targetEl);
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open, targetEl]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === "ArrowRight" && onNext) {
        event.preventDefault();
        onNext();
        return;
      }
      if (event.key === "ArrowLeft" && onPrev) {
        event.preventDefault();
        onPrev();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose, onNext, onPrev]);

  if (!open || !rect) {
    return null;
  }

  const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1280;
  const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 720;

  const highlightStyle: CSSProperties = {
    top: rect.top - 8,
    left: rect.left - 8,
    width: rect.width + 16,
    height: rect.height + 16,
  };

  const tooltipLeft = Math.min(Math.max(rect.left, 16), Math.max(16, viewportWidth - 320));
  const tooltipTop = Math.min(rect.bottom + 12, viewportHeight - 160);

  const overlayCls = classNames?.overlay ?? "highlight-tour-overlay";
  const backdropCls = classNames?.backdrop ?? "highlight-tour-backdrop";
  const highlightCls = classNames?.highlight ?? "highlight-tour-highlight";
  const tooltipCls = classNames?.tooltip ?? "highlight-tour-tooltip";
  const tooltipHeaderCls = classNames?.tooltipHeader ?? "highlight-tour-tooltip-header";
  const badgeCls = classNames?.badge ?? "highlight-tour-badge";
  const titleCls = classNames?.title ?? "highlight-tour-title";
  const descriptionCls = classNames?.description ?? "highlight-tour-description";
  const actionsCls = classNames?.actions ?? "highlight-tour-actions";
  const buttonBase = classNames?.button ?? "highlight-tour-button";
  const buttonOutline = classNames?.buttonOutline ?? "highlight-tour-button-outline";
  const buttonPrimary = classNames?.buttonPrimary ?? "highlight-tour-button-primary";
  const progressCls = classNames?.progress ?? "highlight-tour-progress";
  const closeButtonCls = classNames?.closeButton ?? "highlight-tour-close";

  return createPortal(
    <div className={overlayCls}>
      <div className={backdropCls} aria-hidden="true" />
      <div className={highlightCls} style={highlightStyle} aria-hidden="true" />
      <div className={tooltipCls} style={{ top: tooltipTop, left: tooltipLeft }}>
        <div className={tooltipHeaderCls}>
          {progress ? (
            <span className={progressCls}>
              {progress.current} / {progress.total}
            </span>
          ) : null}
          <button type="button" className={closeButtonCls} onClick={onClose} aria-label={closeLabel}>
            ×
          </button>
        </div>
        <h3 className={titleCls}>{title}</h3>
        <p className={descriptionCls}>{description}</p>
        {renderActions ? (
          renderActions({ onClose, onNext, onPrev, closeLabel, backLabel, nextLabel })
        ) : (
          <div className={actionsCls}>
            {onPrev ? (
              <button type="button" className={`${buttonBase} ${buttonOutline}`} onClick={onPrev}>
                {backLabel}
              </button>
            ) : null}
            {onNext ? (
              <button type="button" className={`${buttonBase} ${buttonPrimary}`} onClick={onNext}>
                {nextLabel}
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
};
