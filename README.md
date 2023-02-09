# chrome-devtools-protocol-screenshot-bug

## Bug

When taking a screenshot with `chromeDevToolsProtocol$Page$captureScreenshot(captureBeyondViewport=TRUE)`, (sometimes) the size of the window is temporarily set to 1x1 and then it is set to the original viewport size. This triggers either 1 or 2 `window` `resize` events.

## Expected behavior

Current belief: A resize event should **never be triggered** if the viewport is not changing size.

Even when the 1x1 window event is not produced, a resize event is still triggered when capturing a screenshot even though the viewport does not change size.

<details>
<summary>Expected behavior logs</summary>

```
Clip W x H: 400 x 450
  Iteration: 0
  Iteration: 1
  Iteration: 2
  Iteration: 3
  Iteration: 4
  Iteration: 5

Clip W x H: 400 x 250
  Iteration: 0
  Iteration: 1
  Iteration: 2
  Iteration: 3
  Iteration: 4
  Iteration: 5

Clip W x H: 400 x 650
  Iteration: 0
  Iteration: 1
  Iteration: 2
  Iteration: 3
  Iteration: 4
  Iteration: 5

Clip W x H: 200 x 450
  Iteration: 0
  Iteration: 1
  Iteration: 2
  Iteration: 3
  Iteration: 4
  Iteration: 5

Clip W x H: 200 x 250
  Iteration: 0
  Iteration: 1
  Iteration: 2
  Iteration: 3
  Iteration: 4
  Iteration: 5

Clip W x H: 200 x 650
  Iteration: 0
  Iteration: 1
  Iteration: 2
  Iteration: 3
  Iteration: 4
  Iteration: 5

Clip W x H: 600 x 450
  Iteration: 0
  Iteration: 1
  Iteration: 2
  Iteration: 3
  Iteration: 4
  Iteration: 5

Clip W x H: 600 x 250
  Iteration: 0
  Iteration: 1
  Iteration: 2
  Iteration: 3
  Iteration: 4
  Iteration: 5

Clip W x H: 600 x 650
  Iteration: 0
  Iteration: 1
  Iteration: 2
  Iteration: 3
  Iteration: 4
  Iteration: 5
```

</details>

## Notes

Originally found in R's `{chromote}` package: <https://github.com/rstudio/chromote/issues/96#issuecomment-1424377437>

To use a more familiar library, I made a minimal reprex with `{puppeteer}`. `puppeteer` makes it's `Page.captureScreenshot` method here: <https://github.com/puppeteer/puppeteer/blob/abcc1756dd434dbe27d322aa9692b7fd9858a9ca/packages/puppeteer-core/src/common/Page.ts#L1430-L1439>

## Reprex

### `screenshot.html`

Bare bones html file to write to console when a resize event has occurred:

```html
<html>
  <head></head>
  <body style="border:1px solid black">
      <h1>Does it trigger a resize?</h1>
      <script>
        window.addEventListener('resize', function(event) {
          console.log('resize triggered! Current window size:', window.innerWidth, 'x', window.innerHeight)
        }, true);
      </script>
    </div>
  </body>
</html>
```

The HTML file has a border to help display when the cliprect is larger or smaller than the viewport

### `screenshot.mjs`

Captures a screenshot of `screenshot.html` using `puppeteer` which wraps the Chrome DevTools Protocol with a high level API.

Steps:
1. Init the browser
  * Launch browser and make a new page
  * Set the viewport size
1. Visit `screenshot.html`
2. Add handler so that all `console.log()` are displayed
3. For each combination of `width` and `height`, repeat 5 times:
  1. Wait 100ms to act like a human waiting to perform an action
    * If this step is removed, the bug is not surfaced!!
    * Wait times <= 50ms did not surface the bug
  2. Take screenshot with args `{clip: { x:0, y:0, width:clipWidth, height:clipHeight}, captureBeyondViewport:true}`


#### Usage

```
# npm install
node screenshot.mjs
```


#### Example output:
```
Clip W x H: 400 x 450
  Iteration: 0
     resize triggered! Current window size: 1 x 1
     resize triggered! Current window size: 400 x 450
  Iteration: 1
     resize triggered! Current window size: 400 x 450
  Iteration: 2
     resize triggered! Current window size: 1 x 1
     resize triggered! Current window size: 400 x 450
  Iteration: 3
     resize triggered! Current window size: 400 x 450
  Iteration: 4
     resize triggered! Current window size: 400 x 450
  Iteration: 5
     resize triggered! Current window size: 400 x 450

Clip W x H: 400 x 250
  Iteration: 0
     resize triggered! Current window size: 400 x 450
  Iteration: 1
     resize triggered! Current window size: 400 x 450
  Iteration: 2
     resize triggered! Current window size: 400 x 450
  Iteration: 3
     resize triggered! Current window size: 1 x 1
     resize triggered! Current window size: 400 x 450
  Iteration: 4
     resize triggered! Current window size: 1 x 1
     resize triggered! Current window size: 400 x 450
  Iteration: 5
     resize triggered! Current window size: 1 x 1
     resize triggered! Current window size: 400 x 450

Clip W x H: 400 x 650
  Iteration: 0
     resize triggered! Current window size: 1 x 1
     resize triggered! Current window size: 400 x 450
  Iteration: 1
     resize triggered! Current window size: 400 x 450
  Iteration: 2
     resize triggered! Current window size: 400 x 450
  Iteration: 3
     resize triggered! Current window size: 1 x 1
     resize triggered! Current window size: 400 x 450
  Iteration: 4
     resize triggered! Current window size: 400 x 450
  Iteration: 5
     resize triggered! Current window size: 1 x 1
     resize triggered! Current window size: 400 x 450

Clip W x H: 200 x 450
  Iteration: 0
     resize triggered! Current window size: 1 x 1
     resize triggered! Current window size: 400 x 450
  Iteration: 1
     resize triggered! Current window size: 400 x 450
  Iteration: 2
     resize triggered! Current window size: 400 x 450
  Iteration: 3
     resize triggered! Current window size: 400 x 450
  Iteration: 4
     resize triggered! Current window size: 1 x 1
     resize triggered! Current window size: 400 x 450
  Iteration: 5
     resize triggered! Current window size: 1 x 1
     resize triggered! Current window size: 400 x 450

Clip W x H: 200 x 250
  Iteration: 0
     resize triggered! Current window size: 400 x 450
  Iteration: 1
     resize triggered! Current window size: 1 x 1
     resize triggered! Current window size: 400 x 450
  Iteration: 2
     resize triggered! Current window size: 1 x 1
     resize triggered! Current window size: 400 x 450
  Iteration: 3
     resize triggered! Current window size: 400 x 450
  Iteration: 4
     resize triggered! Current window size: 1 x 1
     resize triggered! Current window size: 400 x 450
  Iteration: 5
     resize triggered! Current window size: 400 x 450

Clip W x H: 200 x 650
  Iteration: 0
     resize triggered! Current window size: 400 x 450
  Iteration: 1
     resize triggered! Current window size: 400 x 450
  Iteration: 2
     resize triggered! Current window size: 1 x 1
     resize triggered! Current window size: 400 x 450
  Iteration: 3
     resize triggered! Current window size: 400 x 450
  Iteration: 4
     resize triggered! Current window size: 400 x 450
  Iteration: 5
     resize triggered! Current window size: 1 x 1
     resize triggered! Current window size: 400 x 450

Clip W x H: 600 x 450
  Iteration: 0
     resize triggered! Current window size: 400 x 450
  Iteration: 1
     resize triggered! Current window size: 1 x 1
     resize triggered! Current window size: 400 x 450
  Iteration: 2
     resize triggered! Current window size: 1 x 1
     resize triggered! Current window size: 400 x 450
  Iteration: 3
     resize triggered! Current window size: 1 x 1
     resize triggered! Current window size: 400 x 450
  Iteration: 4
     resize triggered! Current window size: 400 x 450
  Iteration: 5
     resize triggered! Current window size: 1 x 1
     resize triggered! Current window size: 400 x 450

Clip W x H: 600 x 250
  Iteration: 0
     resize triggered! Current window size: 400 x 450
  Iteration: 1
     resize triggered! Current window size: 1 x 1
     resize triggered! Current window size: 400 x 450
  Iteration: 2
     resize triggered! Current window size: 400 x 450
  Iteration: 3
     resize triggered! Current window size: 400 x 450
  Iteration: 4
     resize triggered! Current window size: 400 x 450
  Iteration: 5
     resize triggered! Current window size: 400 x 450

Clip W x H: 600 x 650
  Iteration: 0
     resize triggered! Current window size: 1 x 1
     resize triggered! Current window size: 400 x 450
  Iteration: 1
     resize triggered! Current window size: 1 x 1
     resize triggered! Current window size: 400 x 450
  Iteration: 2
     resize triggered! Current window size: 400 x 450
  Iteration: 3
     resize triggered! Current window size: 1 x 1
     resize triggered! Current window size: 400 x 450
  Iteration: 4
     resize triggered! Current window size: 400 x 450
  Iteration: 5
     resize triggered! Current window size: 400 x 450
```
