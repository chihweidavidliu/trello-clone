"use-client";
import { cva } from "class-variance-authority";
import { PropsWithChildren, useRef, useState } from "react";

const dropzone = cva(["min-h-[5rem] rounded-md"], {
  variants: {
    visible: {
      true: ["bg-gray-300", "mt-3"],
    },
  },
});

export interface DropzoneProps extends PropsWithChildren {
  id: string;
  handleDrop: (dropzoneId: string, insertBefore: boolean) => Promise<void>;
  isVisible?: boolean;
}

const Dropzone = ({ children, id, handleDrop, isVisible }: DropzoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const insertRef = useRef<boolean | null | null>(null);
  const shadowRef = useRef<HTMLDivElement | null>(null);
  const dragCounterRef = useRef<number>(0); // cf https://stackoverflow.com/questions/50350406/dragleave-event-is-firing-on-inner-childs

  const cleanup = () => {
    // remove shadow and clear value for insertBefore
    insertRef.current = null;
    shadowRef?.current?.remove();
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const wrapperRect = wrapperRef.current?.getBoundingClientRect();

    if (!wrapperRect) return;

    // insert before if the mouse is closer to the top than the bottom of the dropzone element
    const insertBefore =
      e.clientY - wrapperRect.top < wrapperRect.bottom - e.clientY;

    if (insertRef.current === insertBefore) return;

    shadowRef.current?.remove();

    const shadow = document.createElement("div");

    shadow.className = `bg-gray-400 h-[5rem] my-3 rounded-md`;

    shadowRef.current = shadow;
    if (!insertBefore) {
      wrapperRef.current?.append(shadow);
    } else {
      wrapperRef.current?.prepend(shadow);
    }

    insertRef.current = insertBefore;
  };

  const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const data = e.dataTransfer.getData("text");
    const draggedTicket = document.getElementById(data);
    if (!draggedTicket) return;

    console.log("draggedTicket", draggedTicket);

    // otherwise insert before/after the closest ticket in the list

    if (insertRef.current === null) return;
    if (!wrapperRef.current) return;

    const insertBefore = insertRef.current;
    if (insertBefore) {
      console.log("adding before");

      await handleDrop(draggedTicket.id, insertBefore);
    } else {
      console.log("adding after");

      await handleDrop(draggedTicket.id, insertBefore);
    }

    // tidy up
    cleanup();
  };

  const hideOriginalNode = (
    currentTarget: React.DragEvent<HTMLDivElement>["currentTarget"]
  ) => {
    setTimeout(function () {
      currentTarget.style.display = "none";
    }, 1);
  };

  const showOriginalNode = (
    currentTarget: React.DragEvent<HTMLDivElement>["currentTarget"]
  ) => {
    currentTarget.style.display = "revert";
  };

  const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("text", id);
    hideOriginalNode(e.currentTarget);
  };

  const onDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    cleanup();
    showOriginalNode(e.currentTarget);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    dragCounterRef.current--;

    if (dragCounterRef.current === 0) {
      console.log("leaving", id);
      setIsDragging(false);
      cleanup();
    }
  };

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    console.log("entering", id);
    dragCounterRef.current++;
    // cleanup();
    setIsDragging(true);
  };

  return (
    <div
      className={dropzone({ visible: isVisible })}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      ref={wrapperRef}
      id={id}
    >
      <div className="dropzone-contents">{children}</div>
    </div>
  );
};

export default Dropzone;
