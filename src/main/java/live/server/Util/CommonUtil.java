package live.server.Util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class CommonUtil {

	public static final String SDK_APPID = null;

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

	public static String createUserSig(String sdkAppid) {
		// TODO Auto-generated method stub
		return null;
	}

}
