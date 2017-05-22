package live.server.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

@Controller
@RequestMapping("/console/image")
public class ImageManagerController  {
	private static final Log logger = LogFactory.getLog(ImageManagerController.class);
	
	@ModelAttribute
	public void name(Model model) {
		model.addAttribute("page", "image");
	}

	@RequestMapping(value = { "", "index" })
	public String index(Model model) {
		return "vm/image";
	}

	@RequestMapping(value = "upload")
    @ResponseBody
    public Map<String,Object> upload(@RequestParam(value = "file") MultipartFile upload,HttpServletRequest request){

        Map<String,Object> map = new HashMap<String,Object>() ;

        String originalFilename = upload.getOriginalFilename() ;
        String fileExtension =  StringUtils.substringAfterLast(originalFilename, ".").toLowerCase();
        String uploadPath =  "/export/data/image/" ;
        File uploadDir = new File(uploadPath);
        if (!uploadDir.exists()) {
        	uploadDir.mkdirs();
        }

        String filename = uploadPath + "image." + fileExtension;
        File file = new File(filename);

        try {
            upload.transferTo(file);
        } catch (IOException e) {
            map.put("code",500);
            map.put("message","upload image failed");
            return map;
        }

        map.put("message","upload image success") ;
        return map ;
    }
}
