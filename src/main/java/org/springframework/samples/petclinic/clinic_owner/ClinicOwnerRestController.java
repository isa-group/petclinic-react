package org.springframework.samples.petclinic.clinic_owner;

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
public class ClinicOwnerRestController {
    private final ClinicOwnerService clinicOwnerService;
	private final UserService userService;

	@Autowired
	public ClinicOwnerRestController(ClinicOwnerService clinicOwnerService, UserService userService) {
		this.clinicOwnerService = clinicOwnerService;
		this.userService = userService;
	}

	@GetMapping
	public ResponseEntity<ClinicOwner> findByUserId(@RequestParam(required = true) int userId) {
		return new ResponseEntity<>(clinicOwnerService.findByUserId(userId), HttpStatus.OK);
	}
}