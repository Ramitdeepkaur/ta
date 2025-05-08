const { Builder, By, until } = require("selenium-webdriver");

(async function testRegistration() {
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    await driver.get("http://localhost:3000/register");
    await driver.findElement(By.name("name")).sendKeys("Test User");
    await driver.findElement(By.name("email")).sendKeys("test3@example.com");
    await driver.findElement(By.name("password")).sendKeys("password1234");
    await driver.findElement(By.tagName("button")).click();

    await driver.wait(until.urlContains("/home"), 15000);

    console.log("Registration Test Passed!");
  } catch (error) {
    console.error("Registration Test Failed!", error);
  } finally {
    await driver.quit();
  }
})();
