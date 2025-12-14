"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { HighlightTour } from "./HighlightTour";

export type TourStep = {
  id: string;
  selector: string;
  title: string;
  description: string;
  nextLabel?: string;
  backLabel?: string;
  closeLabel?: string;
  onEnter?: () => void;
  onNext?: () => void;
};

export type TourIntro = {
  title: string;
  description: string;
  nextLabel?: string;
  closeLabel?: string;
  onNext?: () => void;
  onEnter?: () => void;
  onClose?: () => void;
};

export type TourOutro = {
  title: string;
  description: string;
  nextLabel?: string;
  closeLabel?: string;
  onNext?: () => void;
  onEnter?: () => void;
  onClose?: () => void;
};

type StepTourClassNames = {
  overlay?: string;
  backdrop?: string;
  modal?: string;
  closeButton?: string;
  title?: string;
  description?: string;
  actions?: string;
  button?: string;
  buttonOutline?: string;
  buttonPrimary?: string;
};

type StepTourProps = {
  open: boolean;
  steps: TourStep[];
  onClose?: () => void;
  intro?: TourIntro;
  outro?: TourOutro;
  renderActions?: (props: {
    onClose: () => void;
    onNext?: () => void;
    onPrev?: () => void;
    closeLabel: string;
    backLabel?: string;
    nextLabel?: string;
    kind: "intro" | "step" | "outro";
  }) => ReactNode;
  classNames?: StepTourClassNames;
};

export const StepTour = ({ open, steps, onClose, intro, outro, renderActions, classNames }: StepTourProps) => {
  const [index, setIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(false);
  const [showOutro, setShowOutro] = useState(false);
  const introShownRef = useRef(false);
  const stepsRef = useRef(steps);

  useEffect(() => {
    stepsRef.current = steps;
  }, [steps]);

  // Reset index if steps array becomes shorter
  useEffect(() => {
    if (!open) return;
    if (index >= stepsRef.current.length) {
      setIndex(0);
    }
  }, [open, index, steps.length]);

  useEffect(() => {
    if (!open) {
      setIndex(0);
      setShowIntro(false);
      setShowOutro(false);
      introShownRef.current = false;
      return;
    }
    if (introShownRef.current) return;

    introShownRef.current = true;

    if (intro) {
      setShowIntro(true);
      intro.onEnter?.();
    } else {
      stepsRef.current[0]?.onEnter?.();
    }
  }, [open, intro]);

  useEffect(() => {
    if (!open || showIntro) return;
    stepsRef.current[index]?.onEnter?.();
  }, [index, open, showIntro]);

  // Lock background scroll
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.documentElement.style;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = overflow;
    };
  }, [open]);

  const current = useMemo(
    () => (open && !showIntro ? stepsRef.current[index] : undefined),
    [open, showIntro, index],
  );

  const handleClose = () => {
    setShowIntro(false);
    setShowOutro(false);
    setIndex(0);
    introShownRef.current = false;
    onClose?.();
  };

  const handleNext = () => {
    current?.onNext?.();
    const hasNext = index + 1 < stepsRef.current.length;
    if (hasNext) {
      setIndex((prev) => prev + 1);
      return;
    }
    if (outro) {
      outro.onEnter?.();
      setShowOutro(true);
      return;
    }
    handleClose();
  };

  const handlePrev = () => {
    if (index <= 0) return;
    setIndex((prev) => Math.max(0, prev - 1));
  };

  const handleOutroPrev = () => {
    if (stepsRef.current.length === 0) {
      setShowOutro(false);
      return;
    }
    setShowOutro(false);
    setIndex((prev) => Math.max(0, prev - 1));
  };

  const handleIntroNext = () => {
    intro?.onNext?.();
    setShowIntro(false);
    if (stepsRef.current.length > 0) {
      stepsRef.current[0]?.onEnter?.();
    } else {
      handleClose();
    }
  };

  if (!open) return null;

  const overlayCls = classNames?.overlay ?? "step-tour-overlay";
  const backdropCls = classNames?.backdrop ?? "step-tour-backdrop";
  const modalCls = classNames?.modal ?? "step-tour-modal";
  const closeBtnCls = classNames?.closeButton ?? "step-tour-close";
  const titleCls = classNames?.title ?? "step-tour-title";
  const descriptionCls = classNames?.description ?? "step-tour-description";
  const actionsCls = classNames?.actions ?? "step-tour-actions";
  const buttonBase = classNames?.button ?? "step-tour-button";
  const buttonOutline = classNames?.buttonOutline ?? "step-tour-button-outline";
  const buttonPrimary = classNames?.buttonPrimary ?? "step-tour-button-primary";

  if (showIntro && intro) {
    return createPortal(
      <div className={overlayCls}>
        <div className={backdropCls} aria-hidden="true" />
        <div className={modalCls}>
          <button type="button" className={closeBtnCls} aria-label={intro.closeLabel ?? "Close"} onClick={handleClose}>
            ×
          </button>
          <h3 className={titleCls}>{intro.title}</h3>
          <p className={descriptionCls}>{intro.description}</p>
          {renderActions ? (
            renderActions({
              kind: "intro",
              onClose: handleClose,
              onNext: handleIntroNext,
              onPrev: undefined,
              closeLabel: intro.closeLabel ?? "Close",
              backLabel: intro.closeLabel ?? "Back",
              nextLabel: intro.nextLabel ?? "Next",
            })
          ) : (
            <div className={actionsCls}>
              <button type="button" className={`${buttonBase} ${buttonPrimary}`} onClick={handleIntroNext}>
                {intro.nextLabel ?? "Next"}
              </button>
            </div>
          )}
        </div>
      </div>,
      document.body,
    );
  }

  if (showOutro && outro) {
    return createPortal(
      <div className={overlayCls}>
        <div className={backdropCls} aria-hidden="true" />
        <div className={modalCls}>
          <button type="button" className={closeBtnCls} aria-label={outro.closeLabel ?? "Close"} onClick={handleClose}>
            ×
          </button>
          <h3 className={titleCls}>{outro.title}</h3>
          <p className={descriptionCls}>{outro.description}</p>
          {renderActions ? (
            renderActions({
              kind: "outro",
              onClose: handleClose,
              onNext: () => {
                outro.onNext?.();
                handleClose();
              },
              onPrev: index > 0 ? handleOutroPrev : undefined,
              closeLabel: outro.closeLabel ?? "Close",
              backLabel: outro.closeLabel ?? "Back",
              nextLabel: outro.nextLabel ?? "Finish",
            })
          ) : (
            <div className={actionsCls}>
              {index > 0 ? (
                <button type="button" className={`${buttonBase} ${buttonOutline}`} onClick={handleOutroPrev}>
                  {outro.closeLabel ?? "Back"}
                </button>
              ) : null}
              <button
                type="button"
                className={`${buttonBase} ${buttonPrimary}`}
                onClick={() => {
                  outro.onNext?.();
                  handleClose();
                }}
              >
                {outro.nextLabel ?? "Finish"}
              </button>
            </div>
          )}
        </div>
      </div>,
      document.body,
    );
  }

  if (!current) return null;

  return (
    <HighlightTour
      open
      targetSelector={current.selector}
      title={current.title}
      description={current.description}
      nextLabel={current.nextLabel ?? "Next"}
      backLabel={current.backLabel ?? "Back"}
      closeLabel={current.closeLabel ?? "Close"}
      onNext={handleNext}
      onPrev={index > 0 ? handlePrev : undefined}
      onClose={handleClose}
      progress={{ current: index + 1, total: stepsRef.current.length }}
      renderActions={
        renderActions
          ? (props) =>
              renderActions({
                ...props,
                onPrev: index > 0 ? handlePrev : undefined,
                backLabel: current.backLabel ?? "Back",
                kind: "step",
              })
          : undefined
      }
      classNames={{
        overlay: classNames?.overlay,
        backdrop: classNames?.backdrop,
        tooltip: classNames?.modal, // reuse modal styling for tooltip container
        title: classNames?.title,
        description: classNames?.description,
        actions: classNames?.actions,
        button: classNames?.button,
        buttonOutline: classNames?.buttonOutline,
        buttonPrimary: classNames?.buttonPrimary,
      }}
    />
  );
};
