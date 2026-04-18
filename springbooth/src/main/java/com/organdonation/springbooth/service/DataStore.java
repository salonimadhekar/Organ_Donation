package com.organdonation.springbooth.service;

//no use of this class after DB connection
import com.organdonation.springbooth.model.*;

import java.util.*;

public class DataStore {

    // 🏥 All hospitals
    public static Map<String, Hospital> hospitals = new HashMap<>();

    // 👤 All patients
    public static Map<String, Patient> patients = new HashMap<>();

    // 🫀 Organ → list of patients
    public static Map<String, List<Patient>> organMap = new HashMap<>();

}