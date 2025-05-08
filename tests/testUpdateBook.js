const { Builder, By, until } = require("selenium-webdriver");

const bookIdToEdit = "68130c336d78b01b77a5b357"; // 🔁 Replace with actual book _id

(async function testUpdateBookCopies() {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    // Go to the edit page of the book
    await driver.get(`http://localhost:3000/books/edit/${bookIdToEdit}`);

    // Wait for the input field for 'copies' to be visible
    const copiesInput = await driver.wait(
      until.elementLocated(By.css("input[type='number'][value]")),
      5000
    );

    // Increase number of copies by 1
    const incrementButton = await driver.findElement(By.xpath("//label[contains(text(),'Number of Copies')]/following::button[1]"));
    await incrementButton.click();

    // Click Save button
    const saveButton = await driver.findElement(By.xpath("//button[text()='Save']"));
    await saveButton.click();

    // Wait for navigation to /home
    await driver.wait(until.urlContains("/home"), 5000);

    console.log(`✅ Update Book Test Passed: Copies updated for book ${bookIdToEdit}`);

  } catch (err) {
    console.error("❌ Update Book Test Failed:", err.message);
  } finally {
    await driver.quit();
  }
})();
