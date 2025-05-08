const { Builder, By, until } = require("selenium-webdriver");

const bookIdToDelete = "681a3c0d6d78b01b77a5b407"; // 🔁 Replace this with the actual _id of the book

(async function testDeleteSpecificBook() {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get("http://localhost:3000/home");

    // Wait for all books to load
    await driver.wait(until.elementLocated(By.css("a[href^='/books/delete/']")), 5000);

    // Locate the delete link for the specific book ID
    const deleteLinkSelector = `a[href='/books/delete/${bookIdToDelete}']`;
    const deleteLink = await driver.findElement(By.css(deleteLinkSelector));
    await deleteLink.click();

    // Wait for the delete confirmation page
    await driver.wait(until.elementLocated(By.xpath("//button[text()='Yes']")), 5000);

    // Confirm deletion
    const yesButton = await driver.findElement(By.xpath("//button[text()='Yes']"));
    await yesButton.click();

    // Wait for redirection back to /home
    await driver.wait(until.urlContains("/home"), 5000);

    console.log(`✅ Delete Book Test Passed: Book with ID ${bookIdToDelete} deleted.`);

  } catch (err) {
    console.error("❌ Delete Book Test Failed:", err.message);
  } finally {
    await driver.quit();
  }
})();
