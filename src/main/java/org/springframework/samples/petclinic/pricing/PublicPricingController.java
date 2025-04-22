package org.springframework.samples.petclinic.pricing;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.github.isagroup.PricingService;
import io.github.isagroup.models.Feature;
import io.github.isagroup.models.Plan;
import io.github.isagroup.models.UsageLimit;
import petclinic.payload.response.MessageResponse;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/v1/plans")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PublicPricingController {
    
    private PricingService pricingService;

    public PublicPricingController(PricingService pricingService) {
        this.pricingService = pricingService;
    }

    @GetMapping()
    public ResponseEntity<Collection<Plan>> getPlans() {
        
        Map<String, Plan> plans = pricingService.getPricingPlans();

        return new ResponseEntity<>(plans.values(), HttpStatus.OK);

    }

    @GetMapping(path = "/{planName}")
    public ResponseEntity<Plan> getPlanByName(@PathVariable("planName") String planName){
        
        Map<String, Plan> plans = pricingService.getPricingPlans();

        return new ResponseEntity<>(plans.get(planName), HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<MessageResponse> createPlanByName(@RequestBody Map<String, Object> plan){

        Map<String, Feature> pricingFeatures = pricingService.getPricingFeatures();
        Map<String, UsageLimit> pricingUsageLimits = pricingService.getPricingUsageLimits();

        Plan newPlan = new Plan();

        newPlan.setName(plan.get("name").toString());
        newPlan.setDescription("");
        newPlan.setPrice(Double.valueOf(plan.get("price").toString()));
        newPlan.setUnit("user/month");

        Map<String, Feature> newPlanFeatures = new HashMap<>();
        Map<String, UsageLimit> newPlanUsageLimits = new HashMap<>();

        for (String featureName: pricingFeatures.keySet()){
            if (featureName.equals("pets")){
                UsageLimit maxPetsUsageLimit = pricingUsageLimits.get("maxPets");
                maxPetsUsageLimit.setValue(Integer.valueOf(plan.get(featureName).toString()));
                newPlanUsageLimits.put("maxPets", maxPetsUsageLimit);
            }else if(featureName.equals("visits")){
                UsageLimit maxVisitsPerMonthAndPetUsageLimit = pricingUsageLimits.get("maxVisitsPerMonthAndPet");
                maxVisitsPerMonthAndPetUsageLimit.setValue(Integer.valueOf(plan.get(featureName).toString()));
                newPlanUsageLimits.put("maxVisitsPerMonthAndPet", maxVisitsPerMonthAndPetUsageLimit);
            }else{
                Feature feature = pricingFeatures.get(featureName);
                feature.setValue(plan.get(featureName));
                newPlanFeatures.put(featureName, feature);
            }
        }

        newPlan.setFeatures(newPlanFeatures);
        newPlan.setUsageLimits(newPlanUsageLimits);

        pricingService.addPlanToConfiguration(newPlan);

        return new ResponseEntity<>(new MessageResponse("Plan added to the pricing!"), HttpStatus.OK);
    }

    @PutMapping(path = "/{planName}")
    public ResponseEntity<Plan> updatePlanByName(@PathVariable("planName") String planName, @RequestBody Map<String, Object> plan){
        
        Map<String, Plan> plans = pricingService.getPricingPlans();

        Plan existingPlan = plans.get(planName);

        if (existingPlan == null) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        existingPlan.setName(plan.get("name").toString());
        existingPlan.setPrice(Double.valueOf(plan.get("price").toString()));

        for (Feature feature: existingPlan.getFeatures().values()){
            if (feature.getName().equals("pets")){
                existingPlan.getUsageLimits().get("maxPets").setValue(plan.get(feature.getName()));
            }else if(feature.getName().equals("visits")){
                existingPlan.getUsageLimits().get("maxVisitsPerMonthAndPet").setValue(plan.get(feature.getName()));
            }else{
                existingPlan.getFeatures().get(feature.getName()).setValue(plan.get(feature.getName()));
            }
        }

        pricingService.updatePlanFromConfiguration(planName, existingPlan);

        return new ResponseEntity<>(existingPlan, HttpStatus.OK);
    }

    @DeleteMapping(path = "/{planName}")
    public ResponseEntity<MessageResponse> deletePlanByName(@PathVariable("planName") String planName){
        
        pricingService.removePlanFromConfiguration(planName);

        return new ResponseEntity<>(new MessageResponse("Plan successfully removed!"), HttpStatus.OK);
    }
    
}
