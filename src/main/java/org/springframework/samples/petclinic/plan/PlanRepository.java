package org.springframework.samples.petclinic.plan;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface PlanRepository extends CrudRepository<Plan, Integer>{
    
    @Query("SELECT p FROM Plan p WHERE p.name <> :plan")
    public List<Plan> findDifferentPlan(PricingPlan plan);

    @Query("SELECT pp FROM ParserPlan pp WHERE pp.id = :id")     
    public ParserPlan findPlanParserById(int id);

    @Query("SELECT pp FROM ParserPlan pp")
    public List<ParserPlan> findAllParserPlans();

}
