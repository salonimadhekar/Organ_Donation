package com.organdonation.springbooth.model;

import java.util.HashMap;
public class Organs {

    private static final HashMap<String, Integer> organTime = new HashMap<>();

    static {
        organTime.put("heart", 6);
        organTime.put("lungs", 6);
        organTime.put("liver", 12);
        organTime.put("kidney", 36);
        organTime.put("pancreas", 18);
        organTime.put("intestine", 8);
    }

    public static int getTime(String organ) {
        return organTime.getOrDefault(organ.toLowerCase(), -1);
    }
}
