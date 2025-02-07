import { test, expect } from "../pageTest";

test.beforeEach(async ({ queries }) => {
  await (
    await queries.findByText("Radio firmware", undefined, { timeout: 10000 })
  ).click();
});

test("Flash v2.5.0 firmware", async ({ queries, browserName }) => {
  test.skip(browserName !== "chromium");
  // First page
  await (await queries.findByLabelText("Firmware version")).press("Enter");
  await (await queries.findByText('EdgeTX "Dauntless" 2.5.0')).click();

  const radioSelector = await queries.findByLabelText("Radio model");
  await radioSelector.waitForElementState("enabled");
  await radioSelector.click();
  await (await queries.findByText("Flysky NV14")).click();

  const flashButton = await queries.findByText("Flash via USB");
  await flashButton.click();

  // Second page
  await (await queries.findByText("Good device")).click();

  const nextButton = await queries.findByText("Next");
  expect(await nextButton.isEnabled()).toBeTruthy();

  await nextButton.click();

  // Confirmation page
  expect(
    await (await queries.findByText("Flysky NV14")).isVisible()
  ).toBeTruthy();
  expect(
    await (await queries.findByText("Good device")).isVisible()
  ).toBeTruthy();

  await (await queries.findByText("Start flashing")).click();

  // Flashing
  expect(
    await (await queries.findByText("Flashing EdgeTX")).isVisible()
  ).toBeTruthy();

  expect(
    await (
      await queries.findByText("Downloaded", undefined, { timeout: 60000 })
    ).isVisible()
  ).toBeTruthy();
  expect(
    await (
      await queries.findByText("Erased", undefined, { timeout: 60000 })
    ).isVisible()
  ).toBeTruthy();
  expect(
    await (
      await queries.findByText("Flashed", undefined, { timeout: 60000 })
    ).isVisible()
  ).toBeTruthy();
  expect(
    await (
      await queries.findByText("Your radio has been flashed with EdgeTX")
    ).isVisible()
  ).toBeTruthy();
});
