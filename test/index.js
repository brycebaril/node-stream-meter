var test = require("tap").test
var spigot = require("stream-spigot")
var concat = require("concat-stream")

var meter

// Stats
test("load", function (t) {
  t.plan(1)

  meter = require("../")
  t.ok(meter, "loaded module")
})

test("no max (passthrough)", function (t) {
  t.plan(2)

  var m = meter()

  var content = "ABCD1234"

  function match(d) {
    t.equals(d.toString(), content)
    t.equals(m.bytes, 8)
  }

  spigot({content: content}).pipe(m).pipe(concat(match))
})

test("under max", function (t) {
  t.plan(2)

  var m = meter(100)

  var content = "ABCD1234"

  function match(d) {
    t.equals(d.toString(), content)
    t.equals(m.bytes, 8)
  }

  spigot({content: content}).pipe(m).pipe(concat(match))
})

test("stops at meter", function (t) {
  t.plan(4)

  var chunks = 0
  var content = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

  function match(d) {
    t.fail()
  }

  var c = concat(match)

  var m = meter(10)
  m.on("error", function (e) {
    t.ok(e.message, "Stream exceeded specified max of 10 bytes.")
    t.equals(chunks, 4)
    // 12 because read frame is 4, so the 3rd read will put it over the max at 12 bytes
    t.equals(c.getBody().toString(), content.substring(0, 12))
    t.equals(m.bytes, 12)
  })

  var s = spigot({
    content: content,
    chunkSize: 4,
  })
  s.on("progress", function (s) {
    chunks++
  })


  s.pipe(m).pipe(c)
})