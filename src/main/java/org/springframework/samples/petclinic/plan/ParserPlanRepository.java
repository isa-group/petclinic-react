package org.springframework.samples.petclinic.plan;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface ParserPlanRepository extends CrudRepository<ParserPlan, Integer>{

}
