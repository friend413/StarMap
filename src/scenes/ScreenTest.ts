import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
import { Settings } from '../data/Settings';

export class ScreenTest extends THREE.Group {
    scene;
    camera;
    cameraCtrl;
    private renderer: CSS3DRenderer;

    constructor(camera, scene, cameraCtrl) {
        super();

        this.scene = scene;
        this.camera = camera;
        this.cameraCtrl = cameraCtrl;

        // this.init1();
        this.init2();

        // this.add(this.createCSS('ipLtiGPjyyo', 0, 0, 0, 0));

    }

    init1() {

        const container = document.getElementById('container');

        // camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 5000 );
        // camera.position.set( 500, 350, 750 );

        // scene = new THREE.Scene();

        this.renderer = new CSS3DRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        // container.appendChild( this.renderer.domElement );
        Settings.domCanvasParent.appendChild(this.renderer.domElement);
        // Settings.domRenderer = this.renderer.domElement;

        // const group = new THREE.Group();
        // group.add( new Element( 'SJOz3qjfQXU', 0, 0, 240, 0 ) );
        // group.add( new Element( 'Y2-xZ-1HE-Q', 240, 0, 0, Math.PI / 2 ) );
        // group.add( new Element( 'IrydklNpcFI', 0, 0, - 240, Math.PI ) );
        // group.add( new Element( '9ubytEsCaS0', - 240, 0, 0, - Math.PI / 2 ) );
        // scene.add( group );

        window.addEventListener('resize', this.onWindowResize);

        // Block iframe events when dragging camera

        const blocker = document.getElementById('blocker');
        // blocker.style.display = 'none';

        this.cameraCtrl.addEventListener('start', () => {
            blocker.style.display = '';
        });
        this.cameraCtrl.addEventListener('end', () => {
            blocker.style.display = 'none';
        });

    }

    init2() {

        // Load the YouTube API client library
        gapi.load('client', () => {
            // Initialize the API client library
            gapi.client.init({
                apiKey: 'AIzaSyAVN6coDMCkwbGvjJZOePXG97sUDy_3oPo',
                scope: 'https://www.googleapis.com/auth/youtube.readonly',
                discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest']
            }).then(() => {
                // Make the API request to get the video information
                return gapi.client.request({
                    path: '/youtube/v3/videos',
                    params: {
                        part: 'snippet,contentDetails',
                        id: 'P1aSX58RyhU',
                    }
                });
            }).then((response) => {

                //1st version
                // Get the URL of the video's highest-quality thumbnail
                // var thumbnailUrl = response.result.items[0].snippet.thumbnails.maxres.url;
                // // Create a texture from the thumbnail image
                // var texture = new THREE.TextureLoader().load(thumbnailUrl);
                // // Create a plane geometry for the video
                // var geometry = new THREE.PlaneGeometry(16, 9);
                // // Create a material for the video
                // var material = new THREE.MeshBasicMaterial({ map: texture });
                // // Create a mesh for the video
                // var mesh = new THREE.Mesh(geometry, material);
                // mesh.position.y = 12;
                // // Add the mesh to the scene
                // this.scene.add(mesh);

                // 2nd version

                const videoUrl = `https://www.youtube.com/embed/${response.result.items[0].id}`;

                // Создание элемента iframe для воспроизведения видео
                const video = document.createElement('iframe');
                video.src = videoUrl;
                // video.play();

                // Создание объекта THREE.VideoTexture и установка источника видео
                const texture = new THREE.VideoTexture(video as any);
                texture.minFilter = THREE.LinearFilter;
                texture.magFilter = THREE.LinearFilter;
                texture.format = THREE.RGBFormat;

                // Создание объекта THREE.Mesh и установка текстуры
                const geometry = new THREE.BoxGeometry(40, 20, 40);
                const material = new THREE.MeshBasicMaterial({ map: texture });
                const mesh = new THREE.Mesh(geometry, material);
                mesh.position.y = 20;

                // Добавление объекта на сцену
                this.scene.add(mesh);
            });

        });



    }

    onWindowResize() {
        // this.camera.aspect = window.innerWidth / window.innerHeight;
        // camera.updateProjectionMatrix();
        // this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    createCSS(id, x, y, z, ry) {

        const div = document.createElement('div');
        div.style.width = '240px';
        div.style.height = '180px';
        div.style.backgroundColor = '#000';

        const iframe = document.createElement('iframe');
        iframe.style.width = '240px';
        iframe.style.height = '180px';
        iframe.style.border = '0px';
        iframe.src = ['https://www.youtube.com/embed/', id, '?rel=0'].join('');
        div.appendChild(iframe);

        const object = new CSS3DObject(div);
        object.position.set(x, y, z);
        object.rotation.y = ry;

        return object;

    }

    createElement(id, x, y, z, ry) {

        // Создаем Video элемент и устанавливаем его источник
        const video = document.createElement('video');
        video.src = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
        video.crossOrigin = 'anonymous'; // необходимо для загрузки видео с другого домена

        // Создаем текстуру на основе Video элемента
        const videoTexture = new THREE.VideoTexture(video);
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;
        videoTexture.format = THREE.RGBFormat;

        // Создаем материал на основе текстуры
        const material = new THREE.MeshBasicMaterial({ map: videoTexture });

        // Создаем геометрию для объекта (HD:720)
        const geometry = new THREE.PlaneGeometry(1280 / 4, 720 / 4);

        // Создаем объект и добавляем его на сцену
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = 100;

        // Начинаем воспроизведение видео
        video.play();

        return mesh;

    }

    createElement2(id, x, y, z, ry) {

        const div = document.createElement('div');
        div.style.width = '480px';
        div.style.height = '360px';
        div.style.backgroundColor = '#000';

        const iframe = document.createElement('iframe');
        iframe.style.width = '480px';
        iframe.style.height = '360px';
        iframe.style.border = '0px';
        iframe.src = ['https://www.youtube.com/embed/', id, '?rel=0'].join('');
        div.appendChild(iframe);


        // Создаем Video элемент и устанавливаем его источник
        // const video = document.createElement('video');
        // video.src = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
        // video.crossOrigin = 'anonymous'; // необходимо для загрузки видео с другого домена

        // Создаем текстуру на основе Video элемента
        // const videoTexture = new THREE.VideoTexture(iframe);
        // videoTexture.minFilter = THREE.LinearFilter;
        // videoTexture.magFilter = THREE.LinearFilter;
        // videoTexture.format = THREE.RGBFormat;

        // // Создаем материал на основе текстуры
        // const material = new THREE.MeshBasicMaterial({ map: videoTexture });

        // // Создаем геометрию для объекта (HD:720)
        // const geometry = new THREE.PlaneGeometry(1280 / 4, 720 / 4);

        // // Создаем объект и добавляем его на сцену
        // const mesh = new THREE.Mesh(geometry, material);
        // mesh.position.y = 100;

        // return mesh;

    }

    render() {
        // this.renderer.render(this.scene, this.camera);
    }


}