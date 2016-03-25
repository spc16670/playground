import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.InetSocketAddress;
import java.net.MalformedURLException;
import java.net.Proxy;
import java.net.URL;
import java.net.URLConnection;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import org.apache.commons.io.FilenameUtils;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;


public class Selenium {

	private static final String PROXY_URL = "169.29.36.99";
	private static final int PROXY_PORT = 8443;
	
	private final WebDriver driver;
	private final JavascriptExecutor js;
	
	public Selenium () {
		driver = new FirefoxDriver();
		js = (JavascriptExecutor) driver;
	}
	
	public void test() {
		
		String appUrl = "file:///C:/Workspaces/JavaScript/Angular/DependencyHell/index.html";
		driver.manage().window().maximize();
		driver.navigate().to(appUrl);
		driver.manage().timeouts().pageLoadTimeout(10, TimeUnit.SECONDS);
		String actualTitle = driver.getTitle();
		System.out.println("Page loaded: " + actualTitle);
		driver.manage().timeouts().setScriptTimeout(5, TimeUnit.SECONDS);
		System.out.println("Running script");
		String script = "var callback = arguments[arguments.length - 1];"
				+ "angular.element(document.getElementById('Test1')).scope().test(callback);";
		Map<String,Object> r = (Map<String,Object>) js.executeAsyncScript(script,"");
		String url = (String) r.get("url");
		System.out.println("URL is " + url);
		byte[] downloaded = download(url);
		String baseName = FilenameUtils.getBaseName(url);
        String extension = FilenameUtils.getExtension(url);
        System.out.println("Basename : " + baseName);
        System.out.println("extension : " + extension);
        String fileName = baseName + extension;
		save(fileName,downloaded);
		System.out.println("Finished");
		driver.close();

	}
	

	/**
	 * 
	 * @param strUrl
	 * @return
	 */
	private byte[] download(String strUrl) {
		byte[] result = null;
		try {
			InputStream is = null;
			ByteArrayOutputStream os = null;
			try {
				InetSocketAddress socket = new InetSocketAddress(PROXY_URL, PROXY_PORT);
				Proxy proxy = new Proxy(Proxy.Type.HTTP, socket);
				URLConnection connection = new URL(strUrl).openConnection(proxy);
				is = new BufferedInputStream(connection.getInputStream());
				os = new ByteArrayOutputStream();
				byte[] buffer = new byte[1024];
				int intByte = 0;
				while ( (intByte = is.read(buffer)) != -1) {
					os.write(buffer, 0, intByte);
				}
				result = os.toByteArray();
			} finally {
				if (os != null) {
					os.close();
				}
				if (is != null) {
					is.close();
				}
			}
		} catch (MalformedURLException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return result;
	}
	
	/**
	 * 
	 * @param filePath
	 * @param data
	 */
	private void save(String filePath, byte[] data) {
		try {
			FileOutputStream fos = null;
			try {
				fos = new FileOutputStream(filePath);
				fos.write(data);
			} finally {
				if (fos != null) {
					fos.close();
				}
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
