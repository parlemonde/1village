import type { Vector3, Camera } from 'three';
import { Group } from 'three';

import { getMapPosition } from 'src/utils/getMapPosition';
import type { User } from 'types/user.type';

import { polar2Cartesian } from '../lib/coords-utils';
import type { HoverableObject } from '../lib/hoverable-object';
import { loadGLB } from '../lib/load-glb';
import { GLOBE_RADIUS } from '../world-map.constants';

export const getPins = async (users: Array<User>, cameraPos: Vector3): Promise<Group> => {
  const pins = new Group();
  pins.name = 'pins';

  const pinModel = await getPinModel();

  for (const user of users) {
    pins.add(new HoverablePin(pinModel, user, await getMapPosition(user), cameraPos));
  }

  return pins;
};

export const getPinModel = async () => loadGLB('/earth/pin.glb');

export class HoverablePin
  extends Group
  implements
    HoverableObject<{
      user: User;
    }>
{
  private coords: [number, number];
  public userData: HoverableObject<{
    user: User;
  }>['userData'];

  constructor(pinModel: Group, user: User, coords: [number, number], cameraPos: Vector3) {
    super();

    for (const child of pinModel.children) {
      this.add(child.clone(true));
    }

    this.userData = {
      isHoverable: true,
      isClickable: true,
      type: 'pin',
      user,
    };
    this.name = 'pinGroup';

    // place
    this.coords = coords;
    const pos = polar2Cartesian(coords[0], coords[1], 1);
    this.position.x = pos.x;
    this.position.y = pos.y;
    this.position.z = pos.z;

    // rotate
    this.lookAt(cameraPos); // face toward camera pos
  }

  public update(cameraPos: Vector3, altitude: number) {
    // scale with altitude
    const scale = Math.max(0.2, Math.min(1, altitude / 100 - 1));
    this.scale.x = scale;
    this.scale.y = scale;
    this.scale.z = scale;

    // update face toward camera pos
    this.lookAt(cameraPos);
  }

  public getData(): { user: User } {
    return this.userData;
  }
  public getType(): string {
    return this.userData.type;
  }
  public onHover(): void {}
  public onReset(): void {}

  public onClick(camera: Camera, cameraAltitude: number): void {
    const newPos = polar2Cartesian(this.coords[0], this.coords[1], Math.min(cameraAltitude, 200) - GLOBE_RADIUS);
    camera.position.x = newPos.x;
    camera.position.y = newPos.y;
    camera.position.z = newPos.z;
  }
}
