package live.server.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;


@Controller
@RequestMapping("/index")
public class IndexController {

    Logger logger = Logger.getLogger(IndexController.class);

    @ModelAttribute
    public void name(Model model){
        model.addAttribute("page","index") ;
    }

    @RequestMapping(value = {"","index"})
    public String index(Model model,HttpServletResponse response){
        
        return "vm/index";
    }

    @RequestMapping(value = "refuse", method = RequestMethod.GET)
    public String refuse(Model model, HttpServletRequest request, HttpServletResponse response) throws Exception {
        return "vm/index/sys_error";
    }

    @RequestMapping(value = "error", method = RequestMethod.GET)
    public String error(Model model) {
        return "vm/index/sys_error";
    }

    @RequestMapping(value = "resourceTip", method = RequestMethod.GET)
    public String resourceTip(Model model) {
        return "vm/index/resource_tip";
    }

}
