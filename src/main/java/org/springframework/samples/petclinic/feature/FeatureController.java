package org.springframework.samples.petclinic.feature;

import org.springframework.http.HttpMessage;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.protobuf.ProtobufHttpMessageConverter;
import org.springframework.samples.petclinic.protobuf.FeatureResponseOuterProto.FeatureResponse;
import org.springframework.samples.petclinic.protobuf.FeatureResponseOuterProto.FeatureResponse.Feature;
import org.springframework.samples.petclinic.protobuf.FeatureResponseOuterProto.FeatureResponse.Feature.ValueType;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
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

        Feature featureBoolean = Feature.newBuilder().setValueType(ValueType.BOOLEAN).setBooleanValue(true).build();
        Feature featureNumeric = Feature.newBuilder().setValueType(ValueType.NUMERIC).setNumericValue(5).build();
        Feature featureString = Feature.newBuilder().setValueType(ValueType.BOOLEAN).setStringValue("dog cat bird snake").build();

        featureMap.put("pet-list", featureBoolean);
        featureMap.put("pet-read", featureBoolean);
        featureMap.put("pet-edit", featureBoolean);
        featureMap.put("pet-add", featureBoolean);
        featureMap.put("pet-delete", featureBoolean);
        featureMap.put("pet-requests-remaining", featureNumeric);
        featureMap.put("pet-allowed-types", featureString);

    }

    @CrossOrigin
    @RequestMapping(value = "/feature", method = RequestMethod.POST, consumes = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public ResponseEntity<byte[]> list(HttpServletRequest httpServletRequest) {
        ServletInputStream inputStream;

        try {
            inputStream = httpServletRequest.getInputStream();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        final List<String> list = new BufferedReader(new InputStreamReader(inputStream))
                .lines().collect(Collectors.toList());

        Map<String, Feature> result = new HashMap<>();

        for (String feature : list) {
            feature = feature.trim();
            if (featureMap.keySet().contains(feature)) {
                result.put(feature, featureMap.get(feature));
            }
        }

        FeatureResponse featureResponse = FeatureResponse.newBuilder().putAllFeatureMap(result).build();
        
        byte[] protobufBytes = featureResponse.toByteArray();

        return new ResponseEntity<>(protobufBytes, HttpStatus.OK);
    }
}
