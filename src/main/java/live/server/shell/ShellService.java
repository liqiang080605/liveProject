package live.server.shell;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;

import live.server.Util.CommonUtil;

@Service
public class ShellService {
	private static final Log log = LogFactory.getLog(ShellService.class);
	
	public String createUserSig(String sdkAppid, String uid) {
		File tmpFile = null;
		try {
			tmpFile = File.createTempFile("tmpFile", "sig");
		} catch (IOException e) {
			log.error("Failed to create tmp file!");
		}
		if(tmpFile == null) {
			log.error("Create tmpFile failed!");
			return null;
		}
		String tmpPath = tmpFile.getAbsolutePath();
		
		String[] cmdAndParams = new String[6];
		cmdAndParams[0] = "/export/data/bin/tls_licence_tools";
		cmdAndParams[1] = "gen";
		cmdAndParams[2] = CommonUtil.PRIVATE_KEY_PATH;
		cmdAndParams[3] = tmpPath;
		cmdAndParams[4] = CommonUtil.SDK_APPID;
		cmdAndParams[5] = uid;
		
		if(!isExecSuccess(cmdAndParams)) {
			return null;
		}
		
		String sig = exec("cat", tmpPath);
		if(tmpFile.exists()) {
			tmpFile.delete();
		}
		
		return sig;
	}
	
	public boolean isExecSuccess(String... cmdAndParams) {
		try {  
	        Process process = Runtime.getRuntime().exec(cmdAndParams);  
	        int exitValue = process.waitFor();  
	        if (0 != exitValue) {  
	            log.error("call shell failed. error code is :" + exitValue);  
	            return false;
	        }  
	    } catch (Throwable e) {  
	        log.error("call shell failed. " + e);  
	        return false;
	    }  
		
		return true;
	}
	
	public String exec(String... cmdAndParams) {
		String result = "";
		Process process = null;  
        try {  
            process = Runtime.getRuntime().exec(cmdAndParams);  
            BufferedReader input = new BufferedReader(new InputStreamReader(process.getInputStream()));  
            String line = "";  
            while ((line = input.readLine()) != null) {  
            	result += line;
            }  
            input.close();  
        } catch (IOException e) {  
        	log.error("call shell failed. " + e); 
        }  
        
        return result;
	}
}
