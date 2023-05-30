package org.springframework.samples.petclinic.plan;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/v1/plans")
public class PlanRestController {
    
    private final PlanService planService;

    @Autowired
    public PlanRestController(PlanService planService) {
        this.planService = planService;
    }

    @GetMapping
    public ResponseEntity<List<Plan>> getAll() {
        return new ResponseEntity<>(planService.findAll(), HttpStatus.OK);
    }

}
