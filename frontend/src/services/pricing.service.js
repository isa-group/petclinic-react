class PricingService {
    getValueMapOfPlanFeatures(plan){

        let valueMap = {};

        for (let feature of Object.values(plan.features)){
            if (feature.expression.includes("usageLimits")){
                let usageLimitName = feature.expression.split("usageLimits")[1].split(/['"]/)[2];
                let usageLimit = plan.usageLimits[usageLimitName];
                valueMap[feature.name] = usageLimit.value != null ? usageLimit.value : usageLimit.defaultValue;
            }else{
                valueMap[feature.name] = feature.value != null ? feature.value : feature.defaultValue;
            }
        }

        return valueMap;
    }
}

const pricingService = new PricingService();

export default pricingService;