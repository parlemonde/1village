import type { Vector3, Camera } from 'three';
import { Group, CylinderGeometry, MeshStandardMaterial, Mesh, TextureLoader } from 'three';

import { getMapPosition } from 'src/utils/getMapPosition';
import { clamp, getGravatarUrl } from 'src/utils';
import type { User } from 'types/user.type';

import { polar2Cartesian } from '../lib/coords-utils';
import type { HoverableObject } from '../lib/hoverable-object';
import { loadGLB } from '../lib/load-glb';
import { GLOBE_RADIUS } from '../world-map.constants';

export const getPins = async (users: Array<User>, cameraPos: Vector3): Promise<Group> => {
  const pins = new Group();
  pins.name = 'pins';

  const pinModel = await getPinModel();
  const textureLoader = new TextureLoader();

  for (const user of users) {
    pins.add(new HoverablePin(pinModel, user, await getMapPosition(user), cameraPos, textureLoader));
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

  constructor(pinModel: Group, user: User, coords: [number, number], cameraPos: Vector3, textureLoader: TextureLoader) {
    super();

    for (const child of pinModel.children) {
      this.add(child.clone(true));
    }

    const cylindar = new Mesh(
      new CylinderGeometry(3.8, 3.8, 0.8, 30),
      new MeshStandardMaterial({ color: 13111312, roughness: 0.292, metalness: 0.25 }),
    );
    cylindar.position.y = 9.1;
    cylindar.position.z = 0.2;
    cylindar.rotation.x = Math.PI / 2;
    this.add(cylindar);

    const imgSrc = user.avatar || getGravatarUrl(user.email);
    const cylindar2 = new Mesh(
      new CylinderGeometry(3.4, 3.4, 0.8, 30),
      new MeshStandardMaterial({
        map: textureLoader.load(imgSrc),
      }),
    );
    cylindar2.position.y = 9.1;
    cylindar2.position.z = 0.25;
    cylindar2.rotation.x = Math.PI / 2;
    cylindar2.rotation.y = Math.PI / 2;
    this.add(cylindar2);

    this.userData = {
      isHoverable: true,
      isClickable: true,
      type: 'pin',
      user,
    };
    this.name = 'pinGroup';

    // place
    this.coords = coords;
    const pos = polar2Cartesian(coords[0], coords[1], 2);
    this.position.x = pos.x;
    this.position.y = pos.y;
    this.position.z = pos.z;

    // rotate
    this.lookAt(cameraPos); // face toward camera pos
  }

  public update(cameraPos: Vector3, altitude: number) {
    // scale with altitude
    const scale = clamp(altitude / 100, 0.2, 1);
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
