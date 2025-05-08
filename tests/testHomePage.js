const { Builder, By, until } = require("selenium-webdriver");
(async function testHomePage() {
    let driver = await new Builder().forBrowser("chrome").build();
    try {
      await driver.get("http://localhost:3000/home");
      
      let header = await driver.wait(
        until.elementLocated(By.xpath("//h1[contains(text(),'📚 Books List')]")),
        5000
      );
      console.log("Home Page Test Passed!");
    } catch (error) {
      console.error("Home Page Test Failed!", error);
    } finally {
      await driver.quit();
    }
  })();
  