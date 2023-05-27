package org.springframework.samples.petclinic.clinic;

import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.samples.petclinic.clinic_owner.ClinicOwner;
import org.springframework.samples.petclinic.clinic_owner.ClinicOwnerService;
import org.springframework.samples.petclinic.user.User;
import org.springframework.samples.petclinic.user.UserService;
import org.springframework.samples.petclinic.util.RestPreconditions;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import petclinic.payload.response.MessageResponse;

@RestController
@RequestMapping("/api/v1/clinics")
public class ClinicRestController {
    private final ClinicService clinicService;
	private final ClinicOwnerService clinicOwnerService;
	private final UserService userService;

	@Autowired
	public ClinicRestController(ClinicService clinicService, ClinicOwnerService clinicOwnerService, UserService userService) {
		this.clinicService = clinicService;
		this.clinicOwnerService = clinicOwnerService;
		this.userService = userService;
	}


    @GetMapping(value = "{clinicId}")
	public ResponseEntity<Clinic> findClinicById(@PathVariable("clinicId") int clinicId) {
		return new ResponseEntity<>(clinicService.findClinicById(clinicId), HttpStatus.OK);
	}

	@PostMapping
	public ResponseEntity<Clinic> createClinic(@RequestBody @Valid Clinic clinic) {

		Clinic newClinic = new Clinic();
		BeanUtils.copyProperties(clinic, newClinic, "id");
		ClinicOwner owner = clinicOwnerService.findByUserId(userService.findCurrentUser().getId());

		newClinic.setClinicOwner(owner);

		return new ResponseEntity<>(clinicService.save(newClinic), HttpStatus.CREATED);
	}

	@PutMapping(value = "{clinicId}")
	public ResponseEntity<Clinic> updateClinic(@PathVariable("clinicId") int clinicId, @RequestBody @Valid Clinic clinic) {
		RestPreconditions.checkNotNull(clinicService.findClinicById(clinicId), "Clinic", "ID", clinicId);

		return new ResponseEntity<>(clinicService.update(clinic, clinicId), HttpStatus.OK);
	}

	@DeleteMapping(value = "{clinicId}")
	public ResponseEntity<MessageResponse> deleteClinic(@PathVariable("clinicId") int clinicId) {
		RestPreconditions.checkNotNull(clinicService.findClinicById(clinicId), "Clinic", "ID", clinicId);
		clinicService.delete(clinicId);
		return new ResponseEntity<>(new MessageResponse("Clinic deleted!"), HttpStatus.OK);
	}
}