package org.springframework.samples.petclinic.exceptions;

import java.util.Date;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.samples.petclinic.pet.exceptions.DuplicatedPetNameException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

@RestControllerAdvice
public class ExceptionHandlerController {

	@ExceptionHandler(Exception.class)
	@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
	public ResponseEntity<ErrorMessage> globalExceptionHandler(Exception ex, WebRequest request) {
		ErrorMessage message = new ErrorMessage(HttpStatus.INTERNAL_SERVER_ERROR.value(), new Date(), ex.getMessage(),
				request.getDescription(false));
		
		return new ResponseEntity<ErrorMessage>(message, HttpStatus.INTERNAL_SERVER_ERROR);
	}
	
	@ExceptionHandler(ResourceNotFoundException.class)
	@ResponseStatus(value = HttpStatus.NOT_FOUND)
	public ResponseEntity<ErrorMessage> resourceNotFoundException(ResourceNotFoundException ex, WebRequest request) {
		ErrorMessage message = new ErrorMessage(HttpStatus.NOT_FOUND.value(), new Date(), ex.getMessage(),
				request.getDescription(false));

		return new ResponseEntity<ErrorMessage>(message, HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(ResourceNotOwnedException.class)
	@ResponseStatus(value = HttpStatus.BAD_REQUEST)
	public ResponseEntity<ErrorMessage> resourceNotOwnedException(ResourceNotFoundException ex, WebRequest request) {
		ErrorMessage message = new ErrorMessage(HttpStatus.BAD_REQUEST.value(), new Date(), ex.getMessage(),
				request.getDescription(false));

		return new ResponseEntity<ErrorMessage>(message, HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(value = TokenRefreshException.class)
	@ResponseStatus(HttpStatus.FORBIDDEN)
	public ResponseEntity<ErrorMessage> handleTokenRefreshException(TokenRefreshException ex, WebRequest request) {
		ErrorMessage message = new ErrorMessage(HttpStatus.FORBIDDEN.value(), new Date(), ex.getMessage(),
				request.getDescription(false));

		return new ResponseEntity<ErrorMessage>(message, HttpStatus.FORBIDDEN);
	}
	
	@ExceptionHandler(value = LimitReachedException.class)
	@ResponseStatus(HttpStatus.FORBIDDEN)
	public ResponseEntity<ErrorMessage> handleLimitReachedException(LimitReachedException ex, WebRequest request) {
		ErrorMessage message = new ErrorMessage(HttpStatus.FORBIDDEN.value(), new Date(), ex.getMessage(),
				request.getDescription(false));

		return new ResponseEntity<ErrorMessage>(message, HttpStatus.FORBIDDEN);
	}
	
	@ExceptionHandler(value = DuplicatedPetNameException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public ResponseEntity<ErrorMessage> handleDuplicatedPetNameExceptionException(DuplicatedPetNameException ex, WebRequest request) {
		ErrorMessage message = new ErrorMessage(HttpStatus.BAD_REQUEST.value(), new Date(), ex.getMessage(),
				request.getDescription(false));

		return new ResponseEntity<ErrorMessage>(message, HttpStatus.BAD_REQUEST);
	}

}