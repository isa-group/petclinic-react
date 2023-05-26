package org.springframework.samples.petclinic.clinic;

import java.util.Optional;

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

    // @Transactional
	// public ClinicOwner saveClinicOwner(ClinicOwner clinicOwner) throws DataAccessException {
	// 	clinicOwnerRepository.save(clinicOwner);
	// 	return clinicOwner;
	// }
}
