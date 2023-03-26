import type { Vector3 } from 'three';
import { DirectionalLight, Group, Mesh, MeshBasicMaterial, SphereGeometry } from 'three';

import type { HoverableObject } from '../lib/hoverable-object';
import { ImageTexture } from '../lib/image-texture';
import { GLOBE_IMAGE_URL, GLOBE_RADIUS } from '../world.constants';
import { AtmosphereGlow } from './atmosphere-glow';
import type { GeoLabel } from './capital';
import { Capital } from './capital';
import type { GeoJSONCountryData } from './country';
import { CountryGroup } from './countryGroup';
import { GlobeOutline } from './globe-outline';
import { Pin } from './pin';
import type { User } from 'types/user.type';

export class Earth extends Group implements HoverableObject {
  public countryVisibility: boolean;
  public userVisibility: boolean;
  public userData: HoverableObject['userData'];

  constructor() {
    super();

    // Add globe
    const globeGeometry = new SphereGeometry(GLOBE_RADIUS, 75, 75);
    const defaultGlobeMaterial = new MeshBasicMaterial({
      map: new ImageTexture(GLOBE_IMAGE_URL),
      transparent: false,
    });
    const globeObj = new Mesh(globeGeometry, defaultGlobeMaterial);
    globeObj.rotation.y = -Math.PI / 2; // face prime meridian along Z axis
    globeObj.name = 'globe';
    this.add(globeObj);

    // Add glow
    const glowObj = new AtmosphereGlow();
    this.add(glowObj);

    // Add outline
    const outlineMesh1 = new GlobeOutline(GLOBE_RADIUS, 0x000000, 2);
    const outlineMesh2 = new GlobeOutline(GLOBE_RADIUS, 0x4c3ed9, 6);
    this.add(outlineMesh1);
    this.add(outlineMesh2);

    // Add directional light
    this.add(new DirectionalLight(0xffffff, 0.6));

    // Set data
    this.countryVisibility = true;
    this.userVisibility = true;
    this.position.x = -2 * GLOBE_RADIUS;
    this.name = 'earth';
    this.userData = {
      isHoverable: true,
      hoverableViews: ['global'],
      hovarableTargets: [globeObj],
    };
  }

  public addCountries(countries: GeoJSONCountryData[]) {
    this.remove(...this.children.filter((child) => child.name === 'country-group'));
    for (let i = 0; i < countries.length; i++) {
      const newCountry = new CountryGroup(countries[i], i);
      newCountry.visible = this.countryVisibility;
      this.add(newCountry);
    }
  }
  public addCapitals(capitals: GeoLabel[]) {
    this.remove(...this.children.filter((child) => child.name === 'capital'));
    for (let i = 0; i < capitals.length; i++) {
      const newCapital = new Capital(capitals[i]);
      newCapital.visible = this.countryVisibility;
      this.add(newCapital);
    }
  }
  public setCountryVisibility(isVisible: boolean) {
    this.countryVisibility = isVisible;
    for (const child of this.children) {
      if (child.name === 'country-group' || child.name === 'capital') {
        child.visible = isVisible;
      }
    }
  }

  public addUsers(users: User[], cameraPos: Vector3) {
    this.remove(...this.children.filter((child) => child.name === 'pin'));
    for (const user of users) {
      const userPin = new Pin(user, cameraPos);
      userPin.visible = this.userVisibility;
      this.add(userPin);
    }
  }
  public setUserVisibility(isVisible: boolean) {
    this.userVisibility = isVisible;
    for (const child of this.children) {
      if (child.name === 'pin') {
        child.visible = isVisible;
      }
    }
  }

  public onMouseEnter(): void {
    for (const child of this.children) {
      if (child.name === 'globe-outline') {
        child.visible = true;
      }
    }
  }
  public onMouseLeave(): void {
    for (const child of this.children) {
      if (child.name === 'globe-outline') {
        child.visible = false;
      }
    }
  }
}
