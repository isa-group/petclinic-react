package org.springframework.samples.petclinic.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import lombok.Getter;

@ResponseStatus(value = HttpStatus.UNAUTHORIZED)
@Getter
public class LimitReachedException extends RuntimeException {

	private static final long serialVersionUID = -3906338266891937036L;

	public LimitReachedException(String resourceName, String plan) {
		super(String.format(
				"You have reached the limit for %s with the %s plan. Please, contact with the clinic owner to ask for a plan upgrade.",
				resourceName, plan));
	}

}
