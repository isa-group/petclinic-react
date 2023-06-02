package org.springframework.samples.petclinic.feature;

public class Feature {
    private FeatureType type;
    private boolean booleanValue;
    private String stringValue;
    private Integer intValue;
    private Float floatValue;

    public FeatureType getType() {
        return type;
    }

    public boolean getBooleanValue() {
        return booleanValue;
    }

    public String getStringValue() {
        return stringValue;
    }

    public Integer getIntValue() {
        return intValue;
    }

    public Float getFloatValue() {
        return floatValue;
    }

    public Feature(boolean booleanValue) {
        this.type = FeatureType.FEATURE;
        this.booleanValue = booleanValue;
    }

    public Feature(String stringValue) {
        this.type = FeatureType.ATTRIBUTE;
        this.stringValue = stringValue;
    }

    public Feature(Integer intValue) {
        this.type = FeatureType.ATTRIBUTE;
        this.intValue = intValue;
    }

    public Feature(Float floatValue) {
        this.type = FeatureType.ATTRIBUTE;
        this.floatValue = floatValue;
    }
}
