package org.springframework.samples.petclinic.plan;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.samples.petclinic.exceptions.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PlanService {
    
    @Autowired
    private PlanRepository planRepository;

    public PlanService(PlanRepository planRepository) {
        this.planRepository = planRepository;
    }

    @Transactional(readOnly = true)
    public List<Plan> findAll() {
        return (List<Plan>) planRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Plan findById(int id) {
        return planRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Plan", "ID", id));
    }

    @Transactional(readOnly = true)
    public List<Plan> findDifferentPlan(PricingPlan plan) {
        return planRepository.findDifferentPlan(plan);
    }

    @Transactional
    public Plan save(Plan plan) {
        return planRepository.save(plan);
    }

    @Transactional
    public Plan update(Plan plan, int planId) {

        Plan planToUpdate = findById(planId);
		BeanUtils.copyProperties(plan, planToUpdate, "id", "clinicOwner", "owners");
		
        return save(plan);
    }

    @Transactional
    public void deleteById(int id) {
        planRepository.deleteById(id);
    }

    @Transactional
    public Map<String, String> getPlanParserExpresions() {

        ParserPlan planParser = planRepository.findPlanParserById(1);
		
        Map<String, String> result = new HashMap<>();

        Field[] fields = planParser.getClass().getDeclaredFields();
        for (Field field : fields) {
            field.setAccessible(true);
            String fieldName = field.getName();
			try {
				String fieldValue = (String) field.get(planParser);
				result.put(fieldName, fieldValue);
			} catch (IllegalAccessException e) {
				e.printStackTrace();
			}
			
        }

        return result;
    }
}
