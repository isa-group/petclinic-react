package org.springframework.samples.petclinic.visit;

import java.time.LocalDate;
import java.util.Collection;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.samples.petclinic.configuration.PricingConfiguration;
import org.springframework.samples.petclinic.exceptions.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import io.github.isagroup.models.Plan;
import io.github.isagroup.models.PricingManager;

@Service
public class VisitService {

	private final VisitRepository visitRepository;
	private final PricingConfiguration	pricingConfiguration;

	@Autowired
	public VisitService(VisitRepository visitRepository, PricingConfiguration	pricingConfiguration) {
		this.visitRepository = visitRepository;
		this.pricingConfiguration = pricingConfiguration;
	}

	@Transactional(readOnly = true)
	public Iterable<Visit> findAll() {
		return visitRepository.findAll();
	}

	@Transactional(readOnly = true)
	public Collection<Visit> findVisitsByOwnerId(int ownerId) {
		return visitRepository.findByOwnerId(ownerId);
	}

	@Transactional(readOnly = true)
	public Collection<Visit> findVisitsByPetId(int petId) {
		return visitRepository.findByPetId(petId);
	}

	@Transactional(readOnly = true)
	public Visit findVisitById(int id) throws DataAccessException {
		return visitRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Visit", "ID", id));
	}

	@Transactional
	public Visit saveVisit(Visit visit) throws DataAccessException {
		visitRepository.save(visit);
		return visit;
	}

	@Transactional
	public Visit updateVisit(Visit visit, int id) throws DataAccessException {
		Visit toUpdate = findVisitById(id);
		BeanUtils.copyProperties(visit, toUpdate, "id");
		visitRepository.save(toUpdate);

		return toUpdate;
	}

	@Transactional
	public void deleteVisit(int id) throws DataAccessException {
		Visit toDelete = findVisitById(id);
		visitRepository.delete(toDelete);
	}

	public boolean underLimit(Visit visit) {
		Integer visitCount = this.visitRepository.countVisitsByPetInMonth(visit.getPet().getId(),
				visit.getDatetime().getMonthValue(), visit.getDatetime().getYear());
		PricingManager pricingManager = pricingConfiguration.getPricingManager();
		Plan plan = pricingManager.getPlans().get(visit.getVet().getClinic().getPlan());

		Integer limitValue = (Integer) plan.getUsageLimits().get("maxVisitsPerMonthAndPet").getValue();
		Integer limitDefaultValue = (Integer) plan.getUsageLimits().get("maxVisitsPerMonthAndPet").getDefaultValue();

		if (limitValue == null){
			return visitCount < limitDefaultValue;
		}

		return visitCount < limitValue;
	}

	public Map<String, Object> getVisitsOwnerStats(int ownerId) {
		Map<String, Object> res = new HashMap<>();
		Integer countAll = this.visitRepository.countAllByOwner(ownerId);
		res.put("totalVisits", countAll);
		if (countAll > 0) {
			Map<String, Integer> visitsByYear = getVisitsByYear(ownerId);
			int years = LocalDate.now().getYear() - this.visitRepository.getYearOfFirstVisit(ownerId);
			if (years >= 1) {
				Double avgVisitsByYear = (double) countAll / (years + 1);
				res.put("avgVisitsByYear", avgVisitsByYear);
			}
			Map<String, Integer> visitsByPet = getVisitsByPet(ownerId);

			res.put("visitsByYear", visitsByYear);
			res.put("visitsByPet", visitsByPet);
		}

		return res;
	}

	public Map<String, Object> getVisitsAdminStats() {
		Map<String, Object> res = new HashMap<>();

		Integer countAll = this.visitRepository.countAll();
		int pets = this.visitRepository.countAllPets();
		if (pets > 0) {
			Double avgVisitsByPet = (double) this.visitRepository.countAll() / pets;
			res.put("avgVisitsByPet", avgVisitsByPet);
		}

		res.put("totalVisits", countAll);
		return res;
	}

	private Map<String, Integer> getVisitsByYear(int userId) {
		Map<String, Integer> unsortedVisitsByYear = new HashMap<>();
		this.visitRepository.countVisitsGroupedByYear(userId).forEach(m -> {
			String key = m.get("year").toString();
			Integer value = m.get("visits");
			unsortedVisitsByYear.put(key, value);
		});
		return unsortedVisitsByYear.entrySet().stream().sorted(Map.Entry.comparingByKey(Comparator.reverseOrder()))
				.collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (oldValue, newValue) -> oldValue,
						LinkedHashMap::new));
	}

	private Map<String, Integer> getVisitsByPet(int userId) {
		Map<String, Integer> unsortedVisitsByPet = new HashMap<>();
		this.visitRepository.countVisitsGroupedByPet(userId).forEach(m -> {
			String key = m.get("pet");
			Integer value = Integer.parseInt(m.get("visits"));
			unsortedVisitsByPet.put(key, value);
		});
		return unsortedVisitsByPet;
	}

}
