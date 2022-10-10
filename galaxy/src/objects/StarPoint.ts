import * as THREE from "three";
import { ThreeLoader } from "../loaders/ThreeLoader";
import gsap from "gsap";

export type StarPointParams = {
    name: string;
    starId: number;
    baseScale: number;
    camera: THREE.PerspectiveCamera;
};

export class StarPoint extends THREE.Group {

    private _params: StarPointParams;
    private _starPointSprite: THREE.Sprite;
    private _cameraScale = 1;

    constructor(aParams: StarPointParams) {

        super();
        this._params = aParams;

        let loader = ThreeLoader.getInstance();

        let previewTexture = loader.getTexture('starPoint');
        let previewMaterial = new THREE.SpriteMaterial({
            map: previewTexture,
            transparent: true,
            opacity: 0.9,
            depthWrite: false,
            // blending: THREE.AdditiveBlending
        });

        this._starPointSprite = new THREE.Sprite(previewMaterial);

        this._starPointSprite.scale.set(1, 1, 1);
        this._starPointSprite[`name`] = 'starPoint';
        this._starPointSprite[`starId`] = this._params.starId;
        this.updateScale();
        this.add(this._starPointSprite);

    }

    private updateScale() {
        let sc = this._params.baseScale * this._cameraScale;
        this._starPointSprite.scale.set(sc, sc, 1);
    }

    private updateCameraScale() {

        let version = 0;

        switch (version) {

            case 0:

                const minScale = 0.1;
                const maxScale = 25;
                const dtScale = maxScale - minScale;
                const minDist = 10;
                const maxDist = 4000;
                const dtDist = maxDist - minDist;

                let dist = this._params.camera.position.distanceTo(this.position);
                // console.log(`dist:`, dist);

                dist = Math.min(maxDist, Math.max(minDist, dist));

                let perc = (dist - minDist) / dtDist;
                this._cameraScale = minScale + perc * dtScale;

                this.updateScale();

                break;
            
            case 1:

                let dist1 = this._params.camera.position.distanceTo(this.position);
                this._cameraScale = dist1 / 70;

                break;
        }
            
        this.updateScale();

    }
    
    public set cameraScale(v: number) {
        this._cameraScale = v;
        this.updateScale();
    }
    

    show(aDur: number, aDelay: number) {
        const starPointSprite = this._starPointSprite;
        gsap.to([starPointSprite.material], {
            opacity: 1,
            duration: aDur,
            delay: aDelay,
            ease: 'sine.out',
            onStart: () => {
                starPointSprite.visible = true;
            }
        });
    }

    hide(aDur: number) {
        const starPointSprite = this._starPointSprite;
        gsap.to([starPointSprite.material], {
            opacity: 0,
            duration: aDur,
            ease: 'sine.in',
            onComplete: () => {
                starPointSprite.visible = false;
            }
        });
    }

    update() {
        this.updateCameraScale();
    }

}