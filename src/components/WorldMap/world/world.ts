import type { Object3D } from 'three';
import { Raycaster, Vector3, AmbientLight, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import type { User } from '../../../../types/user.type';
import { clamp } from '../../../utils';
import type { PopoverData } from '../Popover';
import { Animations } from './animations';
import { LinearAnimation } from './animations/linear-animation';
import { cartesian2Polar, polar2Cartesian } from './lib/coords-utils';
import { disposeNode } from './lib/dispose-node';
import type { HoverableObject } from './lib/hoverable-object';
import { isHoverable } from './lib/hoverable-object';
import type { GeoLabel } from './objects/capital';
import type { Country, GeoJSONCountryData } from './objects/country';
import { Earth } from './objects/earth';
import { Pelico } from './objects/pelico';
import { Pin } from './objects/pin';
import { Sky } from './objects/sky';
import { GLOBE_RADIUS, MAX_DISTANCE, MIN_DISTANCE, SKY_RADIUS, START_DISTANCE, PELICO_USER } from './world.constants';

type View = 'earth' | 'global' | 'pelico';
const CENTERS: Record<View, Vector3> = {
  earth: new Vector3(-2 * GLOBE_RADIUS, -1 * GLOBE_RADIUS, 0),
  global: new Vector3(),
  pelico: new Vector3(1 * GLOBE_RADIUS, 1 * GLOBE_RADIUS, 0),
};

type MouseStyleSetter = (mouseStyle: React.CSSProperties['cursor']) => void;
type PopoverDataSetter = (popoverData: PopoverData | null) => void;

export class World {
  // -- global objects --
  private readonly scene: Scene;
  private readonly renderer: WebGLRenderer;
  private readonly raycaster: Raycaster;
  private readonly camera: PerspectiveCamera;
  private readonly controls: OrbitControls;
  private readonly animations: Animations;

  // -- scene objects --
  private readonly earth: Earth;
  private readonly pelico: Pelico;
  private readonly pelicoPin: Pin;

  // -- mouse pos --
  public canvasRect: DOMRect;
  private mousePosition: {
    x: number;
    y: number;
  } | null;
  private readonly setMouseStyle: MouseStyleSetter;
  private readonly setPopoverData: PopoverDataSetter;
  private hoveredObject: HoverableObject | null;

  private view: 'earth' | 'global' | 'pelico';
  private isPelicoEnabled: boolean = false;

  constructor(canvas: HTMLCanvasElement, setMouseStyle: MouseStyleSetter, setPopoverData: PopoverDataSetter, selectedPhase: number) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    this.canvasRect = canvas.getBoundingClientRect();
    this.setMouseStyle = setMouseStyle;
    this.setPopoverData = setPopoverData;
    this.mousePosition = null;
    this.hoveredObject = null;

    // -- Setup current view --
    this.view = selectedPhase === 3 ? 'pelico' : 'earth';

    // -- Init scene, camera, and renderer --
    this.scene = new Scene();
    this.scene.add(new AmbientLight(0xffffff, 1));
    this.camera = new PerspectiveCamera(50, width / height, 0.1, SKY_RADIUS * 2.5);
    this.camera.position.x = CENTERS[this.view].x;
    this.camera.position.y = CENTERS[this.view].y;
    this.camera.position.z = START_DISTANCE;
    this.renderer = new WebGLRenderer({ canvas, powerPreference: 'high-performance', antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
    this.renderer.setSize(width, height, false);
    this.raycaster = new Raycaster();

    // -- Add earth --
    this.earth = new Earth();
    this.earth.position.copy(CENTERS.earth);
    this.earth.setCountryVisibility(false);
    this.earth.visible = this.view === 'earth';
    this.scene.add(this.earth);

    // -- Add pelico globe --
    this.pelico = new Pelico();
    this.pelico.position.copy(CENTERS.pelico);
    this.pelico.visible = this.view === 'pelico';
    this.scene.add(this.pelico);

    // -- Add pelico user --
    this.pelicoPin = new Pin(PELICO_USER, new Vector3(0, 0, 1), true, GLOBE_RADIUS * 0.75, true);
    const pos = polar2Cartesian(30, -90, 2, GLOBE_RADIUS * 0.75);
    this.pelicoPin.position.x = pos.x;
    this.pelicoPin.position.y = pos.y;
    this.pelicoPin.position.z = pos.z;
    this.pelicoPin.position.add(CENTERS.pelico);
    this.pelicoPin.lookAt(this.pelicoPin.position.clone().add(new Vector3(0, 0, 1)));
    this.pelicoPin.rotateZ(0.9);
    this.pelicoPin.scale.set(8, 8, 8);
    this.pelicoPin.visible = false;
    this.scene.add(this.pelicoPin);

    // -- Add sky --
    this.scene.add(new Sky());

    // -- Setup camera controls --
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.minDistance = MIN_DISTANCE;
    this.controls.maxDistance = MAX_DISTANCE;
    this.controls.enablePan = false;
    this.controls.enableDamping = false;
    this.controls.target = CENTERS[this.view].clone();
    this.controls.rotateSpeed = 0.2;
    this.controls.zoomSpeed = 0.2;
    this.controls.addEventListener('change', this.onCameraChange.bind(this));
    this.controls.autoRotate = false;

    // -- Add animations
    this.animations = new Animations();
  }

  public addCountriesAndCapitals({ countries, capitals }: { countries: GeoJSONCountryData[]; capitals: GeoLabel[] }) {
    this.earth.addCountries(countries);
    this.earth.addCapitals(capitals);
  }

  public addUsers(users: User[]) {
    this.earth.addUsers(users, this.camera.position.clone().sub(CENTERS[this.view]));
    this.pelico.addUsers(users, this.camera.position.clone().sub(CENTERS[this.view]));
  }

  private onResize() {
    const canvas = this.renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      this.canvasRect = canvas.getBoundingClientRect();
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height, false);
    }
  }

  private previousTimestamp: number | undefined = undefined;
  public render(timestamp: number) {
    // Update resize if needed
    this.onResize();

    // Update animations
    const dt = this.previousTimestamp ? timestamp - this.previousTimestamp : timestamp;
    this.previousTimestamp = timestamp;
    this.animations.animate(dt);

    // Animate global view
    if (this.view === 'global') {
      this.animateGlobalView(dt);
    }

    // Update hovered object
    this.onHover();

    // Update camera
    if (this.view !== 'global') {
      this.controls.update();
    }

    // Update scene
    this.renderer.render(this.scene, this.camera);
  }

  public dispose() {
    this.renderer.renderLists.dispose();
    this.renderer.dispose();
    this.controls.dispose();
    this.scene.children.forEach(disposeNode);
  }

  public onZoom(delta: number) {
    if (this.view === 'global') {
      return;
    }
    const center = CENTERS[this.view];
    const { lat, lng, altitude } = cartesian2Polar(this.camera.position.clone().sub(center));
    const { x, y, z } = polar2Cartesian(lat, lng, clamp(altitude + delta, MIN_DISTANCE, MAX_DISTANCE) - GLOBE_RADIUS);
    this.camera.position.x = x + center.x;
    this.camera.position.y = y + center.y;
    this.camera.position.z = z + center.z;
  }

  private onCameraChange() {
    const altitude = this.camera.position.clone().distanceTo(CENTERS[this.view]);
    if (altitude > MAX_DISTANCE - 10 && this.view !== 'global' && this.isPelicoEnabled) {
      this.transitionToGlobal();
    }
    const showDecors = altitude < 240;
    if (this.earth.countryVisibility !== showDecors) {
      this.earth.setCountryVisibility(showDecors);
    }
    this.updateUsers(altitude);
  }

  private updateUsers(altitude: number) {
    for (const child of this.earth.children) {
      if (child.name === 'pin') {
        (child as Pin).update(this.camera.position.clone(), altitude);
      }
    }
    for (const child of this.pelico.children) {
      if (child.name === 'pin') {
        (child as Pin).update(this.camera.position.clone(), altitude);
      }
    }
  }

  private setAltitude(altitude: number) {
    const center = CENTERS[this.view];
    const { lat, lng } = cartesian2Polar(this.camera.position.clone().sub(center));
    const { x, y, z } = polar2Cartesian(lat, lng, clamp(altitude, MIN_DISTANCE, MAX_DISTANCE) - GLOBE_RADIUS);
    this.camera.position.x = x + center.x;
    this.camera.position.y = y + center.y;
    this.camera.position.z = z + center.z;
  }

  private transitionToGlobal() {
    this.setAltitude(MAX_DISTANCE);
    this.animations.cancelAnimations();
    this.earth.setCountryVisibility(false);
    this.earth.setUserVisibility(false);
    this.pelico.setUserVisibility(false);
    const previousView = this.view;
    const center = CENTERS[this.view];
    const polarAngle = this.controls.getPolarAngle();
    const azimuthalAngle = this.controls.getAzimuthalAngle();
    this.controls.enabled = false;
    this.view = 'global';

    // Translate camera to center.
    let prevX = 0;
    this.animations.addAnimation(
      new LinearAnimation(0, -center.x, 250, (x) => {
        this.camera.translateX(x - prevX);
        prevX = x;
      }),
    );
    let prevY = 0;
    this.animations.addAnimation(
      new LinearAnimation(0, -center.y, 250, (y) => {
        this.camera.translateY(y - prevY);
        prevY = y;
      }),
    );

    setTimeout(() => {
      this.camera.position.x = 0;
      this.camera.position.y = 0;
      this.camera.position.z = MAX_DISTANCE;
      this.camera.lookAt(new Vector3());
      this.scene.children.forEach((child) => {
        if (child.name === previousView) {
          child.rotateX(Math.PI / 2 - polarAngle);
          child.rotateY(-azimuthalAngle);
        }
      });
      let prev = 0;
      this.animations.addAnimation(
        new LinearAnimation(0, polarAngle - Math.PI / 2, 200, (x) => {
          this.scene.children.forEach((child) => {
            if (child.name === previousView) {
              child.rotateOnWorldAxis(new Vector3(1, 0, 0), x - prev);
              prev = x;
            }
          });
        }),
      );
      this.scene.children.forEach((child) => {
        if ((child.name === 'pelico' && previousView === 'earth') || (child.name === 'earth' && previousView === 'pelico') || child.name === 'pin') {
          child.visible = true;
          child.scale.set(0, 0, 0);
        }
      });
      this.animations.addAnimation(
        new LinearAnimation(0, 1, 200, (scale) => {
          this.scene.children.forEach((child) => {
            if ((child.name === 'pelico' && previousView === 'earth') || (child.name === 'earth' && previousView === 'pelico')) {
              child.scale.set(scale, scale, scale);
            }
            if (child.name === 'pin') {
              child.scale.set(scale * 8, scale * 8, scale * 8);
            }
          });
        }),
      );
    }, 250);
  }

  public onMouseMove(event: React.MouseEvent) {
    const { top, left, width, height } = this.canvasRect;
    // calculate mouse position in normalized device coordinates, (-1 to +1) for both components
    this.mousePosition = {
      x: ((event.clientX - left) / width) * 2 - 1,
      y: 1 - ((event.clientY - top) / height) * 2,
    };
  }

  public onHover() {
    if (this.mousePosition === null) {
      this.hoveredObject?.onMouseLeave();
      this.hoveredObject = null;
      this.setMouseStyle('default');
      this.setPopoverData(null);
      return;
    }

    const hoverableObjects: Object3D[] = [];
    this.scene.traverseVisible((object) => {
      if (isHoverable(object) && object.userData.hoverableViews.includes(this.view)) {
        if (object.userData.hovarableTargets) {
          hoverableObjects.push(...object.userData.hovarableTargets);
        } else {
          hoverableObjects.push(object);
        }
      }
    });
    this.raycaster.setFromCamera(this.mousePosition, this.camera);
    const intersections = this.raycaster.intersectObjects(hoverableObjects, false);
    const firstIntersectObject = intersections[0]?.object || null;
    let hoveredObject: HoverableObject | null = null;
    if (firstIntersectObject && isHoverable(firstIntersectObject)) {
      hoveredObject = firstIntersectObject;
    } else if (firstIntersectObject && isHoverable(firstIntersectObject.parent)) {
      hoveredObject = firstIntersectObject.parent;
    }

    // Update hovered events
    if (this.hoveredObject !== hoveredObject) {
      this.hoveredObject?.onMouseLeave();
      this.hoveredObject = hoveredObject;
      this.hoveredObject?.onMouseEnter();
      this.setMouseStyle(this.hoveredObject === null ? 'default' : this.hoveredObject.userData.cursor || 'pointer');
      if (this.hoveredObject !== null && this.hoveredObject.name === 'country') {
        this.setPopoverData({
          type: 'country',
          data: {
            country: (this.hoveredObject as Country).userData.countryName,
          },
        });
      } else if (this.hoveredObject !== null && this.hoveredObject.name === 'pin') {
        this.setPopoverData({
          type: 'user',
          data: (this.hoveredObject as Pin).userData.user,
        });
      } else {
        this.setPopoverData(null);
      }
    }
  }

  public getHoveredObjectName() {
    return this.hoveredObject?.name;
  }
  public resetHoverState() {
    this.mousePosition = null;
  }

  public changeView(newView: 'pelico' | 'earth') {
    if (this.view === newView) {
      return;
    }
    this.resetHoverState();
    this.camera.lookAt(CENTERS[newView]);
    this.camera.position.x = CENTERS[newView].clone().x;
    this.camera.position.y = CENTERS[newView].clone().y;
    this.camera.position.z = START_DISTANCE;
    this.pelicoPin.visible = false;
    if (newView === 'earth') {
      this.view = 'earth';
      this.setAltitude(START_DISTANCE);
      this.controls.target = CENTERS[this.view].clone();
      this.controls.enabled = true;
      this.animations.cancelAnimations();
      this.earth.rotation.set(0, 0, 0);
      this.earth.visible = true;
      this.pelico.visible = false;
      this.earth.setCountryVisibility(false);
      this.earth.setUserVisibility(true);
    } else {
      this.view = 'pelico';
      this.setAltitude(START_DISTANCE);
      this.controls.target = CENTERS[this.view].clone();
      this.controls.enabled = true;
      this.pelico.rotation.set(0, 0, 0);
      this.animations.cancelAnimations();
      this.pelico.visible = true;
      this.earth.visible = false;
      this.pelico.setUserVisibility(true);
    }
  }

  public onClick() {
    if (this.hoveredObject !== null && this.hoveredObject.name === 'earth') {
      this.changeView('earth');
    }
    if (this.hoveredObject !== null && this.hoveredObject.name === 'pelico') {
      this.changeView('pelico');
    }
    if (this.hoveredObject !== null && this.hoveredObject.name === 'pin' && this.view !== 'global') {
      const altitude = this.camera.position.clone().distanceTo(CENTERS[this.view]);
      const coords = (this.hoveredObject as Pin).userData.user.position;
      const center = CENTERS[this.view].clone();
      const { x, y, z } = polar2Cartesian(coords.lat, coords.lng, 100);
      this.camera.position.x = x + center.x;
      this.camera.position.y = y + center.y;
      this.camera.position.z = z + center.z;
      this.setAltitude(altitude);
    }
  }

  private animateGlobalView(dt: number) {
    for (const child of this.scene.children) {
      if (child.name === 'earth') {
        child.rotateY(dt / 3000);
      }
      if (child.name === 'pelico') {
        child.rotateY(dt / 4000);
      }
    }
  }

  public addPelicoEnigme() {
    this.isPelicoEnabled = true;
  }

  public removePelicoEnigme() {
    this.isPelicoEnabled = false;
  }
}
