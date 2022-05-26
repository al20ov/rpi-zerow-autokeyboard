const os = require("os");
const fs = require("fs");

const fastify = require("fastify")({
  logger: true,
});

// TODO: remove all cors related stuff before releasing
fastify.register(require("@fastify/cors"), {});

fastify.get("/", function (request, reply) {
  reply.send({ hello: "world" });
});

fastify.get("/memory", function (_, reply) {
  reply.send({ free: os.freemem(), total: os.totalmem() });
});

fastify.post("/write", async function (request, reply) {
  const { text, initialDelay, interval } = request.body;

  await sleep(1000);
  await writeString(text);
  reply.send({ success: true });
});

fastify.listen(8080, "::", function (err, _) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

const file = "/dev/hidg0";

const leftShift = 0x02;
const clear = Buffer.from([
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
]);

function asciiToHidReport(character) {
  let hidChar = 0x00;
  let uppercase = false;

  if (character >= "a" && character <= "z") {
    hidChar = character.charCodeAt(0) - 97 + 0x04;
  } else if (character >= "A" && character <= "Z") {
    hidChar = character.charCodeAt(0) - 65 + 0x04;
    uppercase = true;
  } else if (character >= "0" && character <= "9") {
    hidChar = character.charCodeAt(0) - 48 + 0x1e;
  } else if (character === " ") {
    hidChar = 0x2c;
  } else if (character === "\n") {
    hidChar = 0x28;
  }

  return Buffer.from([
    uppercase ? leftShift : 0x00,
    0x00,
    hidChar,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
  ]);
}

const delayMs = 2;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function writeString(buffer) {
  for (let i = 0; i < buffer.length; i++) {
    const charBuffer = asciiToHidReport(buffer[i]);

    await sleep(delayMs);
    fs.writeFileSync(file, charBuffer);
    await sleep(delayMs);
    fs.writeFileSync(file, clear);
  }
}
