# Development Guide

This guide explains how to modify the presentation, add new slides, and use the built-in features.

## Project Structure

*   `index.html`: The main structure containing all slides and content.
*   `styles.css`: All styling, animations, and print layouts.
*   `script.js`: Logic for navigation, laser pointer, and image zoom.

## Adding a New Slide

To add a new slide, copy the following template and paste it inside the `<main class="slides-container">` in `index.html`. Place it where you want it to appear in the flow.

```html
<!-- Slide X: Title -->
<section class="slide" id="slide-new">
    <div class="content-wrapper">
        <h2 class="slide-title animate-in">Your Slide Title</h2>
        
        <!-- Choose a Layout Below -->
        
        <!-- Layout Option 1: Split Layout (Text Left, Image Right) -->
        <div class="split-layout">
            <div class="text-column">
                <div class="content-block animate-in delay-1">
                    <h3>Section Header</h3>
                    <p>Your content goes here.</p>
                </div>
            </div>
            <div class="visual-content animate-in delay-2">
                <!-- Image with Zoom Effect -->
                <img src="path/to/image.png" alt="Description" class="slide-image">
            </div>
        </div>

        <!-- Speaker Notes (Hidden in presentation, visible in Print/PDF) -->
        <div class="speaker-notes">
            <h3>Speaker Notes</h3>
            <p>Write your script here.</p>
        </div>
    </div>
</section>
```

### Key Classes

*   `.slide`: The container for a single slide.
*   `.content-wrapper`: Centers content and handles padding.
*   `.animate-in`: Adds a fade-in and slide-up animation.
*   `.delay-1`, `.delay-2`, etc.: Adds a delay to the animation for a staggered effect.

## Layout Options

### 1. Split Layout (Text + Image)
Use `.split-layout` to create a two-column grid (Text on left, Image on right).

```html
<div class="split-layout">
    <div class="text-column">...</div>
    <div class="visual-content">...</div>
</div>
```

### 2. Cards Layout
Use `.cards-layout` for a row of feature cards.

```html
<div class="cards-layout animate-in delay-1">
    <div class="card">
        <h3>Card Title</h3>
        <p>Card content.</p>
    </div>
    <div class="card">
        <h3>Another Card</h3>
        <p>More content.</p>
    </div>
</div>
```

## Features

### Image Zoom
To enable the zoom effect on an image, simply add the class `.slide-image` to your `<img>` tag.

```html
<img src="image.png" class="slide-image">
```
*   **Behavior:** Clicking the image will float it to the center and expand it to 80% of the screen.
*   **Close:** Click anywhere outside the image to close it.

### Speaker Notes
Add a `.speaker-notes` block at the bottom of your slide content. These are **hidden** during the presentation but will appear at the bottom of each page when you print (Ctrl+P) or export to PDF.

```html
<div class="speaker-notes">
    <h3>Speaker Notes</h3>
    <p>Only visible in print mode.</p>
</div>
```
