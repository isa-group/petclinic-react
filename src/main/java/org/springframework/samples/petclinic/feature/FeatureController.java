package org.springframework.samples.petclinic.feature;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMessage;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.protobuf.ProtobufHttpMessageConverter;
import org.springframework.samples.petclinic.protobuf.FeatureResponseOuterProto.FeatureResponse;
import org.springframework.samples.petclinic.protobuf.FeatureResponseOuterProto.FeatureResponse.Feature;
import org.springframework.samples.petclinic.protobuf.FeatureResponseOuterProto.FeatureResponse.Feature.ValueType;
import org.springframework.samples.petclinic.user.UserService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.io.InputStreamReader;
import java.io.BufferedReader;
import java.io.IOException;

import javax.security.auth.message.AuthException;
import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/")
public class FeatureController {

    private final UserService userService;

    @Autowired
    public FeatureController(UserService userService) {

        this.userService = userService;

    }

    @CrossOrigin
    @PostMapping(value = "feature", consumes = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public ResponseEntity<byte[]> featureList(HttpServletRequest httpServletRequest) {
        ServletInputStream inputStream;

        try {
            inputStream = httpServletRequest.getInputStream();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        final List<String> list = new BufferedReader(new InputStreamReader(inputStream))
                .lines().collect(Collectors.toList());

        Map<String, Feature> result = new HashMap<>();
        Map<String, Feature> featureMap = new HashMap<>();
        
        try{
            featureMap = userService.findFeaturesByUser();
        }catch(AuthException e){
            System.out.println("EXCEPCION");
        }

        System.out.println(list);
        System.out.println(featureMap);

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
