import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";

function canonicalizeJSON(obj) {
  if (obj === null || typeof obj !== "object") {
    return JSON.stringify(obj);
  }
  if (Array.isArray(obj)) {
    return "[" + obj.map((item) => canonicalizeJSON(item)).join(",") + "]";
  }
  const sortedKeys = Object.keys(obj).sort();
  const pairs = sortedKeys.map((key) => {
    return JSON.stringify(key) + ":" + canonicalizeJSON(obj[key]);
  });
  return "{" + pairs.join(",") + "}";
}

function computeMetadataHash(metadata) {
  const canonicalJson = canonicalizeJSON(metadata);
  const hashHex = "0x" + createHash("sha256").update(canonicalJson, "utf8").digest("hex");
  return { canonicalJson, hashHex };
}

test("Canonical JSON serializes deterministically regardless of key insertion order", () => {
  const objA = { title: "Student Council", zIndex: 1, admin: "0x123", alpha: "A" };
  const objB = { alpha: "A", admin: "0x123", zIndex: 1, title: "Student Council" };

  const canonicalA = canonicalizeJSON(objA);
  const canonicalB = canonicalizeJSON(objB);

  assert.equal(canonicalA, canonicalB);
  assert.equal(computeMetadataHash(objA).hashHex, computeMetadataHash(objB).hashHex);
});

test("SHA-256 metadata hash detects any off-chain parameter modification", () => {
  const original = {
    title: "University Student Council Election 2026",
    startTime: 1700000000,
    endTime: 1700604800,
    rules: { singleChoice: true, minimumCandidates: 2 }
  };

  const tampered = {
    title: "University Student Council Election 2026",
    startTime: 1700000000,
    endTime: 1700604800,
    rules: { singleChoice: false, minimumCandidates: 2 } // tampered rule!
  };

  const hashOriginal = computeMetadataHash(original).hashHex;
  const hashTampered = computeMetadataHash(tampered).hashHex;

  assert.notEqual(hashOriginal, hashTampered);
});
