import * as THREE from "three";
import { IBaseClass } from "../interfaces/IBaseClass";
import { Settings } from "../data/Settings";
import { Signal } from "../events/Signal";
import { GalaxyStarParams } from "../scenes/Galaxy";
import { LogMng } from "../utils/LogMng";
import { MyMath } from "../utils/MyMath";

import star1Vert from "../shaders/galaxy/star_v.glsl";
import star1Frag from "../shaders/galaxy/star_f.glsl";

import star2Vert from "../shaders/galaxy/star2_v.glsl";
import star2Frag from "../shaders/galaxy/star2_f.glsl";

const SHADER_1 = {
    vertex: star1Vert,
    fragment: star1Frag
}

const SHADER_2 = {
    vertex: star2Vert,
    fragment: star2Frag
}

type GalaxyStarsParams = {
    starsData: GalaxyStarParams[];
    texture: THREE.Texture;
    onWindowResizeSignal: Signal;
};

type Version = '1' | '2';

export class GalaxyStars extends THREE.Group implements IBaseClass {

    private params: GalaxyStarsParams;
    private uniforms: any;
    private geometry: THREE.BufferGeometry;
    private material: THREE.ShaderMaterial;
    private stars: THREE.Points;
    private _alphaFactor = 1;

    private _type: Version;

    constructor(aParams: GalaxyStarsParams) {

        super();
        this.params = aParams;
        
        // this.init1();
        // this.init2_saturn();
        this.init3();

        this.params.onWindowResizeSignal.add(this.onWindowResize, this);

    }

    get alphaFactor(): number {
        return this._alphaFactor;
    }

    set alphaFactor(aVal: number) {
        this._alphaFactor = aVal;
    }

    private init1() {
        this.uniforms = {
            diffuseTexture: { value: this.params.texture },
            pointMultiplier: { value: innerHeight / (2.0 * Math.tan(.02 * 60.0 * Math.PI / 180)) }
        };

        this.material = new THREE.ShaderMaterial({
            vertexShader: SHADER_1.vertex,
            fragmentShader: SHADER_1.fragment,
            uniforms: this.uniforms,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            transparent: true,
            alphaTest: 0.01,
            vertexColors: true
        });

        let starsData = this.generateStars(this.params.starsData);

        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(starsData.positionsXYZ, 3));
        this.geometry.setAttribute('size', new THREE.Float32BufferAttribute(starsData.sizes, 1));
        this.geometry.setAttribute('clr', new THREE.Float32BufferAttribute(starsData.colorsRGBA, 4));

        this.stars = new THREE.Points(this.geometry, this.material);
        this.add(this.stars);

        this._type = '1';
    }

    private init2_saturn() {

        let starsData = this.generateStars(this.params.starsData);

        this.uniforms = {
            time: { value: 0 }
        }

        let points: THREE.Vector3[] = [];

        for (let i = 0; i < starsData.positionsXYZ.length; i += 3) {
            const x = starsData.positionsXYZ[i];
            const y = starsData.positionsXYZ[i + 1];
            const z = starsData.positionsXYZ[i + 2];
            points.push(new THREE.Vector3(x, y, z));
        }


        this.geometry = new THREE.BufferGeometry().setFromPoints(points);
        this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(starsData.positionsXYZ, 3));
        // this.geometry.setAttribute("sizes", new THREE.Float32BufferAttribute(sizes, 1));
        this.geometry.setAttribute('sizes', new THREE.Float32BufferAttribute(starsData.sizes, 1));
        // this.geometry.setAttribute("shift", new THREE.Float32BufferAttribute(shift, 4));
        this.geometry.setAttribute('clr', new THREE.Float32BufferAttribute(starsData.colorsRGBA, 4));


        /* eslint-disable */
        let m = new THREE.PointsMaterial({
            size: 0.125,
            transparent: true,
            depthTest: false,
            blending: THREE.AdditiveBlending
        });

        m.onBeforeCompile = shader => {

            shader.uniforms.time = this.uniforms.time;
            shader.vertexShader = `
                uniform float time;
                attribute float sizes;
                // attribute vec4 shift;
                // varying vec3 vColor;
                attribute vec4 clr;
                ${shader.vertexShader}
            `.replace(
                `gl_PointSize = size;`,
                `gl_PointSize = size * sizes;`
            ).replace(
                `#include <color_vertex>`,
                `#include <color_vertex>
                float d = length(abs(position) / vec3(40., 10., 40));
                d = clamp(d, 0., 1.);
                // vColor = mix(vec3(227., 155., 0.), vec3(100., 50., 255.), d) / 255.;
                `
            ).replace(
                `#include <begin_vertex>`,
                `#include <begin_vertex>
                float t = time;
                // float moveT = mod(shift.x + shift.z * t, PI2);
                // float moveS = mod(shift.y + shift.z * t, PI2);
                // transformed += vec3(cos(moveS) * sin(moveT), cos(moveT), sin(moveS) * sin(moveT)) * shift.w;
                `
            );

            shader.fragmentShader = `
                varying vec3 vColor;
                attribute vec4 clr;
                ${shader.fragmentShader}
          `.replace(
                `#include <clipping_planes_fragment>`,
                `
                #include <clipping_planes_fragment>
                float d = length(gl_PointCoord.xy - 0.5);
                //if (d > 0.5) discard;
                `
            ).replace(
                `vec4 diffuseColor = vec4(diffuse, opacity);`,
                `vec4 diffuseColor = vec4(clr, smoothstep(0.5, 0.1, d) /* * 0.5 + 0.5*/ );`
                // `gl_FragColor = texture2D(diffuseTexture, gl_PointCoord) * vColor;`
            );

        };
        /* eslint-enable */

        // this.material = new THREE.ShaderMaterial({
        //     vertexShader: _vShader,
        //     fragmentShader: _fShader,
        //     uniforms: this.uniforms,
        //     blending: THREE.AdditiveBlending,
        //     // depthTest: true,
        //     depthWrite: false,
        //     transparent: true,
        //     alphaTest: 0.01,
        //     vertexColors: true
        // });

        this.material = m as any;

        let p = new THREE.Points(this.geometry, m);
        this.add(p)

        this._type = '2';

    }

    private init3() {
        this.uniforms = {
            // diffuseTexture: { value: this.params.texture },
            pointMultiplier: { value: innerHeight / (2.0 * Math.tan(.02 * 60.0 * Math.PI / 180)) }
        };

        this.material = new THREE.ShaderMaterial({
            vertexShader: SHADER_2.vertex,
            fragmentShader: SHADER_2.fragment,
            uniforms: this.uniforms,
            transparent: true,
            alphaTest: 0.001,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexColors: true
        });

        let starsData = this.generateStars(this.params.starsData);

        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(starsData.positionsXYZ, 3));
        this.geometry.setAttribute('size', new THREE.Float32BufferAttribute(starsData.sizes, 1));
        this.geometry.setAttribute('clr', new THREE.Float32BufferAttribute(starsData.colorsRGBA, 4));

        this.stars = new THREE.Points(this.geometry, this.material);
        this.add(this.stars);

        this._type = '1';
    }

    private onWindowResize() {
        this.uniforms.pointMultiplier.value = window.innerHeight / (2.0 * Math.tan(.02 * 60.0 * Math.PI / 180));
    }

    private generateStars(aStarsData: GalaxyStarParams[]): {
        positionsXYZ: Float32Array,
        colorsRGBA: Float32Array,
        sizes: Float32Array
    } {
        const starsCount = aStarsData.length;
        let positions = new Float32Array(starsCount * 3);
        let colors = new Float32Array(starsCount * 4);
        let sizes = new Float32Array(starsCount);

        for (let i = 0; i < starsCount; i++) {

            let starData = aStarsData[i];
            // position
            let pId = i * 3;
            positions[pId] = starData.pos.x;
            positions[pId + 1] = starData.pos.y;
            positions[pId + 2] = starData.pos.z;

            // color
            let cId = i * 4;
            colors[cId] = starData.color.r;
            colors[cId + 1] = starData.color.g;
            colors[cId + 2] = starData.color.b;
            colors[cId + 3] = starData.color.a * this._alphaFactor;

            // size
            sizes[i] = starData.scale;

        }

        return {
            positionsXYZ: positions,
            colorsRGBA: colors, 
            sizes: sizes
        };
    }

    // public set azimutAngle(v: number) {
    //     this._azimutAngle = v;
    // }

    // public set polarAngle(v: number) {
    //     this._polarAngle = v;
    // }

    updateUniformValues() {
        this.material.uniforms.radiusMin.value = Settings.skyData.radiusMin;
        this.material.uniforms.radiusMax.value = Settings.skyData.radiusMax;
        this.material.uniforms.scaleMin.value = Settings.skyData.scaleMin;
        this.material.uniforms.scaleMax.value = Settings.skyData.scaleMax;
        this.material.uniforms.starSize.value = Settings.skyData.starSize;
        this.material.uniforms.starAlpha.value = Settings.skyData.starAlpha;
    }
    
    free() {
        this.remove(this.stars);
        // this.geometry.vertices = [];
        this.geometry = null;
        this.material = null;
        this.params = null;
        this.stars = null;
    }

    private updateParticles(dt: number) {

        let starsData = this.params.starsData;
        let colors: Float32Array = this.geometry.attributes['clr'].array as any; // getAttribute('clr').array;
        let clr: any = this.geometry.attributes['clr']; // getAttribute('clr').array;

        for (let i = 0; i < starsData.length; i++) {
            const sd = starsData[i];
            let a = 1;

            if (sd.blink) {

                let b = sd.blink;
                b.progressTime += dt;
                let t = Math.min(1, b.progressTime / b.duration);

                a = b.isFade ? 1 - b.tweenFunction(t) : b.tweenFunction(t);

                if (b.progressTime >= b.duration) {
                    b.isFade = !b.isFade;
                    b.progressTime = 0;
                }

                
            }

            let clrId = i * 4;
            clr.array[clrId + 3] = a * this._alphaFactor;
            // LogMng.debug(`clr a: ${clr.array[clrId + 3]}`);

        }

        // this.geometry.setAttribute('clr', colors);
        clr.needsUpdate = true;

    }

    update(dt: number) {

        switch (this._type) {
            case '1':
                this.updateParticles(dt);
                break;
        
            case '2':
                this.uniforms.time.value += dt;
                break;
        }

    }

}