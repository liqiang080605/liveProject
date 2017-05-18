package live.server.controller;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import live.server.model.Code;
import live.server.service.CodeService;

@Controller
@RequestMapping("/console/image")
public class ImageManagerController  {
	private static final Log logger = LogFactory.getLog(ImageManagerController.class);
	
	@Autowired
	CodeService codeService;

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
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMM");
        String dateString = simpleDateFormat.format(new Date());

        String uploadPath =  "upload" + "/" + dateString + "/" ;
        File uploadDir = new File(request.getRealPath(uploadPath));
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        String filename = uploadPath + UUID.randomUUID() + "." + fileExtension ;
        File file = new File(request.getRealPath(filename));

        try {
            upload.transferTo(file);
        } catch (IOException e) {
            map.put("code",500);
            map.put("message","upload file failed");
            return map;
        }

        map.put("code",0) ;
        map.put("message","upload file success") ;
        map.put("path",filename) ;

        return map ;
    }
}
