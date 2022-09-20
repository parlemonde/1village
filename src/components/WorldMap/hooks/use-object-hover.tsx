import { useRouter } from 'next/router';
import * as React from 'react';
import type { Object3D, Scene, Raycaster, Camera } from 'three';

import Card from '@mui/material/Card';

import { UserPopover } from '../UserPopover';
import type { HoverableObject } from '../lib/hoverable-object';
import { onResetHoveredObject, isHoverable } from '../lib/hoverable-object';
import type { User } from 'types/user.type';

export const useObjectHover = () => {
  const router = useRouter();
  const canvasBoundingRectRef = React.useRef<DOMRect | null>(null);

  // Mouse position
  const mousePositionRef = React.useRef<{ x: number; y: number } | null>(null);
  const [popoverPos, setPopoverPos] = React.useState<{ x: number; y: number } | null>(null);

  // Hovered Object.
  const [hoveredObject, setHoveredObject] = React.useState<HoverableObject | null>(null);
  const hoveredObjectIdRef = React.useRef<Object3D['id'] | null>(null);

  // HoverableObjects
  const hoverableObjectsRef = React.useRef<Object3D[]>([]);

  const mascotteData = hoveredObject?.userData['user'] as User | undefined;
  const mascotteActivityId = mascotteData?.mascotteId;

  const setHoverableObjects = React.useCallback((scene: Scene, showDecors: boolean = true) => {
    const addObjectFrom = (children: Object3D[]): Object3D[] => {
      const obj: Object3D[] = [];
      for (const child of children) {
        if (child.type === 'Group' && child.children) {
          obj.push(...addObjectFrom(child.children));
        }
        if (isHoverable(child) && (child.getType() !== 'country' || !showDecors)) {
          obj.push(child);
        }
      }
      return obj;
    };

    hoverableObjectsRef.current = addObjectFrom(scene.children).concat(scene.children.filter((child) => child.name === 'globe'));
    hoveredObjectIdRef.current = null;
    setHoveredObject(null);
  }, []);

  const onUpdateHover = React.useCallback((raycaster: Raycaster, camera: Camera, scene: Scene) => {
    if (mousePositionRef.current === null) {
      return;
    }

    raycaster.setFromCamera(mousePositionRef.current, camera);
    const hoveredObjects = raycaster.intersectObjects(hoverableObjectsRef.current);
    let hoveredObject = hoveredObjects.length > 0 && hoveredObjects[0].object.name !== 'globe' ? hoveredObjects[0].object : null;
    if (hoveredObject && !isHoverable(hoveredObject) && isHoverable(hoveredObject.parent)) {
      hoveredObject = hoveredObject.parent;
    }

    if (isHoverable(hoveredObject) && (hoveredObjectIdRef.current === null || hoveredObject.id !== hoveredObjectIdRef.current)) {
      onResetHoveredObject(hoveredObjectIdRef.current, scene);
      hoveredObjectIdRef.current = hoveredObject.id;
      hoveredObject.onHover();
      setHoveredObject(hoveredObject);
    }
    if (hoveredObject === null && hoveredObjectIdRef.current !== null) {
      onResetHoveredObject(hoveredObjectIdRef.current, scene);
      hoveredObjectIdRef.current = null;
      setHoveredObject(null);
    }
  }, []);

  const onMouseMove = React.useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = event.target as HTMLCanvasElement;
    if (canvasBoundingRectRef.current === null) {
      canvasBoundingRectRef.current = canvas.getBoundingClientRect();
    }
    const { top, left, width, height } = canvasBoundingRectRef.current;

    // calculate mouse position in normalized device coordinates, (-1 to +1) for both components
    mousePositionRef.current = {
      x: ((event.clientX - left) / width) * 2 - 1,
      y: 1 - ((event.clientY - top) / height) * 2,
    };
    setPopoverPos({
      x: event.clientX - left,
      y: event.clientY - top + 20,
    });
  }, []);

  const onMouseLeave = React.useCallback(() => {
    mousePositionRef.current = null;
    setPopoverPos(null);
  }, []);

  const onClick = React.useCallback(
    (camera: Camera, cameraAltitude: number) => {
      if (hoveredObject !== null && mascotteData?.mascotteId) {
        hoveredObject.onClick(camera, cameraAltitude);
        router.push(`/activite/${mascotteActivityId}`);
      } else {
        return;
      }
    },
    [hoveredObject, mascotteActivityId, mascotteData?.mascotteId, router],
  );

  const resetCanvasBoundingRect = React.useCallback(() => {
    canvasBoundingRectRef.current = null;
  }, []);

  const popover =
    popoverPos !== null && hoveredObject !== null ? (
      <div style={{ position: 'absolute', display: 'inline-block', left: popoverPos.x, top: popoverPos.y }}>
        <div style={{ position: 'relative', left: '-50%', pointerEvents: 'none', userSelect: 'none' }}>
          <Card style={{ padding: '0.25rem 0.5rem' }}>
            {hoveredObject.getType() === 'country' && <span className="text text--small">{hoveredObject.userData.countryName as string}</span>}
            {hoveredObject.getType() === 'pin' && <UserPopover user={hoveredObject.userData.user as User} />}
          </Card>
        </div>
      </div>
    ) : null;

  return {
    setHoverableObjects,
    onUpdateHover,
    onMouseMove,
    onMouseLeave,
    resetCanvasBoundingRect,
    onClick,
    cursorStyle: hoveredObject !== null && hoveredObject.userData.isClickable ? 'pointer' : 'default',
    popover,
  };
};
