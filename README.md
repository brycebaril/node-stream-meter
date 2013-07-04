Stream Meter
============

Stream Meter is a... uh, meter for streams.

It is a streams2 Transform stream that passes through content, but counts the number of bytes it forwards.

However, give it a size in bytes and it will abort as soon as that threshold is passed. This is useful for capping your [hyperquest](http://npm.im/hyperquest) or http/https clients or servers content size.

```
npm install stream-meter
```

Examples:

```javascript
var meter = require("stream-meter")

// make an un-capped meter
var m = meter()
process.stdin.pipe(m).pipe(process.stdout)
setTimeout(function () {
  // Log how much we saw in a couple seconds.
  console.log(m.bytes)
}, 2000)

// this will abort (with an Error) in the frame where 1024 bytes is reached
process.stdin.pipe(meter(1024)).pipe(process.stdout)

// create a 1024 byte-capped meter
var m = meter(1024)
m.on("error", function (e) {
  // log the error but don't kill the process
  console.log(e.message)
})
process.stdin.pipe(m).pipe(process.stdout)

```

Usage
=====

```javascript
var meter = require("stream-meter")

var stream = meter(size)
stream.on("error", function (e) {
  // handle the meter aborting the stream
})

// read the bytes processed by the meter and passed through to any subsequent streams.
var size = stream.bytes
```

See test/index.js for additional examples.

Options
=======

size
----

Size (in bytes) to trigger the stream to abort. It will complete whatever frame it aborted in, so the size streamed will still be >= size but no more than size + highWaterMark

Properties
==========

bytes
-----

Number of bytes handled and passed through the meter.

LICENSE
=======

MIT
