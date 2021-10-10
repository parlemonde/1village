import type { Object3D, Scene, Camera } from 'three';

export interface HoverableObject<T extends Record<string, unknown> = Record<string, unknown>> extends Object3D {
  userData: T & { isHoverable: true; isClickable: boolean; type: string };
  getData(): T;
  getType(): string;
  onHover(): void;
  onReset(): void; // called when object is no more hovered.
  onClick(camera: Camera, cameraAltitude: number): void;
}

export const isHoverable = (object?: Object3D | null): object is HoverableObject =>
  object !== null && object !== undefined && object.userData && object.userData.isHoverable;

export const onResetHoveredObject = (id: number | null, scene: Scene) => {
  if (id === null) {
    return;
  }
  const previousObject = scene.getObjectById(id);
  if (isHoverable(previousObject)) {
    previousObject.onReset();
  }
};
