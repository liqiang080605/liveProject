package live.server.Util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Random;

import org.apache.commons.lang.math.RandomUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class CommonUtil {
	private static final Log log = LogFactory.getLog(CommonUtil.class);

	public static final long EXPIRED_TIME = 7 * 24 * 60 * 60;

	public static final Integer CODE_EXPIRED_0 = 0;

	public static final Integer CODE_EXPIRED_1 = 1;

	public static final Integer ACCOUNT_STATE_0 = 0;
	
	public static final Integer ACCOUNT_STATE_1 = 1;

	public static final Integer IAVROOM_ROLE_0 = 0;
	
	public static final Integer IAVROOM_ROLE_1 = 1;
	
	public static final Integer IAVROOM_ROLE_2 = 2;

	public static final String CURRENT_EXPERT = "1";
	
	public static final String HISTORY_EXPERT = "2";

	public static String BIZID;

	public static String LIVE_URLS;

	public static String SDK_APPID;
	
	public static String PRIVATE_KEY_PATH;
	
	private static String PUBLIC_KEY_PATH;

	public static String md5(String str) {
		String result = null;
		try {
			result = new String(str);
			MessageDigest md = MessageDigest.getInstance("MD5");
			StringBuilder sb = new StringBuilder();
			for (byte b : md.digest(str.getBytes())) {
				sb.append(String.format("%02X", b));
			}
			return sb.toString();
		} catch (NoSuchAlgorithmException ex) {
			ex.printStackTrace();
		}
		return result;
	}
	
	public static String sha256(String str) {
		String result = null;
		try {
			result = new String(str);
			MessageDigest md = MessageDigest.getInstance("SHA-256");
			StringBuilder sb = new StringBuilder();
			for (byte b : md.digest(str.getBytes())) {
				sb.append(String.format("%02X", b));
			}
			return sb.toString();
		} catch (NoSuchAlgorithmException ex) {
			ex.printStackTrace();
		}
		return result;
	}
	
	public static String getSDK_APPID() {
		return SDK_APPID;
	}

	public static String getPRIVATE_KEY_PATH() {
		return PRIVATE_KEY_PATH;
	}

	public static String getPUBLIC_KEY_PATH() {
		return PUBLIC_KEY_PATH;
	}

	public static void setSDK_APPID(String sDK_APPID) {
		SDK_APPID = sDK_APPID;
	}

	public static void setPRIVATE_KEY_PATH(String pRIVATE_KEY_PATH) {
		PRIVATE_KEY_PATH = pRIVATE_KEY_PATH;
	}

	public static void setPUBLIC_KEY_PATH(String pUBLIC_KEY_PATH) {
		PUBLIC_KEY_PATH = pUBLIC_KEY_PATH;
	}

	public static String getBIZID() {
		return BIZID;
	}

	public static String getLIVE_URLS() {
		return LIVE_URLS;
	}

	public static void setBIZID(String bIZID) {
		BIZID = bIZID;
	}

	public static void setLIVE_URLS(String lIVE_URLS) {
		LIVE_URLS = lIVE_URLS;
	}

	public static String getRandomCode() {
		String code = "";
		for(int i = 0; i < 6; i++) {
			code += String.valueOf(RandomUtils.nextInt(10));
		}
		
		return code;
	}

}
