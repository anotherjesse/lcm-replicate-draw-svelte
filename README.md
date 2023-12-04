# Svelte Canvas + LCM + Replicate

This is a proof of concept for a Svelte app that uses a canvas to draw, with LCM powered by replicate

## Get started

    npm i
    export VITE_API_KEY=$REPLICATE_API_TOKEN
    npm run dev

## How it works

The app is a simple canvas app (written mostly by chatgpt).  You draw on the left canvas and click "render" when you want to send the image to the right canvas.  The right canvas is powered by https://replicate.com, and will render the image with the prompt.

