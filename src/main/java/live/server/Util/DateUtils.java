package live.server.Util;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class DateUtils {
	// 取得本地时间：
    private static Calendar cal = Calendar.getInstance();
    // 取得时间偏移量：
    private static int zoneOffset = cal.get(java.util.Calendar.ZONE_OFFSET);
    // 取得夏令时差：
    private static int dstOffset = cal.get(java.util.Calendar.DST_OFFSET);
    
    public static final String UTC_TIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss'Z'";
    
    public static final String YYYY_MM_DD_HH_MM_SS = "yyyy-MM-dd HH:mm:ss";
	
	public static boolean isWithinSpecifedDays (long stime, long etime, int days) {
		long withinTime = etime - stime;
		Long withinDays = withinTime / (24 * 60 * 60 * 1000);
		if(withinDays.intValue() < days) {
			return true;
		}
		
		return false;
	}
	
	public static String getUTCTime(long millis, String dataFormat) {
		cal.setTimeInMillis(millis);

        SimpleDateFormat foo = new SimpleDateFormat(dataFormat);

        // 从本地时间里扣除这些差量，即可以取得UTC时间：
        cal.add(java.util.Calendar.MILLISECOND, -(zoneOffset + dstOffset));
        return foo.format(cal.getTime());
	}
	
	public static String formatDate(Date date, String format) {
		SimpleDateFormat sdf = new SimpleDateFormat(format);
		
		return sdf.format(date);
	}
	
}
