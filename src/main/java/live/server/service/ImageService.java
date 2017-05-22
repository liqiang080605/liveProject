package live.server.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.util.Enumeration;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;

import live.server.Util.Constants;

@Service
public class ImageService {
	
	private static final Log log = LogFactory.getLog(ImageService.class);
	
	public void download(HttpServletResponse response, HttpServletRequest request, Map<String, Object> resultMap) {
		InputStream inputStream = null;
	    OutputStream outputStream = null;
	    try {
	    	//处理中文乱码
	    	request.setCharacterEncoding("UTF-8");
	    	String filePath = "/export/data/image";
	    	File file = new File(filePath);
	    	if(!file.isDirectory()) {
	    		resultMap.put("errorCode",Constants.ERR_REQ_DATA);
				resultMap.put("errorInfo", "Image directory not exist.");
				return;
	    	}
	      
	    	String[] list = file.list();
	    	if(list.length == 0) {
	    		resultMap.put("errorCode",Constants.ERR_REQ_DATA);
				resultMap.put("errorInfo", "Image not exist.");
				return;
	    	}
	      
	     	String fileName = filePath + File.separator + list[0];
	      
	     	fileName = new String(fileName.getBytes("iso8859-1"),"UTF-8");
	     	//处理浏览器兼容
	     	response.setContentType("application/msexcel;charset=utf-8");//定义输出类型
	     	Enumeration enumeration = request.getHeaders("User-Agent");
	     	String browserName = (String) enumeration.nextElement();
	     	boolean isMSIE = browserName.contains("MSIE");
	     	if (isMSIE) {
	     		response.addHeader("Content-Disposition", "attachment;fileName=" + URLEncoder.encode(fileName, "UTF8"));
	     	} else {
	     		response.addHeader("Content-Disposition", "attachment;fileName=" + new String(fileName.getBytes("gb2312"), "ISO8859-1"));
	     	}
	     	//url地址如果存在空格，会导致报错！  解决方法为：用+或者%20代替url参数中的空格。
	     	fileName = fileName.replace(" ", "%20");
	     	//图片下载
	     	outputStream = response.getOutputStream();
	     	inputStream = new FileInputStream(new File(fileName));
	     	IOUtils.copy(inputStream, outputStream);
	      
	     	resultMap.put("errorCode", Constants.ERR_SUCCESS);
			resultMap.put("errorInfo", "success.");
    	} catch (IOException e) {
    		System.err.println(e);
    	}finally { 
    		IOUtils.closeQuietly(inputStream); 
    		IOUtils.closeQuietly(outputStream); 
    	} 
	}
}
