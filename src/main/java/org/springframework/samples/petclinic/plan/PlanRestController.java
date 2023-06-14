package org.springframework.samples.petclinic.plan;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import petclinic.payload.response.MessageResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.samples.petclinic.clinic.Clinic;
import org.springframework.samples.petclinic.clinic.ClinicService;
import org.springframework.samples.petclinic.util.RestPreconditions;

@RestController
@RequestMapping("/api/v1/plans")
public class PlanRestController {
    
    private final PlanService planService;
    private final ClinicService clinicService;

    @Autowired
    public PlanRestController(PlanService planService, ClinicService clinicService) {
        this.planService = planService;
        this.clinicService = clinicService;
    }

    @GetMapping
    public ResponseEntity<List<Plan>> getAll() {
        return new ResponseEntity<>(planService.findAll(), HttpStatus.OK);
    }

    @GetMapping(value="/parser")
    public ResponseEntity<List<ParserPlan>> getAllParserPlans() {
        return new ResponseEntity<>(planService.findAllParserPlans(), HttpStatus.OK);
    }

    @GetMapping(value = "/{planId}")
    public ResponseEntity<Plan> getPlanById(@PathVariable int planId) {
        return new ResponseEntity<>(planService.findById(planId), HttpStatus.OK);
    }

    @GetMapping(value = "/parser/{parserPlanId}")
    public ResponseEntity<ParserPlan> getParserPlanById(@PathVariable int parserPlanId) {
        return new ResponseEntity<>(planService.findPlanParserById(parserPlanId), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Plan> createPlan(@Valid Plan plan) {
        return new ResponseEntity<>(planService.save(plan), HttpStatus.CREATED);
    }

    @PutMapping(value = "{planId}")
    public ResponseEntity<Plan> updatePlan(@PathVariable("planId") int planId, @RequestBody @Valid Plan plan) {

        RestPreconditions.checkNotNull(planService.findById(planId), "Plan", "ID", planId);

        return new ResponseEntity<>(planService.update(plan, planId), HttpStatus.OK);
    }

    @PutMapping(value = "/parser/{parserPlanId}")
    public ResponseEntity<ParserPlan> updateParserPlan(@PathVariable("parserPlanId") int parserPlanId, @RequestBody @Valid ParserPlan parserPlan) {

        RestPreconditions.checkNotNull(planService.findPlanParserById(parserPlanId), "ParserPlan", "ID", parserPlanId);

        return new ResponseEntity<>(planService.updatePlanParser(parserPlan, parserPlanId), HttpStatus.OK);
    }

    @DeleteMapping(value = "/{planId}")
    public ResponseEntity<MessageResponse> deletePlan(@PathVariable int planId) {
        
        Plan planToDelete = planService.findById(planId);

        List<Clinic> clinics = clinicService.findClinicsOfPlan(planToDelete.getName());
        List<Plan> plansToSubstitute = planService.findDifferentPlan(planToDelete.getName());
        for (Clinic clinic: clinics){
            clinic.setPlan(plansToSubstitute.get(0));
            clinicService.save(clinic);
        }

        planService.deleteById(planId);
        return new ResponseEntity<>(new MessageResponse("Plan deleted!"), HttpStatus.OK);
    }

}
