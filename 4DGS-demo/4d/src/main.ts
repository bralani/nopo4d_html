import * as SPLAT from "gsplat";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const loadingOverlay = document.getElementById("loading-overlay") as HTMLDivElement;
const progressIndicator = document.getElementById("progress-indicator") as HTMLProgressElement;
const cards = document.querySelectorAll<HTMLElement>(".scene-card");

const scenes = [
    { name: "Cook",   url: "./scene_cook.splatv" },
    { name: "Table",  url: "./scene_covid.splatv" },
    { name: "Basket", url: "./scene_basket.splatv" },
];

const renderer = new SPLAT.WebGLRenderer(canvas);
renderer.addProgram(new SPLAT.VideoRenderProgram(renderer));

const scene = new SPLAT.Scene();
const camera = new SPLAT.Camera();
const controls = new SPLAT.OrbitControls(camera, canvas);

let loading = false;

function setActiveCard(index: number) {
    cards.forEach((c, i) => c.classList.toggle("active", i === index));
}

async function loadScene(index: number) {
    if (loading) return;
    loading = true;
    setActiveCard(index);
    scene.reset();
    progressIndicator.value = 0;
    loadingOverlay.classList.remove("hidden");
    await SPLAT.SplatvLoader.LoadAsync(scenes[index].url, scene, camera, (progress) => {
        progressIndicator.value = progress * 100;
    });
    controls.setCameraTarget(camera.position.add(camera.forward.multiply(5)));
    loadingOverlay.classList.add("hidden");
    loading = false;
}

async function main() {
    await loadScene(0);

    const handleResize = () => renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    const frame = () => {
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(frame);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    requestAnimationFrame(frame);

    cards.forEach((card) => {
        card.addEventListener("click", () => {
            const index = Number(card.dataset.index);
            if (!card.classList.contains("active")) loadScene(index);
        });
    });
}

main();
