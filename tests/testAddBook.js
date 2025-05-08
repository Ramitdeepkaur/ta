const { Builder, By, until } = require("selenium-webdriver");

(async function testAddBook() {
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    // Navigate
    await driver.get("http://localhost:3000/books/create"); 

    // Fill
    await driver.findElement(By.name("title")).sendKeys("The Great Gatsby");
    await driver.findElement(By.name("author")).sendKeys("F. Scott Fitzgerald");
    await driver.findElement(By.name("publishYear")).sendKeys("1925");
    await driver.findElement(By.name("price")).sendKeys("350"); 
    await driver.findElement(By.name("copies")).sendKeys("5");

    await driver.findElement(By.css("button")).click();

    
    await driver.wait(until.urlContains("/home"), 10000);
    
    console.log("Add Book Test Passed! Successfully redirected to /home.");

  } catch (error) {
    console.error("Add Book Test Failed!", error);
  } finally {
    await driver.quit();
  }
})();
