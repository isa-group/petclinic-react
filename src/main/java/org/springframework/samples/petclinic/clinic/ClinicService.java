package org.springframework.samples.petclinic.clinic;

import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ClinicService {
    private ClinicRepository clinicRepository;

    @Autowired
	public ClinicService(ClinicRepository clinicRepository) {
		this.clinicRepository = clinicRepository;
	}

	@Transactional(readOnly = true)
	public Clinic findClinicById(int clinicId) throws DataAccessException {
		
		Optional<Clinic> clinic = clinicRepository.findById(clinicId);
		
		if(clinic.isPresent()) {
			return clinic.get();
		}else{
			return null;
		}
	}

    @Transactional
	public Clinic save(Clinic clinic) throws DataAccessException {
		clinicRepository.save(clinic);
		return clinic;
	}

	@Transactional
	public Clinic update(Clinic clinic, int clinicId) throws DataAccessException {
		
		Clinic clinicToUpdate = clinicRepository.findById(clinicId).get();
		BeanUtils.copyProperties(clinic, clinicToUpdate, "id", "clinicOwner", "owners");

		return save(clinicToUpdate);
	}

	@Transactional
	public void delete(int clinicId) throws DataAccessException {
		clinicRepository.deleteById(clinicId);
	}
}
