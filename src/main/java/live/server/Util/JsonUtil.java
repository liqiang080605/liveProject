package live.server.Util;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import net.sf.json.JSONObject;

/**
 * Created by zhj on 2015/4/27.
 */
public class JsonUtil {
	private static Log log = LogFactory.getLog(JsonUtil.class);

	public static boolean isValidJson(String json) {
		ObjectMapper objectMapper = new ObjectMapper();
		boolean result = true;
		try {
			objectMapper.readValue(json, Map.class);
		} catch (Exception e) {
			result = false;
		}
		return result;
	}

	@SuppressWarnings("unchecked")
	public static Map<String, Object> jsonToMap(String json){
		ObjectMapper objectMapper = new ObjectMapper();
		Map<String, Object> result = null;
		try {
			result = objectMapper.readValue(json, Map.class);
		} catch (JsonParseException e) {
			result = new HashMap<String, Object>();
			log.error(String.format("[API-UTIL] [jsonToMap] [JsonParseException]"), e);
		} catch (JsonMappingException e) {
			result = new HashMap<String, Object>();
			log.error(String.format("[API-UTIL] [jsonToMap] [JsonMappingException]"), e);
		} catch (IOException e) {
			result = new HashMap<String, Object>();
			log.error(String.format("[API-UTIL] [jsonToMap] [IOException]"), e);
		}
		return result;
	}

	@SuppressWarnings("unchecked")
	public static Map<String, Object> jsonToMap(Map<String, Object> json, String fieldName) {
		Map<String, Object> map = (Map<String, Object>)json.get(fieldName);
		if(map == null){
			map = new HashMap<String, Object>();
		}
		return map;
	}

	public Map<String, Object> jsonToMap(String json, String fieldName) {
		Map<String, Object> map = jsonToMap(json);
		return jsonToMap(map, fieldName);
	}

	@SuppressWarnings("unchecked")
	public static List<Map<String, Object>> jsonToList(String json){
		ObjectMapper objectMapper = new ObjectMapper();
		log.debug(String.format("[API-UTIL] [jsonToList]"));
		List<Map<String, Object>> result = null;
		try {
			result = objectMapper.readValue(json, List.class);
		} catch (JsonParseException e) {
			result = new ArrayList<Map<String, Object>>();
			log.error(String.format("[API-UTIL] [jsonToList] [JsonParseException]"), e);
		} catch (JsonMappingException e) {
			result = new ArrayList<Map<String, Object>>();
			log.error(String.format("[API-UTIL] [jsonToList] [JsonMappingException]"), e);
		} catch (IOException e) {
			result = new ArrayList<Map<String, Object>>();
			log.error(String.format("[API-UTIL] [jsonToList] [IOException]"), e);
		}
		return result;
	}

	@SuppressWarnings("unchecked")
	public static List<Map<String, Object>> jsonToList(Map<String, Object> map, String fieldName){
		List<Map<String, Object>> list = (List<Map<String, Object>>)map.get(fieldName);
		if(list == null){
			list = new ArrayList<Map<String, Object>>();
		}
		return list;
	}

	public static List<Map<String, Object>> jsonToList(String json, String fieldName){
		Map<String, Object> map = jsonToMap(json);
		return jsonToList(map, fieldName);
	}

	public String getListOneFieldStringValue(Map<String, Object> map, String listFieldName, int number, String fieldName){
		String result = "";
		List<Map<String, Object>> list = jsonToList(map, listFieldName);
		if(list.size() > 0 && list.size() > number){
			result = (String)list.get(number).get(fieldName);
		}
		return result;
	}

	public static String mapToJson(Map<String, Object> map){
		ObjectMapper objectMapper = new ObjectMapper();
		log.debug(String.format("[API-UTIL] [mapToJson]"));
		String result = null;
		try {
			result = objectMapper.writeValueAsString(map);
		} catch (JsonGenerationException e) {
			log.error(String.format("[API-UTIL] [mapToJson] [JsonGenerationException]"), e);
		} catch (JsonMappingException e) {
			log.error(String.format("[API-UTIL] [mapToJson] [JsonMappingException]"), e);
		} catch (IOException e) {
			log.error(String.format("[API-UTIL] [mapToJson] [IOException]"), e);
		}
		return result;
	}
	
	public static String listToJson(List<?> list){
		ObjectMapper objectMapper = new ObjectMapper();
		log.debug(String.format("[API-UTIL] [listToJson]"));
		String result = null;
		try {
			result = objectMapper.writeValueAsString(list);
		} catch (JsonGenerationException e) {
			log.error(String.format("[API-UTIL] [listToJson] [JsonGenerationException]"), e);
		} catch (JsonMappingException e) {
			log.error(String.format("[API-UTIL] [listToJson] [JsonMappingException]"), e);
		} catch (IOException e) {
			log.error(String.format("[API-UTIL] [listToJson] [IOException]"), e);
		}
		return result;
	}

	public static boolean hasJsonField(Map<String, Object> map, String fieldName) {
		boolean result = false;
		if(map.get(fieldName) != null){
			result = true;
		}
		return result;
	}

	public static boolean  hasJsonField(String json, String fieldName) {
		Map<String, Object> map = jsonToMap(json);
		return hasJsonField(map, fieldName);
	}

	public static String getJsonFieldString(Map<String, Object> map, String fieldName) {
		String result = null;
		if(hasJsonField(map, fieldName)){
			result = (String)map.get(fieldName);
		}
		return result;
	}

	public static String getJsonFieldString(String json, String fieldName) {
		String result = null;
		if(hasJsonField(json, fieldName)){
			Map<String, Object> map = jsonToMap(json);
			result = (String)map.get(fieldName);
		}
		return result;
	}

	public static Integer getJsonFieldInteger(Map<String, Object> map, String fieldName) {
		Integer result = null;
		if(hasJsonField(map, fieldName)){
			result = (Integer)map.get(fieldName);
		}
		return result;
	}

	public static Integer getJsonFieldInteger(String json, String fieldName) {
		Integer result = null;
		if(hasJsonField(json, fieldName)){
			Map<String, Object> map = jsonToMap(json);
			result = (Integer)map.get(fieldName);
		}
		return result;
	}


    public static void checkError(String json) throws Exception{

        try{
            JSONObject jsonObject = JSONObject.fromObject(json) ;

            if(jsonObject.has("error")){
                throw new Exception(
                        (Error)JSONObject.toBean(jsonObject.getJSONObject("error"),Error.class)) ;
            }

        }catch (Exception e){
            log.error(String.format("[API-UTIL] [checkError] [Exception] json:%s", json), e);
            throw e ;
        }
    }


    public static String objectToJson(Object obj){
		ObjectMapper objectMapper = new ObjectMapper();
        String result = "" ;
        try{
            result = objectMapper.writeValueAsString(obj) ;

        } catch (Exception e) {
            log.error(String.format("[API-UTIL] [objectToJson] [Exception] object:%s", obj), e);
        }

        return result;
    }

    public static Object getValue(Object json,String key){
        try{

            if(json == null || StringUtils.isEmpty(key)){
                return null ;
            }

            JSONObject jsonObject = JSONObject.fromObject(json) ;
            Object obj = null ;

            String[] keys = key.split("\\.");
            for(int i=0;i<keys.length;i++){

                if(jsonObject.isEmpty()){
                    return null ;
                }

                if(i == keys.length - 1){
                    obj = jsonObject.get(keys[i]);
                }else{
                    jsonObject = jsonObject.getJSONObject(keys[i]);
                }
            }

            return obj ;
        }catch (Exception e){
            log.error(String.format("[API-UTIL] [getValue] [Exception] json:%s ,key:%s", json, key), e);
            return null ;
        }

    }


	
    public static String addQuoted(String noQuotedStr) {
//		StringBuffer sb = new StringBuffer();
//		noQuotedStr = StringUtils.replace(noQuotedStr, "=", ":");
		char[] charArray = noQuotedStr.toCharArray();
		
		char lastChar = ' ';
		List<String> strList = new ArrayList<String>();
		for(char c : charArray) {
			if(c == ' ') {
				continue;
			}
//			if(lastChar != '{' && lastChar != '}') {
//				strList.add("\"");
//			}
			
			if( c == '{') {
				if(lastChar != '[') {
					removeLast(strList);
				}
				strList.add(String.valueOf(c));
				strList.add("\"");
			} else if( c == '=' || c == ',' ) {
				if (c == '=') {
					c = ':';
				}
				if(lastChar != '}') {
					strList.add("\"");
				}
				
				strList.add(String.valueOf(c));
				strList.add("\"");
			} else if( c == '}') {
				if(lastChar != '}' && lastChar != ']') {
					strList.add("\"");
				}
				strList.add(String.valueOf(c));
			} else if( c == '[') {
				removeLast(strList);
				strList.add(String.valueOf(c));
			} else {
				strList.add(String.valueOf(c));
			}
			lastChar = c;
		}
		StringBuffer sb = new StringBuffer();
		
		for(String temp : strList) {
			sb.append(temp);
		}
		return String.valueOf(sb);
	}
    
    private static void removeLast(List<String> list) {
    	int size = list.size();
    	if(size != 0 ) {
    		list.remove(size - 1);
    	}
    }
	
    public static String getFailResponse(){
        Map<String,Object> map = new HashMap<String,Object>();
        map.put("message","fail");
        map.put("code",400);
        return objectToJson(map);
    }

    public static String getFailResponse(String msg,int code){
        Map<String,Object> map = new HashMap<String,Object>();
        map.put("message",msg);
        map.put("code",code);
        return objectToJson(map);
    }

    public static String getSuccessResponse(){
        Map<String,Object> map = new HashMap<String,Object>();
        map.put("message","success");
        map.put("code",200);
        return objectToJson(map);
    }

    public static String getSuccessResponse(String msg,int code){
        Map<String,Object> map = new HashMap<String,Object>();
        map.put("message",msg);
        map.put("code",code);
        return objectToJson(map);
    }


}
