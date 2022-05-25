const fs = require("fs");
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

const testString =
  "Hello World\nThis is a test string\nThe raspberry pi should act as a keyboard now\n";

const delayMs = 2;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function writeString() {
  for (let i = 0; i < testString.length; i++) {
    const charBuffer = asciiToHidReport(testString[i]);

    await sleep(delayMs);
    fs.writeFileSync(file, charBuffer);
    await sleep(delayMs);
    fs.writeFileSync(file, clear);
  }
}

writeString();
