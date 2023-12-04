<script lang="ts">
    import Replicate from "replicate";
    import { onMount } from "svelte";

    let drawCanvas: HTMLCanvasElement, drawCtx: CanvasRenderingContext2D;
    let renderCanvas: HTMLCanvasElement, renderCtx: CanvasRenderingContext2D;
    let isDrawing = false;
    let currentColor = "black";
    let currentSize = 2;
    let prompt = "a cute dog";
    let isRendering = false;
    let base = window.location.protocol + "//" + window.location.host;

    let replicate = new Replicate({
        auth: import.meta.env.VITE_API_KEY,
        baseUrl: base + "/v1",
    });

    let colors = [
        "black",
        "grey",
        "white",
        "red",
        "green",
        "blue",
        "cyan",
        "magenta",
        "yellow",
        "orange",
        "brown",
        "purple",
        "pink",
        "lime",
        "skyblue",
        "navy",
    ];

    // Initialize the canvas context
    function initCanvas() {
        let context = drawCanvas.getContext("2d");
        if (!context) {
            throw new Error("Failed to get 2D context");
        }
        drawCtx = context;
        drawCtx.fillStyle = "white";
        drawCtx.fillRect(0, 0, drawCanvas.width, drawCanvas.height);

        context = renderCanvas.getContext("2d");
        if (!context) {
            throw new Error("Failed to get 2D context");
        }
        renderCtx = context;
        renderCtx.fillStyle = "white";
        renderCtx.fillRect(0, 0, renderCanvas.width, renderCanvas.height);
    }

    // Start drawing
    function startDrawing(e: MouseEvent | TouchEvent) {
        isDrawing = true;
        draw(e);
    }

    // Draw on the canvas
    function draw(e: MouseEvent | TouchEvent) {
        if (!isDrawing) return;
        drawCtx.lineWidth = currentSize;
        drawCtx.lineCap = "round";
        drawCtx.strokeStyle = currentColor;

        let x, y;
        if (e instanceof MouseEvent) {
            x = e.clientX;
            y = e.clientY;
        } else if (e instanceof TouchEvent && e.touches.length > 0) {
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        } else {
            return;
        }

        drawCtx.lineTo(x - drawCanvas.offsetLeft, y - drawCanvas.offsetTop);
        drawCtx.stroke();
        drawCtx.beginPath();
        drawCtx.moveTo(x - drawCanvas.offsetLeft, y - drawCanvas.offsetTop);
    }
    // Stop drawing
    function stopDrawing() {
        isDrawing = false;
        drawCtx.beginPath();
    }

    function copyToDraw() {
        drawCtx.drawImage(renderCanvas, 0, 0);
    }

    async function copyToRender() {
        isRendering = true;
        try {
            const output = await replicate.run(
                "fofr/latent-consistency-model:a83d4056c205f4f62ae2d19f73b04881db59ce8b81154d314dd34ab7babaa0f1",
                {
                    input: {
                        prompt,
                        width: 512,
                        height: 512,
                        image: drawCanvas.toDataURL(),
                        disable_safety_checker: true,
                    },
                },
            );

            let url = output[0].replace("https://replicate.delivery", base);
            let img = new Image();
            img.src = url;
            img.onload = () => {
                renderCtx.drawImage(img, 0, 0);
            };
        } catch (e) {
            console.log(e);
        }
        isRendering = false;
    }

    // Initialize the canvas once the component is mounted
    onMount(() => {
        initCanvas();
    });
</script>

<div class="drawing-area">
    <div class="controls">
        <label for="size">Size: </label>
        <input
            type="range"
            id="size"
            min="1"
            max="100"
            value={currentSize}
            on:input={(e) => (currentSize = e.target.value)}
        />

        <label for="prompt">
            <input
                type="text"
                id="prompt"
                placeholder="Enter a prompt"
                bind:value={prompt}
            />
        </label>
    </div>
    <div class="palette">
        {#each colors as color}
            <div
                class="color-swatch"
                style="background: {color}; border: {currentColor === color
                    ? `2px solid ${color}`
                    : '2px solid #fff'};"
                on:click={() => (currentColor = color)}
                on:keydown={(e) => e.key === "Enter" && (currentColor = color)}
            ></div>
        {/each}
    </div>

    <div class="canvas-container">
        <canvas
            bind:this={drawCanvas}
            width="512"
            height="512"
            on:mousedown={startDrawing}
            on:mouseup={stopDrawing}
            on:mouseout={stopDrawing}
            on:mousemove={draw}
            on:touchstart={startDrawing}
            on:touchend={stopDrawing}
            on:touchmove={draw}
            on:touchcancel={stopDrawing}
        />

        <button on:click={copyToDraw}>Copy to Draw</button>
        <button on:click={copyToRender} disabled={isRendering}>
            {isRendering ? "Rendering..." : "Render"}
        </button>
        <canvas bind:this={renderCanvas} width="512" height="512" />
    </div>
</div>

<style>
    canvas {
        border: 1px solid #ccc;
    }

    .palette {
        display: flex;
        margin-bottom: 10px;
    }

    .color-swatch {
        width: 30px;
        height: 30px;
        margin-right: 5px;
        border: 1px solid #ccc;
        cursor: pointer;
    }
    .drawing-area {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .controls {
        margin-bottom: 10px;
    }

    input[type="range"] {
        width: 100px;
    }

    .canvas-container {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    canvas {
        border: 1px solid #ccc;
        margin: 0 10px;
    }
    button {
        margin: 0 10px;
    }
</style>
