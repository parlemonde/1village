import type { Object3D, Scene } from 'three';

export interface HoverableObject<T extends Record<string, unknown> = Record<string, unknown>> extends Object3D {
  userData: T & { isHoverable: true; type: string };
  getData(): T;
  getType(): string;
  onHover(): void;
  onReset(): void; // called when object is no more hovered.
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
