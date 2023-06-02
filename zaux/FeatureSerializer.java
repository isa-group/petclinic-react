package org.springframework.samples.petclinic.feature;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.springframework.boot.jackson.JsonComponent;

import java.awt.*;
import java.io.IOException;

@JsonComponent
public class FeatureSerializer extends JsonSerializer<Feature> {

    @Override
    public void serialize(Feature feature, JsonGenerator jsonGenerator,
                          SerializerProvider serializerProvider) throws IOException,
            JsonProcessingException {

        if (feature.getType() == FeatureType.FEATURE) {
            jsonGenerator.writeBoolean(feature.getBooleanValue());
        } else {
            if (feature.getFloatValue() != null) {
                jsonGenerator.writeNumber(feature.getFloatValue());
            } else if (feature.getIntValue() != null) {
                jsonGenerator.writeNumber(feature.getIntValue());
            } else if (feature.getStringValue() != null) {
                jsonGenerator.writeString(feature.getStringValue());
            }
        }
    }
}