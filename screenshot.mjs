// Run script with `node captureScreenshot.js`
import puppeteer from "puppeteer";

const browser = await puppeteer.launch();
const page = await browser.newPage();

const width = 400
const height = 450

// Set screen size
await page.setViewport({width: width, height: height});

let url = `file://${process.cwd()}/screenshot.html`

// Visit page
void await page.goto(url)

// Replay console messages
void page.on("console", function(msgObj) { console.log("    ", msgObj.text()) })

// // Take screenshot of an image that is within the viewport
// void await page.screenshot({path: "screenshot.png", clip: {x:0,y:0,width:width,height:height,scale:1}, fromSurface:true, captureBeyondViewport:true})
// //> resize triggered! Current window size:  1 x 1
// //> resize triggered! Current window size:  1323 x 922

for (const clipWidth of [width, width - 200, width + 200]) {
  for (const clipHeight of [height, height - 200, height + 200]) {
    console.log(`\nClip W x H: ${clipWidth} x ${clipHeight}`)

    // Repeat a few times to trigger inconsistent reprex behavior
    for (let i in [1,2,3,4,5,6]) {
      // Add some wait, otherwise the bug is not surfaced
      await new Promise(resolve => setTimeout(resolve, 250));

      console.log(`  Iteration: ${i}`);
      // Take screenshot
      void await page.screenshot({
        clip: {
          x:0,
          y:0,
          width:clipWidth,
          height:clipHeight,
          scale:1
        },
        fromSurface:true,
        captureBeyondViewport:true
      });
    }
  }
}

process.exit()
