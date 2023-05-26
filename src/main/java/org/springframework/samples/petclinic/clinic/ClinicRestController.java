package org.springframework.samples.petclinic.clinic;

import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

	@Autowired
	public ClinicRestController(ClinicService clinicService) {
		this.clinicService = clinicService;
	}


    @GetMapping(value = "{clinicId}")
	public ResponseEntity<Clinic> findClinicById(@PathVariable("clinicId") int clinicId) {
		return new ResponseEntity<>(clinicService.findClinicById(clinicId), HttpStatus.OK);
	}
}