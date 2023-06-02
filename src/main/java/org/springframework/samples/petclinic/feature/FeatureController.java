package org.springframework.samples.petclinic.feature;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import java.io.InputStreamReader;
import java.io.BufferedReader;
import java.io.IOException;

import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/")
public class FeatureController {

    final Map<String, Feature> featureMap = new HashMap<>(); {}

    public FeatureController() {
        featureMap.put("pet-list", new Feature(true));
        featureMap.put("pet-read", new Feature(true));
        featureMap.put("pet-edit", new Feature(true));
        featureMap.put("pet-add", new Feature(false));
        featureMap.put("pet-delete", new Feature(true));
        featureMap.put("pet-requests-remaining", new Feature(5));
        featureMap.put("pet-allowed-types", new Feature("dog cat bird snake"));

    }

    @CrossOrigin
    @RequestMapping(value = "/feature", method = RequestMethod.POST, consumes = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public ResponseEntity<Map<String, Feature>> list(HttpServletRequest httpServletRequest) {
        ServletInputStream inputStream;

        try {
            inputStream = httpServletRequest.getInputStream();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        final List<String> list = new BufferedReader(new InputStreamReader(inputStream))
                .lines().toList();

        Map<String, Feature> result = new HashMap<>();

        for (String feature : list) {
            feature = feature.trim();
            if (featureMap.keySet().contains(feature)) {
                result.put(feature, featureMap.get(feature));
            }
        }

        System.out.println(result);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
