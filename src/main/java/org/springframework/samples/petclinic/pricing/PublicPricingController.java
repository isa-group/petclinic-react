package org.springframework.samples.petclinic.pricing;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.github.isagroup.PricingService;
import io.github.isagroup.models.Plan;

import java.util.Collection;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("/api/v1/plans")
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
    

}
